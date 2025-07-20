import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Cleanup function to remove all auth-related keys
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer user role fetching to prevent deadlocks
          setTimeout(async () => {
            try {
              console.log('Fetching user role for:', session.user.id);
              const { data: userData, error } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .maybeSingle(); // Use maybeSingle instead of single
              
              if (error) {
                console.error('Error fetching user role:', error);
                setUserRole('student'); // Default fallback
              } else if (userData) {
                console.log('User role fetched:', userData.role);
                setUserRole(userData.role || 'student');
              } else {
                console.log('No user data found, using default role');
                setUserRole('student');
              }
            } catch (error) {
              console.error('Error in role fetch:', error);
              setUserRole('student');
            }
          }, 100);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, role: string = 'student') => {
    try {
      // Clean up any existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Cleanup signout failed, continuing...');
      }

      console.log('Attempting signup for:', email, 'with role:', role);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: name,
            role: role
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Signup successful with role:', role);
        toast({
          title: "Registration Successful",
          description: "Please check your email for verification."
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Signup exception:', error);
      toast({
        title: "Registration Error",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up any existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Cleanup signout failed, continuing...');
      }

      console.log('Attempting signin for:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Signin error:', error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Signin successful');
      }

      return { error };
    } catch (error: any) {
      console.error('Signin exception:', error);
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Signout failed, continuing...');
      }
      
      setUser(null);
      setSession(null);
      setUserRole(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error: any) {
      console.error('Signout error:', error);
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userRole,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

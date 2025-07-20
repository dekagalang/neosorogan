
-- Fix the infinite recursion issue in users table RLS policies
-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;

-- Create a security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
BEGIN
    -- Direct query without RLS interference
    RETURN (SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1);
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'student'::user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate the policies using the security definer function
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        public.get_current_user_role() = 'admin'::user_role
    );

CREATE POLICY "Admins can manage users" ON users
    FOR ALL USING (
        public.get_current_user_role() = 'admin'::user_role
    );

-- Fix the trigger function to handle potential errors better
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into users table with better error handling
    INSERT INTO public.users (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'::user_role)
    );
    
    -- Log the registration
    INSERT INTO public.activity_logs (user_id, action, details)
    VALUES (NEW.id, 'user_registered', jsonb_build_object('email', NEW.email));
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error for debugging
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

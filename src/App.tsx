
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthContext";
import AuthPage from "@/components/auth/AuthPage";
import Index from "./pages/Index";
import StudentDashboard from "@/pages/student/StudentDashboard";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import StudentTasks from "@/pages/student/StudentTasks";
import StudentMaterials from "@/pages/student/StudentMaterials";
import StudentProfile from "@/pages/student/StudentProfile";
import TeacherClasses from "@/pages/teacher/TeacherClasses";
import TeacherMaterials from "@/pages/teacher/TeacherMaterials";
import TeacherTasks from "@/pages/teacher/TeacherTasks";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminLogs from "@/pages/admin/AdminLogs";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Student Routes */}
            <Route path="/dashboard/student" element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/tasks" element={
              <ProtectedRoute requiredRole="student">
                <StudentTasks />
              </ProtectedRoute>
            } />
            <Route path="/student/materials" element={
              <ProtectedRoute requiredRole="student">
                <StudentMaterials />
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute requiredRole="student">
                <StudentProfile />
              </ProtectedRoute>
            } />
            
            {/* Teacher Routes */}
            <Route path="/dashboard/teacher" element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            } />
            <Route path="/teacher/classes" element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherClasses />
              </ProtectedRoute>
            } />
            <Route path="/teacher/materials" element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherMaterials />
              </ProtectedRoute>
            } />
            <Route path="/teacher/tasks" element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherTasks />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/logs" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLogs />
              </ProtectedRoute>
            } />
            
            <Route path="/*" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


-- Fix infinite recursion in classes table RLS policies
-- First, drop the problematic policies
DROP POLICY IF EXISTS "Students can view their enrolled classes" ON classes;
DROP POLICY IF EXISTS "Admins can view all classes" ON classes;

-- Create a security definer function to check if user is enrolled in a class
CREATE OR REPLACE FUNCTION public.is_student_enrolled_in_class(class_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.class_students 
        WHERE class_students.class_id = is_student_enrolled_in_class.class_id 
        AND class_students.student_id = auth.uid()
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate the policies using the security definer function
CREATE POLICY "Students can view their enrolled classes" ON classes
    FOR SELECT USING (
        is_student_enrolled_in_class(id)
    );

CREATE POLICY "Admins can view all classes" ON classes
    FOR SELECT USING (
        public.get_current_user_role() = 'admin'::user_role
    );


-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- For external auth tracking
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Class students junction table
CREATE TABLE class_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- Tasks table for daily vocabulary submissions
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    submission_date DATE NOT NULL,
    words JSONB NOT NULL, -- Array of {word, meaning, sentence, description}
    stars INTEGER CHECK (stars >= 1 AND stars <= 3),
    comment TEXT,
    is_late BOOLEAN DEFAULT FALSE,
    extra_words_penalty INTEGER DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    UNIQUE(student_id, submission_date)
);

-- Materials table
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    file_url TEXT,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System logs table
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can manage users" ON users
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- RLS Policies for classes table
CREATE POLICY "Teachers can view their classes" ON classes
    FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Students can view their enrolled classes" ON classes
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM class_students WHERE class_id = id AND student_id = auth.uid())
    );

CREATE POLICY "Teachers can manage their classes" ON classes
    FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Admins can view all classes" ON classes
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- RLS Policies for class_students table
CREATE POLICY "Students can view their enrollments" ON class_students
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can view their class students" ON class_students
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM classes WHERE id = class_id AND teacher_id = auth.uid())
    );

CREATE POLICY "Teachers can manage their class students" ON class_students
    FOR ALL USING (
        EXISTS (SELECT 1 FROM classes WHERE id = class_id AND teacher_id = auth.uid())
    );

-- RLS Policies for tasks table
CREATE POLICY "Students can view and submit their tasks" ON tasks
    FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Teachers can view and review tasks from their classes" ON tasks
    FOR ALL USING (
        EXISTS (SELECT 1 FROM classes WHERE id = class_id AND teacher_id = auth.uid())
    );

-- RLS Policies for materials table
CREATE POLICY "Class members can view materials" ON materials
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM classes WHERE id = class_id AND teacher_id = auth.uid())
        OR EXISTS (SELECT 1 FROM class_students WHERE class_id = materials.class_id AND student_id = auth.uid())
    );

CREATE POLICY "Teachers can manage materials for their classes" ON materials
    FOR ALL USING (
        EXISTS (SELECT 1 FROM classes WHERE id = class_id AND teacher_id = auth.uid())
    );

-- RLS Policies for activity_logs table
CREATE POLICY "Users can view their activity logs" ON activity_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity logs" ON activity_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- RLS Policies for system_logs table
CREATE POLICY "Admins can view system logs" ON system_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
    );
    
    -- Log the registration
    INSERT INTO activity_logs (user_id, action, details)
    VALUES (NEW.id, 'user_registered', jsonb_build_object('email', NEW.email));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Function to check for late tasks and apply penalties
CREATE OR REPLACE FUNCTION apply_late_penalties()
RETURNS void AS $$
DECLARE
    student_record RECORD;
BEGIN
    -- Find students who didn't submit tasks yesterday
    FOR student_record IN
        SELECT DISTINCT cs.student_id, cs.class_id
        FROM class_students cs
        WHERE NOT EXISTS (
            SELECT 1 FROM tasks t 
            WHERE t.student_id = cs.student_id 
            AND t.submission_date = CURRENT_DATE - INTERVAL '1 day'
        )
    LOOP
        -- Create a penalty task for yesterday
        INSERT INTO tasks (student_id, class_id, submission_date, words, is_late, extra_words_penalty)
        VALUES (
            student_record.student_id,
            student_record.class_id,
            CURRENT_DATE - INTERVAL '1 day',
            '[]'::jsonb,
            TRUE,
            3
        );
        
        -- Log the penalty
        INSERT INTO activity_logs (user_id, action, details)
        VALUES (
            student_record.student_id,
            'penalty_applied',
            jsonb_build_object('date', CURRENT_DATE - INTERVAL '1 day', 'extra_words', 3)
        );
    END LOOP;
    
    -- Log system event
    INSERT INTO system_logs (event_type, description)
    VALUES ('penalty_check', 'Daily penalty check completed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Fix the trigger function to match the actual table structure
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

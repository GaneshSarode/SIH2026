-- Create an enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'microgrid_operator', 'home_owner', 'bess_operator');

-- Extend the auth.users table via a public profiles table
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role user_role NOT NULL DEFAULT 'home_owner',
  assigned_resource_id TEXT, -- E.g., 'M1', 'H1', 'BESS-01'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role, assigned_resource_id)
  VALUES (
    new.id, 
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'home_owner'::user_role),
    new.raw_user_meta_data->>'resource_id'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Revoke execute from public to secure the function
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

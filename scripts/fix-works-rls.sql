
-- Enable RLS
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to be safe (handling both English and Spanish naming conventions seen in migrations)
DROP POLICY IF EXISTS "Works visible to all" ON works;
DROP POLICY IF EXISTS "Authenticated users can manage works" ON works;
DROP POLICY IF EXISTS "Trabajos publicados visibles públicamente" ON works;
DROP POLICY IF EXISTS "Artistas pueden ver sus trabajos" ON works;
DROP POLICY IF EXISTS "Artistas pueden crear trabajos" ON works;
DROP POLICY IF EXISTS "Artistas pueden actualizar sus trabajos" ON works;
DROP POLICY IF EXISTS "Artistas pueden eliminar sus trabajos" ON works;

-- Create comprehensive policies

-- Allow everyone to view works (needed for the public site)
CREATE POLICY "Works visible to all" 
ON works FOR SELECT 
TO public 
USING (true);

-- Allow authenticated users (admins, artists) to do everything (INSERT, UPDATE, DELETE, SELECT)
-- In a more strict system, you might restrict this to 'admin' role or owner, 
-- but for now, we want to ensure the dashboard works.
CREATE POLICY "Authenticated users can manage works" 
ON works FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

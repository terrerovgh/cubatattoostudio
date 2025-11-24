-- Solución alternativa SIMPLE para el problema de recursión infinita
-- Esta solución permite acceso completo a usuarios autenticados
-- La verificación de admin se hace en el código de la aplicación
-- Ejecutar en Supabase SQL Editor

-- Paso 1: Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Paso 2: Crear políticas simples sin recursión
-- Permitir que usuarios autenticados vean todos los perfiles
-- (la app controlará qué se muestra basándose en el rol)
CREATE POLICY "Authenticated users can view profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Permitir que usuarios autenticados inserten su propio perfil
CREATE POLICY "Authenticated users can insert own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Permitir que usuarios actualicen su propio perfil
CREATE POLICY "Authenticated users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Paso 3: Asegurar que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Paso 4: Verificar las políticas creadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- NOTA: Con esta configuración, cualquier usuario autenticado puede VER todos los perfiles,
-- pero solo puede MODIFICAR su propio perfil.
-- La verificación de quién es administrador se hace en el código de la aplicación
-- (AdminGuard.tsx, api/site-content.ts, api/users.ts) donde ya tenemos la lista de emails admin.

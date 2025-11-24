-- Script para corregir las políticas RLS de la tabla profiles
-- Ejecutar en Supabase SQL Editor

-- Paso 1: Eliminar todas las políticas existentes que causan recursión
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- Paso 2: Crear una función helper que NO cause recursión
-- Esta función obtiene el rol directamente sin activar las políticas RLS
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER -- Esto ejecuta la función con permisos del owner, bypassing RLS
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN user_role;
END;
$$;

-- Paso 3: Crear políticas que NO causen recursión
-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- Los usuarios pueden insertar su propio perfil
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Los administradores pueden ver todos los perfiles
-- Usa la función helper para evitar recursión
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
USING (
  public.get_user_role(auth.uid()) = 'admin'
);

-- Los administradores pueden actualizar todos los perfiles
CREATE POLICY "Admins can update all profiles"
ON profiles
FOR UPDATE
USING (
  public.get_user_role(auth.uid()) = 'admin'
);

-- Los administradores pueden insertar perfiles
CREATE POLICY "Admins can insert profiles"
ON profiles
FOR INSERT
WITH CHECK (
  public.get_user_role(auth.uid()) = 'admin'
);

-- Paso 4: Asegurar que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Paso 5: Verificar las políticas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

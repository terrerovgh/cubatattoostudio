-- Script para verificar y corregir el constraint de roles en la tabla profiles
-- Ejecutar en Supabase SQL Editor

-- Paso 1: Ver el constraint actual
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass
AND contype = 'c';  -- 'c' es para CHECK constraints

-- Paso 2: Eliminar el constraint problemático
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Paso 3: Crear un nuevo constraint que permita 'user' y 'admin'
ALTER TABLE profiles
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'admin'));

-- Paso 4: Verificar que se aplicó correctamente
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass
AND contype = 'c';

-- Paso 5: Verificar la estructura de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

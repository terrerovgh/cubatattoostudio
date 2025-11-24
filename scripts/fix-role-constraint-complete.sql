-- Script completo para diagnosticar y corregir el problema de roles
-- Ejecutar en Supabase SQL Editor

-- PASO 1: Diagnóstico - Ver la estructura de la tabla profiles
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- PASO 2: Ver todos los constraints (CHECK, FOREIGN KEY, etc.)
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- PASO 3: Ver si hay un tipo ENUM para roles
SELECT 
    n.nspname AS schema,
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE t.typname LIKE '%role%'
ORDER BY t.typname, e.enumsortorder;

-- PASO 4: Eliminar constraint problemático si existe
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- PASO 5: Si la columna role es de tipo ENUM, cambiarla a TEXT
-- NOTA: Solo ejecutar esto si el diagnóstico muestra que role es un ENUM
-- ALTER TABLE public.profiles ALTER COLUMN role TYPE text;

-- PASO 6: Agregar un nuevo constraint simple que permita 'user' y 'admin'
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'admin'));

-- PASO 7: Asegurar que la columna role tiene un valor por defecto
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'user';

-- PASO 8: Verificación final
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
AND conname = 'profiles_role_check';

-- PASO 9: Prueba - intentar insertar un registro de prueba
-- (Comentado para seguridad)
-- INSERT INTO public.profiles (id, display_name, role, created_at, updated_at)
-- VALUES (
--     '00000000-0000-0000-0000-000000000001',
--     'Test User',
--     'user',
--     NOW(),
--     NOW()
-- );
-- SELECT * FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001';
-- DELETE FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001';

-- Script para crear usuario administrador
-- Email: admin@cubatattoostudio.com
-- Contraseña: LP.cambiar
-- Ejecutar en Supabase SQL Editor

-- IMPORTANTE: Este script usa la función auth.create_user() que solo está disponible
-- en el SQL Editor de Supabase con privilegios de administrador

-- Paso 1: Crear el usuario en la tabla de autenticación
-- Nota: Supabase encriptará automáticamente la contraseña
DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Verificar si el usuario ya existe
    SELECT id INTO new_user_id
    FROM auth.users
    WHERE email = 'admin@cubatattoostudio.com';

    IF new_user_id IS NULL THEN
        -- Crear nuevo usuario
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            invited_at,
            confirmation_token,
            confirmation_sent_at,
            recovery_token,
            recovery_sent_at,
            email_change_token_new,
            email_change,
            email_change_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            created_at,
            updated_at,
            phone,
            phone_confirmed_at,
            phone_change,
            phone_change_token,
            phone_change_sent_at,
            email_change_token_current,
            email_change_confirm_status,
            banned_until,
            reauthentication_token,
            reauthentication_sent_at,
            is_sso_user,
            deleted_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@cubatattoostudio.com',
            crypt('LP.cambiar', gen_salt('bf')), -- Encripta la contraseña
            NOW(), -- Email confirmado inmediatamente
            NULL,
            '',
            NULL,
            '',
            NULL,
            '',
            '',
            NULL,
            NULL,
            '{"provider":"email","providers":["email"]}',
            '{}',
            FALSE,
            NOW(),
            NOW(),
            NULL,
            NULL,
            '',
            '',
            NULL,
            '',
            0,
            NULL,
            '',
            NULL,
            FALSE,
            NULL
        )
        RETURNING id INTO new_user_id;

        RAISE NOTICE 'Usuario creado con ID: %', new_user_id;

        -- Paso 2: Crear o actualizar el perfil con rol admin
        INSERT INTO public.profiles (id, role, created_at, updated_at)
        VALUES (new_user_id, 'admin', NOW(), NOW())
        ON CONFLICT (id) 
        DO UPDATE SET 
            role = 'admin',
            updated_at = NOW();

        RAISE NOTICE 'Perfil de administrador creado/actualizado';
    ELSE
        RAISE NOTICE 'El usuario ya existe con ID: %', new_user_id;
        
        -- Actualizar contraseña del usuario existente
        UPDATE auth.users
        SET 
            encrypted_password = crypt('LP.cambiar', gen_salt('bf')),
            updated_at = NOW()
        WHERE id = new_user_id;

        -- Asegurar que tiene rol admin en profiles
        INSERT INTO public.profiles (id, role, created_at, updated_at)
        VALUES (new_user_id, 'admin', NOW(), NOW())
        ON CONFLICT (id) 
        DO UPDATE SET 
            role = 'admin',
            updated_at = NOW();

        RAISE NOTICE 'Contraseña actualizada y rol admin asignado';
    END IF;
END $$;

-- Verificar que todo se creó correctamente
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.created_at,
    p.role,
    p.created_at as profile_created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@cubatattoostudio.com';

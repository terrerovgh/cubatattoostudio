/**
 * Script para crear usuario administrador usando Supabase Admin API
 * Email: admin@cubatattoostudio.com
 * Contraseña: LP.cambiar
 * 
 * REQUISITO: Necesitas tener la SUPABASE_SERVICE_ROLE_KEY en el archivo .env
 * 
 * Uso: node scripts/create-admin-user.js
 * O con tsx: npx tsx scripts/create-admin-user.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Faltan variables de entorno');
    console.error('Asegúrate de tener PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el archivo .env');
    process.exit(1);
}

// Crear cliente de Supabase con Service Role Key (tiene permisos de admin)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createAdminUser() {
    console.log('🚀 Iniciando creación de usuario administrador...\n');

    try {
        // Paso 1: Crear el usuario en Supabase Auth
        console.log('📧 Creando usuario: admin@cubatattoostudio.com');
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: 'admin@cubatattoostudio.com',
            password: 'LP.cambiar',
            email_confirm: true, // Confirmar email automáticamente
            user_metadata: {
                full_name: 'Administrador',
            }
        });

        if (authError) {
            // Si el usuario ya existe, intentar actualizarlo
            if (authError.message.includes('already exists') || authError.message.includes('already registered')) {
                console.log('⚠️  El usuario ya existe, actualizando...');

                // Obtener el usuario existente
                const { data: existingUsers } = await supabase.auth.admin.listUsers();
                const existingUser = existingUsers?.users.find(u => u.email === 'admin@cubatattoostudio.com');

                if (existingUser) {
                    // Actualizar contraseña
                    const { error: updateError } = await supabase.auth.admin.updateUserById(
                        existingUser.id,
                        { password: 'LP.cambiar' }
                    );

                    if (updateError) {
                        throw updateError;
                    }

                    console.log('✅ Contraseña actualizada');

                    // Paso 2: Asegurar que tiene perfil de admin
                    await createOrUpdateProfile(existingUser.id);

                    console.log('\n✨ Usuario administrador actualizado exitosamente!');
                    console.log('📋 Detalles:');
                    console.log(`   📧 Email: admin@cubatattoostudio.com`);
                    console.log(`   🔑 Contraseña: LP.cambiar`);
                    console.log(`   🆔 ID: ${existingUser.id}`);
                    console.log(`   👤 Rol: admin`);
                }
            } else {
                throw authError;
            }
        } else {
            console.log('✅ Usuario creado en Auth');

            // Paso 2: Crear perfil con rol admin
            await createOrUpdateProfile(authData.user.id);

            console.log('\n✨ Usuario administrador creado exitosamente!');
            console.log('📋 Detalles:');
            console.log(`   📧 Email: ${authData.user.email}`);
            console.log(`   🔑 Contraseña: LP.cambiar`);
            console.log(`   🆔 ID: ${authData.user.id}`);
            console.log(`   👤 Rol: admin`);
        }

    } catch (error) {
        console.error('\n❌ Error al crear usuario:', error);
        process.exit(1);
    }
}

async function createOrUpdateProfile(userId: string) {
    console.log('👤 Creando/actualizando perfil...');

    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            role: 'admin',
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'id'
        });

    if (profileError) {
        throw profileError;
    }

    console.log('✅ Perfil de admin creado/actualizado');
}

// Ejecutar el script
createAdminUser();

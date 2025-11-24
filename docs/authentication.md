# Sistema de Autenticación

Documentación del sistema de autenticación para Cuba Tattoo Studio utilizando Supabase Auth.

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Configuración de Providers](#configuración-de-providers)
- [Flujos de Autenticación](#flujos-de-autenticación)
- [Componentes de UI](#componentes-de-ui)
- [Gestión de Sesiones](#gestión-de-sesiones)
- [Protección de Rutas](#protección-de-rutas)
- [Roles y Permisos](#roles-y-permisos)

## Visión General

El sistema de autenticación proporciona:
- **Email/Contraseña**: Autenticación tradicional
- **Google OAuth**: Sign in con Google
- **Gestión de sesiones**: JWT tokens con refresh automático
- **Roles de usuario**: Public, Artist, Admin
- **Protected routes**: Middleware para rutas administrativas

## Configuración de Providers

### Email/Contraseña

Habilitado por defecto en Supabase. Configurar en Dashboard:

1. Ir a **Authentication** > **Providers**
2. Habilitar **Email**
3. Configurar opciones:
   - **Confirmación de email**: Recomendado activar
   - **Email templates**: Personalizar plantillas
   - **Redirect URLs**: Agregar `http://localhost:4321/auth/callback`

### Google OAuth

Configurar provider de Google:

**1. Crear credenciales en Google Cloud Console:**

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear nuevo proyecto o seleccionar existente
3. Navegar a **APIs & Services** > **Credentials**
4. Crear credenciales > **OAuth 2.0 Client ID**
5. Configurar:
   - **Application type**: Web application
   - **Authorized redirect URIs**: 
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     http://localhost:4321/auth/callback
     ```
6. Copiar **Client ID** y **Client Secret**

**2. Configurar en Supabase:**

1. Ir a **Authentication** > **Providers** > **Google**
2. Habilitar Google provider
3. Pegar **Client ID** y **Client Secret**
4. Configurar **Redirect URL** (auto-generado por Supabase)

**3. Variables de entorno:**

```bash
# .env
PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

## Flujos de Autenticación

### Registro con Email/Contraseña

```typescript
// src/lib/auth.ts
import { supabase } from './supabase';

export async function signUpWithEmail(
    email: string, 
    password: string, 
    fullName: string
) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: 'public' // Default role
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
        }
    });

    if (error) throw error;
    return data;
}
```

### Login con Email/Contraseña

```typescript
export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data;
}
```

### Login con Google OAuth

```typescript
export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent'
            }
        }
    });

    if (error) throw error;
    return data;
}
```

### Logout

```typescript
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}
```

### Reset de Contraseña

```typescript
export async function resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (error) throw error;
    return data;
}
```

## Componentes de UI

### Login Form Component

```typescript
// src/components/LoginForm.tsx
import { useState } from 'react';
import { signInWithEmail, signInWithGoogle } from '../lib/auth';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmail(email, password);
            window.location.href = '/admin';
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="login-form">
            <form onSubmit={handleEmailLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
            </form>

            <div className="divider">O</div>

            <button onClick={handleGoogleLogin} className="google-btn">
                <svg>...</svg> Sign in with Google
            </button>

            {error && <p className="error">{error}</p>}
        </div>
    );
}
```

### Signup Form Component

```astro
---
// src/pages/signup.astro
import Layout from '../layouts/Layout.astro';
---

<Layout title="Sign Up - Cuba Tattoo Studio">
    <div class="signup-container">
        <h1>Create Account</h1>
        <form id="signup-form">
            <input type="text" id="full-name" placeholder="Full Name" required />
            <input type="email" id="email" placeholder="Email" required />
            <input type="password" id="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
        </form>
        <p id="error-message" class="error"></p>
    </div>
</Layout>

<script>
    import { supabase } from '../lib/supabase';

    const form = document.getElementById('signup-form') as HTMLFormElement;
    const errorEl = document.getElementById('error-message');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = (document.getElementById('full-name') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName, role: 'public' }
            }
        });

        if (error) {
            errorEl!.textContent = error.message;
        } else {
            window.location.href = '/auth/verify-email';
        }
    });
</script>
```

### Auth Callback Page

```astro
---
// src/pages/auth/callback.astro
import { supabase } from '../../lib/supabase';

// Handle OAuth callback
const { searchParams } = Astro.url;
const code = searchParams.get('code');

if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
        return Astro.redirect('/login?error=' + error.message);
    }
}

return Astro.redirect('/admin');
---
```

## Gestión de Sesiones

### Auth State Listener

```typescript
// src/lib/auth-listener.ts
import { supabase } from './supabase';

export function setupAuthListener() {
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth event:', event);
        
        switch (event) {
            case 'SIGNED_IN':
                console.log('User signed in:', session?.user);
                break;
            case 'SIGNED_OUT':
                console.log('User signed out');
                window.location.href = '/';
                break;
            case 'TOKEN_REFRESHED':
                console.log('Token refreshed');
                break;
            case 'USER_UPDATED':
                console.log('User updated');
                break;
        }
    });
}
```

### Get Current User

```typescript
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    return user;
}
```

### Get Session

```typescript
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    return session;
}
```

## Protección de Rutas

### Middleware de Autenticación

```typescript
// src/middleware/index.ts
import { defineMiddleware } from 'astro:middleware';
import { supabase } from '../lib/supabase';

export const onRequest = defineMiddleware(async ({ request, locals, redirect }, next) => {
    // Get session
    const { data: { session } } = await supabase.auth.getSession();
    
    locals.session = session;
    locals.user = session?.user ?? null;
    
    const url = new URL(request.url);
    
    // Protect /admin routes
    if (url.pathname.startsWith('/admin')) {
        if (!session) {
            return redirect('/login?redirect=' + url.pathname);
        }
        
        const userRole = session.user.user_metadata?.role;
        
        // Check if user has admin or artist role
        if (userRole !== 'admin' && userRole !== 'artist') {
            return redirect('/?error=unauthorized');
        }
    }
    
    // Redirect authenticated users away from login
    if (url.pathname === '/login' && session) {
        return redirect('/admin');
    }
    
    return next();
});
```

### TypeScript Types for Locals

```typescript
// src/env.d.ts
/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        session: import('@supabase/supabase-js').Session | null;
        user: import('@supabase/supabase-js').User | null;
    }
}
```

### Protected Page Example

```astro
---
// src/pages/admin/dashboard.astro
import Layout from '../../layouts/Layout.astro';

const user = Astro.locals.user;
const userRole = user?.user_metadata?.role;

// Additional check (middleware already protects this route)
if (!user) {
    return Astro.redirect('/login');
}
---

<Layout title="Dashboard">
    <h1>Welcome, {user.user_metadata?.full_name}!</h1>
    <p>Role: {userRole}</p>
    
    {userRole === 'admin' && (
        <div>
            <h2>Admin Controls</h2>
            <!-- Admin-only features -->
        </div>
    )}
</Layout>
```

## Roles y Permisos

### Estructura de Roles

```typescript
// src/types/auth.ts
export type UserRole = 'public' | 'artist' | 'admin';

export interface UserMetadata {
    role: UserRole;
    full_name: string;
    artist_id?: string;
}

export interface ExtendedUser {
    id: string;
    email: string;
    user_metadata: UserMetadata;
}
```

### Asignar Rol a Usuario

Solo admins pueden asignar roles. Crear Edge Function:

```typescript
// supabase/functions/assign-role/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, role } = await req.json();

    // Verify caller is admin
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || user?.user_metadata?.role !== 'admin') {
        return new Response('Unauthorized', { status: 401 });
    }

    // Update user role
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { role } }
    );

    if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), {
            status: 400
        });
    }

    return new Response(JSON.stringify({ success: true, data }), {
        headers: { 'Content-Type': 'application/json' }
    });
});
```

### Permission Checks

```typescript
// src/lib/permissions.ts
import type { User } from '@supabase/supabase-js';

export function hasPermission(user: User | null, permission: string): boolean {
    if (!user) return false;
    
    const role = user.user_metadata?.role;
    
    const permissions: Record<string, string[]> = {
        admin: ['*'], // Admin has all permissions
        artist: [
            'read:own_profile',
            'update:own_profile',
            'create:own_works',
            'update:own_works',
            'delete:own_works'
        ],
        public: ['read:public_content']
    };
    
    const userPermissions = permissions[role] || [];
    
    return userPermissions.includes('*') || userPermissions.includes(permission);
}

export function canManageWork(user: User | null, artistId: string): boolean {
    if (!user) return false;
    
    const role = user.user_metadata?.role;
    const userArtistId = user.user_metadata?.artist_id;
    
    return role === 'admin' || (role === 'artist' && userArtistId === artistId);
}
```

---

**Última actualización**: 2025-11-23

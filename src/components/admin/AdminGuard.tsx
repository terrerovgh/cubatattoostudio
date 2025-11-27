import React, { useEffect, useState } from 'react';
import { AuthProvider } from '../auth/AuthProvider';
import ProtectedRoute from '../auth/ProtectedRoute';
import { supabase } from '../../lib/supabase';
import type { AuthResponse } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined

interface AdminGuardProps {
    children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [checking, setChecking] = useState<boolean>(true);

    useEffect(() => {
        if (import.meta.env.MODE !== 'test' && import.meta.env.DEV && !(supabaseUrl || '').includes('supabase.co')) {
            setAuthorized(true)
            setChecking(false)
            return
        }
        let mounted = true;
        supabase.auth.getUser()
            .then(async (response: any) => {
                const { data } = response;
                const user = data.user;
                if (!user) {
                    setAuthorized(false);
                    setChecking(false);
                    return;
                }

                // Allow specific users to bypass role check
                const adminEmails = ['terrerov@gmail.com', 'admin@cubatattoostudio.com'];
                if (adminEmails.includes(user.email || '')) {
                    setAuthorized(true);
                    setChecking(false);
                    return;
                }
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (error) {
                    setAuthorized(false);
                    setChecking(false);
                    return;
                }
                setAuthorized(profile?.role === 'admin');
                setChecking(false);
            })
            .catch(() => {
                setAuthorized(false);
                setChecking(false);
            });
        return () => { mounted = false; };
    }, []);

    return (
        <AuthProvider>
            <ProtectedRoute>
                {checking ? (
                    <div className="flex h-screen items-center justify-center bg-neutral-950">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-600 border-t-white"></div>
                    </div>
                ) : authorized ? (
                    <>{children}</>
                ) : (
                    <div className="flex h-screen items-center justify-center bg-neutral-950 text-white">
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
                            <h2 className="mb-2 text-xl font-semibold">Acceso restringido</h2>
                            <p className="text-zinc-400">Se requiere rol administrador para acceder a este panel.</p>
                        </div>
                    </div>
                )}
            </ProtectedRoute>
        </AuthProvider>
    );
}

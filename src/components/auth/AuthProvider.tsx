import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithGoogle: () => Promise<{ error: any }>;
    signInWithPassword: (email: string, password: string) => Promise<{ data: any; error: any }>;
    signOut: () => Promise<{ error: any }>;
    signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
    resetPassword: (email: string, redirectTo?: string) => Promise<{ data: any; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }).catch(() => {
            // Handle mock client or connection errors
            setSession(null);
            setUser(null);
            setLoading(false);
        });

        // Listen for changes on auth state (sign in, sign out, etc.)
        try {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            });
            return () => subscription.unsubscribe();
        } catch (error) {
            // Handle mock client
            setLoading(false);
            return () => {};
        }
    }, []);

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });
        return { data, error };
    };

    const signInWithPassword = async (email: string, password: string) => {
        // Development mode: Allow any login for testing
        if (import.meta.env.DEV && !supabaseUrl?.includes('supabase.co')) {
            console.warn('🛠️  Development mode: Allowing mock login');
            const mockUser = {
                id: 'dev-user-123',
                email: email,
                user_metadata: { name: 'Developer' },
                app_metadata: {},
                aud: 'authenticated',
                created_at: new Date().toISOString(),
            };
            const mockSession = {
                access_token: 'dev-token',
                refresh_token: 'dev-refresh',
                user: mockUser,
                expires_in: 3600,
                expires_at: Date.now() + 3600000,
            };
            setUser(mockUser as any);
            setSession(mockSession as any);
            return { data: { user: mockUser, session: mockSession }, error: null };
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        return { data, error };
    };

    const resetPassword = async (email: string, redirectTo?: string) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectTo || `${window.location.origin}/login` });
        return { data, error };
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signInWithPassword, signOut, signUp, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

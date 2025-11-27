import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Development mode: Create a mock client if no real credentials are provided
const isDevelopment = import.meta.env.DEV;
const hasValidCredentials = supabaseUrl && supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key');

let supabase: any;

if (!hasValidCredentials) {
    if (isDevelopment) {
        console.warn('⚠️  Running in DEVELOPMENT MODE with MOCK Supabase client');
        console.warn('⚠️  To use real data, update your .env file with actual Supabase credentials');

        // Create a mock client for development
        const mockClient = {
            from: (table: string) => ({
                select: () => ({
                    order: () => Promise.resolve({ data: [], error: null }),
                    eq: () => ({
                        single: () => Promise.resolve({ data: null, error: null }),
                    }),
                }),
                insert: () => Promise.resolve({ data: null, error: null }),
                update: () => ({
                    eq: () => Promise.resolve({ data: null, error: null }),
                }),
                delete: () => ({
                    eq: () => Promise.resolve({ data: null, error: null }),
                }),
            }),
            auth: {
                signInWithOAuth: () => Promise.resolve({ data: { url: null }, error: null }),
                signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
                signOut: () => Promise.resolve({ error: null }),
                getSession: () => Promise.resolve({ data: { session: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            },
            storage: {
                from: () => ({
                    upload: () => Promise.resolve({ data: { path: '' }, error: null }),
                    getPublicUrl: () => ({ data: { publicUrl: '' } }),
                }),
            },
        };

        supabase = mockClient;
    } else {
        console.error('❌ Missing Supabase environment variables');
        console.warn('⚠️  App will run in degraded mode. Data fetching will fail.');

        // Create a mock client that warns on use, rather than crashing immediately
        const mockClient = {
            from: (table: string) => ({
                select: () => ({
                    order: () => Promise.resolve({ data: [], error: { message: 'Missing Supabase credentials' } }),
                    eq: () => ({
                        single: () => Promise.resolve({ data: null, error: { message: 'Missing Supabase credentials' } }),
                    }),
                }),
                insert: () => Promise.resolve({ data: null, error: { message: 'Missing Supabase credentials' } }),
                update: () => ({
                    eq: () => Promise.resolve({ data: null, error: { message: 'Missing Supabase credentials' } }),
                }),
                delete: () => ({
                    eq: () => Promise.resolve({ data: null, error: { message: 'Missing Supabase credentials' } }),
                }),
            }),
            auth: {
                signInWithOAuth: () => Promise.resolve({ data: { url: null }, error: { message: 'Missing Supabase credentials' } }),
                signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Missing Supabase credentials' } }),
                signOut: () => Promise.resolve({ error: { message: 'Missing Supabase credentials' } }),
                getSession: () => Promise.resolve({ data: { session: null }, error: { message: 'Missing Supabase credentials' } }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            },
            storage: {
                from: () => ({
                    upload: () => Promise.resolve({ data: { path: '' }, error: { message: 'Missing Supabase credentials' } }),
                    getPublicUrl: () => ({ data: { publicUrl: '' } }),
                    list: () => Promise.resolve({ data: [], error: { message: 'Missing Supabase credentials' } }),
                    remove: () => Promise.resolve({ error: { message: 'Missing Supabase credentials' } }),
                }),
            },
        };

        supabase = mockClient;
    }
} else {
    // Use real Supabase client
    supabase = createClient<Database>(
        supabaseUrl,
        supabaseAnonKey,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            },
        }
    );
}

export { supabase };

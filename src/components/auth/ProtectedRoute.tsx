import { useEffect } from 'react';
import { useAuth } from './AuthProvider';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            window.location.assign('/login');
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-neutral-950">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-600 border-t-white"></div>
            </div>
        );
    }

    return user ? <>{children}</> : null;
}

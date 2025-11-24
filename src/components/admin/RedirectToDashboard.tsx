import { useEffect } from 'react';

export default function RedirectToDashboard() {
    useEffect(() => {
        window.location.href = '/admin/dashboard';
    }, []);

    return (
        <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-400">
            Redirecting to dashboard...
        </div>
    );
}

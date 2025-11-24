import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';

export default function Login() {
    const { signInWithGoogle, signInWithPassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (error: any) {
            console.error('Error logging in with Google:', error);
            setError(error.message || 'Error al iniciar sesión con Google');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError(null);
            const { error } = await signInWithPassword(email, password);
            if (error) throw error;
            // Redirect handled by AuthProvider/ProtectedRoute or manually here if needed
            window.location.href = '/admin/dashboard';
        } catch (error: any) {
            console.error('Error logging in with email:', error);
            setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
            <Card className="w-full max-w-md border-neutral-800 bg-neutral-900 text-neutral-100">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Cuba Tattoo Studio</CardTitle>
                    <CardDescription className="text-neutral-400">
                        Inicia sesión para acceder al panel de administración
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@cubatattoostudio.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-neutral-600"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-neutral-600"
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-neutral-200"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Iniciar Sesión
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-neutral-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-neutral-900 px-2 text-neutral-500">O continuar con</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:text-white"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                        )}
                        Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

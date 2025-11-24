import { AuthProvider } from './AuthProvider';
import Login from './Login';

export default function LoginPage() {
    return (
        <AuthProvider>
            <Login />
        </AuthProvider>
    );
}

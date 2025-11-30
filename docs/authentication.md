# Authentication System

The project uses **Supabase Auth** for a secure and robust authentication system.

## Overview

- **Provider**: Supabase (built on GoTrue).
- **Methods**:
    - Email/Password
    - Google OAuth
- **Session Management**: JWTs (JSON Web Tokens) persisted in local storage/cookies.

## Components

### `AuthProvider` (`src/components/auth/AuthProvider.tsx`)
This component wraps the application (or the admin section) and provides the authentication context.
- Monitors `onAuthStateChange` events from Supabase.
- Maintains `user` and `session` state.
- Exposes `signIn`, `signOut`, and `loading` states to children.

### `Login` (`src/components/auth/Login.tsx`)
A user-friendly login form.
- Handles email/password submission.
- Initiates OAuth flow for Google login.
- Displays error messages.

### `ProtectedRoute` (`src/components/auth/ProtectedRoute.tsx`)
A wrapper component for protecting routes.
- Checks if a user is authenticated.
- If not, redirects to the login page (`/login`).
- If authenticated, renders the child components.

### `AdminGuard` (`src/components/admin/AdminGuard.tsx`)
A specialized guard for the Admin Dashboard.
- Checks if the authenticated user has the `admin` role (stored in `app_metadata` or a separate `profiles` table/logic).
- Prevents regular users (e.g., artists) from accessing sensitive admin features if role separation is enforced.

## Authentication Flow

1.  **User visits `/admin`**:
    - `AdminGuard` checks auth state.
    - If no session, redirects to `/login`.
2.  **User logs in**:
    - Enters credentials or clicks "Sign in with Google".
    - Supabase validates credentials and returns a session.
    - `AuthProvider` updates state.
    - User is redirected back to `/admin`.
3.  **Session Persistence**:
    - The session is stored locally.
    - On page reload, `AuthProvider` restores the session from Supabase client.
4.  **Logout**:
    - User clicks "Logout".
    - `supabase.auth.signOut()` is called.
    - State is cleared, and user is redirected to home or login.

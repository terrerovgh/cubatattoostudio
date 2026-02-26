export type UserRole = 'admin' | 'artist' | 'client';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  password_salt: string;
  role: UserRole;
  artist_id?: string;
  client_id?: string;
  display_name: string;
  avatar_url?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: string;
  email: string;
  role: UserRole;
  artist_id?: string;
  client_id?: string;
  display_name: string;
  avatar_url?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface SessionData {
  user_id: string;
  email: string;
  role: UserRole;
  artist_id?: string;
  client_id?: string;
  display_name: string;
  created_at: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface SetupRequest {
  email: string;
  password: string;
  display_name: string;
  admin_password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
  display_name: string;
  artist_id?: string;
}

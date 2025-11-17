export interface User {
  id?: string;
  username: string;
  email?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id?: string;
  username?: string;
  email?: string;
  message: string;
  accessToken?: string;
  tokenType?: string;
}


export interface User {
  id: string;
  email: string;
  name: string;
  isTransporter: boolean;
  createdAt: Date;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  isTransporter: boolean;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}
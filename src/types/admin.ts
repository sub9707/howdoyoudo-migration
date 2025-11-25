export interface Admin {
  id: number;
  username: string;
  name: string;
  password:string;
  ip_address: string | null;
  last_login: Date | null;
  login_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  admin?: {
    id: number;
    username: string;
    name: string;
  };
  token?: string;
  error?: string;
}

export interface AdminSession {
  id: number;
  username: string;
  name: string;
  iat: number;
  exp: number;
}

export interface LoginLog {
  id: number;
  admin_id: number;
  ip_address: string;
  user_agent: string | null;
  login_at: Date;
  status: 'success' | 'failed';
}
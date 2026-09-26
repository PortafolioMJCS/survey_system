export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'collaborator';
  company_id: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
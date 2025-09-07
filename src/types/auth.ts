export interface AuthResponse {
  status: boolean;
  message?: string;
}

export interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (accessToken?: string, refreshToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

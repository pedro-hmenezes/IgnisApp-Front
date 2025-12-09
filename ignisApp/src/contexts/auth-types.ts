export type UserProfile = 'op1' | 'op2' | 'chefe' | 'admin' | null;

export interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile;
  userId?: string; // ID do usuário autenticado
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

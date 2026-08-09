import type { AuthUser } from './AuthUser';

export interface AuthState {
  loading: boolean;
  authenticated: boolean;
  user: AuthUser | null;
}

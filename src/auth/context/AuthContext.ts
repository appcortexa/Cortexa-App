import { createContext } from 'react';
import type { AuthUser } from '../types/AuthUser';
import type { License } from '../services/LicenseService';

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  licenseLoading: boolean;
  authenticated: boolean;
  license: License | null;
  licenseValid: boolean;
  signOut: () => Promise<void>;
}

export const defaultAuthContextValue: AuthContextValue = {
  user: null,
  loading: true,
  licenseLoading: false,
  authenticated: false,
  license: null,
  licenseValid: false,
  signOut: async () => {},
};

export const AuthContext = createContext<AuthContextValue>(defaultAuthContextValue);

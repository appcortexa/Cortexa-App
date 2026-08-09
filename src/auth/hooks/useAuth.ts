import { useContext } from 'react';
import { AuthContext, defaultAuthContextValue } from '../context/AuthContext';

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (authContext === defaultAuthContextValue) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authContext;
};
import { supabase } from '../../services/supabase/supabaseClient';

type SignInResult = Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;
type SignOutResult = Awaited<ReturnType<typeof supabase.auth.signOut>>;
type CurrentUserResult = Awaited<ReturnType<typeof supabase.auth.getUser>>;
type CurrentSessionResult = Awaited<ReturnType<typeof supabase.auth.getSession>>;
type AuthStateChangeCallback = Parameters<typeof supabase.auth.onAuthStateChange>[0];
type AuthStateChangeResult = ReturnType<typeof supabase.auth.onAuthStateChange>;

export class AuthService {
  async signIn(email: string, password: string): Promise<SignInResult> {
    return supabase.auth.signInWithPassword({ email, password });
  }

  async signOut(): Promise<SignOutResult> {
    return supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<CurrentUserResult> {
    return supabase.auth.getUser();
  }

  async getCurrentSession(): Promise<CurrentSessionResult> {
    return supabase.auth.getSession();
  }

  onAuthStateChange(callback: AuthStateChangeCallback): AuthStateChangeResult {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();

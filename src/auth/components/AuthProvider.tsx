import { useEffect, useState, useRef, type ReactElement, type ReactNode } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/AuthService';
import { licenseService, type License } from '../services/LicenseService';
import { licenseManager } from '../services/LicenseManager';
import { offlinePermitService } from '../services/OfflinePermitService';
import { deviceManager } from '../services/DeviceManager';
import { APP_VERSION } from '../../config/app';
import type { AuthUser } from '../types/AuthUser';

interface AuthProviderProps {
  children: ReactNode;
}

const mapSessionToUser = (session: Session | null): AuthUser | null => {
  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email ?? '',
  };
};

const isLicenseValid = (license: License | null): boolean => {
  if (!license) {
    return false;
  }

  if (license.status !== 'ACTIVE') {
    return false;
  }

  if (!license.expiresAt) {
    return false;
  }

  const expiresAt = new Date(license.expiresAt);
  return !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() > Date.now();
};

const isLicenseServiceUnavailable = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    return true;
  }

  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as { message?: unknown; status?: unknown };
  if (typeof candidate.status === 'number' && candidate.status >= 500) {
    return true;
  }

  return typeof candidate.message === 'string'
    && /network|failed to fetch|fetch failed|timeout|service unavailable|offline/i.test(candidate.message);
};

export const validateLocalOfflinePermit = async (userId: string): Promise<boolean> => {
  const currentDeviceId = await deviceManager.getDeviceId();
  const storedPermit = await licenseManager.loadSignedOfflinePermit();

  return storedPermit
    ? offlinePermitService.verifySignedOfflinePermit(
        storedPermit,
        userId,
        currentDeviceId,
        APP_VERSION,
      )
    : false;
};

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [license, setLicense] = useState<License | null>(null);
  const [licenseValid, setLicenseValid] = useState(false);
  const savedOfflineRef = useRef<{ userId: string; licenseId: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const syncAuthState = async (session: Session | null) => {
      const nextUser = mapSessionToUser(session);

      setUser(nextUser);

      if (!nextUser) {
        setLicense(null);
        setLicenseValid(false);
        setLicenseLoading(false);
        return;
      }

      setLicenseLoading(true);

      try {
        const nextLicense = await licenseService.getLicense(nextUser.id);

        if (!isMounted) {
          return;
        }

        setLicense(nextLicense);
        const onlineLicenseValid = isLicenseValid(nextLicense);
        setLicenseValid(onlineLicenseValid);
        // Persist offline copy once per userId+licenseId while provider is mounted
        try {
          if (
            nextUser &&
            nextLicense &&
            nextLicense.id &&
            isLicenseValid(nextLicense)
          ) {
            const prev = savedOfflineRef.current;
            if (!(prev && prev.userId === nextUser.id && prev.licenseId === nextLicense.id)) {
              try {
                const permit = await offlinePermitService.requestSignedOfflinePermit(nextUser.id, nextLicense);
                if (!isMounted) {
                  return;
                }

                await licenseManager.saveSignedOfflinePermit(permit);
                if (!isMounted) {
                  return;
                }

                savedOfflineRef.current = { userId: nextUser.id, licenseId: nextLicense.id };
                setLicenseValid(true);
              } catch (err) {
                const currentDeviceId = await deviceManager.getDeviceId();
                const storedPermit = await licenseManager.loadSignedOfflinePermit();
                const storedValid = storedPermit
                  ? await offlinePermitService.verifySignedOfflinePermit(
                      storedPermit,
                      nextUser.id,
                      currentDeviceId,
                      APP_VERSION,
                      nextLicense.id,
                    )
                  : false;

                if (!storedValid) {
                  setLicenseValid(false);
                }

                // eslint-disable-next-line no-console
                console.error('[AuthProvider] offline permit request or validation failed:', err);
              }
            }
          }
        } catch (err) {
          // Do not change auth state on persistence errors. Log for diagnostics.
          // eslint-disable-next-line no-console
          console.error('[AuthProvider] licenseManager.saveOfflineLicense error:', err);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setLicense(null);
        if (!isLicenseServiceUnavailable(error)) {
          setLicenseValid(false);
          return;
        }

        try {
          const storedValid = await validateLocalOfflinePermit(nextUser.id);

          if (isMounted) {
            setLicenseValid(storedValid);
          }
        } catch {
          if (isMounted) {
            setLicenseValid(false);
          }
        }
      } finally {
        if (isMounted) {
          setLicenseLoading(false);
        }
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await authService.getCurrentSession();

        if (!isMounted) {
          return;
        }

        await syncAuthState(session);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void initializeAuth();

    const { data: { subscription } } = authService.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (!isMounted) {
          return;
        }

        await syncAuthState(session);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        licenseLoading,
        authenticated: user !== null,
        license,
        licenseValid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

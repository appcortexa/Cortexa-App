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
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as { category?: unknown; status?: unknown };
  if (candidate.category === 'LICENSE_TRANSPORT_UNAVAILABLE' || candidate.status === 0) {
    return true;
  }

  if (error instanceof TypeError) {
    return true;
  }

  const messageCandidate = error as { message?: unknown };
  return typeof messageCandidate.message === 'string'
    && /network|failed to fetch|fetch failed|timeout|service unavailable|offline/i.test(messageCandidate.message);
};

const offlineDiagnostic = (event: string, details: Record<string, boolean | string>): void => {
  // Temporary diagnostics: values are intentionally limited to booleans and safe categories.
  // eslint-disable-next-line no-console
  console.info('[CORTEXA-OFFLINE-DIAG]', event, details);
};

const sanitizedErrorMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message : '';
  if (/network|failed to fetch|fetch failed|timeout|service unavailable|offline/i.test(message)) {
    return 'NETWORK_UNAVAILABLE';
  }

  if (/permission|unauthoriz|forbidden/i.test(message)) {
    return 'AUTHORIZATION_ERROR';
  }

  return 'GENERIC_ERROR';
};

const errorName = (error: unknown): string =>
  error instanceof Error ? error.name : 'UnknownError';

export const validateLocalOfflinePermit = async (userId: string): Promise<boolean> => {
  const currentDeviceId = await deviceManager.getDeviceId();
  const storedPermit = await licenseManager.loadSignedOfflinePermit();

  offlineDiagnostic('STORAGE', {
    deviceIdPresent: Boolean(currentDeviceId),
    storedPermitPresent: Boolean(storedPermit),
  });

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
        offlineDiagnostic('AUTH_PROVIDER_FINAL', { reason: 'SESSION_MISSING' });
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
        offlineDiagnostic('OFFLINE_FALLBACK', { offlineFallbackEntered: false });
        const onlineLicenseValid = isLicenseValid(nextLicense);
        if (!onlineLicenseValid) {
          offlineDiagnostic('AUTH_PROVIDER_FINAL', { reason: 'LICENSE_QUERY_RESPONDED_INVALID' });
        }
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
                  offlineDiagnostic('AUTH_PROVIDER_FINAL', { reason: 'STORED_PERMIT_INVALID' });
                  setLicenseValid(false);
                }

                offlineDiagnostic('PERMIT_PERSISTENCE', {
                  errorName: errorName(err),
                  errorMessage: sanitizedErrorMessage(err),
                });
              }
            }
          }
        } catch (err) {
          // Do not change auth state on persistence errors. Log only a safe category.
          offlineDiagnostic('PERMIT_PERSISTENCE', {
            errorName: errorName(err),
            errorMessage: sanitizedErrorMessage(err),
          });
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setLicense(null);
        const classifiedAsNetworkUnavailable = isLicenseServiceUnavailable(error);
        offlineDiagnostic('LICENSE_QUERY', {
          licenseQueryFailed: true,
          errorName: errorName(error),
          errorMessage: sanitizedErrorMessage(error),
          classifiedAsNetworkUnavailable,
        });
        offlineDiagnostic('OFFLINE_FALLBACK', { offlineFallbackEntered: classifiedAsNetworkUnavailable });
        if (!classifiedAsNetworkUnavailable) {
          offlineDiagnostic('AUTH_PROVIDER_FINAL', { reason: 'LICENSE_QUERY_RESPONDED_INVALID' });
          setLicenseValid(false);
          return;
        }

        try {
          const storedValid = await validateLocalOfflinePermit(nextUser.id);

          if (isMounted) {
            offlineDiagnostic('AUTH_PROVIDER_FINAL', {
              reason: storedValid ? 'OFFLINE_PERMIT_ACCEPTED' : 'NETWORK_ERROR_WITHOUT_VALID_PERMIT',
            });
            setLicenseValid(storedValid);
          }
        } catch {
          if (isMounted) {
            offlineDiagnostic('AUTH_PROVIDER_FINAL', { reason: 'NETWORK_ERROR_WITHOUT_VALID_PERMIT' });
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
        const { data: { session }, error } = await authService.getCurrentSession();

        offlineDiagnostic('SESSION_RECOVERY', {
          sessionPresent: Boolean(session),
          userPresent: Boolean(session?.user),
        });
        if (error) {
          offlineDiagnostic('SESSION_RECOVERY_ERROR', {
            errorName: errorName(error),
            errorMessage: sanitizedErrorMessage(error),
          });
        }

        if (!isMounted) {
          return;
        }

        await syncAuthState(session);
      } catch (error) {
        offlineDiagnostic('SESSION_RECOVERY_ERROR', {
          errorName: errorName(error),
          errorMessage: sanitizedErrorMessage(error),
        });
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

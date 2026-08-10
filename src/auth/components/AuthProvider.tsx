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
  const offlinePermitFlightsRef = useRef(new Map<string, Promise<void>>());
  const signOutVersionRef = useRef(0);

  useEffect(() => {
    let isMounted = true;

    const syncAuthState = async (session: Session | null) => {
      const signOutVersion = signOutVersionRef.current;
      const isCurrentAuthState = () => isMounted && signOutVersion === signOutVersionRef.current;
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

        if (!isCurrentAuthState()) {
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
                const flightKey = `${nextUser.id}\u0000${nextLicense.id}`;
                let flight = offlinePermitFlightsRef.current.get(flightKey);

                if (!flight) {
                  let resolveFlight!: () => void;
                  let rejectFlight!: (reason: unknown) => void;
                  flight = new Promise<void>((resolve, reject) => {
                    resolveFlight = resolve;
                    rejectFlight = reject;
                  });
                  // Store the flight before starting the request so concurrent syncs share it.
                  offlinePermitFlightsRef.current.set(flightKey, flight);

                  void (async () => {
                    try {
                      const permit = await offlinePermitService.requestSignedOfflinePermit(nextUser.id, nextLicense);
                      if (!isCurrentAuthState()) {
                        resolveFlight();
                        return;
                      }

                      await licenseManager.saveSignedOfflinePermit(permit);
                      if (isCurrentAuthState()) {
                        savedOfflineRef.current = { userId: nextUser.id, licenseId: nextLicense.id };
                      }
                      resolveFlight();
                    } catch (error) {
                      rejectFlight(error);
                    } finally {
                      if (offlinePermitFlightsRef.current.get(flightKey) === flight) {
                        offlinePermitFlightsRef.current.delete(flightKey);
                      }
                    }
                  })();
                }

                await flight;
                if (!isCurrentAuthState()) {
                  return;
                }

                setLicenseValid(true);
              } catch {
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
              }
            }
          }
        } catch {
          // Do not change auth state on persistence errors.
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setLicense(null);
        const classifiedAsNetworkUnavailable = isLicenseServiceUnavailable(error);
        if (!classifiedAsNetworkUnavailable) {
          setLicenseValid(false);
          return;
        }

        try {
          const storedValid = await validateLocalOfflinePermit(nextUser.id);

          if (isCurrentAuthState()) {
            setLicenseValid(storedValid);
          }
        } catch {
          if (isCurrentAuthState()) {
            setLicenseValid(false);
          }
        }
      } finally {
        if (isCurrentAuthState()) {
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
      } catch {
        // Session recovery errors leave the provider unauthenticated.
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

  const signOut = async (): Promise<void> => {
    // Invalidate in-flight license/permit work before Supabase emits SIGNED_OUT.
    signOutVersionRef.current += 1;

    const { error } = await authService.signOut();
    if (error) {
      throw error;
    }

    // Offline authorization is session-bound. Device identity is deliberately retained.
    await Promise.all([
      licenseManager.clearSignedOfflinePermit(),
      licenseManager.clearLicense(),
    ]);

    savedOfflineRef.current = null;
    offlinePermitFlightsRef.current.clear();
    setUser(null);
    setLicense(null);
    setLicenseValid(false);
    setLicenseLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        licenseLoading,
        authenticated: user !== null,
        license,
        licenseValid,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const dependencies = vi.hoisted(() => ({
  getCurrentSession: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  getLicense: vi.fn(),
  requestSignedOfflinePermit: vi.fn(),
  verifySignedOfflinePermit: vi.fn(),
  getDeviceId: vi.fn(),
  loadSignedOfflinePermit: vi.fn(),
  saveSignedOfflinePermit: vi.fn(),
  clearSignedOfflinePermit: vi.fn(),
  clearLicense: vi.fn(),
}));

vi.mock('../services/AuthService', () => ({ authService: {
  getCurrentSession: dependencies.getCurrentSession,
  signOut: dependencies.signOut,
  onAuthStateChange: dependencies.onAuthStateChange,
} }));
vi.mock('../services/LicenseService', () => ({ licenseService: { getLicense: dependencies.getLicense } }));
vi.mock('../services/OfflinePermitService', () => ({ offlinePermitService: {
  requestSignedOfflinePermit: dependencies.requestSignedOfflinePermit,
  verifySignedOfflinePermit: dependencies.verifySignedOfflinePermit,
} }));
vi.mock('../services/DeviceManager', () => ({ deviceManager: { getDeviceId: dependencies.getDeviceId } }));
vi.mock('../services/LicenseManager', () => ({ licenseManager: {
  loadSignedOfflinePermit: dependencies.loadSignedOfflinePermit,
  saveSignedOfflinePermit: dependencies.saveSignedOfflinePermit,
  clearSignedOfflinePermit: dependencies.clearSignedOfflinePermit,
  clearLicense: dependencies.clearLicense,
} }));

describe('AuthProvider secure offline fallback', () => {
  let root: Root;
  let container: HTMLDivElement;
  let authStateCallback: ((event: never, session: { user: { id: string; email: string } } | null) => Promise<void>) | undefined;

  beforeEach(() => {
    vi.resetModules();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    dependencies.getCurrentSession.mockResolvedValue({ data: { session: { user: { id: 'user-1', email: 'test@example.com' } } } });
    dependencies.signOut.mockResolvedValue({ error: null });
    dependencies.getLicense.mockResolvedValue(null);
    dependencies.getDeviceId.mockResolvedValue('device-1');
    dependencies.loadSignedOfflinePermit.mockResolvedValue({});
    dependencies.verifySignedOfflinePermit.mockResolvedValue(true);
    dependencies.requestSignedOfflinePermit.mockResolvedValue({});
    dependencies.saveSignedOfflinePermit.mockResolvedValue({});
    dependencies.onAuthStateChange.mockImplementation(((callback: typeof authStateCallback) => {
      authStateCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    }) as never);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  async function renderProvider(): Promise<void> {
    const { AuthProvider } = await import('../components/AuthProvider');
    const { AuthContext } = await import('../context/AuthContext');
    await act(async () => {
      root.render(<AuthProvider><AuthContext.Consumer>{value => <span>{String(value.licenseValid)}</span>}</AuthContext.Consumer></AuthProvider>);
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  it('allows an active online license and saves its verified permit', async () => {
    dependencies.getLicense.mockResolvedValue({ id: 'license-1', status: 'ACTIVE', expiresAt: '2026-12-01T00:00:00.000Z' });
    await renderProvider();

    expect(container.textContent).toBe('true');
    expect(dependencies.requestSignedOfflinePermit).toHaveBeenCalled();
    expect(dependencies.saveSignedOfflinePermit).toHaveBeenCalled();
  });

  it('shares one permit issuance between concurrent syncs for the same user and license', async () => {
    let resolvePermit: (permit: object) => void;
    dependencies.getLicense.mockResolvedValue({ id: 'license-1', status: 'ACTIVE', expiresAt: '2026-12-01T00:00:00.000Z' });
    dependencies.requestSignedOfflinePermit.mockImplementation(() => new Promise(resolve => {
      resolvePermit = resolve;
    }));

    await renderProvider();
    expect(dependencies.requestSignedOfflinePermit).toHaveBeenCalledTimes(1);

    let concurrentSync: Promise<void> | undefined;
    await act(async () => {
      concurrentSync = authStateCallback?.(undefined as never, { user: { id: 'user-1', email: 'test@example.com' } });
      await Promise.resolve();
    });
    expect(dependencies.requestSignedOfflinePermit).toHaveBeenCalledTimes(1);

    resolvePermit!({});
    await act(async () => {
      await concurrentSync;
    });

    expect(dependencies.saveSignedOfflinePermit).toHaveBeenCalledTimes(1);
    expect(container.textContent).toBe('true');
  });

  it('clears a failed permit flight so a later sync can retry', async () => {
    dependencies.getLicense.mockResolvedValue({ id: 'license-1', status: 'ACTIVE', expiresAt: '2026-12-01T00:00:00.000Z' });
    dependencies.requestSignedOfflinePermit
      .mockRejectedValueOnce(new Error('permit issuance failed'))
      .mockResolvedValueOnce({});

    await renderProvider();
    expect(dependencies.requestSignedOfflinePermit).toHaveBeenCalledTimes(1);

    await act(async () => {
      await authStateCallback?.(undefined as never, { user: { id: 'user-1', email: 'test@example.com' } });
    });

    expect(dependencies.requestSignedOfflinePermit).toHaveBeenCalledTimes(2);
    expect(dependencies.saveSignedOfflinePermit).toHaveBeenCalledTimes(1);
  });

  it('does not share a permit flight with a different user or license', async () => {
    let resolveFirstPermit: (permit: object) => void;
    dependencies.getLicense.mockImplementation(userId => Promise.resolve({
      id: userId === 'user-1' ? 'license-1' : 'license-2',
      status: 'ACTIVE',
      expiresAt: '2026-12-01T00:00:00.000Z',
    }));
    dependencies.requestSignedOfflinePermit.mockImplementationOnce(() => new Promise(resolve => {
      resolveFirstPermit = resolve;
    }));

    await renderProvider();
    let otherSync: Promise<void> | undefined;
    await act(async () => {
      otherSync = authStateCallback?.(undefined as never, { user: { id: 'user-2', email: 'other@example.com' } });
      await Promise.resolve();
    });

    expect(dependencies.requestSignedOfflinePermit).toHaveBeenCalledTimes(2);
    resolveFirstPermit!({});
    await act(async () => {
      await otherSync;
    });
  });

  it('allows a persisted session only when the online query fails and the permit verifies', async () => {
    dependencies.getLicense.mockRejectedValue(new Error('network unavailable'));
    await renderProvider();

    expect(container.textContent).toBe('true');
    expect(dependencies.verifySignedOfflinePermit).toHaveBeenCalledWith({}, 'user-1', 'device-1', '1.0.0');
  });

  it('uses fallback for a Safari-style generic transport error with no response', async () => {
    dependencies.getLicense.mockRejectedValue({
      name: 'UnknownError',
      category: 'LICENSE_TRANSPORT_UNAVAILABLE',
    });
    await renderProvider();

    expect(container.textContent).toBe('true');
    expect(dependencies.verifySignedOfflinePermit).toHaveBeenCalledWith({}, 'user-1', 'device-1', '1.0.0');
  });

  it('denies offline access when the network fails but the stored permit is invalid', async () => {
    dependencies.getLicense.mockRejectedValue(new Error('network unavailable'));
    dependencies.verifySignedOfflinePermit.mockResolvedValue(false);
    await renderProvider();

    expect(container.textContent).toBe('false');
    expect(dependencies.verifySignedOfflinePermit).toHaveBeenCalled();
  });

  it('denies a successful Supabase response with no license without using fallback', async () => {
    dependencies.getLicense.mockResolvedValue(null);
    await renderProvider();

    expect(container.textContent).toBe('false');
    expect(dependencies.verifySignedOfflinePermit).not.toHaveBeenCalled();
  });

  it.each(['SUSPENDED', 'EXPIRED'])('denies an online %s license without using fallback', async status => {
    dependencies.getLicense.mockResolvedValue({ id: 'license-1', status, expiresAt: '2026-12-01T00:00:00.000Z' });
    await renderProvider();

    expect(container.textContent).toBe('false');
    expect(dependencies.verifySignedOfflinePermit).not.toHaveBeenCalled();
  });

  it('denies a non-network license-query error without using fallback', async () => {
    dependencies.getLicense.mockRejectedValue(new Error('permission denied'));
    await renderProvider();

    expect(container.textContent).toBe('false');
    expect(dependencies.verifySignedOfflinePermit).not.toHaveBeenCalled();
  });

  it('denies offline access when no local session exists', async () => {
    dependencies.getCurrentSession.mockResolvedValue({ data: { session: null } });
    await renderProvider();

    expect(container.textContent).toBe('false');
    expect(dependencies.verifySignedOfflinePermit).not.toHaveBeenCalled();
  });

  it('signs out, clears session-bound offline authorization, and clears auth state', async () => {
    let signOut: (() => Promise<void>) | undefined;
    const { AuthProvider } = await import('../components/AuthProvider');
    const { AuthContext } = await import('../context/AuthContext');

    await act(async () => {
      root.render(
        <AuthProvider>
          <AuthContext.Consumer>{value => {
            signOut = value.signOut;
            return <span>{`${value.authenticated}:${value.licenseValid}`}</span>;
          }}</AuthContext.Consumer>
        </AuthProvider>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    await act(async () => {
      await signOut?.();
    });

    expect(dependencies.signOut).toHaveBeenCalledTimes(1);
    expect(dependencies.clearSignedOfflinePermit).toHaveBeenCalledTimes(1);
    expect(dependencies.clearLicense).toHaveBeenCalledTimes(1);
    expect(container.textContent).toBe('false:false');
  });
});

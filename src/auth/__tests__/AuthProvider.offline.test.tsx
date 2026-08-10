import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const dependencies = vi.hoisted(() => ({
  getCurrentSession: vi.fn(),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  getLicense: vi.fn(),
  requestSignedOfflinePermit: vi.fn(),
  verifySignedOfflinePermit: vi.fn(),
  getDeviceId: vi.fn(),
  loadSignedOfflinePermit: vi.fn(),
  saveSignedOfflinePermit: vi.fn(),
}));

vi.mock('../services/AuthService', () => ({ authService: {
  getCurrentSession: dependencies.getCurrentSession,
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
} }));

describe('AuthProvider secure offline fallback', () => {
  let root: Root;
  let container: HTMLDivElement;

  beforeEach(() => {
    vi.resetModules();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    dependencies.getCurrentSession.mockResolvedValue({ data: { session: { user: { id: 'user-1', email: 'test@example.com' } } } });
    dependencies.getLicense.mockResolvedValue(null);
    dependencies.getDeviceId.mockResolvedValue('device-1');
    dependencies.loadSignedOfflinePermit.mockResolvedValue({});
    dependencies.verifySignedOfflinePermit.mockResolvedValue(true);
    dependencies.requestSignedOfflinePermit.mockResolvedValue({});
    dependencies.saveSignedOfflinePermit.mockResolvedValue({});
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
});

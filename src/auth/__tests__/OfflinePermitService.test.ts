import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SignedOfflinePermit } from '../types/SignedOfflinePermit';

const verifier = vi.hoisted(() => ({
  importPublicKey: vi.fn(async () => ({} as CryptoKey)),
  verifyPermit: vi.fn(async () => ({ valid: true })),
}));

vi.mock('../security/SignedPermitVerifier', () => verifier);

const now = new Date('2026-08-09T12:00:00.000Z');

const makePermit = (overrides: Partial<SignedOfflinePermit['payload']> = {}): SignedOfflinePermit => ({
  algorithm: 'ECDSA_P256_SHA256',
  keyId: 'key-v1',
  signature: 'valid-signature',
  payload: {
    permitId: 'permit-1',
    userId: 'user-1',
    licenseId: 'license-1',
    licenseStatus: 'ACTIVE' as any,
    licensePlan: null,
    deviceId: 'device-1',
    issuedAt: '2026-08-09T11:00:00.000Z',
    offlineExpiresAt: '2026-08-10T12:00:00.000Z',
    licenseExpiresAt: '2026-09-01T12:00:00.000Z',
    offlineDays: 1,
    maxDevices: null,
    appVersion: '1.0.0',
    schemaVersion: 1,
    nonce: 'nonce-1',
    ...overrides,
  },
});

describe('OfflinePermitService local verification', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_OFFLINE_PERMIT_PUBLIC_KEY', 'test-public-key');
    vi.setSystemTime(now);
    verifier.importPublicKey.mockClear();
    verifier.verifyPermit.mockResolvedValue({ valid: true });
  });

  it.each([
    ['expired offline permit', { offlineExpiresAt: '2026-08-09T11:59:59.000Z' }],
    ['expired license', { licenseExpiresAt: '2026-08-09T11:59:59.000Z' }],
    ['different user', { userId: 'user-2' }],
    ['different device', { deviceId: 'device-2' }],
    ['non-active license', { licenseStatus: 'SUSPENDED' as any }],
  ])('denies a %s', async (_label, payload) => {
    const { offlinePermitService } = await import('../services/OfflinePermitService');
    await expect(offlinePermitService.verifySignedOfflinePermit(makePermit(payload), 'user-1', 'device-1', '1.0.0')).resolves.toBe(false);
  });

  it('denies an invalid signature', async () => {
    verifier.verifyPermit.mockResolvedValueOnce({ valid: false });
    const { offlinePermitService } = await import('../services/OfflinePermitService');

    await expect(offlinePermitService.verifySignedOfflinePermit(makePermit(), 'user-1', 'device-1', '1.0.0')).resolves.toBe(false);
  });

  it('denies an unsupported key id or algorithm', async () => {
    const { offlinePermitService } = await import('../services/OfflinePermitService');

    await expect(offlinePermitService.verifySignedOfflinePermit({ ...makePermit(), keyId: 'unknown-key' }, 'user-1', 'device-1', '1.0.0')).resolves.toBe(false);
    await expect(offlinePermitService.verifySignedOfflinePermit({ ...makePermit(), algorithm: 'unexpected' as any }, 'user-1', 'device-1', '1.0.0')).resolves.toBe(false);
  });

  it('allows a complete valid permit without an online license id', async () => {
    const { offlinePermitService } = await import('../services/OfflinePermitService');

    await expect(offlinePermitService.verifySignedOfflinePermit(makePermit(), 'user-1', 'device-1', '1.0.0')).resolves.toBe(true);
  });

  it('keeps the online license-id comparison when one is available', async () => {
    const { offlinePermitService } = await import('../services/OfflinePermitService');

    await expect(offlinePermitService.verifySignedOfflinePermit(makePermit(), 'user-1', 'device-1', '1.0.0', 'other-license')).resolves.toBe(false);
  });
});

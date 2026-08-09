import { beforeEach, describe, expect, it, vi } from 'vitest';
import { licenseManager } from '../services/LicenseManager';
import { localLicenseStorage } from '../storage/LocalLicenseStorage';
import type { License } from '../services/LicenseService';
import type { OfflineLicenseRecord } from '../types/OfflineLicense';
import { SessionStatus } from '../types/SessionStatus';

describe('LicenseManager', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it('saveOfflineLicense saves active and valid license', async () => {
    const fixed = new Date('2026-01-01T00:00:00.000Z');
    vi.setSystemTime(fixed);

    const lic: License = {
      id: 'lic-1',
      status: 'ACTIVE',
      plan: null,
      offlineDays: 5,
      maxDevices: null,
      version: null,
      gracePeriodDays: null,
      expiresAt: '2026-12-31T00:00:00.000Z',
    };

    const rec = await licenseManager.saveOfflineLicense(lic, 'user-1', '1.0.0');
    expect(rec).not.toBeNull();
    const loaded = await licenseManager.loadOfflineLicense();
    expect(loaded).not.toBeNull();
    const record = loaded as OfflineLicenseRecord;
    expect(record.validatedAt).toBe(fixed.toISOString());
    const expectedOfflineExpires = new Date(fixed.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(record.offlineExpiresAt).toBe(expectedOfflineExpires);
    expect(record.licenseExpiresAt).toBe(lic.expiresAt);
    expect(record.schemaVersion).toBe(1);
  });

  it('does not save expired license', async () => {
    const past = new Date('2020-01-01T00:00:00.000Z');
    vi.setSystemTime(past);

    const lic: License = {
      id: 'lic-2',
      status: 'ACTIVE',
      plan: null,
      offlineDays: 5,
      maxDevices: null,
      version: null,
      gracePeriodDays: null,
      expiresAt: '2019-12-31T00:00:00.000Z',
    };

    const rec = await licenseManager.saveOfflineLicense(lic, 'user-2', '1.0.0');
    expect(rec).toBeNull();
    expect(await licenseManager.loadOfflineLicense()).toBeNull();
  });

  it('does not save license with non-ACTIVE status', async () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    vi.setSystemTime(now);

    const lic: License = {
      id: 'lic-3',
      status: 'INACTIVE',
      plan: null,
      offlineDays: 5,
      maxDevices: null,
      version: null,
      gracePeriodDays: null,
      expiresAt: '2026-12-31T00:00:00.000Z',
    };

    const rec = await licenseManager.saveOfflineLicense(lic, 'user-3', '1.0.0');
    expect(rec).toBeNull();
    expect(await licenseManager.loadOfflineLicense()).toBeNull();
  });

  it('does not save license with invalid expiresAt', async () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    vi.setSystemTime(now);

    const lic: License = {
      id: 'lic-4',
      status: 'ACTIVE',
      plan: null,
      offlineDays: 5,
      maxDevices: null,
      version: null,
      gracePeriodDays: null,
      expiresAt: 'not-a-date',
    };

    const rec = await licenseManager.saveOfflineLicense(lic, 'user-4', '1.0.0');
    expect(rec).toBeNull();
    expect(await licenseManager.loadOfflineLicense()).toBeNull();
  });

  it('validateStoredLicense returns NO_LICENSE when none', async () => {
    await licenseManager.clearLicense();
    const res = await licenseManager.validateStoredLicense();
    expect(res.reason).toBe('NO_LICENSE');
  });

  it('validateStoredLicense valid inside offline period', async () => {
    const fixed = new Date('2026-01-01T00:00:00.000Z');
    vi.setSystemTime(fixed);

    const lic: License = {
      id: 'lic-5',
      status: 'ACTIVE',
      plan: null,
      offlineDays: 3,
      maxDevices: null,
      version: null,
      gracePeriodDays: null,
      expiresAt: '2026-12-31T00:00:00.000Z',
    };

    await licenseManager.saveOfflineLicense(lic, 'user-5', '1.0.0');

    // advance 2 days -> still valid
    vi.setSystemTime(new Date(fixed.getTime() + 2 * 24 * 60 * 60 * 1000));
    const res = await licenseManager.validateStoredLicense();
    expect(res.reason).toBe('VALID');
    expect(res.valid).toBe(true);
    expect(typeof res.offlineDaysRemaining).toBe('number');
  });

  it('validateStoredLicense returns OFFLINE_PERIOD_EXPIRED when offlineDays exceeded', async () => {
    const fixed = new Date('2026-01-01T00:00:00.000Z');
    vi.setSystemTime(fixed);

    const lic: License = {
      id: 'lic-6',
      status: 'ACTIVE',
      plan: null,
      offlineDays: 2,
      maxDevices: null,
      version: null,
      gracePeriodDays: null,
      expiresAt: '2026-12-31T00:00:00.000Z',
    };

    await licenseManager.saveOfflineLicense(lic, 'user-6', '1.0.0');

    // advance beyond offline days
    vi.setSystemTime(new Date(fixed.getTime() + 3 * 24 * 60 * 60 * 1000));
    const res = await licenseManager.validateStoredLicense();
    expect(res.reason).toBe('OFFLINE_PERIOD_EXPIRED');
    expect(res.valid).toBe(false);
  });

  it('validateStoredLicense returns EXPIRED when licenseExpiresAt passed', async () => {
    const fixed = new Date('2026-01-01T00:00:00.000Z');
    vi.setSystemTime(fixed);

    const lic: License = {
      id: 'lic-7',
      status: 'ACTIVE',
      plan: null,
      offlineDays: 10,
      maxDevices: null,
      version: null,
      gracePeriodDays: null,
      expiresAt: '2026-01-05T00:00:00.000Z',
    };

    await licenseManager.saveOfflineLicense(lic, 'user-7', '1.0.0');

    // advance beyond licenseExpiresAt
    vi.setSystemTime(new Date('2026-01-06T00:00:00.000Z'));
    const res = await licenseManager.validateStoredLicense();
    expect(res.reason).toBe('EXPIRED');
    expect(res.valid).toBe(false);
  });

  it('validateStoredLicense returns INACTIVE for stored inactive license', async () => {
    // build a record and save directly to storage
    const record: OfflineLicenseRecord = {
      userId: 'user-inactive',
      licenseId: 'lic-inactive',
      validatedAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
      offlineExpiresAt: new Date('2026-01-10T00:00:00.000Z').toISOString(),
      licenseStatus: SessionStatus.UNKNOWN as any,
      appVersion: '1.0.0',
      offlineDays: 9,
      licenseExpiresAt: '2026-12-31T00:00:00.000Z',
      schemaVersion: 1,
    };

    // mark as INACTIVE
    const inactive = { ...record, licenseStatus: 'INACTIVE' as any };
    localLicenseStorage.save(inactive);

    const res = await licenseManager.validateStoredLicense();
    expect(res.reason).toBe('INACTIVE');
    expect(res.valid).toBe(false);
  });
});

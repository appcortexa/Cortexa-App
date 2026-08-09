import { beforeEach, describe, expect, it } from 'vitest';
import { localLicenseStorage } from '../storage/LocalLicenseStorage';
import type { OfflineLicenseRecord } from '../types/OfflineLicense';
import { SessionStatus } from '../types/SessionStatus';

const STORAGE_KEY = 'cortexa_offline_license_v1';

describe('LocalLicenseStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saveLicense and getLicense roundtrip', () => {
    const record: OfflineLicenseRecord = {
      userId: 'user-1',
      licenseId: 'lic-1',
      validatedAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
      offlineExpiresAt: new Date('2026-01-06T00:00:00.000Z').toISOString(),
      licenseStatus: SessionStatus.VALID as any,
      appVersion: '1.0.0',
      offlineDays: 5,
      licenseExpiresAt: '2026-12-31T00:00:00.000Z',
      schemaVersion: 1,
    };

    localLicenseStorage.save(record);
    const loaded = localLicenseStorage.load();
    expect(loaded).toEqual(record);
  });

  it('clearLicense removes stored value', () => {
    const record: OfflineLicenseRecord = {
      userId: 'u', licenseId: 'l', validatedAt: new Date().toISOString(), offlineExpiresAt: new Date().toISOString(), licenseStatus: SessionStatus.VALID as any, appVersion: 'v', offlineDays: 1, licenseExpiresAt: null, schemaVersion: 1,
    };

    localLicenseStorage.save(record);
    expect(localLicenseStorage.load()).not.toBeNull();
    localLicenseStorage.clear();
    expect(localLicenseStorage.load()).toBeNull();
  });

  it('load returns null when no data', () => {
    expect(localLicenseStorage.load()).toBeNull();
  });

  it('load handles invalid JSON gracefully', () => {
    // directly write invalid JSON to localStorage under the expected key
    localStorage.setItem(STORAGE_KEY, '{ invalid json');
    expect(localLicenseStorage.load()).toBeNull();
  });
});

import type { License } from './LicenseService';
import { localLicenseStorage } from '../storage/LocalLicenseStorage';
import { localPermitStorage } from '../storage/LocalPermitStorage';
import type { OfflineLicenseRecord } from '../types/OfflineLicense';
import type { SignedOfflinePermit } from '../types/SignedOfflinePermit';
import { validateOfflineLicense } from '../utils/OfflineLicenseValidator';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const SCHEMA_VERSION = 1;

export class LicenseManager {
  // Save an online `License` as a persisted `OfflineLicenseRecord`.
  public async saveOfflineLicense(license: License, userId: string, appVersion: string): Promise<OfflineLicenseRecord | null> {
    if (!license) return null;

    if (license.status !== 'ACTIVE') return null;

    if (!license.expiresAt) return null;

    const expiresAt = new Date(license.expiresAt);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
      return null;
    }

    const validatedAt = new Date();
    const offlineDays = license.offlineDays ?? 0;

    const offlineExpiresAt = new Date(validatedAt.getTime() + Math.max(0, offlineDays) * MS_PER_DAY);

    const record: OfflineLicenseRecord = {
      userId,
      licenseId: license.id,
      validatedAt: validatedAt.toISOString(),
      offlineExpiresAt: offlineExpiresAt.toISOString(),
      licenseStatus: (license.status ?? 'INACTIVE') as any,
      appVersion,
      offlineDays: license.offlineDays ?? null,
      licenseExpiresAt: license.expiresAt ?? null,
      schemaVersion: SCHEMA_VERSION,
    };

    localLicenseStorage.save(record);
    return record;
  }

  // Load the persisted OfflineLicenseRecord
  public async loadOfflineLicense(): Promise<OfflineLicenseRecord | null> {
    return localLicenseStorage.load();
  }

  // Clear persisted offline license
  public async clearLicense(): Promise<void> {
    localLicenseStorage.clear();
  }

  public async saveSignedOfflinePermit(permit: SignedOfflinePermit): Promise<SignedOfflinePermit> {
    if (!permit) {
      throw new Error('SignedOfflinePermit is required');
    }

    localPermitStorage.save(permit);
    return permit;
  }

  public async loadSignedOfflinePermit(): Promise<SignedOfflinePermit | null> {
    return localPermitStorage.load();
  }

  public async clearSignedOfflinePermit(): Promise<void> {
    localPermitStorage.clear();
  }

  // Validate stored license using OfflineLicenseValidator
  public async validateStoredLicense(currentDate?: string | Date) {
    const record = localLicenseStorage.load();
    if (!record) {
      return {
        valid: false,
        reason: 'NO_LICENSE',
        offlineDaysRemaining: undefined,
      } as const;
    }

    // Map stored record to License shape expected by validator
    const mappedLicense: License = {
      id: record.licenseId,
      status: String(record.licenseStatus),
      plan: null,
      offlineDays: record.offlineDays,
      maxDevices: null,
      version: null,
      gracePeriodDays: null,
      expiresAt: record.licenseExpiresAt,
    };

    const info = {
      offlineReferenceDate: record.validatedAt,
      currentDate: currentDate ?? undefined,
    };

    const result = validateOfflineLicense(mappedLicense, info);

    return {
      valid: result.valid,
      reason: result.reason,
      offlineDaysRemaining: result.offlineDaysRemaining,
    };
  }
}

export const licenseManager = new LicenseManager();

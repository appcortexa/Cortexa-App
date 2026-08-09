import { LocalStorageService } from './LocalStorageService';
import type { OfflineLicenseRecord } from '../types/OfflineLicense';

const STORAGE_KEY = 'cortexa_offline_license_v1';

export class LocalLicenseStorage {
  private readonly storage = new LocalStorageService();

  save(offline: OfflineLicenseRecord): void {
    this.storage.set(STORAGE_KEY, offline);
  }

  load(): OfflineLicenseRecord | null {
    return this.storage.get<OfflineLicenseRecord>(STORAGE_KEY);
  }

  clear(): void {
    this.storage.remove(STORAGE_KEY);
  }
}

export const localLicenseStorage = new LocalLicenseStorage();


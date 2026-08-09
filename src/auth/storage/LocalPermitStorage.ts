import { LocalStorageService } from './LocalStorageService';
import type { SignedOfflinePermit } from '../types/SignedOfflinePermit';

const STORAGE_KEY = 'cortexa_offline_permit_v1';

export class LocalPermitStorage {
  private readonly storage = new LocalStorageService();

  save(permit: SignedOfflinePermit): void {
    this.storage.set(STORAGE_KEY, permit);
  }

  load(): SignedOfflinePermit | null {
    return this.storage.get<SignedOfflinePermit>(STORAGE_KEY);
  }

  clear(): void {
    this.storage.remove(STORAGE_KEY);
  }
}

export const localPermitStorage = new LocalPermitStorage();

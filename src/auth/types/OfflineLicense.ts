import type { SessionStatus } from './SessionStatus';

export interface OfflineLicense {
  readonly userId: string;
  readonly licenseId: string;
  readonly validatedAt: string;
  readonly offlineExpiresAt: string;
  readonly licenseStatus: SessionStatus;
  readonly appVersion: string;
}

// Extended fields for persistence and future compatibility
export interface OfflineLicenseRecord extends OfflineLicense {
  readonly offlineDays: number | null;
  readonly licenseExpiresAt: string | null;
  readonly schemaVersion: number;
}

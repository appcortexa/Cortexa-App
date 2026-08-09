import type { SessionStatus } from './SessionStatus';

export interface OfflinePermitPayload {
  readonly permitId: string;
  readonly userId: string;
  readonly licenseId: string;
  readonly licenseStatus: SessionStatus;
  readonly licensePlan: string | null;
  readonly deviceId: string;
  readonly issuedAt: string; // ISO/UTC
  readonly offlineExpiresAt: string; // ISO/UTC
  readonly licenseExpiresAt: string | null; // ISO/UTC
  readonly offlineDays: number;
  readonly maxDevices: number | null;
  readonly appVersion: string;
  readonly schemaVersion: number;
  readonly nonce: string;
}

export type SignedOfflinePermitAlgorithm = 'ECDSA_P256_SHA256';

export interface SignedOfflinePermit {
  readonly payload: OfflinePermitPayload;
  readonly signature: string; // Base64URL representation of the signature (placeholder)
  readonly algorithm: SignedOfflinePermitAlgorithm;
}

export type { OfflinePermitPayload as OfflinePermitPayloadType };

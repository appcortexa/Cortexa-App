import { deviceManager } from './DeviceManager';
import { authService } from './AuthService';
import type { License } from './LicenseService';
import { importPublicKey, verifyPermit } from '../security/SignedPermitVerifier';
import type { SignedOfflinePermit, SignedOfflinePermitAlgorithm, OfflinePermitPayload } from '../types/SignedOfflinePermit';
import { APP_VERSION } from '../../config/app';

const OFFLINE_PERMIT_ENDPOINT = '/edge/issueOfflinePermit';
const SUPPORTED_ALGORITHM: SignedOfflinePermitAlgorithm = 'ECDSA_P256_SHA256';
const KNOWN_KEY_IDS = ['key-v1'];

const OFFLINE_PERMIT_PUBLIC_KEY = import.meta.env.VITE_OFFLINE_PERMIT_PUBLIC_KEY as string | undefined;

interface OfflinePermitResponseMetadata {
  algorithm: string;
  keyId: string;
  issuedBy: string;
  serverTime: string;
  schemaVersion: number;
}

interface OfflinePermitResponse {
  payload: OfflinePermitPayload;
  signature: string;
  metadata: OfflinePermitResponseMetadata;
}

function assertValidPermitMetadata(metadata: OfflinePermitResponseMetadata): void {
  if (metadata.algorithm !== SUPPORTED_ALGORITHM) {
    throw new Error(`Unsupported permit algorithm: ${metadata.algorithm}`);
  }

  if (!KNOWN_KEY_IDS.includes(metadata.keyId)) {
    throw new Error(`Unknown permit keyId: ${metadata.keyId}`);
  }
}

function assertValidPermitPayload(
  payload: OfflinePermitPayload,
  expectedUserId: string,
  expectedDeviceId: string,
  expectedAppVersion: string,
  expectedLicenseId?: string,
): void {
  if (payload.userId !== expectedUserId) {
    throw new Error('Permit payload userId mismatch');
  }

  if (payload.deviceId !== expectedDeviceId) {
    throw new Error('Permit payload deviceId mismatch');
  }

  if (payload.appVersion !== expectedAppVersion) {
    throw new Error('Permit payload appVersion mismatch');
  }

  if (expectedLicenseId && payload.licenseId !== expectedLicenseId) {
    throw new Error('Permit payload licenseId mismatch');
  }
}

function isFutureDate(value: string | null | undefined): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const timestamp = new Date(value).getTime();
  return !Number.isNaN(timestamp) && timestamp > Date.now();
}

function assertValidOfflinePermitPayload(payload: OfflinePermitPayload): void {
  if (String(payload.licenseStatus) !== 'ACTIVE') {
    throw new Error('Permit payload licenseStatus is not ACTIVE');
  }

  if (!isFutureDate(payload.offlineExpiresAt)) {
    throw new Error('Permit payload offlineExpiresAt is invalid or expired');
  }

  if (payload.licenseExpiresAt !== null && !isFutureDate(payload.licenseExpiresAt)) {
    throw new Error('Permit payload licenseExpiresAt is invalid or expired');
  }
}

export class OfflinePermitService {
  public async requestSignedOfflinePermit(userId: string, license: License): Promise<SignedOfflinePermit> {
    if (!OFFLINE_PERMIT_PUBLIC_KEY) {
      throw new Error('Offline permit public key is not configured');
    }

    if (!license || !license.id) {
      throw new Error('License is required to request offline permit');
    }

    const deviceId = await deviceManager.getDeviceId();
    const session = await authService.getCurrentSession();
    const authToken = session.data?.session?.access_token;
    if (!authToken) {
      throw new Error('Missing auth token to request offline permit');
    }

    const response = await fetch(OFFLINE_PERMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        deviceId,
        appVersion: APP_VERSION,
      }),
    });

    if (!response.ok) {
      throw new Error(`Offline permit request failed: ${response.status}`);
    }

    const body = (await response.json()) as OfflinePermitResponse;

    if (!body || typeof body !== 'object') {
      throw new Error('Invalid offline permit response');
    }

    const { payload, signature, metadata } = body;

    if (!payload || typeof signature !== 'string' || !metadata || typeof metadata !== 'object') {
      throw new Error('Offline permit response shape invalid');
    }

    assertValidPermitMetadata(metadata);
    assertValidPermitPayload(payload, userId, deviceId, APP_VERSION, license.id);

    const publicKey = await importPublicKey(OFFLINE_PERMIT_PUBLIC_KEY);
    const permit: SignedOfflinePermit = {
      payload,
      signature,
      algorithm: metadata.algorithm as SignedOfflinePermitAlgorithm,
      keyId: metadata.keyId,
    };

    const { valid } = await verifyPermit(permit, publicKey);
    if (!valid) {
      throw new Error('Offline permit signature is invalid');
    }

    return permit;
  }

  public async verifySignedOfflinePermit(
    permit: SignedOfflinePermit,
    expectedUserId: string,
    expectedDeviceId: string,
    expectedAppVersion: string,
    expectedLicenseId?: string,
  ): Promise<boolean> {
    if (!OFFLINE_PERMIT_PUBLIC_KEY) {
      return false;
    }

    try {
      const { payload, algorithm, keyId } = permit;
      if (algorithm !== SUPPORTED_ALGORITHM || !KNOWN_KEY_IDS.includes(keyId)) {
        return false;
      }

      const publicKey = await importPublicKey(OFFLINE_PERMIT_PUBLIC_KEY);
      const result = await verifyPermit(permit, publicKey);
      if (!result.valid) {
        return false;
      }

      assertValidPermitPayload(payload, expectedUserId, expectedDeviceId, expectedAppVersion, expectedLicenseId);
      assertValidOfflinePermitPayload(payload);
      return true;
    } catch {
      return false;
    }
  }
}

export const offlinePermitService = new OfflinePermitService();

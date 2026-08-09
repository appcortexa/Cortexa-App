import type { SignedOfflinePermit, OfflinePermitPayload } from '../types/SignedOfflinePermit';

const encoder = new TextEncoder();

const BASE64URL_TO_BASE64 = (value: string): string =>
  value.replace(/-/g, '+').replace(/_/g, '/').padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return buffer;
};

const stableSerializePayload = (payload: OfflinePermitPayload): string => {
  const ordered = {
    permitId: payload.permitId,
    userId: payload.userId,
    licenseId: payload.licenseId,
    licensePlan: payload.licensePlan,
    licenseStatus: payload.licenseStatus,
    deviceId: payload.deviceId,
    issuedAt: payload.issuedAt,
    offlineExpiresAt: payload.offlineExpiresAt,
    licenseExpiresAt: payload.licenseExpiresAt,
    offlineDays: payload.offlineDays,
    maxDevices: payload.maxDevices,
    appVersion: payload.appVersion,
    schemaVersion: payload.schemaVersion,
    nonce: payload.nonce,
  };

  return JSON.stringify(ordered);
};

export async function importPublicKey(spkiBase64: string): Promise<CryptoKey> {
  const spki = base64ToArrayBuffer(spkiBase64);

  return crypto.subtle.importKey(
    'spki',
    spki,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['verify'],
  );
}

export async function verifyPermit(
  permit: SignedOfflinePermit,
  publicKey: CryptoKey,
): Promise<{ valid: boolean }> {
  if (permit.algorithm !== 'ECDSA_P256_SHA256') {
    return { valid: false };
  }

  const payloadJson = stableSerializePayload(permit.payload);
  const data = encoder.encode(payloadJson);
  const signatureBase64 = BASE64URL_TO_BASE64(permit.signature);
  const signature = base64ToArrayBuffer(signatureBase64);

  const valid = await crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: 'SHA-256',
    },
    publicKey,
    signature,
    data,
  );

  return { valid };
}

import { licenseService } from '../auth/services/LicenseService';
import { supabase } from '../services/supabase/supabaseClient';

const AUTH_HEADER_PREFIX = 'Bearer ';
const ALGORITHM = 'ECDSA_P256_SHA256';
const KEY_ID = 'key-v1';
const ISSUED_BY = 'CORTEXA_LICENSE_SERVER';
const SCHEMA_VERSION = 1;
const PRIVATE_KEY_SECRET_NAME = 'LICENSE_PRIVATE_KEY';

type IssueOfflinePermitRequestBody = {
  deviceId: string;
  appVersion: string;
  userId?: unknown;
  licenseId?: unknown;
  nonce?: unknown;
};

type OfflinePermitPayload = {
  permitId: string;
  userId: string;
  licenseId: string;
  licensePlan: string | null;
  licenseStatus: string | null;
  deviceId: string;
  issuedAt: string;
  offlineExpiresAt: string;
  licenseExpiresAt: string | null;
  offlineDays: number;
  maxDevices: number | null;
  appVersion: string;
  schemaVersion: number;
  nonce: string;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function base64UrlEncode(input: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...input));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function parseBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) {
    return null;
  }

  if (!authorizationHeader.startsWith(AUTH_HEADER_PREFIX)) {
    return null;
  }

  const token = authorizationHeader.slice(AUTH_HEADER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

async function getUserIdFromJwt(token: string): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return null;
  }

  const userId = data.user.id;
  if (typeof userId !== 'string' || userId.trim().length === 0) {
    return null;
  }

  return userId;
}

function validateRequestBody(body: unknown): body is IssueOfflinePermitRequestBody {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  const requestBody = body as IssueOfflinePermitRequestBody;
  if (typeof requestBody.deviceId !== 'string' || requestBody.deviceId.trim().length === 0) {
    return false;
  }

  if (typeof requestBody.appVersion !== 'string' || requestBody.appVersion.trim().length === 0) {
    return false;
  }

  if ('userId' in requestBody || 'licenseId' in requestBody || 'nonce' in requestBody) {
    return false;
  }

  return true;
}

function buildOfflineExpiresAt(issuedAt: Date, offlineDays: number): string {
  const ms = Math.max(0, offlineDays) * 24 * 60 * 60 * 1000;
  return new Date(issuedAt.getTime() + ms).toISOString();
}

function canonicalizePayload(payload: OfflinePermitPayload): string {
  return JSON.stringify({
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
  });
}

function pemToDer(privateKeyPem: string): ArrayBuffer {
  const normalizedPem = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');

  const binary = atob(normalizedPem);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

async function getPrivateKey(): Promise<CryptoKey> {
  const privateKey = typeof process !== 'undefined' && process.env?.[PRIVATE_KEY_SECRET_NAME]
    ? process.env[PRIVATE_KEY_SECRET_NAME]
    : typeof globalThis !== 'undefined' && (globalThis as any)?.Deno?.env?.get
      ? (globalThis as any).Deno.env.get(PRIVATE_KEY_SECRET_NAME)
      : undefined;

  if (!privateKey || typeof privateKey !== 'string') {
    throw new Error('Missing private key secret');
  }

  const derBuffer = pemToDer(privateKey);
  return crypto.subtle.importKey(
    'pkcs8',
    derBuffer,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    false,
    ['sign']
  );
}

async function signPayload(payload: OfflinePermitPayload): Promise<string> {
  const serialized = canonicalizePayload(payload);
  const key = await getPrivateKey();
  const signature = await crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: 'SHA-256',
    },
    key,
    new TextEncoder().encode(serialized)
  );

  return base64UrlEncode(new Uint8Array(signature));
}

function buildPayload(
  userId: string,
  license: NonNullable<Awaited<ReturnType<typeof licenseService.getLicense>>>,
  deviceId: string,
  appVersion: string
): OfflinePermitPayload {
  const issuedAt = new Date();
  const offlineDays = license.offlineDays ?? 0;

  return {
    permitId: crypto.randomUUID(),
    userId,
    licenseId: license.id,
    licensePlan: license.plan,
    licenseStatus: license.status,
    deviceId,
    issuedAt: issuedAt.toISOString(),
    offlineExpiresAt: buildOfflineExpiresAt(issuedAt, offlineDays),
    licenseExpiresAt: license.expiresAt,
    offlineDays,
    maxDevices: license.maxDevices,
    appVersion,
    schemaVersion: SCHEMA_VERSION,
    nonce: crypto.randomUUID(),
  };
}

export async function handleIssueOfflinePermitRequest(request: Request): Promise<Response> {
  try {
    const authorizationHeader = request.headers.get('Authorization');
    const token = parseBearerToken(authorizationHeader);

    if (!token) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const userId = await getUserIdFromJwt(token);
    if (!userId) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const parsedBody = await request.json().catch(() => null);
    if (!validateRequestBody(parsedBody)) {
      return jsonResponse({ error: 'Invalid request body' }, 422);
    }

    const { deviceId, appVersion } = parsedBody;

    const license = await licenseService.getLicense(userId);
    if (!license) {
      return jsonResponse({ error: 'License not found' }, 403);
    }

    if (license.status !== 'ACTIVE') {
      return jsonResponse({ error: 'License not active' }, 403);
    }

    // Placeholder for future device conflict detection.
    const hasDeviceConflict = false;
    if (hasDeviceConflict) {
      return jsonResponse({ error: 'Device conflict' }, 409);
    }

    const payload = buildPayload(userId, license, deviceId.trim(), appVersion.trim());
    const signature = await signPayload(payload);
    const metadata = {
      algorithm: ALGORITHM,
      keyId: KEY_ID,
      issuedBy: ISSUED_BY,
      serverTime: new Date().toISOString(),
      schemaVersion: SCHEMA_VERSION,
    };

    return jsonResponse({ payload, signature, metadata });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

export async function POST(request: Request): Promise<Response> {
  return handleIssueOfflinePermitRequest(request);
}

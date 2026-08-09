import { createClient } from '@supabase/supabase-js';

const AUTH_HEADER_PREFIX = 'Bearer ';
const ALGORITHM = 'ECDSA_P256_SHA256';
const KEY_ID = 'key-v1';
const ISSUED_BY = 'CORTEXA_LICENSE_SERVER';
const SCHEMA_VERSION = 1;

type NetlifyEvent = {
  body: string | null;
  headers: Record<string, string | undefined>;
};

type NetlifyResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

type IssueOfflinePermitRequestBody = {
  deviceId: string;
  appVersion: string;
  userId?: unknown;
  licenseId?: unknown;
  nonce?: unknown;
};

type LicenseRow = {
  id: string;
  license_status: string | null;
  license_plan: string | null;
  offline_days: number | null;
  max_devices: number | null;
  expires_at: string | null;
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

function jsonResponse(body: unknown, statusCode = 200): NetlifyResponse {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function base64UrlEncode(input: Uint8Array): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function parseBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader?.startsWith(AUTH_HEADER_PREFIX)) {
    return null;
  }

  const token = authorizationHeader.slice(AUTH_HEADER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

function validateRequestBody(body: unknown): body is IssueOfflinePermitRequestBody {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  const requestBody = body as IssueOfflinePermitRequestBody;
  return typeof requestBody.deviceId === 'string'
    && requestBody.deviceId.trim().length > 0
    && typeof requestBody.appVersion === 'string'
    && requestBody.appVersion.trim().length > 0
    && !('userId' in requestBody)
    && !('licenseId' in requestBody)
    && !('nonce' in requestBody);
}

function buildOfflineExpiresAt(issuedAt: Date, offlineDays: number): string {
  return new Date(issuedAt.getTime() + Math.max(0, offlineDays) * 24 * 60 * 60 * 1000).toISOString();
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
  const bytes = Buffer.from(normalizedPem, 'base64');
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function signPayload(payload: OfflinePermitPayload, privateKeyPem: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToDer(privateKeyPem),
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(canonicalizePayload(payload)),
  );

  return base64UrlEncode(new Uint8Array(signature));
}

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  const expiresAtTime = new Date(expiresAt).getTime();
  return !Number.isNaN(expiresAtTime) && expiresAtTime <= Date.now();
}

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const privateKeyPem = process.env.LICENSE_PRIVATE_KEY;
    if (!supabaseUrl || !supabaseAnonKey || !privateKeyPem) {
      throw new Error('Missing server configuration');
    }

    const token = parseBearerToken(event.headers.authorization ?? event.headers.Authorization);
    if (!token) return jsonResponse({ error: 'Unauthorized' }, 401);

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    const userId = authData.user?.id;
    if (authError || !userId) return jsonResponse({ error: 'Unauthorized' }, 401);

    const parsedBody = event.body ? JSON.parse(event.body) : null;
    if (!validateRequestBody(parsedBody)) return jsonResponse({ error: 'Invalid request body' }, 422);

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `${AUTH_HEADER_PREFIX}${token}` } },
    });
    const { data: license, error: licenseError } = await userClient
      .from('licenses')
      .select('id, license_status, license_plan, offline_days, max_devices, expires_at')
      .eq('user_id', userId)
      .maybeSingle<LicenseRow>();
    if (licenseError) throw licenseError;

    if (!license) return jsonResponse({ error: 'License not found' }, 403);
    if (license.license_status !== 'ACTIVE') return jsonResponse({ error: 'License not active' }, 403);
    if (isExpired(license.expires_at)) return jsonResponse({ error: 'License expired' }, 403);

    // Real maxDevices enforcement remains pending; preserve the existing no-conflict behavior.
    const hasDeviceConflict = false;
    if (hasDeviceConflict) return jsonResponse({ error: 'Device conflict' }, 409);

    const issuedAt = new Date();
    const offlineDays = license.offline_days ?? 0;
    const payload: OfflinePermitPayload = {
      permitId: crypto.randomUUID(),
      userId,
      licenseId: license.id,
      licensePlan: license.license_plan,
      licenseStatus: license.license_status,
      deviceId: parsedBody.deviceId.trim(),
      issuedAt: issuedAt.toISOString(),
      offlineExpiresAt: buildOfflineExpiresAt(issuedAt, offlineDays),
      licenseExpiresAt: license.expires_at,
      offlineDays,
      maxDevices: license.max_devices,
      appVersion: parsedBody.appVersion.trim(),
      schemaVersion: SCHEMA_VERSION,
      nonce: crypto.randomUUID(),
    };
    const signature = await signPayload(payload, privateKeyPem);

    return jsonResponse({
      payload,
      signature,
      metadata: {
        algorithm: ALGORITHM,
        keyId: KEY_ID,
        issuedBy: ISSUED_BY,
        serverTime: new Date().toISOString(),
        schemaVersion: SCHEMA_VERSION,
      },
    });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

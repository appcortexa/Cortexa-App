import { supabase } from '../../services/supabase/supabaseClient';

type SupabaseLicenseRow = {
  id: string;
  license_status: string | null;
  license_plan: string | null;
  offline_days: number | null;
  max_devices: number | null;
  license_version: string | null;
  grace_period_days: number | null;
  expires_at: string | null;
};

export type License = {
  id: string;
  status: string | null;
  plan: string | null;
  offlineDays: number | null;
  maxDevices: number | null;
  version: string | null;
  gracePeriodDays: number | null;
  expiresAt: string | null;
};

export class LicenseTransportUnavailableError extends Error {
  public readonly category = 'LICENSE_TRANSPORT_UNAVAILABLE';

  constructor() {
    super('License transport unavailable');
    this.name = 'LicenseTransportUnavailableError';
  }
}

export class LicenseService {
  async getLicense(userId: string): Promise<License | null> {
    const { data, error, status } = await supabase
      .from('licenses')
      .select('id, license_status, license_plan, offline_days, max_devices, license_version, grace_period_days, expires_at')
      .eq('user_id', userId)
      .maybeSingle<SupabaseLicenseRow>();

    if (error) {
      // PostgREST uses status 0 only when fetch produced no HTTP response.
      // Preserve that structural distinction for the signed offline fallback.
      if (status === 0) {
        throw new LicenseTransportUnavailableError();
      }

      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      status: data.license_status,
      plan: data.license_plan,
      offlineDays: data.offline_days,
      maxDevices: data.max_devices,
      version: data.license_version,
      gracePeriodDays: data.grace_period_days,
      expiresAt: data.expires_at,
    };
  }
}

export const licenseService = new LicenseService();

import type { License } from '../services/LicenseService';

export type OfflineLicenseValidationReason =
  | 'NO_LICENSE'
  | 'INACTIVE'
  | 'EXPIRED'
  | 'OFFLINE_PERIOD_EXPIRED'
  | 'VALID';

export interface OfflineLicenseValidationInfo {
  /**
   * Fecha en la que comenzó el período offline o en la que se validó por última vez en línea.
   * Se utiliza como punto de referencia para calcular los días offline transcurridos.
   */
  offlineReferenceDate: string | Date;

  /**
   * Fecha que se utiliza para la evaluación actual. Si se omite, se utiliza la fecha/hora actual del sistema.
   */
  currentDate?: string | Date;
}

export interface OfflineLicenseValidationResult {
  valid: boolean;
  reason: OfflineLicenseValidationReason;
  /**
   * Días offline restantes a partir de la referencia offline. Se incluye cuando es posible calcularlo.
   */
  offlineDaysRemaining?: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const parseDate = (value: string | Date | undefined): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getElapsedFullDays = (from: Date, to: Date): number => {
  const elapsedMs = to.getTime() - from.getTime();
  return elapsedMs <= 0 ? 0 : Math.floor(elapsedMs / MS_PER_DAY);
};

export const validateOfflineLicense = (
  license: License | null,
  info: OfflineLicenseValidationInfo,
): OfflineLicenseValidationResult => {
  if (!license) {
    return {
      valid: false,
      reason: 'NO_LICENSE',
    };
  }

  if (license.status !== 'ACTIVE') {
    return {
      valid: false,
      reason: 'INACTIVE',
    };
  }

  if (!license.expiresAt) {
    return {
      valid: false,
      reason: 'EXPIRED',
    };
  }

  const expiresAt = parseDate(license.expiresAt);
  if (!expiresAt) {
    return {
      valid: false,
      reason: 'EXPIRED',
    };
  }

  const now = info.currentDate ? parseDate(info.currentDate) : new Date();
  if (!now) {
    return {
      valid: false,
      reason: 'OFFLINE_PERIOD_EXPIRED',
      offlineDaysRemaining: 0,
    };
  }

  if (expiresAt.getTime() <= now.getTime()) {
    return {
      valid: false,
      reason: 'EXPIRED',
    };
  }

  const offlineReferenceDate = parseDate(info.offlineReferenceDate);
  if (!offlineReferenceDate) {
    return {
      valid: false,
      reason: 'OFFLINE_PERIOD_EXPIRED',
      offlineDaysRemaining: 0,
    };
  }

  const allowedOfflineDays = license.offlineDays ?? 0;
  if (allowedOfflineDays <= 0) {
    return {
      valid: false,
      reason: 'OFFLINE_PERIOD_EXPIRED',
      offlineDaysRemaining: 0,
    };
  }

  const elapsedDays = getElapsedFullDays(offlineReferenceDate, now);
  const offlineDaysRemaining = Math.max(0, allowedOfflineDays - elapsedDays);

  if (offlineDaysRemaining <= 0) {
    return {
      valid: false,
      reason: 'OFFLINE_PERIOD_EXPIRED',
      offlineDaysRemaining: 0,
    };
  }

  return {
    valid: true,
    reason: 'VALID',
    offlineDaysRemaining,
  };
};

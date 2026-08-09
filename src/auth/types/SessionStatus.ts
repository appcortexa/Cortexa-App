export const SessionStatus = {
  UNKNOWN: 'UNKNOWN',
  VALID: 'VALID',
  EXPIRED: 'EXPIRED',
  NO_SESSION: 'NO_SESSION',
} as const;

// Stage 1 keeps this contract intentionally simple. A dedicated online-validation state can be introduced later
// once the session-validation rules are defined more explicitly.
export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

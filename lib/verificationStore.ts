interface VerificationRecord {
  code: string;
  type: 'signup' | 'forgot-password';
  expiresAt: number;
}

// In-memory verification store (persists during process lifecycle)
const verificationMap = new Map<string, VerificationRecord>();

export function saveVerificationCode(email: string, code: string, type: 'signup' | 'forgot-password', ttlMinutes = 10): void {
  const normalizedEmail = email.toLowerCase().trim();
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  verificationMap.set(`${normalizedEmail}:${type}`, { code, type, expiresAt });
}

export function getVerificationRecord(email: string, type: 'signup' | 'forgot-password'): VerificationRecord | null {
  const normalizedEmail = email.toLowerCase().trim();
  const record = verificationMap.get(`${normalizedEmail}:${type}`);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    verificationMap.delete(`${normalizedEmail}:${type}`);
    return null;
  }
  return record;
}

export function verifyAndClearCode(email: string, code: string, type: 'signup' | 'forgot-password'): boolean {
  const record = getVerificationRecord(email, type);
  if (!record) return false;
  if (record.code === code.trim()) {
    verificationMap.delete(`${email.toLowerCase().trim()}:${type}`);
    return true;
  }
  return false;
}

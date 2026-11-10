export const ALLOWED_DOMAIN = (process.env.EXPO_PUBLIC_ALLOWED_DOMAIN ?? 'hbplus.fit').toLowerCase();
export const DOMAIN_ERROR =
  'Access restricted. Please login using your official domain email.';

/**
 * Exact suffix match on "@domain". Using endsWith (not includes) prevents
 * bypasses like "a@hbplus.fit.evil.com" or "a@nothbplus.fit".
 */
export function isAllowedEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
}

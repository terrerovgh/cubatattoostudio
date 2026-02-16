
/**
 * Constant-time string comparison to prevent timing attacks.
 * Uses SHA-256 hashing to ensure equal length buffers before comparison.
 */
export async function safeCompare(a: string | undefined | null, b: string | undefined | null): Promise<boolean> {
  if (!a || !b) return false;

  const encoder = new TextEncoder();
  const dataA = encoder.encode(a);
  const dataB = encoder.encode(b);

  // Hash the inputs to ensure fixed length
  const hashA = await crypto.subtle.digest('SHA-256', dataA);
  const hashB = await crypto.subtle.digest('SHA-256', dataB);

  // Compare the hashes in constant time
  // crypto.subtle.timingSafeEqual requires ArrayBuffers of equal length, which SHA-256 guarantees (32 bytes)
  return (crypto.subtle as any).timingSafeEqual(hashA, hashB);
}

/**
 * Verifies the Admin authentication token.
 */
export async function verifyAdminAuth(request: Request, env: Env): Promise<boolean> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !env.ADMIN_PASSWORD) return false;

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  return safeCompare(token, env.ADMIN_PASSWORD);
}

/**
 * Verifies the Upload authentication token.
 */
export async function verifyUploadAuth(request: Request, env: Env): Promise<boolean> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !env.UPLOAD_SECRET) return false;

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  return safeCompare(token, env.UPLOAD_SECRET);
}

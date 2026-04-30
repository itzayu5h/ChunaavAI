/**
 * Environment variables validation helper
 * Ensures all required keys exist at startup.
 */

export function validateEnv() {
  const requiredServerVars = [
    'GEMINI_API_KEY',
  ];

  const requiredPublicVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ];

  const missing: string[] = [];

  // Check server-side variables (only if running on server)
  if (typeof window === 'undefined') {
    requiredServerVars.forEach((key) => {
      if (!process.env[key]) missing.push(key);
    });
  }

  // Check public variables (client and server)
  requiredPublicVars.forEach((key) => {
    if (!process.env[key]) missing.push(key);
  });

  if (missing.length > 0) {
    throw new Error(
      `❌ [SECURITY] Missing required environment variables: ${missing.join(', ')}\n` +
      `Check your .env.local file or server environment configuration.`
    );
  }
}

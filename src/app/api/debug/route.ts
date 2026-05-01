/**
 * Debug route — verify environment variables at runtime
 * GET /api/debug
 */
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const key = process.env.GEMINI_API_KEY
  return Response.json({
    hasGeminiKey: !!key,
    keyStart: key ? key.substring(0, 8) : 'MISSING',
    keyLength: key?.length ?? 0,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}

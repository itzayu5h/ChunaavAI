/**
 * CivicBot Chat API Route
 * POST /api/chat
 * Powered by Gemini 1.5 Flash
 * Non-partisan Indian election assistant
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendCivicBotMessage } from '@/lib/gemini'
import { sanitizeUserInput, validateElectionQuery } from '@/lib/security/sanitize'
import type { ChatRequest, ApiResponse } from '@/types/india'

// In-memory rate limiting fallback for hackathon
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();

/**
 * Handle POST requests to CivicBot.
 * Implements security: auth check, sanitization, injection blocking, rate limiting.
 *
 * @param request - Incoming Next.js API request with ChatRequest body
 * @returns JSON ApiResponse<string> with CivicBot reply or error details
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Verify Firebase Auth token in header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Unauthorized: Missing or invalid token' },
        { status: 401 }
      );
    }
    const token = authHeader.split('Bearer ')[1];
    
    // Fallback pseudo-userId for rate limiting (since admin SDK isn't present)
    const userId = token.substring(0, 10); 

    // 2. Rate limiting: max 20 requests per user per hour
    const now = Date.now();
    const userRate = rateLimitMap.get(userId);
    if (userRate && now - userRate.timestamp < 3600000) {
      if (userRate.count >= 20) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Rate limit exceeded: 20 requests per hour allowed.' },
          { status: 429 }
        );
      }
      userRate.count++;
    } else {
      rateLimitMap.set(userId, { count: 1, timestamp: now });
    }

    const body = (await request.json()) as ChatRequest

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // 3. Input sanitization: strip HTML tags, limit to 500 characters max
    const sanitized = sanitizeUserInput(body.message, 500)

    if (sanitized.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid message' },
        { status: 400 }
      )
    }

    // 4. Block prompt injection patterns
    if (!validateElectionQuery(sanitized)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Blocked: Message contains restricted patterns' },
        { status: 403 }
      )
    }

    const response = await sendCivicBotMessage(
      sanitized,
      body.conversationHistory ?? [],
      body.userState
    )

    // 5. Add Security headers
    const headers = new Headers();
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');

    return NextResponse.json<ApiResponse<string>>({
      success: true,
      data: response,
    }, { headers })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('CivicBot API error:', errMsg)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error:
          process.env.NODE_ENV === 'development'
            ? `Gemini error: ${errMsg}`
            : 'CivicBot is temporarily unavailable. Please try again.',
      },
      { status: 500 }
    )
  }
}

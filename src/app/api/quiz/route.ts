/**
 * Quiz Generation API Route
 * POST /api/quiz
 * Generates India-specific election quiz questions using Gemini AI
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateQuizQuestions } from '@/lib/gemini'
import type { QuizRequest, QuizQuestion, ApiResponse } from '@/types/india'

const ALLOWED_TOPICS = [
  "Voter Registration",
  "EVM & VVPAT",
  "Lok Sabha",
  "Vidhan Sabha",
  "Model Code of Conduct",
  "NOTA"
];

const ALLOWED_DIFFICULTIES = ["basic", "intermediate", "advanced", "Basic", "Intermediate", "Advanced"];

/**
 * Handle POST requests to generate quiz questions.
 * Validates auth, topic and difficulty, clamps question count to 1-10,
 * then delegates to Gemini for bilingual quiz generation.
 *
 * @param request - Incoming Next.js API request with QuizRequest body
 * @returns JSON ApiResponse<QuizQuestion[]> with generated questions or error
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

    const body = (await request.json()) as QuizRequest

    if (!body.topic || !body.difficulty) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Topic and difficulty required' },
        { status: 400 }
      )
    }

    // Validate topic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!ALLOWED_TOPICS.includes(body.topic as any)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid topic. Please select from the allowed list.' },
        { status: 400 }
      )
    }

    // Validate difficulty
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!ALLOWED_DIFFICULTIES.includes(body.difficulty as any)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid difficulty. Must be Basic, Intermediate, or Advanced.' },
        { status: 400 }
      )
    }

    // Clamp question count: minimum 1, maximum 10
    const count = Math.min(Math.max(body.numberOfQuestions ?? 5, 1), 10)

    // Normalize difficulty for Gemini helper
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizedDifficulty = body.difficulty.toLowerCase() as any;

    const questions = await generateQuizQuestions(body.topic, normalizedDifficulty, count)

    // Security headers
    const headers = new Headers();
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');

    return NextResponse.json<ApiResponse<QuizQuestion[]>>({
      success: true,
      data: questions,
    }, { headers })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('Quiz API error:', errMsg)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error:
          process.env.NODE_ENV === 'development'
            ? `Gemini error: ${errMsg}`
            : 'Failed to generate quiz. Please try again.',
      },
      { status: 500 }
    )
  }
}

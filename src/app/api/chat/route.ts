import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limiter'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return Response.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { userId, message: rawMessage, prompt: rawPrompt } = body
    const message = rawMessage || rawPrompt || ''
    
    if (!message.trim()) {
      return Response.json(
        { error: 'Message is empty' },
        { status: 400 }
      )
    }

    // --- Rate Limiting ---
    if (userId) {
      const { allowed } = await checkRateLimit(userId, 'chat')
      if (!allowed) {
        return Response.json(
          { 
            error: 'Daily limit reached. Try again tomorrow! 🗳️',
            limitExceeded: true 
          },
          { status: 429 }
        )
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash'
    })

    const prompt = `You are CivicBot, a friendly 
non-partisan Indian election education assistant.

Only answer questions about:
- Indian elections and voting process
- Voter registration and EPIC cards
- EVM and VVPAT machines
- NOTA option
- Election Commission of India
- Lok Sabha and Vidhan Sabha
- Model Code of Conduct
- Candidate nominations
- Vote counting and results

Format your response with:
- Relevant emojis
- Short clear paragraphs
- Bullet points for lists
- Simple language for first time voters

If asked anything else, say:
"I can only help with Indian election topics! 
Ask me about voting, registration, or EVMs 🗳️"

User question: ${message}`

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    return Response.json({ 
      response: response,
      success: true
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('CivicBot error:', errorMessage)
    return Response.json(
      { 
        error: errorMessage,
        success: false
      },
      { status: 500 }
    )
  }
}

import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'AI service not configured.' }, { status: 500 })
    }

    const body = await req.json()
    const message = body.message || body.prompt || ''
    if (!message.trim()) {
      return Response.json({ error: 'Message cannot be empty' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent(
      `You are CivicBot, a friendly non-partisan Indian election education assistant.
Only answer about Indian elections, voter registration, EVM, NOTA, voting rights.
Use emojis, simple language for first-time voters.

User question: ${message}`
    )

    return Response.json({ response: result.response.text(), success: true })
  } catch (err: unknown) {
    const e = err as { message?: string }
    console.error('CivicBot error:', e.message)
    return Response.json({ error: e.message, success: false }, { status: 500 })
  }
}

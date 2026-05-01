import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    console.log('Chat API called')
    console.log('API Key exists:', !!apiKey)
    console.log('API Key length:', apiKey?.length)

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set!')
      return Response.json(
        { error: 'AI service not configured. Missing API key.' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const message = body.message || body.prompt || ''

    if (!message.trim()) {
      return Response.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    })

    const prompt = `You are CivicBot, a friendly non-partisan Indian election education assistant.

RULES:
- Only answer about Indian elections, voter registration, EVM, NOTA, election process, voting rights, candidates, results
- Use simple language for first-time voters
- Use emojis to make it friendly
- Keep answers clear and structured
- If asked non-election topics, politely redirect to elections

User question: ${message}`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    console.log('Gemini response received, length:', response.length)

    return Response.json({
      response: response,
      success: true,
    })
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number; stack?: string }
    console.error('CivicBot error details:', {
      message: err.message,
      status: err.status,
      stack: err.stack,
    })
    return Response.json(
      {
        error: 'CivicBot error: ' + err.message,
        success: false,
      },
      { status: 500 }
    )
  }
}

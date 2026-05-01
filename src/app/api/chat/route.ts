import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    console.log('Chat API called')

    const body = await req.json()
    const message = body.message || body.prompt || ''

    if (!message.trim()) {
      return Response.json({ error: 'Message cannot be empty' }, { status: 400 })
    }

    // Lazy import — VertexAI is only loaded when a request arrives, never at build time
    const { VertexAI } = await import('@google-cloud/vertexai')

    const vertexAI = new VertexAI({
      project: 'chunaavai-c1dda',
      location: 'asia-south1',
    })

    const model = vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
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
    const response = result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    console.log('Vertex AI response received, length:', response.length)

    return Response.json({ response, success: true })
  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string }
    console.error('CivicBot error:', err.message)
    return Response.json(
      { error: 'CivicBot error: ' + err.message, success: false },
      { status: 500 }
    )
  }
}

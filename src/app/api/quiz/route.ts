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
    const topic = body.topic || 'Voter Registration'
    const difficulty = body.difficulty || 'Basic'

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent(
      `Generate exactly 5 multiple choice questions about "${topic}" at "${difficulty}" level for Indian election education.

Return ONLY this exact JSON format, nothing else:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Explanation here"
    }
  ]
}

Rules:
- exactly 5 questions, exactly 4 options each
- correct is index 0-3
- relevant to Indian elections
- return ONLY JSON, no markdown`
    )

    let text = result.response.text()
    text = text.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim()
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start !== -1 && end !== -1) text = text.substring(start, end + 1)

    const parsed = JSON.parse(text)
    return Response.json({ ...parsed, success: true })
  } catch (err: unknown) {
    const e = err as { message?: string }
    console.error('Quiz error:', e.message)
    return Response.json({ error: e.message, success: false }, { status: 500 })
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    console.log('Quiz API called')
    console.log('API Key exists:', !!apiKey)

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set!')
      return Response.json(
        { error: 'Quiz service not configured.' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const topic = body.topic || 'Voter Registration'
    const difficulty = body.difficulty || 'Basic'

    console.log('Generating quiz for:', topic, difficulty)

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2048,
      },
    })

    const prompt = `Generate exactly 5 multiple choice questions about "${topic}" at "${difficulty}" level for Indian election education.

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
- exactly 5 questions
- exactly 4 options each
- correct is index 0-3
- relevant to Indian elections
- return ONLY JSON no markdown`

    const result = await model.generateContent(prompt)
    let text = result.response.text()

    console.log('Raw Gemini response:', text.substring(0, 200))

    text = text
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .trim()

    const startIndex = text.indexOf('{')
    const endIndex = text.lastIndexOf('}')
    if (startIndex !== -1 && endIndex !== -1) {
      text = text.substring(startIndex, endIndex + 1)
    }

    const parsed = JSON.parse(text)

    console.log('Quiz generated successfully:', parsed.questions?.length, 'questions')

    return Response.json({
      ...parsed,
      success: true,
    })
  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string }
    console.error('Quiz error details:', {
      message: err.message,
      stack: err.stack,
    })
    return Response.json(
      {
        error: 'Quiz error: ' + err.message,
        success: false,
      },
      { status: 500 }
    )
  }
}

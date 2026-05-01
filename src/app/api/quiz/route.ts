import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'

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
    const topic = body.topic || 'Voter Registration'
    const difficulty = body.difficulty || 'Basic'

    const genAI = new GoogleGenerativeAI(apiKey)
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash'
    })

    const prompt = `Generate exactly 5 multiple choice 
questions about "${topic}" at "${difficulty}" level 
for Indian election education.

Return ONLY valid JSON, no markdown, no explanation:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": [
        "Option A",
        "Option B", 
        "Option C",
        "Option D"
      ],
      "correct": 0,
      "explanation": "Why this is correct"
    }
  ]
}

Important:
- Exactly 5 questions
- Exactly 4 options each
- correct = index of right answer (0,1,2 or 3)
- About Indian elections only
- Return ONLY the JSON object above`

    const result = await model.generateContent(prompt)
    let text = result.response.text()
    
    text = text
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .trim()
    
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1)
    }
    
    const parsed = JSON.parse(text)
    
    return Response.json({
      questions: parsed.questions,
      success: true
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Quiz error:', errorMessage)
    return Response.json(
      { 
        error: errorMessage,
        success: false  
      },
      { status: 500 }
    )
  }
}

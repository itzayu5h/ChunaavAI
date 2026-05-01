import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    console.log('Quiz API called')

    const body = await req.json()
    const topic = body.topic || 'Voter Registration'
    const difficulty = body.difficulty || 'Basic'

    console.log('Generating quiz for:', topic, difficulty)

    // Lazy import — VertexAI is only loaded when a request arrives, never at build time
    const { VertexAI } = await import('@google-cloud/vertexai')

    const vertexAI = new VertexAI({
      project: 'chunaavai-c1dda',
      location: 'asia-south1',
    })

    const model = vertexAI.getGenerativeModel({
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
    let text = result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    console.log('Raw Vertex AI response:', text.substring(0, 200))

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
    console.log('Quiz generated:', parsed.questions?.length, 'questions')

    return Response.json({ ...parsed, success: true })
  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string }
    console.error('Quiz error:', err.message)
    return Response.json(
      { error: 'Quiz error: ' + err.message, success: false },
      { status: 500 }
    )
  }
}

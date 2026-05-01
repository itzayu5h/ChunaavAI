/**
 * Gemini AI client for ChunaavAI
 * Uses @google/generative-ai with GEMINI_API_KEY from Cloud Run env
 * Key is read lazily at call time — never at module load/build time
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type {
  ChatMessage,
  QuizQuestion,
  QuizTopic,
  QuizDifficulty,
  IndianState,
} from '@/types/india'

// Lazy getter — reads key fresh on every call, never at import time
function getGenAI(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.')
  }
  return new GoogleGenerativeAI(apiKey)
}

/** Non-partisan system instruction for CivicBot */
const CIVICBOT_SYSTEM_PROMPT = `You are CivicBot 🗳️ — a friendly, non-partisan 
Indian election education assistant powered by Gemini AI.

RESPONSE FORMATTING RULES (VERY IMPORTANT):
- Always start response with a relevant emoji
- Use SHORT paragraphs (2-3 lines max each)
- For lists, use emoji bullets like:
  🔹 Point one
  🔹 Point two  
  🔸 Important point
- For key terms use this format:
  📌 **Term** — explanation here
- For sections use:
  ── 📋 Section Title ──
- End every response with a helpful tip like:
  💡 Tip: [one useful tip]
  OR
  🔗 Verify at: eci.gov.in

RESPONSE STRUCTURE FOR MOST ANSWERS:
1. One line direct answer with emoji
2. Blank line
3. Key points with emoji bullets
4. Blank line  
5. One tip or official source

TONE: Friendly, simple, like explaining to a first-time voter. Not too formal.

LANGUAGE: If user writes in Hindi, respond in Hindi with same emoji format.
If user writes in English, respond in English.

TOPICS ONLY: Indian elections, voter registration, EVM, NOTA, constituencies, 
election process, voting rights, Model Code of Conduct, candidates, results. 
Politely refuse other topics.`

/**
 * Send a user message to CivicBot powered by Gemini Flash.
 */
export async function sendCivicBotMessage(
  message: string,
  history: ChatMessage[],
  userState?: IndianState
): Promise<string> {
  const model = getGenAI().getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: CIVICBOT_SYSTEM_PROMPT,
  })

  const geminiHistory = history
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))
    .slice(
      history.findIndex((m) => m.role === 'user') === -1
        ? history.length
        : history.findIndex((m) => m.role === 'user')
    )

  const chat = model.startChat({ history: geminiHistory })

  const stateContext = userState
    ? `User is from ${userState}. Give state-specific info where relevant.`
    : ''

  const result = await chat.sendMessage(`${stateContext}\n\nUser question: ${message}`)
  return result.response.text()
}

/**
 * Generate multiple-choice quiz questions about Indian elections.
 */
export async function generateQuizQuestions(
  topic: QuizTopic,
  difficulty: QuizDifficulty,
  count: number = 5
): Promise<QuizQuestion[]> {
  const model = getGenAI().getGenerativeModel({
    model: 'gemini-1.5-flash',
  })

  const pointsPerDifficulty: Record<QuizDifficulty, number> = {
    basic: 10,
    intermediate: 20,
    advanced: 30,
  }

  const prompt = `
Generate exactly ${count} multiple choice quiz questions about "${topic}" for Indian election education.

Difficulty: ${difficulty}
Context: Questions for Indian citizens learning about the Indian election process.

RULES:
1. All questions must be factually accurate
2. Based on Indian election law and ECI guidelines
3. Non-partisan (no political party bias)
4. Include Hindi translation for each question and option
5. Exactly 4 options per question
6. One correct answer only
7. correctIndex must be a number 0-3

Return ONLY valid JSON array, no markdown fences, no extra text:
[
  {
    "id": "q1",
    "question": "English question here?",
    "questionHindi": "Hindi question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "optionsHindi": ["Hindi A", "Hindi B", "Hindi C", "Hindi D"],
    "correctIndex": 0,
    "explanation": "English explanation of why this is correct.",
    "explanationHindi": "Hindi explanation.",
    "difficulty": "${difficulty}",
    "topic": "${topic}",
    "points": ${pointsPerDifficulty[difficulty]}
  }
]
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  const cleanJson = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  return JSON.parse(cleanJson) as QuizQuestion[]
}

/**
 * Sanitize user input before forwarding to Gemini API.
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 500)
    .replace(/<[^>]*>/g, '')
    .replace(/[<>{}]/g, '')
}

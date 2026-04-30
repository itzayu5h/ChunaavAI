/**
 * Gemini AI client for ChunaavAI
 * Powers CivicBot (election Q&A) and Quiz generation
 * Model: gemini-2.0-flash — latest, fast, cost-effective
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type {
  ChatMessage,
  QuizQuestion,
  QuizTopic,
  QuizDifficulty,
  IndianState,
} from '@/types/india'

// Read from either env var — GEMINI_API_KEY for server routes, NEXT_PUBLIC_ as fallback
const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  ''

if (!apiKey) {
  console.error(
    '❌ GEMINI_API_KEY is not set! Add it to .env.local and restart the dev server.'
  )
}

const genAI = new GoogleGenerativeAI(apiKey)


/** Non-partisan system instruction for CivicBot */
const CIVICBOT_SYSTEM_PROMPT = `You are CivicBot 🗳️ — a friendly, non-partisan 
Indian election education assistant powered by 
Gemini AI.

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

TONE: Friendly, simple, like explaining to a 
first-time voter. Not too formal.

LANGUAGE: If user writes in Hindi, respond 
in Hindi with same emoji format.
If user writes in English, respond in English.

TOPICS ONLY: Indian elections, voter registration,
EVM, NOTA, constituencies, election process, 
voting rights, Model Code of Conduct, candidates,
results. Politely refuse other topics.

EXAMPLE GOOD RESPONSE for 'What is NOTA?':

🗳️ NOTA stands for **None of The Above** — 
your right to reject all candidates!

── 📋 Key Facts ──
🔹 **Introduced:** 2013 by Supreme Court order
🔹 **Where:** Last option on EVM after all candidates
🔹 **Effect:** Your vote is counted but doesn't 
   help any candidate win
🔹 **Winner:** Candidate with most votes still wins

💡 Tip: NOTA is your democratic right to say 
'I don't approve of any candidate here!'

🔗 Learn more at: eci.gov.in`

/**
 * Send a user message to CivicBot powered by Gemini 1.5 Flash.
 * Maintains conversation context via history parameter.
 * Prepends optional state context for personalized answers.
 *
 * @param message - The user's sanitized question text
 * @param history - Previous conversation messages for multi-turn context
 * @param userState - User's Indian state for state-specific guidance (optional)
 * @returns CivicBot's response as a string
 * @throws Error if Gemini API call fails
 */
export async function sendCivicBotMessage(
  message: string,
  history: ChatMessage[],
  userState?: IndianState
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: CIVICBOT_SYSTEM_PROMPT,
  })

  // Gemini requires history to start with 'user' and alternate user/model.
  // Filter out any leading assistant messages (e.g. the welcome message)
  // and only keep proper user→model pairs.
  const geminiHistory = history
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))
    // Drop everything before the first 'user' turn
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
 * Generate multiple-choice quiz questions about Indian elections using Gemini AI.
 * All questions are factual, non-partisan, and India-specific.
 * Returns bilingual questions (English + Hindi).
 *
 * @param topic - The election topic to generate questions about
 * @param difficulty - Difficulty level: basic (10pts), intermediate (20pts), advanced (30pts)
 * @param count - Number of questions to generate, clamped to 1-10 (default: 5)
 * @returns Array of QuizQuestion objects parsed from Gemini's JSON response
 * @throws Error if Gemini returns invalid JSON or the API call fails
 */
export async function generateQuizQuestions(
  topic: QuizTopic,
  difficulty: QuizDifficulty,
  count: number = 5
): Promise<QuizQuestion[]> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
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

  // Strip any accidental markdown code fences from the response
  const cleanJson = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  return JSON.parse(cleanJson) as QuizQuestion[]
}

/**
 * Sanitize user input before forwarding to Gemini API.
 * Trims whitespace, enforces 500 character limit,
 * and strips HTML tags and angle brackets.
 *
 * @param input - Raw string from user input
 * @returns Sanitized string safe for AI processing
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 500)
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>{}]/g, '') // Remove residual bracket characters
}

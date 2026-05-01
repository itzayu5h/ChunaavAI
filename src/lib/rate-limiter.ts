import { db } from './firebase'
import { doc, getDoc, setDoc, increment } from 'firebase/firestore'

/**
 * Rate limit configuration
 * CivicBot: 10 per hour
 * Quiz: 5 per hour
 */
const LIMITS = {
  chat: 10,
  quiz: 5
}

export async function checkRateLimit(
  userId: string,
  type: 'chat' | 'quiz'
): Promise<{ allowed: boolean; remaining: number }> {
  if (!userId) return { allowed: true, remaining: 999 } // Fallback for unauthenticated if any

  const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const hour = new Date().getHours()
  const limitId = `${date}_H${hour}`
  
  const rateLimitRef = doc(db, 'rateLimits', userId, 'history', limitId)
  
  try {
    const snap = await getDoc(rateLimitRef)
    const data = snap.exists() ? snap.data() : { chatCount: 0, quizCount: 0 }
    
    const currentCount = type === 'chat' ? (data.chatCount || 0) : (data.quizCount || 0)
    const limit = type === 'chat' ? LIMITS.chat : LIMITS.quiz

    if (currentCount >= limit) {
      return { allowed: false, remaining: 0 }
    }

    // Increment count
    await setDoc(rateLimitRef, {
      [type === 'chat' ? 'chatCount' : 'quizCount']: increment(1),
      updatedAt: new Date().toISOString()
    }, { merge: true })

    return { allowed: true, remaining: limit - (currentCount + 1) }
  } catch (error) {
    console.error('Rate limit check error:', error)
    return { allowed: true, remaining: 1 } // Graceful failure: allow the request
  }
}

/**
 * Firebase configuration for ChunaavAI
 * Project region: asia-south1 (Mumbai, India)
 * Services: Authentication (Google OAuth) + Firestore
 */

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore'
import type { UserProgress, QuizScore, ChecklistItem, Badge } from '@/types/india'

/**
 * Validate that all required Firebase environment variables are present
 * and are not still set to placeholder values.
 * Warnings are shown in the server console on startup — never thrown as errors
 * so the app degrades gracefully in CI/preview environments.
 */
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const

requiredEnvVars.forEach((varName) => {
  const value = process.env[varName]
  if (!value || value === 'placeholder') {
    console.warn(
      `⚠️  Missing Firebase config: ${varName}. ` +
        `Set it in .env.local to enable Firebase services.`
    )
  }
})

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Singleton pattern — prevents duplicate Firebase app initialization in Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)

/**
 * Sign in user with Google OAuth popup.
 * Initializes Firestore user document if it doesn't exist.
 *
 * @returns Firebase User object on successful sign-in
 * @throws Error if Google popup is closed or sign-in fails
 */
export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider()
  // Force account selection even if user is already signed in
  provider.setCustomParameters({ prompt: 'select_account' })
  const result = await signInWithPopup(auth, provider)

  await initializeUserProgress(result.user)
  return result.user
}

/**
 * Sign out the currently authenticated user.
 *
 * @throws Error if sign-out operation fails
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

/**
 * Initialize a new user's progress document in Firestore.
 * Called automatically after the user's first login.
 * Skips silently if the document already exists.
 *
 * @param user - Firebase User object from Google sign-in
 */
export async function initializeUserProgress(user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    const initialProgress: Omit<UserProgress, 'createdAt' | 'updatedAt'> = {
      userId: user.uid,
      displayName: user.displayName ?? 'Voter',
      email: user.email ?? '',
      photoURL: user.photoURL ?? undefined,
      selectedState: null,
      selectedElectionType: null,
      completedSteps: [],
      totalPoints: 0,
      quizScores: [],
      badges: [],
      checklistItems: [],
    }
    await setDoc(userRef, {
      ...initialProgress,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
}

/**
 * Retrieve a user's complete progress document from Firestore.
 *
 * @param userId - Firebase Auth UID
 * @returns UserProgress object, or null if no document exists
 */
export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) return null
  return userSnap.data() as UserProgress
}

/**
 * Partially update a user's progress document in Firestore.
 * Automatically sets the updatedAt timestamp.
 *
 * @param userId - Firebase Auth UID
 * @param data - Partial UserProgress fields to update
 */
export async function saveUserProgress(
  userId: string,
  data: Partial<UserProgress>
): Promise<void> {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Mark an election timeline step as completed and award 30 points.
 * Uses arrayUnion so duplicate stepIds are safely ignored.
 *
 * @param userId - Firebase Auth UID
 * @param stepId - ID of the election step to mark complete
 */
export async function markStepCompleted(userId: string, stepId: string): Promise<void> {
  const userRef = doc(db, 'users', userId)
  const current = await getUserProgress(userId)
  await updateDoc(userRef, {
    completedSteps: arrayUnion(stepId),
    totalPoints: (current?.totalPoints ?? 0) + 30,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Append a completed quiz score to the user's Firestore record
 * and add the earned points to their total.
 *
 * @param userId - Firebase Auth UID
 * @param score - QuizScore object containing points and results
 */
export async function saveQuizScore(userId: string, score: QuizScore): Promise<void> {
  const userRef = doc(db, 'users', userId)
  const current = await getUserProgress(userId)
  const newPoints = (current?.totalPoints ?? 0) + score.pointsEarned

  await updateDoc(userRef, {
    quizScores: arrayUnion(score),
    totalPoints: newPoints,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Toggle the checked state of a voter readiness checklist item.
 * Awards 50 bonus points when an item is checked.
 *
 * @param userId - Firebase Auth UID
 * @param itemId - ID of the checklist item to update
 * @param isChecked - New checked/unchecked state
 */
export async function updateChecklistItem(
  userId: string,
  itemId: string,
  isChecked: boolean
): Promise<void> {
  const userRef = doc(db, 'users', userId)
  const current = await getUserProgress(userId)

  const updatedItems: ChecklistItem[] = (current?.checklistItems ?? []).map((item) =>
    item.id === itemId ? { ...item, isChecked } : item
  )

  const bonusPoints = isChecked ? 50 : 0

  await updateDoc(userRef, {
    checklistItems: updatedItems,
    totalPoints: (current?.totalPoints ?? 0) + bonusPoints,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Award a badge to the user, marking it as earned with the current timestamp.
 * Uses arrayUnion so the same badge cannot be added twice from race conditions.
 *
 * @param userId - Firebase Auth UID
 * @param badge - Badge object to award (isEarned and earnedAt will be set)
 */
export async function awardBadge(userId: string, badge: Badge): Promise<void> {
  const userRef = doc(db, 'users', userId)
  const earnedBadge: Badge = {
    ...badge,
    isEarned: true,
    earnedAt: new Date(),
  }
  await updateDoc(userRef, {
    badges: arrayUnion(earnedBadge),
    updatedAt: serverTimestamp(),
  })
}

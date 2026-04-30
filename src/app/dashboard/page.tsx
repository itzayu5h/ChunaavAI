'use client'

/**
 * User Dashboard — Personal learning hub
 * Shows progress, badges, quiz history
 * Requires Firebase Auth login
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { onAuthStateChanged, User } from 'firebase/auth'
import {
  auth,
  getUserProgress,
  signInWithGoogle,
  saveUserProgress,
} from '@/lib/firebase'
import {
  LOK_SABHA_STEPS,
  BADGES_DATA,
  INDIAN_STATES_DATA,
} from '@/lib/indianElectionData'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { UserProgress, IndianState } from '@/types/india'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const p = await getUserProgress(u.uid)
        setProgress(p)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (loading) return <LoadingSpinner fullScreen message="Loading your journey... / आपकी यात्रा लोड हो रही है..." />

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center pb-nav">
      <div className="text-6xl mb-4">🗳️</div>
      <h2 className="text-2xl font-bold text-[#212121] mb-2">Welcome to ChunaavAI</h2>
      <p className="text-gray-500 text-sm mb-2">Login to track your election learning journey</p>
      <p className="hindi-text mb-8">अपनी चुनाव शिक्षा यात्रा ट्रैक करने के लिए लॉगिन करें</p>
      <button onClick={signInWithGoogle} className="btn-primary max-w-xs" aria-label="Login with Google">
        🔐 Login with Google
      </button>
      <p className="text-xs text-gray-400 mt-6">Educational only • Not affiliated with ECI</p>
    </div>
  )

  const completedCount = progress?.completedSteps.length ?? 0
  const progressPercent = Math.round(completedCount / 7 * 100)
  const nextStep = LOK_SABHA_STEPS.find(
    s => !progress?.completedSteps.includes(s.id)
  )
  const stateInfo = INDIAN_STATES_DATA.find(
    s => s.stateName === progress?.selectedState
  )

  return (
    <div className="pb-nav max-w-lg mx-auto">

        {/* WELCOME CARD */}
        <div className="mx-4 mt-6 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 blur-xl opacity-30 rounded-3xl group-hover:opacity-50 transition-opacity duration-500"></div>
          <div
            className="relative rounded-3xl p-6 shadow-xl overflow-hidden border border-white/20"
            style={{
              background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
            }}
          >
            {/* Decorative background circles */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-black/10 blur-xl"></div>
            
            <div className="relative z-10 text-white font-black text-2xl tracking-tight">
              Welcome back, {user.displayName?.split(' ')[0]}! 👋
            </div>
            <div className="relative z-10 text-white/90 text-sm mt-2 font-medium">
              Here is your civic journey at a glance
            </div>
            <p 
              className="relative z-10 text-white/70 text-sm mt-1"
              style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            >
              यहाँ आपकी नागरिक यात्रा की झलक है
            </p>
          </div>
        </div>

        {/* PROGRESS CARD */}
        <div className="mx-4 mt-6 bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          
          {/* Circular SVG ring */}
          <div className="relative">
            <svg width="88" height="88" viewBox="0 0 80 80" className="flex-shrink-0 drop-shadow-sm">
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="8"
              />
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progressPercent * 2.13} 213`}
                strokeDashoffset="0"
                transform="rotate(-90 40 40)"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6F00" />
                  <stop offset="100%" stopColor="#E65100" />
                </linearGradient>
              </defs>
              <text
                x="40" y="38"
                textAnchor="middle"
                fontSize="16"
                fontWeight="900"
                fill="#1f2937"
              >
                {progressPercent}%
              </text>
              <text
                x="40" y="52"
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="#9ca3af"
              >
                Done
              </text>
            </svg>
          </div>

          <div className="flex-1">
            <div className="font-black text-gray-800 text-lg">
              Voter Education
            </div>
            <div className="text-sm font-medium text-gray-500 mt-1">
              {completedCount} of 7 modules done
            </div>
            <div className="bg-gray-100 rounded-full h-2.5 mt-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] rounded-full h-full transition-all duration-1000 relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <div className="text-xs font-bold text-gray-400 mt-2">
              {progressPercent === 100 
                ? '🎉 Election Ready!' 
                : `${7 - completedCount} steps remaining`}
            </div>
          </div>
        </div>

        {/* NEXT STEP CARD */}
        {nextStep && (
          <div className="mx-4 mt-6 relative overflow-hidden bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FF6F00] to-[#E65100]"></div>
            <div className="text-xs text-[#FF6F00] font-black uppercase tracking-wider mb-2">
              Next Step
            </div>
            <div className="font-black text-gray-800 text-lg flex items-center gap-3">
              <span className="text-2xl drop-shadow-sm">{nextStep.icon}</span>
              <span>{nextStep.title}</span>
            </div>
            <div 
              className="text-sm font-medium text-gray-500 mt-1 ml-9"
              style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            >
              {nextStep.titleHindi}
            </div>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 mt-4 ml-9 px-4 py-2 bg-white hover:bg-orange-50 border border-orange-100 text-[#FF6F00] text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all"
            >
              Continue learning <span>→</span>
            </Link>
          </div>
        )}

        {/* TWO ACTION BUTTONS */}
        <div className="flex gap-3 mx-4 mt-4">
          <Link
            href="/learn"
            className="flex-1 bg-[#FF6F00] text-white font-bold py-3 rounded-xl text-center text-sm"
          >
            📅 Start Learning
          </Link>
          <Link
            href="/candidates"
            className="flex-1 bg-white text-[#FF6F00] font-semibold py-3 rounded-xl text-center text-sm border-2 border-[#FF6F00]"
          >
            👥 Know Candidates
          </Link>
        </div>

        {/* STATE FOCUS */}
        <div className="card mx-4 mt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-[#212121]">State Focus 📍</span>
          </div>

          {stateInfo ? (
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="font-bold text-[#212121]">
                {stateInfo.stateName}
              </div>
              <div 
                className="text-xs text-gray-500 mt-0.5"
                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              >
                {stateInfo.stateNameHindi}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                🏛️ Lok Sabha Seats: {stateInfo.lokSabhaSeats} |
                🗺️ Vidhan Sabha: {stateInfo.vidhanSabhaSeats}
              </div>
              {stateInfo.upcomingElection && (
                <div className="text-xs text-[#FF6F00] font-semibold mt-1">
                  📅 {stateInfo.upcomingElection}
                </div>
              )}
              <a
                href="https://voters.eci.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#1565C0] underline mt-2 block"
              >
                Check Electoral Roll →
              </a>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Select your state for personalized info:
              </p>
              <select
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-[#212121] focus:outline-none focus:border-[#FF6F00]"
                onChange={async (e) => {
                  const state = e.target.value as IndianState
                  if (user && state) {
                    await saveUserProgress(user.uid, { selectedState: state })
                    setProgress(prev => prev 
                      ? { ...prev, selectedState: state } 
                      : null
                    )
                  }
                }}
                defaultValue=""
                aria-label="Select your state"
              >
                <option value="" disabled>Select your state...</option>
                {INDIAN_STATES_DATA.map(s => (
                  <option key={s.stateName} value={s.stateName}>
                    {s.stateName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* BADGES ROW */}
        <div className="mx-4 mt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-[#212121]">Your Badges</span>
            <Link
              href="/achievements"
              className="text-[#FF6F00] text-sm font-medium"
            >
              See All →
            </Link>
          </div>
          <div className="flex gap-3">
            {BADGES_DATA.slice(0, 3).map(badge => {
              const isEarned = (progress?.totalPoints ?? 0) >= badge.pointsRequired
              return (
                <div
                  key={badge.id}
                  className={`flex-1 rounded-xl py-3 px-2 text-center ${
                    isEarned 
                      ? 'bg-[#FF6F00]' 
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="text-xl mb-1">{badge.icon}</div>
                  <div className={`text-[10px] font-semibold ${
                    isEarned ? 'text-white' : 'text-gray-400'
                  }`}>
                    {badge.name}
                  </div>
                  {!isEarned && (
                    <div className="text-[9px] text-gray-400 mt-0.5">
                      🔒 {badge.pointsRequired} pts
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* QUIZ HISTORY */}
        <div className="card mx-4 mt-4 mb-6">
          <div className="font-semibold text-[#212121] mb-3">
            Recent Quiz Scores 📊
          </div>

          {!progress?.quizScores || progress.quizScores.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-gray-400 text-sm">
                No quizzes taken yet
              </p>
              <Link
                href="/quiz"
                className="text-[#FF6F00] text-sm font-semibold mt-2 block"
              >
                Start your first quiz →
              </Link>
            </div>
          ) : (
            progress.quizScores.slice(-3).reverse().map((score, i) => {
              const pct = score.score / score.totalQuestions
              return (
                <div
                  key={i}
                  className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm text-[#212121] flex-1 pr-2">
                    {score.topic}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${
                    pct >= 0.7 
                      ? 'bg-green-100 text-green-700'
                      : pct >= 0.5
                      ? 'bg-[#FFF3E0] text-[#FF6F00]'
                      : 'bg-red-50 text-red-500'
                  }`}>
                    {score.score}/{score.totalQuestions}
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* DISCLAIMER */}
        <p className="text-center text-xs text-gray-400 px-4 pb-4">
          Educational only • Not affiliated with ECI or any political party
        </p>
    </div>
  )
}

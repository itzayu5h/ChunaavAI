'use client'

/**
 * Election Learning Hub
 * Interactive 7-step Lok Sabha timeline
 * Tracks and saves progress to Firebase
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, getUserProgress, markStepCompleted }
  from '@/lib/firebase'
import { LOK_SABHA_STEPS } from '@/lib/indianElectionData'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function LearnPage() {
  const [user, setUser] = useState<User | null>(null)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [markingStep, setMarkingStep] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const progress = await getUserProgress(u.uid)
        setCompletedSteps(progress?.completedSteps ?? [])
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  /**
   * Mark step as complete and save to Firebase
   */
  async function handleMarkComplete(
    e: React.MouseEvent, 
    stepId: string
  ) {
    e.stopPropagation()
    if (!user || markingStep) return

    setMarkingStep(stepId)
    try {
      await markStepCompleted(user.uid, stepId)
      setCompletedSteps(prev => [...prev, stepId])
    } catch (err) {
      console.error('Failed to mark step:', err)
    } finally {
      setMarkingStep(null)
    }
  }

  if (loading) return <LoadingSpinner fullScreen message="Loading timeline... / टाइमलाइन लोड हो रही है..." />

  const completedCount = completedSteps.length
  const progressPercent = Math.round(completedCount / 7 * 100)

  return (
    <div className="pb-nav max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="px-4 pt-8 pb-6 relative">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400/20 blur-3xl rounded-full -z-10"></div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                Election Journey
              </h1>
              <p 
                className="text-base font-medium text-gray-500 mt-1"
                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              >
                चुनाव यात्रा
              </p>
            </div>
            <span className="text-sm font-bold text-[#FF6F00] bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100 shadow-sm">
              {completedCount}/7 Steps
            </span>
          </div>

          {/* Progress bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-100 mt-4">
            <div className="flex justify-between text-sm font-bold text-gray-500 mb-3">
              <span className="tracking-wider">JOURNEY PROGRESS</span>
              <span className="text-[#FF6F00]">{progressPercent}% complete</span>
            </div>
            <div className="bg-gray-100 rounded-full h-4 p-0.5">
              <div
                className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] rounded-full h-full transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="px-4">
          {LOK_SABHA_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = !isCompleted && 
              completedSteps.length === step.stepNumber - 1
            const isUpcoming = !isCompleted && !isCurrent
            const isExpanded = expandedStep === step.id
            const isLast = index === LOK_SABHA_STEPS.length - 1

            return (
              <div key={step.id} className="flex gap-5">
                
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center flex-shrink-0 relative">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-5 transition-all duration-500 z-10 ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-md shadow-green-500/30' 
                      : isCurrent 
                      ? 'bg-gradient-to-br from-[#FF6F00] to-[#E65100] ring-4 ring-orange-100 shadow-lg shadow-orange-500/40 animate-pulse'
                      : 'bg-gray-200 border-2 border-white shadow-sm'
                  }`} />
                  {!isLast && (
                    <div className={`w-1 flex-1 my-2 rounded-full ${
                      isCompleted ? 'bg-gradient-to-b from-green-400 to-green-200' : 'bg-gray-100'
                    }`} />
                  )}
                </div>

                {/* Step card */}
                <div
                  className={`flex-1 mb-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                    isCompleted
                      ? 'bg-gradient-to-br from-green-50/50 to-white border-green-200 hover:shadow-md'
                      : isCurrent
                      ? 'bg-white border-orange-300 shadow-xl shadow-orange-500/10 hover:-translate-y-1'
                      : 'bg-white/60 backdrop-blur-sm border-gray-100 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setExpandedStep(
                    isExpanded ? null : step.id
                  )}
                  role="button"
                  aria-expanded={isExpanded}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setExpandedStep(
                      isExpanded ? null : step.id
                    )
                  }}
                >
                  {isCurrent && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6F00] to-[#E65100]"></div>
                  )}
                  <div className="p-5">
                    {/* Card header */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm ${
                          isCurrent ? 'bg-orange-50 border border-orange-100' : isCompleted ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'
                        }`}>
                          {step.icon}
                        </div>
                        <div>
                          <div className={`font-bold text-lg transition-colors ${
                            isCurrent 
                              ? 'text-gray-900' 
                              : isCompleted
                              ? 'text-green-800'
                              : 'text-gray-600'
                          }`}>
                            {step.title}
                          </div>
                          <div 
                            className="text-base text-gray-500 mt-1"
                            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                          >
                            {step.titleHindi}
                          </div>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="flex-shrink-0 mt-1">
                        {isCompleted && (
                          <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm px-3 py-1.5 rounded-full font-bold shadow-sm border border-green-200/50">
                            ✅ Done
                          </span>
                        )}
                        {isCurrent && (
                          <span className="bg-gradient-to-r from-orange-100 to-amber-100 text-[#FF6F00] text-sm px-3 py-1.5 rounded-full font-bold shadow-sm border border-orange-200/50 animate-pulse">
                            ▶ Now
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-400 text-base">🔒</span>
                        )}
                      </div>
                    </div>

                    {/* Short description */}
                    <p className="text-sm text-gray-600 mt-4 ml-[60px] leading-relaxed">
                      {step.shortDescription}
                    </p>
                    <p 
                      className="text-sm text-gray-500 mt-1.5 ml-[60px] leading-relaxed"
                      style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                    >
                      {step.shortDescriptionHindi}
                    </p>

                    {/* Expand indicator */}
                    <div className="text-sm font-medium text-[#FF6F00] mt-3 ml-[60px] flex items-center gap-1">
                      {isExpanded ? '▲ Show less' : '▼ Learn more'}
                    </div>
                  </div>

                  {/* EXPANDED CONTENT */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-100 mt-4 pt-5 ml-[40px]">

                      {/* Timeline note */}
                      <div className="bg-blue-50/80 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
                        <span className="text-lg">📅</span>
                        <span className="text-sm text-[#1565C0] font-semibold">
                          {step.typicalTimeline}
                        </span>
                      </div>

                      {/* Key Facts */}
                      <div className="mb-5">
                        <div className="font-bold text-base text-[#212121] mb-3">
                          📌 Key Facts:
                        </div>
                        {step.keyFacts.map((fact, i) => (
                          <div key={i} className="flex gap-3 text-sm text-gray-700 mb-2 leading-relaxed">
                            <span className="text-[#FF6F00] font-bold mt-0.5 flex-shrink-0 text-lg">•</span>
                            <span>{fact}</span>
                          </div>
                        ))}
                      </div>

                      {/* What you should do */}
                      <div className="mb-5">
                        <div className="font-bold text-base text-[#212121] mb-3">
                          ✅ What You Should Do:
                        </div>
                        {step.whatYouShouldDo.map((action, i) => (
                          <div key={i} className="flex gap-3 text-sm text-gray-700 mb-2 leading-relaxed">
                            <span className="text-[#2E7D32] font-bold mt-0.5 flex-shrink-0 text-lg">→</span>
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>

                      {/* Official Links */}
                      {step.officialLinks.length > 0 && (
                        <div className="mb-6">
                          <div className="font-bold text-base text-[#212121] mb-3">
                            🔗 Official Sources:
                          </div>
                          {step.officialLinks.map(link => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block bg-[#E8EAF6] text-[#1A237E] text-sm font-semibold px-4 py-3 rounded-xl mb-2 hover:bg-[#C5CAE9] transition-colors"
                            >
                              🔗 {link.label}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-3 mt-4">
                        {!isCompleted && (
                          <button
                            onClick={(e) => handleMarkComplete(e, step.id)}
                            disabled={!!markingStep}
                            className="flex-1 bg-[#FF6F00] text-white font-bold py-3 rounded-xl text-base disabled:opacity-60 shadow-sm"
                            aria-label={`Mark ${step.title} as complete`}
                          >
                            {markingStep === step.id 
                              ? 'Saving...' 
                              : 'Mark Complete ✅'}
                          </button>
                        )}
                        <Link
                          href="/quiz"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 border-2 border-[#FF6F00] text-[#FF6F00] font-semibold py-3 rounded-xl text-base text-center hover:bg-[#FFF3E0] transition-colors shadow-sm"
                        >
                          Take Quiz 🎯
                        </Link>
                      </div>

                      {!user && (
                        <p className="text-xs text-gray-400 text-center mt-3">
                          Login to save your progress
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* QUIZ CTA */}
        <div className="mx-4 mt-2 mb-6">
          <Link href="/quiz" className="btn-primary block text-center">
            Take Full Quiz on Election Process 🎯
          </Link>
          <p className="text-xs text-gray-400 text-center mt-3">
            Educational only • Not affiliated with ECI
          </p>
        </div>
    </div>
  )
}

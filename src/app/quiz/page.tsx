'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, saveQuizScore } from '@/lib/firebase'
import { Brain, CheckCircle2, XCircle, Award, RefreshCcw, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import type { QuizTopic, QuizDifficulty, QuizQuestion, QuizScore, ApiResponse } from '@/types/india'

const TOPICS: QuizTopic[] = [
  'Voter Registration',
  'EVM & VVPAT',
  'Lok Sabha',
  'Vidhan Sabha',
  'Model Code of Conduct',
  'NOTA'
]

const DIFFICULTIES: QuizDifficulty[] = ['basic', 'intermediate', 'advanced']

export default function QuizPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [topic, setTopic] = useState<QuizTopic | null>(null)
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('basic')
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsubscribe()
  }, [])

  const startQuiz = async () => {
    setIsGenerating(true)
    setQuestions([])
    setCurrentIndex(0)
    setScore(0)
    setIsFinished(false)
    setIsAnswered(false)
    setSelectedOption(null)

    try {
      let token = 'guest-token'
      if (user) {
        try {
          token = await user.getIdToken()
        } catch (e) {
          console.error("Could not get auth token", e)
        }
      }

      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic, difficulty, numberOfQuestions: 5 })
      })
      const data: ApiResponse<QuizQuestion[]> = await res.json()
      if (data.success && data.data) {
        setQuestions(data.data)
      } else {
        alert(data.error || 'Failed to generate quiz')
      }
    } catch (e) {
      console.error(e)
      alert('Error connecting to quiz server.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswer = (index: number) => {
    if (isAnswered) return
    setSelectedOption(index)
    setIsAnswered(true)
    if (index === questions[currentIndex].correctIndex) {
      setScore(s => s + 1)
    }
  }

  const nextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1)
      setIsAnswered(false)
      setSelectedOption(null)
    } else {
      setIsFinished(true)
      if (user) {
        const finalScore = score + (selectedOption === questions[currentIndex].correctIndex ? 1 : 0)
        const quizScore: QuizScore = {
          topic: topic as QuizTopic,
          score: finalScore,
          totalQuestions: questions.length,
          pointsEarned: finalScore * questions[0].points,
          completedAt: new Date()
        }
        await saveQuizScore(user.uid, quizScore).catch(console.error)
      }
    }
  }

  // Helper for rendering wrapper
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden pb-24">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      {children}
    </div>
  )

  if (!questions.length) {
    return (
      <Wrapper>
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-16 md:pt-24 relative z-10">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/60 overflow-hidden">
            
            {/* Header Banner */}
            <div className="relative p-10 md:p-16 text-center bg-gradient-to-br from-[#0A1128] via-[#1A237E] to-[#311B92] overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 border border-white/20 shadow-inner rotate-3">
                  <Brain size={40} className="text-white -rotate-3" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-sm">AI Democracy Quiz</h1>
                <p className="text-blue-100 text-lg md:text-xl font-medium max-w-lg mx-auto">Test your knowledge, earn civic badges, and level up your democracy skills!</p>
              </div>
            </div>
            
            {/* Setup Body */}
            <div className="p-8 md:p-12 space-y-10">
              {!user && (
                <div className="bg-amber-50/80 backdrop-blur-sm text-amber-800 p-5 rounded-2xl text-sm border border-amber-200/50 flex gap-3 shadow-sm">
                  <AlertCircle className="shrink-0 text-amber-500" size={20} />
                  <div>
                    <span className="font-bold">Playing as a guest.</span> <button onClick={() => router.push('/dashboard')} className="font-bold underline hover:text-amber-900 transition-colors">Log in</button> to earn points, unlock badges, and track your progress on the leaderboard!
                  </div>
                </div>
              )}
              
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest">
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">1</span>
                  Select Topic
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TOPICS.map(t => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`p-4 text-sm font-bold rounded-2xl border-2 transition-all duration-300 ${
                        topic === t 
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-md shadow-indigo-100 scale-[1.02]' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50 hover:shadow-sm'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest">
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">2</span>
                  Difficulty Level
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 p-4 text-sm font-bold rounded-2xl border-2 capitalize transition-all duration-300 ${
                        difficulty === d 
                          ? 'bg-orange-50 border-[#FF6F00] text-orange-700 shadow-md shadow-orange-100 scale-[1.02]' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-orange-200 hover:bg-slate-50 hover:shadow-sm'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={startQuiz}
                  disabled={isGenerating || !topic}
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white font-bold py-5 rounded-2xl shadow-xl shadow-orange-500/30 transition-all hover:shadow-orange-500/50 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-orange-500/30"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="relative flex justify-center items-center gap-3 text-lg">
                    {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                    {isGenerating ? 'AI is crafting your quiz...' : 'Start Challenge 🚀'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    )
  }

  if (isFinished) {
    const totalPoints = score * questions[0].points
    const isPerfect = score === questions.length

    return (
      <Wrapper>
        <div className="max-w-2xl mx-auto px-4 md:px-6 pt-16 md:pt-24 relative z-10 text-center">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/60 p-10 md:p-16 relative overflow-hidden">
            {/* Celebration backdrop */}
            <div className={`absolute inset-0 opacity-20 pointer-events-none ${isPerfect ? 'bg-gradient-to-b from-amber-200 to-transparent' : 'bg-gradient-to-b from-emerald-200 to-transparent'}`} />
            
            <div className={`relative z-10 w-32 h-32 mx-auto rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl ${isPerfect ? 'bg-gradient-to-br from-amber-300 via-orange-400 to-orange-500 text-white' : 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white'} transform rotate-3 hover:rotate-6 transition-transform duration-500`}>
              <Award size={64} className="-rotate-3" />
            </div>
            
            <h2 className="relative z-10 text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">Challenge Complete!</h2>
            <p className="relative z-10 text-xl text-slate-500 font-medium mb-12">You scored <span className="text-slate-800 font-black text-2xl mx-1">{score}</span> out of {questions.length}</p>
            
            <div className="relative z-10 grid grid-cols-2 gap-4 md:gap-6 mb-12">
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/80 shadow-sm transition-transform hover:-translate-y-1">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Points Earned</p>
                <p className="text-3xl font-black text-[#1A237E]">+{totalPoints}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/80 shadow-sm transition-transform hover:-translate-y-1">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Accuracy</p>
                <p className="text-3xl font-black text-[#2E7D32]">{Math.round((score/questions.length)*100)}%</p>
              </div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setQuestions([])} className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-8 rounded-2xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 flex-1 hover:-translate-y-1">
                <RefreshCcw size={20} /> Play Again
              </button>
              <button onClick={() => router.push('/dashboard')} className="bg-gradient-to-r from-[#1A237E] to-[#3949AB] hover:from-[#3949AB] hover:to-[#1A237E] text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 flex-1 hover:-translate-y-1">
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </Wrapper>
    )
  }

  const q = questions[currentIndex]

  return (
    <Wrapper>
      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-12 md:pt-16 relative z-10">
        
        {/* Top Progress / Score Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-white/40 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow-sm shadow-indigo-500/50" />
            <span className="text-xs font-black text-slate-700 tracking-widest uppercase">Question {currentIndex + 1} of {questions.length}</span>
          </div>
          <div className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 rounded-full shadow-lg shadow-orange-500/20 flex items-center gap-2 border border-orange-400/50">
            <Award size={18} className="text-white" />
            <span className="text-xs font-black text-white tracking-widest uppercase">Score: {score}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-xl border border-white/60 p-8 md:p-12 mb-6 relative overflow-hidden transition-all duration-500">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-10 leading-snug relative z-10">
            {q.question}
          </h2>
          
          <div className="space-y-4 relative z-10">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex
              const isSelected = i === selectedOption
              
              // Base button styles
              let buttonClass = "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-md"
              
              if (isAnswered) {
                if (isCorrect) {
                  buttonClass = "bg-green-50 border-green-500 text-green-900 font-bold shadow-md shadow-green-500/10 scale-[1.02]"
                } else if (isSelected) {
                  buttonClass = "bg-red-50 border-red-400 text-red-800 font-bold opacity-80"
                } else {
                  buttonClass = "bg-slate-50 border-slate-200 text-slate-400 opacity-50"
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={isAnswered}
                  className={`w-full text-left p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 flex justify-between items-center group ${buttonClass}`}
                >
                  <span className="text-base md:text-lg pr-4">{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="text-green-500 shrink-0" size={24} />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-400 shrink-0" size={24} />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Explanation & Next Action */}
        {isAnswered && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className={`p-6 md:p-8 rounded-[2rem] border-2 mb-6 flex flex-col md:flex-row gap-5 items-start shadow-lg backdrop-blur-md ${
              selectedOption === q.correctIndex 
                ? 'bg-green-50/90 border-green-200 shadow-green-500/10' 
                : 'bg-amber-50/90 border-amber-200 shadow-amber-500/10'
            }`}>
              <div className={`shrink-0 p-3 rounded-2xl ${selectedOption === q.correctIndex ? 'bg-green-100' : 'bg-amber-100'}`}>
                {selectedOption === q.correctIndex 
                  ? <CheckCircle2 className="text-green-600" size={28} />
                  : <AlertCircle className="text-amber-600" size={28} />
                }
              </div>
              <div>
                <h4 className={`font-black text-xl mb-2 tracking-tight ${selectedOption === q.correctIndex ? 'text-green-800' : 'text-amber-800'}`}>
                  {selectedOption === q.correctIndex ? 'Awesome! That is correct.' : 'Not quite right.'}
                </h4>
                <p className={`text-base leading-relaxed font-medium ${selectedOption === q.correctIndex ? 'text-green-700' : 'text-amber-700'}`}>
                  {q.explanation}
                </p>
              </div>
            </div>
            
            <button
              onClick={nextQuestion}
              className="w-full relative group overflow-hidden bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex justify-center items-center gap-3 text-lg">
                {currentIndex < questions.length - 1 ? 'Next Question →' : 'Finish Challenge 🏆'}
              </div>
            </button>
          </div>
        )}
      </div>
    </Wrapper>
  )
}

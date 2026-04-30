'use client'

/**
 * Voter Readiness Checklist page
 * Bilingual, persisted to localStorage for guest users
 * Firebase sync for logged-in users
 */

import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, getUserProgress, updateChecklistItem } from '@/lib/firebase'
import { useLanguage } from '@/context/LanguageContext'
import type { ChecklistItem } from '@/types/india'

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'reg-1',
    category: 'Registration',
    title: 'Check voter registration status',
    titleHindi: 'मतदाता पंजीकरण स्थिति जांचें',
    description: 'Visit voters.eci.gov.in and search by your name or EPIC number.',
    descriptionHindi: 'voters.eci.gov.in पर जाएं और नाम या EPIC नंबर से खोजें।',
    actionLink: 'https://voters.eci.gov.in',
    actionLabel: 'Check Now',
    isChecked: false,
  },
  {
    id: 'reg-2',
    category: 'Registration',
    title: 'Register or update your voter info (Form 6)',
    titleHindi: 'मतदाता जानकारी पंजीकृत या अपडेट करें (फॉर्म 6)',
    description: 'New voters or those who have moved must fill Form 6 on nvsp.in.',
    descriptionHindi: 'नए मतदाता या जो स्थानांतरित हुए हैं, nvsp.in पर फॉर्म 6 भरें।',
    actionLink: 'https://nvsp.in',
    actionLabel: 'Register →',
    isChecked: false,
  },
  {
    id: 'id-1',
    category: 'ID',
    title: 'Find your Voter ID card (EPIC)',
    titleHindi: 'अपना मतदाता ID कार्ड (EPIC) खोजें',
    description: 'Your EPIC card is the primary ID for voting. Keep it safe.',
    descriptionHindi: 'आपका EPIC कार्ड मतदान के लिए प्राथमिक ID है। इसे सुरक्षित रखें।',
    isChecked: false,
  },
  {
    id: 'id-2',
    category: 'ID',
    title: 'Know your 12 valid alternative IDs',
    titleHindi: '12 वैध वैकल्पिक ID जानें',
    description: 'Aadhaar, PAN, Passport, Driving License, etc. are accepted at booths.',
    descriptionHindi: 'आधार, PAN, पासपोर्ट, ड्राइविंग लाइसेंस आदि बूथ पर स्वीकृत हैं।',
    isChecked: false,
  },
  {
    id: 'booth-1',
    category: 'Booth',
    title: 'Find your polling booth',
    titleHindi: 'अपना मतदान बूथ खोजें',
    description: 'Your booth is printed on your EPIC card or find it on voters.eci.gov.in.',
    descriptionHindi: 'आपका बूथ EPIC कार्ड पर लिखा है या voters.eci.gov.in पर खोजें।',
    actionLink: 'https://voters.eci.gov.in',
    actionLabel: 'Find Booth →',
    isChecked: false,
  },
  {
    id: 'booth-2',
    category: 'Booth',
    title: 'Note the date and time of polling',
    titleHindi: 'मतदान की तिथि और समय नोट करें',
    description: 'Booths are open from 7 AM to 6 PM on election day.',
    descriptionHindi: 'बूथ चुनाव के दिन सुबह 7 बजे से शाम 6 बजे तक खुले रहते हैं।',
    isChecked: false,
  },
  {
    id: 'know-1',
    category: 'Knowledge',
    title: 'Understand what NOTA means',
    titleHindi: 'NOTA का अर्थ समझें',
    description: 'NOTA = None of The Above. You can vote NOTA if you do not support any candidate.',
    descriptionHindi: 'NOTA = इनमें से कोई नहीं। यदि आप किसी उम्मीदवार का समर्थन नहीं करते तो NOTA दबाएं।',
    isChecked: false,
  },
  {
    id: 'know-2',
    category: 'Knowledge',
    title: 'Learn how EVM + VVPAT works',
    titleHindi: 'EVM + VVPAT कैसे काम करता है',
    description: 'EVM is not internet connected. VVPAT shows a paper slip for 7 seconds to confirm your vote.',
    descriptionHindi: 'EVM इंटरनेट से नहीं जुड़ी। VVPAT 7 सेकंड के लिए पर्ची दिखाती है।',
    isChecked: false,
  },
]

const CATEGORY_META: Record<string, { icon: string; en: string; hi: string; color: string }> = {
  Registration: { icon: '📋', en: 'Registration', hi: 'पंजीकरण', color: '#1565C0' },
  ID: { icon: '🪪', en: 'Valid ID', hi: 'वैध ID', color: '#7B1FA2' },
  Booth: { icon: '🏛️', en: 'Booth', hi: 'बूथ', color: '#FF6F00' },
  Knowledge: { icon: '🧠', en: 'Knowledge', hi: 'ज्ञान', color: '#2E7D32' },
}

export default function ChecklistPage() {
  const { t, isHindi } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const progress = await getUserProgress(u.uid)
        if (progress?.checklistItems?.length) {
          setItems(progress.checklistItems)
        } else {
          // persist defaults to Firebase
          setItems(DEFAULT_CHECKLIST)
        }
      } else {
        // Guest: load from localStorage
        const saved = localStorage.getItem('chunaavai-checklist')
        if (saved) setItems(JSON.parse(saved) as ChecklistItem[])
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  async function handleToggle(id: string) {
    const updated = items.map(item =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    )
    setItems(updated)

    if (user) {
      const item = updated.find(i => i.id === id)!
      await updateChecklistItem(user.uid, id, item.isChecked).catch(console.error)
    } else {
      localStorage.setItem('chunaavai-checklist', JSON.stringify(updated))
    }
  }

  const checkedCount = items.filter(i => i.isChecked).length
  const progress = Math.round((checkedCount / items.length) * 100)

  const categories = ['Registration', 'ID', 'Booth', 'Knowledge'] as const

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-10 mt-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-400/20 blur-3xl rounded-full -z-10"></div>
        <div className="w-20 h-20 bg-gradient-to-br from-[#FF6F00] to-[#E65100] rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-orange-500/30 transform hover:scale-105 transition-transform">
          ✅
        </div>
        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-2">
          {t('Voter Readiness Checklist', 'मतदाता तैयारी चेकलिस्ट')}
        </h1>
        <p className="text-gray-500 font-medium">
          {t('Complete all steps to become a confident voter', 'आत्मविश्वासी मतदाता बनने के लिए सभी चरण पूरे करें')}
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
        <div className="flex justify-between items-center mb-4 relative z-10">
          <span className="font-bold text-gray-700">{t('Your Progress', 'आपकी प्रगति')}</span>
          <span className="font-black text-[#FF6F00] text-2xl">{checkedCount}<span className="text-gray-400 text-lg">/{items.length}</span></span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 relative z-10 p-0.5">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #FF6F00, #E65100)' }}
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-500 mt-3 text-right relative z-10">{progress}% {t('complete', 'पूर्ण')}</div>

        {progress === 100 && (
          <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 text-green-700 font-bold p-4 rounded-2xl text-center shadow-sm relative z-10 animate-fade-in-up">
            🎉 {t('You are voter-ready! Go vote with confidence!', 'आप मतदान के लिए तैयार हैं! आत्मविश्वास के साथ मतदान करें!')}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400">{t('Loading...', 'लोड हो रहा है...')}</div>
      ) : (
        categories.map(category => {
          const meta = CATEGORY_META[category]
          const catItems = items.filter(i => i.category === category)
          return (
            <div key={category} className="mb-8 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4 px-2">
                <span className="text-2xl drop-shadow-sm">{meta.icon}</span>
                <h2 className="font-black text-gray-800 text-lg tracking-tight">{isHindi ? meta.hi : meta.en}</h2>
                <div className="flex-1 border-t border-gray-100 ml-2"></div>
                <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  {catItems.filter(i => i.isChecked).length}/{catItems.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className={`group relative bg-white rounded-3xl p-5 border-2 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer overflow-hidden ${
                      item.isChecked ? 'border-green-400/60 bg-gradient-to-r from-green-50/50 to-transparent' : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/30'
                    }`}
                    onClick={() => handleToggle(item.id)}
                  >
                    {/* Subtle left border glow on hover if not checked */}
                    {!item.isChecked && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    )}
                    <div className="flex items-start gap-4 relative z-10">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all duration-300 ${
                        item.isChecked ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-500 text-white shadow-md shadow-green-500/20 scale-110' : 'border-gray-300 group-hover:border-orange-400 bg-gray-50 group-hover:bg-white'
                      }`}>
                        {item.isChecked && <span className="text-sm font-bold">✓</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-base transition-colors ${item.isChecked ? 'line-through text-gray-400' : 'text-gray-800 group-hover:text-[#FF6F00]'}`}>
                          {isHindi ? item.titleHindi : item.title}
                        </div>
                        <div className={`text-sm mt-1.5 leading-relaxed transition-colors ${item.isChecked ? 'text-gray-400' : 'text-gray-500'}`}>
                          {isHindi ? item.descriptionHindi : item.description}
                        </div>
                        {item.actionLink && !item.isChecked && (
                          <a
                            href={item.actionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 mt-3 px-4 py-2 bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 text-sm font-bold text-[#FF6F00] rounded-xl transition-all hover:shadow-sm"
                          >
                            {item.actionLabel || 'Open'} <span>→</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}

      {!user && (
        <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-sm">
          💡 {t('Log in to save your progress permanently and earn bonus points!', 'स्थायी प्रगति सहेजने और बोनस अंक अर्जित करने के लिए लॉगिन करें!')}
        </div>
      )}
    </div>
  )
}

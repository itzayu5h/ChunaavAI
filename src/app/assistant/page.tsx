'use client'

/**
 * CivicBot AI Assistant page
 * Bilingual, non-partisan Indian election chat powered by Gemini
 */

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, RefreshCw, Info } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useLanguage } from '@/context/LanguageContext'
import { auth } from '@/lib/firebase'
import type { ChatMessage, ChatRequest, ApiResponse } from '@/types/india'

const SUGGESTED_QUESTIONS = [
  { en: 'How do I register to vote?', hi: 'मतदाता पंजीकरण कैसे करें?' },
  { en: 'What is NOTA?', hi: 'NOTA क्या है?' },
  { en: 'How does EVM work?', hi: 'EVM कैसे काम करता है?' },
  { en: 'What IDs are valid at polling booth?', hi: 'बूथ पर कौन से ID मान्य हैं?' },
]

export default function AssistantPage() {
  const { t, isHindi } = useLanguage()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Namaste! 🙏 I am CivicBot — your non-partisan guide to Indian elections.\n\nAsk me anything about voter registration, EVMs, NOTA, the election process, or your voting rights!',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    const msg = text.trim()
    if (!msg || isLoading) return

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    const body: ChatRequest = { message: msg, conversationHistory: messages }

    try {
      let token = 'guest-token'
      if (auth.currentUser) {
        try {
          token = await auth.currentUser.getIdToken()
        } catch (e) {
          console.error("Could not get auth token", e)
        }
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      })
      const data: ApiResponse<string> = await res.json()

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.success && data.data
          ? data.data
          : `⚠️ ${data.error ?? 'Something went wrong. Please try again.'}`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Network error. Please check your connection and try again.',
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto bg-[#F8FAFC] shadow-2xl overflow-hidden sm:rounded-t-2xl sm:border sm:border-slate-200 mt-2">

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 shadow-sm border-b border-slate-100 z-10 sticky top-0">
        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6F00] to-[#E65100] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Bot size={26} className="text-white" />
        </div>
        <div>
          <h1 className="text-slate-900 font-black text-xl tracking-tight">
            {t('CivicBot', 'सिविकबॉट')}
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50" />
            {t('Online • Powered by Gemini AI', 'ऑनलाइन • Gemini AI द्वारा संचालित')}
          </p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          <Info size={14} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{t('Non-Partisan', 'निष्पक्ष')}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Suggested questions (only shown at start) */}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 max-w-2xl mx-auto">
            {SUGGESTED_QUESTIONS.map(q => (
              <button
                key={q.en}
                onClick={() => sendMessage(isHindi ? q.hi : q.en)}
                className="text-left text-sm bg-white border border-slate-200 rounded-2xl p-4 text-slate-600 hover:border-[#FF6F00] hover:shadow-md hover:text-[#FF6F00] transition-all font-semibold leading-relaxed group"
              >
                {isHindi ? q.hi : q.en}
                <div className="text-xs text-slate-400 font-normal mt-1 group-hover:text-orange-400 transition-colors">
                  {t('Tap to ask →', 'पूछने के लिए टैप करें →')}
                </div>
              </button>
            ))}
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-gradient-to-tr from-[#1A237E] to-[#3949AB]' : 'bg-gradient-to-br from-[#FF6F00] to-[#E65100]'
              }`}>
                {msg.role === 'user'
                  ? <User size={18} className="text-white" />
                  : <Bot size={18} className="text-white" />
                }
              </div>
              {/* Bubble */}
              <div className={`shadow-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'px-5 py-4 text-sm whitespace-pre-wrap bg-[#1A237E] text-white rounded-3xl rounded-tr-sm'
                  : 'p-4 text-sm bg-orange-50/30 text-slate-800 rounded-3xl rounded-tl-sm border-l-4 border-orange-400 ring-1 ring-slate-900/5'
              }`}>
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        strong: ({children}) => (
                          <strong className="font-bold text-orange-600">
                            {children}
                          </strong>
                        ),
                        p: ({children}) => (
                          <p className="mb-2 last:mb-0 leading-relaxed">
                            {children}
                          </p>
                        ),
                        ul: ({children}) => (
                          <ul className="space-y-1 my-2">
                            {children}
                          </ul>
                        ),
                        li: ({children}) => (
                          <li className="flex gap-1 leading-relaxed">
                            {children}
                          </li>
                        ),
                        hr: () => (
                          <hr className="border-orange-200 my-3" />
                        ),
                        code: ({children}) => (
                          <code className="bg-orange-50 text-orange-700 px-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6F00] to-[#E65100] flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot size={18} className="text-white" />
              </div>
              <div className="bg-white border border-slate-100 rounded-3xl rounded-tl-sm px-5 py-4 shadow-sm ring-1 ring-slate-900/5 flex items-center gap-3">
                <RefreshCw size={16} className="animate-spin text-[#FF6F00]" />
                <span className="text-[15px] text-slate-500 font-medium">{t('CivicBot is thinking...', 'CivicBot सोच रहा है...')}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input area */}
      <div className="bg-white px-4 sm:px-6 py-4 border-t border-slate-100 z-10 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3 items-end max-w-4xl mx-auto relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={t('Ask about voting, elections, EVM...', 'मतदान, चुनाव, EVM के बारे में पूछें...')}
            rows={1}
            className="flex-1 resize-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-3xl pl-5 pr-14 py-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/50 focus:border-[#FF6F00] transition-all text-slate-800 placeholder-slate-400 max-h-32 shadow-inner"
            disabled={isLoading}
            style={{ minHeight: '56px' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 h-10 w-10 bg-[#1A237E] disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-full flex items-center justify-center transition-all hover:bg-[#283593] shadow-md disabled:shadow-none hover:scale-105 active:scale-95"
          >
            <Send size={18} className={input.trim() && !isLoading ? 'translate-x-0.5 -translate-y-0.5' : ''} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-slate-400 font-medium">
          <Info size={12} />
          <p>
            {t('CivicBot can make mistakes. Verify critical info on ', 'CivicBot गलती कर सकता है। महत्वपूर्ण जानकारी सत्यापित करें: ')}
            <a href="https://eci.gov.in" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">eci.gov.in</a>
          </p>
        </div>
      </div>
    </div>
  )
}


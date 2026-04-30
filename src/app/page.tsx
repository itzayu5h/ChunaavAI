'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function LandingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden px-6 pt-24 pb-20 text-center flex flex-col items-center shadow-xl"
        style={{ background: 'linear-gradient(135deg, #0A1128 0%, #1A237E 50%, #FF6F00 100%)' }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="rounded-full border-[1px] border-white/20 absolute w-[600px] h-[600px] animate-spin-slow" />
          <div className="rounded-full border-[2px] border-white/10 absolute w-[400px] h-[400px]" />
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#FF6F00] rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#1A237E] rounded-full blur-3xl opacity-50" />
        </div>

        {/* Floating badge */}
        <div className="relative z-10 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-5 py-2.5 rounded-full mb-8 border border-white/20 shadow-lg shadow-black/10">
          <span className="animate-pulse">🇮🇳</span> {t("India's #1 Election Education Platform", "भारत का #1 चुनाव शिक्षा मंच")}
        </div>

        {/* Headline */}
        <h1 className="relative z-10 text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
          {t('Apna Vote', 'अपना वोट')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB300] to-[#FF6F00] filter drop-shadow-sm">
            {t('Samjho', 'समझो')}
          </span>{' '}
          🗳️
        </h1>

        {/* Subheadline */}
        <p className="relative z-10 text-slate-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
          {t(
            'Learn everything about Indian elections — EVM, NOTA, voter registration, and more. Powered by Gemini AI.',
            'भारतीय चुनावों के बारे में सब कुछ सीखें — EVM, NOTA, मतदाता पंजीकरण। Gemini AI द्वारा संचालित।'
          )}
        </p>

        {/* CTA Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full max-w-2xl mx-auto">
          <Link href="/learn" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white font-bold px-8 py-4 rounded-2xl text-center text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:-translate-y-1 ring-2 ring-transparent hover:ring-white/20 whitespace-nowrap">
            🚀 {t('Start Learning', 'सीखना शुरू करें')}
          </Link>
          <Link href="/assistant" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-4 rounded-2xl text-center text-lg transition-all hover:-translate-y-1 shadow-xl shadow-black/10 whitespace-nowrap">
            🤖 {t('Ask CivicBot', 'CivicBot पूछें')}
          </Link>
        </div>

        {/* Trust pills */}
        <div className="relative z-10 flex gap-3 mt-12 justify-center flex-wrap">
          {[
            t('✅ Free', '✅ मुफ़्त'),
            t('🛡️ Non-Partisan', '🛡️ निष्पक्ष'),
            t('📋 ECI Verified Info', '📋 ECI सत्यापित'),
            t('🤖 AI Powered', '🤖 AI संचालित'),
          ].map(pill => (
            <span key={pill} className="bg-white/5 backdrop-blur-md border border-white/10 text-slate-200 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
              {pill}
            </span>
          ))}
        </div>
      </section>

      {/* ── FLOATING STATS ── */}
      <section className="px-4 -mt-12 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto border border-white/40 ring-1 ring-slate-900/5">
          <div className="flex justify-between items-center mb-6">
            <span className="font-extrabold text-base text-slate-800 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">📊</span> {t('India Election Facts 2026', 'भारत चुनाव तथ्य 2026')}
            </span>
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 animate-pulse shadow-sm shadow-red-500/20">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { num: '97 Cr+', label: t('Registered Voters', 'मतदाता'), color: '#FF6F00', bg: 'bg-orange-50' },
              { num: '543', label: t('Lok Sabha Seats', 'लोकसभा सीटें'), color: '#1A237E', bg: 'bg-indigo-50' },
              { num: '4', label: t('Election Types', 'चुनाव प्रकार'), color: '#2E7D32', bg: 'bg-green-50' },
              { num: '36', label: t('States & UTs', 'राज्य और UT'), color: '#7B1FA2', bg: 'bg-purple-50' },
            ].map(stat => (
              <div key={stat.label} className={`text-center p-5 rounded-2xl ${stat.bg} border border-slate-100 shadow-sm transition-transform hover:-translate-y-1`}>
                <div className="text-3xl font-black mb-1" style={{ color: stat.color }}>{stat.num}</div>
                <div className="text-sm text-slate-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#FF6F00] font-bold text-sm tracking-wider uppercase bg-orange-50 px-3 py-1 rounded-full">Explore Features</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 mb-3">
              {t('What you get with ChunaavAI', 'ChunaavAI में क्या मिलेगा?')}
            </h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto">
              {t('Everything you need to become an informed voter in a single platform.', 'एक जागरूक मतदाता बनने के लिए सब कुछ एक ही मंच पर।')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                href: '/learn',
                gradient: 'linear-gradient(135deg, #1A237E 0%, #3949AB 100%)',
                icon: '📅',
                title: t('Election Timeline', 'चुनाव टाइमलाइन'),
                desc: t('7-step interactive guide from announcement to govt formation', '7 चरणों में इंटरैक्टिव मार्गदर्शिका'),
                badge: null,
              },
              {
                href: '/assistant',
                gradient: 'linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%)',
                icon: '🤖',
                title: t('CivicBot AI', 'सिविकबॉट AI'),
                desc: t('Ask anything about elections in Hindi or English, 24/7', 'हिंदी या अंग्रेजी में 24/7 चुनाव सम्बंधित प्रश्न पूछें'),
                badge: 'AI Powered',
              },
              {
                href: '/quiz',
                gradient: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
                icon: '🎯',
                title: t('Knowledge Quiz', 'ज्ञान प्रश्नोत्तरी'),
                desc: t('AI-generated civics questions, earn badges and points', 'AI जनित प्रश्न, बैज और अंक अर्जित करें'),
                badge: null,
              },
              {
                href: '/checklist',
                gradient: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%)',
                icon: '✅',
                title: t('Voter Checklist', 'मतदाता चेकलिस्ट'),
                desc: t('Step-by-step readiness guide — never miss a deadline', 'चरण-दर-चरण तैयारी गाइड — कोई समयसीमा न चूकें'),
                badge: 'NEW',
              },
            ].map(card => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative block rounded-3xl p-8 text-left overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-slate-200/50"
                style={{ background: card.gradient, minHeight: 180 }}
              >
                {/* Decoration blob */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

                {card.badge && (
                  <span className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold border border-white/20">
                    {card.badge}
                  </span>
                )}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-14 h-14 flex items-center justify-center text-3xl mb-4 border border-white/20 shadow-inner">
                  {card.icon}
                </div>
                <div className="text-white font-extrabold text-2xl mb-2">{card.title}</div>
                <div className="text-white/80 text-sm leading-relaxed mb-4 max-w-sm">{card.desc}</div>
                <div className="text-white/60 font-bold text-sm flex items-center gap-2 group-hover:text-white transition-colors">
                  {t('Explore', 'देखें')} <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white px-4 py-24 border-y border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">Simple Process</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-6 mb-4">
              {t('Your Journey to the Ballot ⚡', 'मतदान तक की आपकी यात्रा ⚡')}
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              {t('In just three simple steps, transform from an observer into an active, informed participant in the world\'s largest democracy.', 'केवल तीन सरल चरणों में, एक दर्शक से दुनिया के सबसे बड़े लोकतंत्र में एक सक्रिय, जागरूक भागीदार बनें।')}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-8 md:gap-4 lg:gap-6">
            {[
              { color: 'bg-gradient-to-br from-[#1A237E] to-[#3949AB]', hoverBorder: 'hover:border-indigo-200', textColor: 'text-indigo-900', shadow: 'shadow-indigo-500/20', num: '1', icon: '📍', title: t('Find Your Info', 'अपनी जानकारी खोजें'), desc: t('Select your state and constituency to get tailored election data.', 'चुनावी डेटा प्राप्त करने के लिए अपना राज्य और क्षेत्र चुनें।') },
              { color: 'bg-gradient-to-br from-[#FF6F00] to-[#FF8F00]', hoverBorder: 'hover:border-orange-200', textColor: 'text-orange-900', shadow: 'shadow-orange-500/20', num: '2', icon: '🤖', title: t('Ask CivicBot', 'CivicBot से पूछें'), desc: t('Got doubts about NOTA or EVMs? Ask our AI in English or Hindi.', 'NOTA या EVM के बारे में संदेह? हमारे AI से पूछें।') },
              { color: 'bg-gradient-to-br from-[#2E7D32] to-[#43A047]', hoverBorder: 'hover:border-green-200', textColor: 'text-green-900', shadow: 'shadow-green-500/20', num: '3', icon: '🗳️', title: t('Cast Your Vote', 'अपना वोट डालें'), desc: t('Step into the booth informed, verified, and completely confident.', 'बूथ पर जागरूक, सत्यापित और पूर्ण आत्मविश्वास के साथ जाएं।') },
            ].map((step, index) => (
              <React.Fragment key={step.num}>
                <div className={`relative z-10 flex-1 bg-gradient-to-b from-white to-slate-50/80 rounded-[2.5rem] p-10 border border-slate-100/80 hover:border-slate-200 shadow-2xl shadow-slate-200/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-3 flex flex-col group overflow-hidden`}>
                  {/* Subtle top glare/highlight */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-t-[2.5rem]"></div>
                  
                  {/* Massive Number Watermark */}
                  <div className={`absolute -bottom-6 -right-2 text-[10rem] font-black opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 transform group-hover:scale-110 pointer-events-none ${step.textColor} leading-none select-none`}>
                    {step.num}
                  </div>

                  <div className="relative flex items-center justify-between mb-10 z-10">
                    <div className={`w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl ${step.color} ${step.shadow} transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 ring-4 ring-white/50 backdrop-blur-sm`}>
                      {step.icon}
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="font-black text-2xl text-slate-900 mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all duration-300">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 text-base leading-relaxed font-medium group-hover:text-slate-700 transition-colors duration-300">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Connecting Arrow for Desktop */}
                {index < 2 && (
                  <div className="hidden md:flex flex-col justify-center items-center px-1 lg:px-4 text-slate-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 lg:w-12 lg:h-12 drop-shadow-sm group-hover:text-indigo-400 transition-colors duration-300">
                      <line x1="0" y1="12" x2="20" y2="12"></line>
                      <polyline points="13 5 20 12 13 19"></polyline>
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFICIAL LINKS ── */}
      <section className="bg-[#0A1128] px-4 py-20 relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
              🏛️ {t('Verified & Trusted', 'सत्यापित और विश्वसनीय')}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              {t('Official Government Resources', 'आधिकारिक सरकारी संसाधन')}
            </h2>
            <p className="text-indigo-200 mt-3 text-sm md:text-base max-w-xl mx-auto">
              {t('Direct links to the Election Commission of India portals for voter registration and verification.', 'मतदाता पंजीकरण और सत्यापन के लिए भारत निर्वाचन आयोग के पोर्टल के सीधे लिंक।')}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
            <div className="flex flex-col gap-4">
              {[
                { icon: '🌐', text: 'voters.eci.gov.in', desc: t('Search name in voter list', 'मतदाता सूची में नाम खोजें'), action: t('Visit Portal', 'पोर्टल पर जाएं'), href: 'https://voters.eci.gov.in' },
                { icon: '📝', text: 'nvsp.in', desc: t('Register as a new voter', 'नए मतदाता के रूप में पंजीकरण करें'), action: t('Register Now', 'अभी पंजीकरण करें'), href: 'https://nvsp.in' },
                { icon: '📞', text: '1950 Voter Helpline', desc: t('Toll-free national helpline', 'टोल-फ्री राष्ट्रीय हेल्पलाइन'), action: t('Call 1950', '1950 पर कॉल करें'), href: 'tel:1950' },
              ].map(link => (
                <a key={link.text} href={link.href} target="_blank" rel="noopener noreferrer" className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 p-5 rounded-2xl group transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl border border-white/10 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                      {link.icon}
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">{link.text}</div>
                      <div className="text-indigo-200/80 text-sm">{link.desc}</div>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto bg-gradient-to-r from-[#FF6F00] to-[#E65100] hover:from-[#FF8F00] hover:to-[#FF6F00] text-white px-6 py-2.5 rounded-xl font-bold text-sm text-center transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 group-hover:scale-105 flex items-center justify-center gap-2">
                    {link.action} <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050A18] px-4 py-12 text-center">
        <div className="text-white font-black text-3xl mb-2 tracking-tight">🗳️ ChunaavAI</div>
        <div className="text-slate-400 font-semibold text-sm mb-4">{t('Apna Vote, Apna Adhikar 🇮🇳', 'अपना वोट, अपना अधिकार 🇮🇳')}</div>
        <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full text-slate-300 text-xs font-medium mb-6 border border-white/10">
          Powered by <span className="font-bold text-white">Google Gemini AI</span> 🤖
        </div>
        <div className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
          {t('Educational purposes only • Not affiliated with the Election Commission of India or any political party', 'केवल शैक्षिक उद्देश्यों के लिए • ECI या किसी राजनीतिक दल से संबद्ध नहीं')}
        </div>
      </footer>
    </div>
  )
}


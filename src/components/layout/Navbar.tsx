'use client'

/**
 * ChunaavAI Top Navigation Bar — Premium UI
 * Uses LanguageContext so HI/EN toggle affects all pages
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { auth, signInWithGoogle, signOut } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useLanguage } from '@/context/LanguageContext'
import { Menu, X, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react'

const NAV_LINKS = [
  { en: 'Learn', hi: 'सीखें', href: '/learn' },
  { en: 'CivicBot', hi: 'सिविकबॉट', href: '/assistant' },
  { en: 'Quiz', hi: 'क्विज़', href: '/quiz' },
  { en: 'Checklist', hi: 'चेकलिस्ट', href: '/checklist' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { language, toggleLanguage, t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    return () => unsubscribe()
  }, [])

  function getUserInitial(): string {
    return user?.displayName?.[0]?.toUpperCase() ?? 'U'
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 py-2'
          : 'bg-white py-3 border-b border-gray-100'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="ChunaavAI Home">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] flex items-center justify-center text-xl shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all group-hover:-translate-y-0.5">
            🗳️
          </div>
          <span className="font-black text-2xl tracking-tight text-[#FF6F00]">
            ChunaavAI
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1 rounded-2xl border border-gray-100">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-[#FF6F00] bg-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                {t(link.en, link.hi)}
              </Link>
            )
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="hidden sm:flex relative p-1 bg-gray-100 rounded-full items-center cursor-pointer overflow-hidden transition-colors"
            aria-label="Toggle language"
          >
            <div
              className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                language === 'EN' ? 'translate-x-full' : 'translate-x-0'
              }`}
            />
            <span className={`relative z-10 px-3 py-1 text-xs font-bold transition-colors duration-200 ${language === 'HI' ? 'text-[#FF6F00]' : 'text-gray-500'}`}>HI</span>
            <span className={`relative z-10 px-3 py-1 text-xs font-bold transition-colors duration-200 ${language === 'EN' ? 'text-[#FF6F00]' : 'text-gray-500'}`}>EN</span>
          </button>

          {/* Auth — desktop */}
          <div className="hidden md:block relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 bg-gradient-to-tr from-[#1A237E] to-[#3949AB] text-white rounded-full font-bold text-sm flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all ring-2 ring-white"
                  aria-label="User menu"
                >
                  {getUserInitial()}
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-3 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-64 z-50 transform opacity-100 scale-100 transition-all origin-top-right">
                      <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                          <UserIcon size={20} />
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-sm font-bold text-gray-900 truncate">{user.displayName}</div>
                          <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors" onClick={() => setShowUserMenu(false)}>
                          <LayoutDashboard size={16} className="text-blue-600" />
                          {t('My Dashboard', 'मेरा डैशबोर्ड')}
                        </Link>
                        <button onClick={() => { signOut(); setShowUserMenu(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1">
                          <LogOut size={16} />
                          {t('Sign Out', 'साइन आउट')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={signInWithGoogle} className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5">
                {t('Login', 'लॉगिन')}
              </button>
            )}
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleLanguage}
                className="flex relative p-1 bg-gray-100 rounded-full items-center cursor-pointer overflow-hidden transition-colors"
              >
                <div
                  className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                    language === 'EN' ? 'translate-x-full' : 'translate-x-0'
                  }`}
                />
                <span className={`relative z-10 px-4 py-1.5 text-xs font-bold ${language === 'HI' ? 'text-[#FF6F00]' : 'text-gray-500'}`}>HI</span>
                <span className={`relative z-10 px-4 py-1.5 text-xs font-bold ${language === 'EN' ? 'text-[#FF6F00]' : 'text-gray-500'}`}>EN</span>
              </button>
            </div>
            
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-2xl text-base font-semibold transition-colors ${
                    isActive ? 'bg-orange-50 text-[#FF6F00]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t(link.en, link.hi)}
                </Link>
              )
            })}
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 px-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-[#1A237E] to-[#3949AB] text-white rounded-full font-bold text-lg flex items-center justify-center shadow-md">
                      {getUserInitial()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{user.displayName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 px-2">
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 rounded-xl font-semibold text-sm">
                      <LayoutDashboard size={18} />
                      {t('Dashboard', 'डैशबोर्ड')}
                    </Link>
                    <button onClick={() => { signOut(); setIsMenuOpen(false) }} className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-semibold text-sm">
                      <LogOut size={18} />
                      {t('Sign Out', 'साइन आउट')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-2">
                  <button onClick={() => { signInWithGoogle(); setIsMenuOpen(false) }} className="w-full bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20">
                    {t('Login with Google', 'Google से लॉगिन')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

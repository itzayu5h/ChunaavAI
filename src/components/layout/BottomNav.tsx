'use client'

/**
 * Mobile bottom navigation bar
 * Shows on all inner pages (not landing)
 * Hidden on desktop screens (md:hidden)
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { icon: '🏠', label: 'Home', href: '/dashboard' },
  { icon: '📅', label: 'Seekho', href: '/learn' },
  { icon: '🤖', label: 'CivicBot', href: '/assistant' },
  { icon: '🎯', label: 'Quiz', href: '/quiz' },
  { icon: '✅', label: 'Check', href: '/checklist' },
] as const

/**
 * Fixed bottom navigation for mobile
 * Uses pathname to highlight active tab
 */
export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden"
      style={{ height: '64px' }}
      aria-label="Bottom navigation"
    >
      <div className="flex h-full">
        {TABS.map(tab => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={`text-xl ${
                isActive ? 'opacity-100' : 'opacity-50'
              }`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-medium ${
                isActive ? 'text-[#FF6F00]' : 'text-gray-400'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#FF6F00]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

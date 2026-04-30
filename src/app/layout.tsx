import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: 'ChunaavAI — Apna Vote Samjho 🇮🇳',
  description: 'India ka sabse smart election education platform. Gemini AI powered. Lok Sabha, Vidhan Sabha, EVM, NOTA — sab kuch samjho.',
  keywords: [
    'Indian election', 'EVM kya hai',
    'NOTA kya hai', 'voter registration India',
    'Lok Sabha', 'chunav shiksha', 'ECI',
    'Vidhan Sabha', 'Indian democracy education',
    'vote kaise dein',
  ],
  openGraph: {
    title: 'ChunaavAI — Apna Vote Samjho 🇮🇳',
    description: 'India election education powered by Gemini AI',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <body>
        <LanguageProvider>
          <Navbar />
          <main className="pt-20 pb-16 md:pb-0 min-h-screen">{children}</main>
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  )
}


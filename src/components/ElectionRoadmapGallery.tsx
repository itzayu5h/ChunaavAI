'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'

interface RoadmapItem {
  id: number
  emoji: string
  titleEn: string
  titleHi: string
  desc: string
  tag: string
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: 1,
    emoji: '📢🗓️',
    titleEn: 'Election Announced',
    titleHi: 'चुनाव की घोषणा',
    desc: 'Election Commission sets dates, Model Code of Conduct begins',
    tag: 'Step 1 • ECI',
  },
  {
    id: 2,
    emoji: '📋✍️',
    titleEn: 'Voter Registration',
    titleHi: 'मतदाता पंजीकरण',
    desc: 'Citizens register using Form 6 on nvsp.in',
    tag: 'Step 2 • NVSP',
  },
  {
    id: 3,
    emoji: '🏛️📜',
    titleEn: 'Candidates File Nominations',
    titleHi: 'नामांकन प्रक्रिया',
    desc: 'Candidates submit papers, scrutiny happens, symbols assigned',
    tag: 'Step 3 • Nomination',
  },
  {
    id: 4,
    emoji: '🗳️🖊️',
    titleEn: 'Voting Day',
    titleHi: 'मतदान दिवस',
    desc: 'Voters cast ballots on EVM from 7AM to 6PM',
    tag: 'Step 4 • Election Day',
  },
  {
    id: 5,
    emoji: '🏆🇮🇳',
    titleEn: 'Results & Government',
    titleHi: 'परिणाम और सरकार',
    desc: 'Votes counted, winner declared, new government formed',
    tag: 'Step 5 • Result',
  },
]

const ImageCollage = ({ isOuterLeft, item }: { isOuterLeft: boolean, item: RoadmapItem }) => {
  return (
    <div className={`roadmap-animate opacity-0 transition-all duration-1000 ease-out md:translate-y-0 translate-y-8 relative ${isOuterLeft ? 'md:-translate-x-8' : 'md:translate-x-8'}`}>
      {/* Large Image Box */}
      <div className="w-64 h-48 md:w-[320px] md:h-[240px] bg-slate-200 rounded-3xl shadow-sm overflow-hidden relative group cursor-pointer transition-transform hover:scale-[1.02]">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-200 transition-colors group-hover:bg-slate-300">
           <span className="text-5xl opacity-30 grayscale">{item.emoji}</span>
           <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-slate-500">Image Placeholder</span>
        </div>
      </div>
      
      {/* Small Overlapping Box */}
      <div className={`absolute -bottom-6 md:-bottom-10 ${isOuterLeft ? '-left-6 md:-left-10' : '-right-6 md:-right-10'} w-32 h-24 md:w-[160px] md:h-[120px] bg-slate-300 rounded-2xl border-[6px] border-[#FAFAF8] shadow-lg overflow-hidden group cursor-pointer transition-transform hover:scale-105`}>
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-slate-300 transition-colors group-hover:bg-slate-400">
          <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-600">Sub Image</span>
        </div>
      </div>
    </div>
  )
}

const TextContent = ({ item, isRightColumn }: { item: RoadmapItem, isRightColumn: boolean }) => {
  return (
    <div className={`roadmap-animate opacity-0 transition-all duration-1000 ease-out md:translate-y-0 translate-y-8 w-full max-w-[280px] flex flex-col justify-center text-left items-start ${isRightColumn ? 'md:translate-x-8' : 'md:-translate-x-8'}`}>
      <div className="text-[10px] text-slate-400 font-semibold tracking-[0.2em] uppercase mb-4">
         {item.tag}
      </div>
      <h3 className="text-2xl md:text-3xl font-light text-slate-800 mb-3 leading-tight font-serif">
        {item.titleEn}
      </h3>
      <div className="text-slate-500 text-xs mb-5 font-medium" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
        {item.titleHi}
      </div>
      <p className="text-slate-500 text-sm leading-relaxed mb-8">
        {item.desc}
      </p>
      <Link href="/learn" className="inline-block text-slate-800 text-[11px] font-bold tracking-widest uppercase hover:text-slate-500 transition-colors pb-1 border-b border-slate-300 hover:border-slate-500">
        Learn More
      </Link>
    </div>
  )
}

/**
 * ElectionRoadmapGallery
 * A minimalist, elegant vertical timeline roadmap with image collages.
 */
export default function ElectionRoadmapGallery() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-x-0', 'translate-y-0')
            entry.target.classList.remove('opacity-0', '-translate-x-8', 'translate-x-8', 'translate-y-8')
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.roadmap-animate')
      cards.forEach((card) => observer.observe(card))
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-[#FAFAF8] px-4 py-32 border-y border-slate-100 overflow-hidden relative font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-32 relative z-20">
          <span className="text-slate-500 font-semibold text-[10px] tracking-[0.3em] uppercase mb-6 block">
            India&apos;s Election Story
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 font-serif">
            The Journey of <span className="italic text-slate-500">Every Vote</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            From announcement to result — see how democracy works in India through an immersive visual journey.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto" ref={containerRef}>
          
          {/* Central Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-slate-300 transform md:-translate-x-1/2" />

          <div className="space-y-28 md:space-y-40">
            {ROADMAP_ITEMS.map((item, index) => {
              // Alternating logic:
              // Even index (0, 2, 4): Image Collage Left, Text Right
              // Odd index (1, 3): Text Left, Image Collage Right
              const isImageLeft = index % 2 === 0

              return (
                <div key={item.id} className="relative flex flex-col md:flex-row items-center w-full">
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 w-2.5 h-2.5 bg-slate-800 rounded-full transform -translate-x-1/2 z-10 shadow-sm" />
                  
                  {/* Connect Line (Horizontal - Desktop) */}
                  <div className={`hidden md:block absolute top-1/2 w-8 h-[1px] bg-slate-300 transform -translate-y-1/2 ${isImageLeft ? 'left-1/2' : 'right-1/2'}`} />

                  {/* Left Column (Desktop) */}
                  <div className="hidden md:flex w-1/2 justify-end pr-16 relative">
                    {isImageLeft ? (
                      <ImageCollage isOuterLeft={true} item={item} />
                    ) : (
                      <TextContent item={item} isRightColumn={false} />
                    )}
                  </div>

                  {/* Right Column (Desktop) */}
                  <div className="hidden md:flex w-1/2 justify-start pl-16 relative">
                    {isImageLeft ? (
                      <TextContent item={item} isRightColumn={true} />
                    ) : (
                      <ImageCollage isOuterLeft={false} item={item} />
                    )}
                  </div>

                  {/* Mobile View */}
                  <div className="flex md:hidden flex-col w-full pl-16 py-8 relative">
                    {/* Mobile horizontal line */}
                    <div className="absolute top-12 left-8 w-6 h-[1px] bg-slate-300" />
                    
                    <TextContent item={item} isRightColumn={true} />
                    <div className="mt-16 mb-4">
                      <ImageCollage isOuterLeft={true} item={item} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Final Celebration Node */}
          <div className="relative mt-24 md:mt-32 flex justify-center w-full z-20">
            <div className="roadmap-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out bg-white rounded-full px-8 py-4 shadow-md border border-slate-200 flex items-center gap-3">
              <span className="text-xl">🎉</span>
              <span className="font-serif font-light text-slate-800 text-lg">You&apos;re Ready to Vote!</span>
              <span className="text-xl">🎉</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

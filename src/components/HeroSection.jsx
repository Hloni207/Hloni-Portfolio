import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import LiveClock from './LiveClock';
import { usePortfolio } from '../context/PortfolioContext';

export default function HeroSection() {
  const { data } = usePortfolio();
  const { profile } = data;

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full pt-10 pb-20 md:pb-28 px-6 md:px-12 lg:px-16 flex flex-col justify-between min-h-[calc(100vh-90px)]">
      {/* Top status bar: Tag & Live Time */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/5 pb-8">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
          <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-[#333333]">
            {profile.titleTag || "Welcome to my personal Portfolio"}
          </span>
        </div>

        <div className="text-right">
          <LiveClock />
        </div>
      </div>

      {/* Main Massive Headline with Profile Photo next to it on the right side */}
      <div className="my-12 md:my-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[108px] xl:text-[118px] leading-[0.94] tracking-[-0.05em] font-extrabold select-none flex-1">
          <span className="block text-[#111111]">{profile.headlinePart1 || "Comming to"}</span>
          <span className="block text-[#8c8c88] transition-colors">{profile.headlinePart2 || "Know Me."}</span>
        </h1>

        {/* 1 & 2. Profile photo next to "Comming to Know me" on the right side using src/media/profileimage.jpg */}
        <div className="flex-shrink-0 self-center lg:self-auto">
          <div className="relative group">
            <div className="w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-[6px] border-white shadow-2xl ring-1 ring-black/10 bg-[#e5e1d6] transition-transform duration-500 group-hover:scale-105">
              <img
                src={profile.avatar || "/media/profileimage.jpg"}
                alt={profile.fullName || "Hloni"}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  if (e.target.src.includes('/media/')) {
                    e.target.src = '/api/media/profileimage.jpg';
                  } else {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                  }
                }}
              />
            </div>
            {/* Subtle decorative ring */}
            <div className="absolute -inset-2 rounded-full border border-black/5 -z-10 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom Row: Bio text & Explore selected work button */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pt-8 border-t border-black/5">
        <div className="max-w-2xl">
          <p className="text-base md:text-xl text-[#2a2a2a] leading-relaxed font-normal">
            {profile.bio}
          </p>
        </div>

        {/* Buttons: Explore selected work + Arrow Down circle */}
        <div className="flex items-center gap-3 self-start lg:self-end flex-shrink-0">
          <button
            onClick={scrollToWork}
            className="group inline-flex items-center gap-2 bg-[#111111] text-white hover:bg-neutral-800 text-sm md:text-base font-semibold px-7 py-4 rounded-full shadow-sm hover:shadow transition-all duration-200"
          >
            <span>Explore selected work</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={scrollToWork}
            aria-label="Scroll down"
            className="w-13 h-13 md:w-14 md:h-14 rounded-full border border-black/20 flex items-center justify-center text-black hover:border-black hover:bg-black hover:text-white transition-all duration-200"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

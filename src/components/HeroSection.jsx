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
    <section className="w-full pt-4 sm:pt-8 md:pt-10 pb-16 sm:pb-20 md:pb-28 px-5 sm:px-8 md:px-12 lg:px-16 flex flex-col justify-between min-h-[calc(100svh-80px)]">
      {/* Top status bar: Tag & Live Time */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-black/5 pb-6 sm:pb-8">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
          <span className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase text-[#333333]">
            {profile.titleTag || "Welcome to my personal Portfolio"}
          </span>
        </div>

        <div className="text-left sm:text-right">
          <LiveClock />
        </div>
      </div>

      {/* Main Massive Headline with Profile Photo: Responsive Layout */}
      <div className="my-8 sm:my-12 md:my-20 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 lg:gap-12">
        <div className="w-full lg:flex-1 text-left">
          <h1 className="text-[44px] leading-[0.96] sm:text-6xl md:text-7xl lg:text-[108px] xl:text-[118px] md:leading-[0.94] tracking-[-0.05em] font-extrabold select-none">
            <span className="block text-[#111111]">{profile.headlinePart1 || "Comming to"}</span>
            <span className="block text-[#8c8c88] transition-colors">{profile.headlinePart2 || "Know Me."}</span>
          </h1>
        </div>

        {/* Profile photo: Centerpiece on mobile, right side on desktop */}
        <div className="flex-shrink-0 self-center lg:self-auto my-2 sm:my-0">
          <div className="relative group">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-[5px] sm:border-[6px] border-white shadow-2xl ring-1 ring-black/10 bg-[#e5e1d6] transition-transform duration-500 hover:scale-105">
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
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-black/5">
        <div className="max-w-2xl">
          <p className="text-base sm:text-lg md:text-xl text-[#2a2a2a] leading-relaxed font-normal">
            {profile.bio}
          </p>
        </div>

        {/* Buttons: Explore selected work + Arrow Down circle */}
        <div className="flex items-center gap-3 w-full sm:w-auto self-start lg:self-end flex-shrink-0">
          <button
            onClick={scrollToWork}
            className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-neutral-800 text-sm md:text-base font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full shadow-sm hover:shadow transition-all duration-200"
          >
            <span>Explore selected work</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={scrollToWork}
            aria-label="Scroll down"
            className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full border border-black/20 flex items-center justify-center text-black hover:border-black hover:bg-black hover:text-white transition-all duration-200 flex-shrink-0"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

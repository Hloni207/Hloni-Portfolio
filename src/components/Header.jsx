import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Header() {
  const { data } = usePortfolio();
  const { profile, contactLinks = [] } = data;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const linkedinLink = contactLinks.find(c => c.name.toLowerCase().includes('linkedin'))?.url || 'https://www.linkedin.com';
  const githubLink = contactLinks.find(c => c.name.toLowerCase().includes('github'))?.url || 'https://github.com/Hloni207';

  return (
    // Non-sticky header: scrolls away with the page as requested
    <header className="w-full pt-8 pb-6 px-6 md:px-12 lg:px-16 flex items-center justify-between text-[#111111]">
      <div className="flex items-center gap-8">
        <Link href="/" className="font-bold text-2xl tracking-tighter hover:opacity-80 transition-opacity">
          {profile.name || "hloni."}
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[15px] text-[#444444] font-medium">
          <button onClick={() => scrollTo('work')} className="hover:text-black transition-colors">
            Work
          </button>
          <button onClick={() => scrollTo('experience')} className="hover:text-black transition-colors">
            Experience
          </button>
          <button onClick={() => scrollTo('about')} className="hover:text-black transition-colors">
            About
          </button>
          <button onClick={() => scrollTo('contact')} className="hover:text-black transition-colors">
            Contact
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={linkedinLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-[14px] text-[#444444] hover:text-black font-medium transition-colors px-2 py-1"
        >
          LinkedIn <ArrowUpRight className="w-3.5 h-3.5" />
        </a>

        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[14px] bg-[#111111] text-white hover:bg-neutral-800 font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm"
        >
          GitHub <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
}

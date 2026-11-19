import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X, FileText } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Header() {
  const { data } = usePortfolio();
  const { profile, contactLinks = [] } = data;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const linkedinLink = contactLinks.find(c => c.name.toLowerCase().includes('linkedin'))?.url || 'https://www.linkedin.com';
  const githubLink = contactLinks.find(c => c.name.toLowerCase().includes('github'))?.url || 'https://github.com/Hloni207';
  const resumePath = profile.resumeUrl || '/media/resume.pdf';

  return (
    // Non-sticky header: scrolls away with the page as requested
    <header className="relative w-full pt-6 md:pt-8 pb-5 md:pb-6 px-5 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between text-[#111111]">
      <div className="flex items-center gap-8">
        <Link href="/" className="font-bold text-2xl tracking-tighter hover:opacity-80 transition-opacity">
          {profile.name || "hloni."}
        </Link>
        {/* Desktop Navigation */}
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

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-3">
        <a
          href={linkedinLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[14px] text-[#444444] hover:text-black font-medium transition-colors px-2 py-1"
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

      {/* Mobile Right Controls: GitHub quick pill + Menu Toggle */}
      <div className="flex md:hidden items-center gap-2.5">
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs bg-[#111111] text-white font-medium px-3.5 py-2 rounded-full shadow-sm"
        >
          <span>GitHub</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 rounded-full border border-black/15 bg-white/80 flex items-center justify-center text-neutral-800 shadow-sm active:scale-95 transition-transform"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 z-40 bg-[#F6F5F1] rounded-3xl p-6 border border-black/10 shadow-2xl space-y-5 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-lg font-bold text-neutral-900">
            <button
              onClick={() => scrollTo('work')}
              className="text-left py-2 px-3 rounded-xl hover:bg-black/5 transition-colors flex items-center justify-between"
            >
              <span>Selected Work</span>
              <span className="text-xs font-mono text-neutral-400">01</span>
            </button>
            <button
              onClick={() => scrollTo('experience')}
              className="text-left py-2 px-3 rounded-xl hover:bg-black/5 transition-colors flex items-center justify-between"
            >
              <span>Background & Experience</span>
              <span className="text-xs font-mono text-neutral-400">02</span>
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="text-left py-2 px-3 rounded-xl hover:bg-black/5 transition-colors flex items-center justify-between"
            >
              <span>About & Skills</span>
              <span className="text-xs font-mono text-neutral-400">03</span>
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="text-left py-2 px-3 rounded-xl hover:bg-black/5 transition-colors flex items-center justify-between"
            >
              <span>Get In Touch</span>
              <span className="text-xs font-mono text-neutral-400">05</span>
            </button>
          </nav>

          <div className="pt-4 border-t border-black/10 flex flex-col gap-2.5">
            <a
              href={resumePath}
              target="_blank"
              rel="noopener noreferrer"
              download={profile.resumeFilename || 'resume.pdf'}
              className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white py-3 rounded-full text-sm font-semibold shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Download Resume</span>
            </a>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-white border border-black/10 py-2.5 rounded-full text-xs font-semibold text-neutral-800"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-white border border-black/10 py-2.5 rounded-full text-xs font-semibold text-neutral-800"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

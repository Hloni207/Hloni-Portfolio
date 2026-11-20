import React from 'react';
import fs from 'fs';
import path from 'path';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import BackgroundSection from '@/components/BackgroundSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import { initialPortfolioData } from '@/data/initialData';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#111111] flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* 1. Header is ONLY on the top section. When user scrolls it scrolls away too */}
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* 01 / PORTFOLIO: Selected Work */}
        <ProjectsSection />

        {/* 02 / BACKGROUND: Built through experience */}
        <BackgroundSection />

        {/* 03 / ABOUT */}
        <AboutSection />

        {/* 05 / CONTACT ME */}
        <ContactSection />
      </main>
    </div>
  );
}

export async function getStaticProps() {
  let initialData = initialPortfolioData;

  try {
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'portfolio.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      const parsed = JSON.parse(raw);
      initialData = {
        ...initialPortfolioData,
        ...parsed,
      };
    }
  } catch (err) {
    console.warn('getStaticProps portfolio.json read warning:', err.message);
  }

  return {
    props: {
      initialPortfolioData: initialData,
    },
    revalidate: 10,
  };
}

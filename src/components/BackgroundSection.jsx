import React, { useState } from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import ExperienceModal from './ExperienceModal';
import { usePortfolio } from '../context/PortfolioContext';

export default function BackgroundSection() {
  const { data } = usePortfolio();
  const { experienceSection, experiences = [], profile } = data;
  const [selectedExperience, setSelectedExperience] = useState(null);

  const resumePath = profile.resumeUrl || '/media/resume.pdf';

  return (
    <section id="experience" className="w-full py-24 px-6 md:px-12 lg:px-16 bg-[#0F1010] text-white">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400 block mb-3">
            {experienceSection.sectionTag || "02 / BACKGROUND"}
          </span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            {experienceSection.title || "Built through experience."}
          </h2>
        </div>

        <p className="max-w-md text-base sm:text-lg text-neutral-400 leading-relaxed font-normal">
          {experienceSection.subtitle || "From industrial engineering and robotics to digital platforms, combining technical problem-solving with hands-on delivery."}
        </p>
      </div>

      {/* Experience Rows */}
      <div className="divide-y divide-neutral-800 border-t border-b border-neutral-800">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id || idx}
            onClick={() => setSelectedExperience(exp)}
            className="group py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-900/60 transition-colors px-2 rounded-lg"
          >
            {/* Left: Number and Company/Name */}
            <div className="flex items-center gap-6 sm:gap-10 md:w-1/3">
              <span className="text-xs sm:text-sm font-mono text-neutral-400">
                {exp.number || String(idx + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                {exp.name}
              </h3>
            </div>

            {/* Center: Position */}
            <div className="md:w-1/3 text-neutral-300 text-sm sm:text-base font-medium">
              {exp.position}
            </div>

            {/* Right: Date + Modal Trigger Button */}
            <div className="flex items-center justify-between md:justify-end gap-4 md:w-1/3">
              <span className="text-sm font-medium text-neutral-400 font-mono">
                {exp.date}
              </span>

              {/* Requirement: button after the date that pops up a modal */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedExperience(exp);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-500 transition-all"
                title="View full experience details"
              >
                <span>Details</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Resume Action */}
      <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <a
          href={resumePath}
          target="_blank"
          rel="noopener noreferrer"
          download={profile.resumeFilename || 'resume.pdf'}
          className="group inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all duration-200"
        >
          <FileText className="w-4 h-4" />
          <span>View full resume</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        <span className="text-xs text-neutral-400">
          Resume: {profile.resumeFilename || 'resume.pdf'} • Click to view or download
        </span>
      </div>

      {/* Experience Details Modal */}
      <ExperienceModal
        experience={selectedExperience}
        isOpen={!!selectedExperience}
        onClose={() => setSelectedExperience(null)}
      />
    </section>
  );
}

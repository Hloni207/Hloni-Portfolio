import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function AboutSection() {
  const { data } = usePortfolio();
  const { aboutSection, skills = [] } = data;

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="w-full py-16 sm:py-20 md:py-24 px-5 sm:px-8 md:px-12 lg:px-16 bg-[#F6F5F1] text-[#111111] border-t border-black/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16">
        {/* Left Column: Heading */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-neutral-500 block">
            {aboutSection.sectionTag || "03 / ABOUT"}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] sm:leading-[1.08] text-[#111111]">
            {(aboutSection.headingLines || [
              "A Robotist man,",
              "A productive mind,",
              "An explorer"
            ]).map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))}
          </h2>

          {/* Skills Badges */}
          {skills && skills.length > 0 && (
            <div className="pt-5 sm:pt-6 border-t border-black/10 space-y-3">
              <span className="text-xs font-bold tracking-wider uppercase text-neutral-400 block">
                Skills
              </span>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {skills.map((skill, idx) => (
                  <span
                    key={skill.id || idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 border border-black/10 text-neutral-800 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 3 Paragraphs */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-sm sm:text-base md:text-lg text-neutral-700 leading-relaxed font-normal">
          {/* Paragraph 1 */}
          <p className="border-l-2 border-neutral-300 pl-4">
            {aboutSection.paragraph1 || "My career began with Programming and Robotics. It tow me from being a person living for the day to being a thinker and builder. I began building small robot prototype in class until i started doing it at home."}
          </p>

          {/* Paragraph 2 */}
          <p className="border-l-2 border-neutral-300 pl-4">
            {aboutSection.paragraph2 || "Curiosity sparked, followed by the love of learning, i ended up starting to explorer more. i started my journey when i worked at a local industrial company in 2026 June holidays as a shadower then Maintance Assistance, sadly i went back to college. curisority though did not end there, i continued by attending my first ever competiton in Soweto (Robo Rumble) where i came out second and went to W3node Hackathon in Cape Town."}
          </p>

          {/* Paragraph 3 */}
          <p className="border-l-2 border-emerald-500 pl-4 font-medium text-neutral-900">
            {aboutSection.paragraph3 || "Now i am a student, a builder, and a curious person striving to make use of everyday i live. with a mind to always become the better version of myself."}
          </p>

          {/* Bottom link */}
          <div className="pt-2 sm:pt-4">
            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-black border-b-2 border-black pb-0.5 hover:opacity-75 transition-opacity"
            >
              <span>More about me & Let's talk</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

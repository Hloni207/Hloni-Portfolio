import React, { useState } from 'react';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import ContactModal from './ContactModal';
import { usePortfolio } from '../context/PortfolioContext';

export default function ContactSection() {
  const { data } = usePortfolio();
  const { contactSection } = data;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className="w-full pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-5 sm:px-8 md:px-12 lg:px-16 bg-[#F6F5F1] text-[#111111] border-t border-black/10 flex flex-col justify-between min-h-[75vh] md:min-h-[85vh]">
      <div>
        {/* Section Tag */}
        <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-neutral-500 block mb-4 sm:mb-6">
          {contactSection.sectionTag || "05 / CONTACT ME"}
        </span>

        {/* Big Display Title: Let's build something. Fully responsive to prevent mobile overflow */}
        <div className="my-8 sm:my-12 md:my-16">
          <h2 className="text-[38px] leading-[0.96] xs:text-5xl sm:text-7xl md:text-8xl lg:text-[112px] md:leading-[0.92] font-extrabold tracking-[-0.04em]">
            <span className="block text-[#111111]">Let's</span>
            <span className="block text-[#8c8c88]">build something.</span>
          </h2>
        </div>

        {/* Subtitle & Get in touch button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 sm:pt-8 border-t border-black/10">
          <p className="text-sm sm:text-base md:text-xl text-neutral-700 font-normal max-w-lg leading-relaxed">
            {contactSection.subtitle || "get in touch to build and find out more with me"}
          </p>

          {/* Requirement: the "get in touch button" pops up a modal with links and icons */}
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 bg-[#111111] text-white hover:bg-neutral-800 text-sm sm:text-base font-semibold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-sm hover:shadow transition-all duration-200"
          >
            <span>{contactSection.buttonText || "Get in touch"}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Footer Row */}
      <footer className="mt-16 sm:mt-24 pt-6 sm:pt-8 border-t border-black/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-neutral-500 font-medium text-center sm:text-left">
        <div>
          {contactSection.copyright || `© ${new Date().getFullYear()} Hloni`}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {data.contactLinks.slice(0, 3).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              {link.name} ↗
            </a>
          ))}

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 hover:text-black transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  );
}

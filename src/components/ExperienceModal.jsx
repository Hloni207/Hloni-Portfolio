import React, { useEffect } from 'react';
import { X, Calendar, Briefcase, Building2 } from 'lucide-react';

export default function ExperienceModal({ experience, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !experience) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#161718] border border-neutral-800 rounded-2xl shadow-2xl overflow-y-auto text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-white hover:text-black flex items-center justify-center text-neutral-300 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Experience Image if available */}
        {experience.image && (
          <div className="w-full h-56 sm:h-64 relative overflow-hidden rounded-t-2xl bg-neutral-900 border-b border-neutral-800">
            <img
              src={experience.image}
              alt={experience.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161718] via-transparent to-black/20" />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-400">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>{experience.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {experience.position}
            </h2>
          </div>

          {/* Date Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700 text-sm font-medium text-neutral-300">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{experience.date}</span>
          </div>

          {/* Full Description */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
              Full Experience Description
            </h3>
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed whitespace-pre-line">
              {experience.description || "No full description provided."}
            </p>
          </div>

          {/* Close action */}
          <div className="pt-4 border-t border-neutral-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

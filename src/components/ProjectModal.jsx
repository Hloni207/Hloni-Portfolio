import React, { useEffect } from 'react';
import { X, ExternalLink, Calendar, Tag } from 'lucide-react';

export default function ProjectModal({ project, isOpen, onClose }) {
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

  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-10 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] bg-[#F7F5F0] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto border border-black/10 text-[#111111] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-black hover:text-white flex items-center justify-center text-neutral-700 shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Project Picture */}
        <div className="w-full bg-[#eae7de] relative max-h-[300px] sm:max-h-[420px] overflow-hidden rounded-t-3xl flex items-center justify-center mt-2 sm:mt-0">
          <img
            src={project.image || "/media/profileimage.jpg"}
            alt={project.title}
            className="w-full h-full object-cover max-h-[300px] sm:max-h-[420px]"
            onError={(e) => {
              e.target.src = "/media/profileimage.jpg";
            }}
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase bg-white/90 backdrop-blur-sm text-neutral-800 shadow-sm">
              {project.category || "Project"}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-black/10 pb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
              {project.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span>{project.date}</span>
            </div>
          </div>

          {project.tags && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 font-medium">
              <Tag className="w-3.5 h-3.5 text-neutral-400" />
              <span>{project.tags}</span>
            </div>
          )}

          <div className="space-y-2.5">
            <h3 className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-neutral-400">
              Overview & Details
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-neutral-800 leading-relaxed whitespace-pre-line">
              {project.description || "No full description provided yet."}
            </p>
          </div>

          {/* Action Link */}
          {project.link && (
            <div className="pt-4 border-t border-black/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-neutral-800 px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all text-center"
              >
                <span>Visit Project / Repository</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={onClose}
                className="text-xs sm:text-sm font-medium text-neutral-500 hover:text-black underline underline-offset-4 text-center py-2 sm:py-0"
              >
                Close preview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

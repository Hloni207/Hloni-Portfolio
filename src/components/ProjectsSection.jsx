import React, { useState } from 'react';
import { ArrowUpRight, FolderCode } from 'lucide-react';
import ProjectModal from './ProjectModal';
import { usePortfolio } from '../context/PortfolioContext';

export default function ProjectsSection() {
  const { data } = usePortfolio();
  const { projectsSection, projects = [] } = data;
  const [activeProject, setActiveProject] = useState(null);

  return (
    <section id="work" className="w-full py-16 sm:py-20 md:py-24 px-5 sm:px-8 md:px-12 lg:px-16 border-t border-black/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16">
        <div>
          <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-neutral-500 block mb-2 sm:mb-3">
            {projectsSection.sectionTag || "01 / PORTFOLIO"}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#111111]">
            {projectsSection.title || "Selected work."}
          </h2>
        </div>

        <p className="max-w-md text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed font-normal">
          {projectsSection.subtitle || "View my workd and projects"}
        </p>
      </div>

      {/* Projects Grid or Clean Empty State */}
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14">
          {projects.map((project, idx) => (
            <div
              key={project.id || idx}
              className="group flex flex-col cursor-pointer"
              onClick={() => setActiveProject(project)}
            >
              {/* Project Image Card */}
              <div className="relative aspect-[16/11] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#e8e4d9] border border-black/5 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <img
                  src={project.image || "/media/profileimage.jpg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "/media/profileimage.jpg";
                  }}
                />
                
                {/* Category pill on image */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase bg-white/95 backdrop-blur-sm text-neutral-800 shadow-sm">
                    {project.category || `0${idx + 1} / WORK`}
                  </span>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-black text-xs font-semibold px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                    Click to view details
                  </span>
                </div>
              </div>

              {/* Bottom info row with title, date, tags and circle arrow */}
              <div className="flex items-start justify-between gap-4 mt-5 sm:mt-6">
                <div>
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111] group-hover:text-black">
                      {project.title}
                    </h3>
                    <span className="text-xs sm:text-sm font-medium text-neutral-500">
                      {project.date}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    {project.tags}
                  </p>
                </div>

                {/* Circle arrow button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProject(project);
                  }}
                  aria-label={`View ${project.title} details`}
                  className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-neutral-700 group-hover:bg-[#111111] group-hover:border-[#111111] group-hover:text-white transition-all duration-200 flex-shrink-0"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty space ready to be filled now as requested (no admin references for visitors) */
        <div className="w-full py-14 sm:py-20 md:py-28 rounded-3xl border border-black/10 flex flex-col items-center justify-center text-center px-6 bg-white/60 shadow-sm">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/5 flex items-center justify-center text-neutral-500 mb-4">
            <FolderCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight mb-2">
            Projects in Development
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md leading-relaxed">
            New robotics prototypes, hardware systems, and software projects will be posted here soon.
          </p>
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        project={activeProject}
        isOpen={!!activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}

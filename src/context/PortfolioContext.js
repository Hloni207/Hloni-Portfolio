import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initialPortfolioData } from '../data/initialData';

const PortfolioContext = createContext(null);

const STORAGE_KEY = 'hloni_portfolio_data_v3';

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(initialPortfolioData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pendingMediaFiles, setPendingMediaFiles] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const autoSyncTimer = useRef(null);

  useEffect(() => {
    async function loadData() {
      let mergedData = initialPortfolioData;

      // 1. Fetch public/data/portfolio.json from server / GitHub
      try {
        const res = await fetch(`/data/portfolio.json?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          mergedData = {
            ...mergedData,
            ...json,
            profile: { ...mergedData.profile, ...(json.profile || {}) },
            projectsSection: { ...mergedData.projectsSection, ...(json.projectsSection || {}) },
            experienceSection: { ...mergedData.experienceSection, ...(json.experienceSection || {}) },
            aboutSection: { ...mergedData.aboutSection, ...(json.aboutSection || {}) },
            contactSection: { ...mergedData.contactSection, ...(json.contactSection || {}) },
            projects: (json.projects && json.projects.length > 0) ? json.projects : mergedData.projects,
            experiences: (json.experiences && json.experiences.length > 0) ? json.experiences : mergedData.experiences,
            skills: json.skills || mergedData.skills,
            contactLinks: json.contactLinks || mergedData.contactLinks,
          };
        }
      } catch (err) {
        console.warn("Could not load /data/portfolio.json, using defaults", err);
      }

      // 2. Overlay localStorage if present and non-empty
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          mergedData = {
            ...mergedData,
            ...parsed,
            profile: { ...mergedData.profile, ...(parsed.profile || {}) },
            projectsSection: { ...mergedData.projectsSection, ...(parsed.projectsSection || {}) },
            experienceSection: { ...mergedData.experienceSection, ...(parsed.experienceSection || {}) },
            aboutSection: { ...mergedData.aboutSection, ...(parsed.aboutSection || {}) },
            contactSection: { ...mergedData.contactSection, ...(parsed.contactSection || {}) },
            // If parsed has projects, use them; if parsed.projects is empty but server has projects, keep server projects!
            projects: (parsed.projects && parsed.projects.length > 0) ? parsed.projects : mergedData.projects,
            experiences: (parsed.experiences && parsed.experiences.length > 0) ? parsed.experiences : mergedData.experiences,
            skills: (parsed.skills && parsed.skills.length > 0) ? parsed.skills : mergedData.skills,
            contactLinks: (parsed.contactLinks && parsed.contactLinks.length > 0) ? parsed.contactLinks : mergedData.contactLinks,
          };
        }
      } catch (err) {
        console.error("Error loading portfolio data from localStorage", err);
      }

      setData(mergedData);
      setIsLoaded(true);

      // Auto-sync initial state to make sure server and git are in sync with user's latest data
      if (mergedData.projects && mergedData.projects.length > 0) {
        try {
          fetch('/api/sync-to-github', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ portfolioData: mergedData }),
          }).catch(() => {});
        } catch (e) {}
      }
    }

    loadData();
  }, []);

  // Save data and automatically sync to disk and GitHub
  const saveToStorage = (newData, filesToPush = []) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (err) {
      console.error("Error saving to localStorage", err);
    }

    // Debounced automatic background sync to GitHub / disk
    if (autoSyncTimer.current) clearTimeout(autoSyncTimer.current);
    autoSyncTimer.current = setTimeout(async () => {
      try {
        let token = undefined;
        try { token = localStorage.getItem('hloni_github_pat') || undefined; } catch (e) {}

        const allFiles = [...pendingMediaFiles, ...filesToPush];

        await fetch('/api/sync-to-github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            portfolioData: newData,
            mediaFiles: allFiles,
            githubToken: token,
          }),
        });

        if (allFiles.length > 0) {
          setPendingMediaFiles([]);
        }
      } catch (e) {
        console.warn('Auto-sync note:', e);
      }
    }, 600);
  };

  const addPendingMediaFile = (fileObj) => {
    setPendingMediaFiles(prev => [...prev.filter(f => f.name !== fileObj.name), fileObj]);
  };

  const updateProfile = (profileUpdates) => {
    const updated = {
      ...data,
      profile: { ...data.profile, ...profileUpdates }
    };
    saveToStorage(updated);
  };

  const updateAbout = (aboutUpdates) => {
    const updated = {
      ...data,
      aboutSection: { ...data.aboutSection, ...aboutUpdates }
    };
    saveToStorage(updated);
  };

  const addProject = (project, mediaFile) => {
    const newProject = {
      ...project,
      id: `proj-${Date.now()}`,
      number: String((data.projects?.length || 0) + 1).padStart(2, '0')
    };
    const updated = {
      ...data,
      projects: [newProject, ...(data.projects || [])]
    };
    saveToStorage(updated, mediaFile ? [mediaFile] : []);
  };

  const updateProject = (id, projectUpdates) => {
    const updated = {
      ...data,
      projects: (data.projects || []).map(p => p.id === id ? { ...p, ...projectUpdates } : p)
    };
    saveToStorage(updated);
  };

  const deleteProject = (id) => {
    const updated = {
      ...data,
      projects: (data.projects || []).filter(p => p.id !== id)
    };
    saveToStorage(updated);
  };

  const addExperience = (exp) => {
    const newExp = {
      ...exp,
      id: `exp-${Date.now()}`,
      number: String((data.experiences?.length || 0) + 1).padStart(2, '0')
    };
    const updated = {
      ...data,
      experiences: [newExp, ...(data.experiences || [])]
    };
    saveToStorage(updated);
  };

  const updateExperience = (id, expUpdates) => {
    const updated = {
      ...data,
      experiences: (data.experiences || []).map(e => e.id === id ? { ...e, ...expUpdates } : e)
    };
    saveToStorage(updated);
  };

  const deleteExperience = (id) => {
    const updated = {
      ...data,
      experiences: (data.experiences || []).filter(e => e.id !== id)
    };
    saveToStorage(updated);
  };

  const addSkill = (skill) => {
    const newSkill = {
      ...skill,
      id: `sk-${Date.now()}`
    };
    const updated = {
      ...data,
      skills: [...(data.skills || []), newSkill]
    };
    saveToStorage(updated);
  };

  const deleteSkill = (id) => {
    const updated = {
      ...data,
      skills: (data.skills || []).filter(s => s.id !== id)
    };
    saveToStorage(updated);
  };

  const addContactLink = (link) => {
    const newLink = {
      ...link,
      id: `cnt-${Date.now()}`
    };
    const updated = {
      ...data,
      contactLinks: [...(data.contactLinks || []), newLink]
    };
    saveToStorage(updated);
  };

  const updateContactLink = (id, linkUpdates) => {
    const updated = {
      ...data,
      contactLinks: (data.contactLinks || []).map(c => c.id === id ? { ...c, ...linkUpdates } : c)
    };
    saveToStorage(updated);
  };

  const deleteContactLink = (id) => {
    const updated = {
      ...data,
      contactLinks: (data.contactLinks || []).filter(c => c.id !== id)
    };
    saveToStorage(updated);
  };

  const updateResume = (resumeUrl, resumeFilename, mediaFile) => {
    const updated = {
      ...data,
      profile: {
        ...data.profile,
        resumeUrl,
        resumeFilename: resumeFilename || data.profile?.resumeFilename || 'resume.pdf'
      }
    };
    saveToStorage(updated, mediaFile ? [mediaFile] : []);
  };

  const resetToDefaults = () => {
    saveToStorage(initialPortfolioData);
  };

  // Explicit sync to GitHub action
  const syncToGitHub = async (githubToken) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync-to-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioData: data,
          mediaFiles: pendingMediaFiles,
          githubToken,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || result.message || 'Failed to sync to GitHub');
      }

      setPendingMediaFiles([]);
      return { success: true, result };
    } catch (err) {
      console.error('Error syncing to GitHub:', err);
      return { success: false, error: err.message };
    } finally {
      setIsSyncing(false);
    }
  };

  const exportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "portfolio-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importData = (importedJson) => {
    try {
      const parsed = typeof importedJson === 'string' ? JSON.parse(importedJson) : importedJson;
      saveToStorage(parsed);
      return true;
    } catch (e) {
      console.error("Invalid JSON imported", e);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoaded,
        isSyncing,
        pendingMediaFiles,
        addPendingMediaFile,
        updateProfile,
        updateAbout,
        addProject,
        updateProject,
        deleteProject,
        addExperience,
        updateExperience,
        deleteExperience,
        addSkill,
        deleteSkill,
        addContactLink,
        updateContactLink,
        deleteContactLink,
        updateResume,
        resetToDefaults,
        syncToGitHub,
        exportData,
        importData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

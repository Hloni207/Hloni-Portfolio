import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialPortfolioData } from '../data/initialData';

const PortfolioContext = createContext(null);

const DRAFT_STORAGE_KEY = 'hloni_portfolio_draft_v4';

export function PortfolioProvider({ children, initialData }) {
  const baseData = initialData || initialPortfolioData;
  const [data, setData] = useState(baseData);
  const [publishedData, setPublishedData] = useState(baseData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [lastPublished, setLastPublished] = useState(null);
  const [pendingMediaFiles, setPendingMediaFiles] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    async function init() {
      let currentPublished = baseData;

      // 1. Fetch public/data/portfolio.json to ensure latest live published state
      try {
        const res = await fetch(`/data/portfolio.json?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          currentPublished = {
            ...initialPortfolioData,
            ...json,
            profile: { ...initialPortfolioData.profile, ...(json.profile || {}) },
            projectsSection: { ...initialPortfolioData.projectsSection, ...(json.projectsSection || {}) },
            experienceSection: { ...initialPortfolioData.experienceSection, ...(json.experienceSection || {}) },
            aboutSection: { ...initialPortfolioData.aboutSection, ...(json.aboutSection || {}) },
            contactSection: { ...initialPortfolioData.contactSection, ...(json.contactSection || {}) },
            projects: Array.isArray(json.projects) ? json.projects : initialPortfolioData.projects,
            experiences: Array.isArray(json.experiences) ? json.experiences : initialPortfolioData.experiences,
            skills: Array.isArray(json.skills) ? json.skills : initialPortfolioData.skills,
            contactLinks: Array.isArray(json.contactLinks) ? json.contactLinks : initialPortfolioData.contactLinks,
          };
          setPublishedData(currentPublished);
        }
      } catch (err) {
        console.warn('Could not load live /data/portfolio.json:', err.message);
      }

      // 2. Only if in admin studio (/admin), check for local draft
      const isAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

      if (isAdminPage) {
        try {
          const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
          if (savedDraft) {
            const parsed = JSON.parse(savedDraft);
            const draftMerged = {
              ...currentPublished,
              ...parsed,
              profile: { ...currentPublished.profile, ...(parsed.profile || {}) },
              projectsSection: { ...currentPublished.projectsSection, ...(parsed.projectsSection || {}) },
              experienceSection: { ...currentPublished.experienceSection, ...(parsed.experienceSection || {}) },
              aboutSection: { ...currentPublished.aboutSection, ...(parsed.aboutSection || {}) },
              contactSection: { ...currentPublished.contactSection, ...(parsed.contactSection || {}) },
              projects: Array.isArray(parsed.projects) ? parsed.projects : currentPublished.projects,
              experiences: Array.isArray(parsed.experiences) ? parsed.experiences : currentPublished.experiences,
              skills: Array.isArray(parsed.skills) ? parsed.skills : currentPublished.skills,
              contactLinks: Array.isArray(parsed.contactLinks) ? parsed.contactLinks : currentPublished.contactLinks,
            };

            // Check if draft differs from published
            const differs = JSON.stringify(draftMerged) !== JSON.stringify(currentPublished);
            setData(draftMerged);
            setHasUnpublishedChanges(differs);
            setIsLoaded(true);
            return;
          }
        } catch (e) {
          console.warn('Draft load warning:', e);
        }
      }

      // Public site always uses verified published data
      setData(currentPublished);
      setIsLoaded(true);
    }

    init();
  }, []);

  // Save changes to working state & draft storage
  const saveDraft = (newData) => {
    setData(newData);
    setHasUnpublishedChanges(true);
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(newData));
    } catch (err) {
      console.warn('Error saving draft:', err);
    }
  };

  const addPendingMediaFile = (fileObj) => {
    setPendingMediaFiles((prev) => [...prev.filter((f) => f.name !== fileObj.name), fileObj]);
    setHasUnpublishedChanges(true);
  };

  const updateProfile = (profileUpdates) => {
    const updated = {
      ...data,
      profile: { ...data.profile, ...profileUpdates },
    };
    saveDraft(updated);
  };

  const updateAbout = (aboutUpdates) => {
    const updated = {
      ...data,
      aboutSection: { ...data.aboutSection, ...aboutUpdates },
    };
    saveDraft(updated);
  };

  const addProject = (project, mediaFile) => {
    const newProject = {
      ...project,
      id: `proj-${Date.now()}`,
      number: String((data.projects?.length || 0) + 1).padStart(2, '0'),
    };
    const updated = {
      ...data,
      projects: [newProject, ...(data.projects || [])],
    };
    if (mediaFile) addPendingMediaFile(mediaFile);
    saveDraft(updated);
  };

  const updateProject = (id, projectUpdates) => {
    const updated = {
      ...data,
      projects: (data.projects || []).map((p) => (p.id === id ? { ...p, ...projectUpdates } : p)),
    };
    saveDraft(updated);
  };

  const deleteProject = (id) => {
    const updated = {
      ...data,
      projects: (data.projects || []).filter((p) => p.id !== id),
    };
    saveDraft(updated);
  };

  const addExperience = (exp) => {
    const newExp = {
      ...exp,
      id: `exp-${Date.now()}`,
      number: String((data.experiences?.length || 0) + 1).padStart(2, '0'),
    };
    const updated = {
      ...data,
      experiences: [newExp, ...(data.experiences || [])],
    };
    saveDraft(updated);
  };

  const updateExperience = (id, expUpdates) => {
    const updated = {
      ...data,
      experiences: (data.experiences || []).map((e) => (e.id === id ? { ...e, ...expUpdates } : e)),
    };
    saveDraft(updated);
  };

  const deleteExperience = (id) => {
    const updated = {
      ...data,
      experiences: (data.experiences || []).filter((e) => e.id !== id),
    };
    saveDraft(updated);
  };

  const addSkill = (skill) => {
    const newSkill = {
      ...skill,
      id: `sk-${Date.now()}`,
    };
    const updated = {
      ...data,
      skills: [...(data.skills || []), newSkill],
    };
    saveDraft(updated);
  };

  const deleteSkill = (id) => {
    const updated = {
      ...data,
      skills: (data.skills || []).filter((s) => s.id !== id),
    };
    saveDraft(updated);
  };

  const addContactLink = (link) => {
    const newLink = {
      ...link,
      id: `cnt-${Date.now()}`,
    };
    const updated = {
      ...data,
      contactLinks: [...(data.contactLinks || []), newLink],
    };
    saveDraft(updated);
  };

  const updateContactLink = (id, linkUpdates) => {
    const updated = {
      ...data,
      contactLinks: (data.contactLinks || []).map((c) => (c.id === id ? { ...c, ...linkUpdates } : c)),
    };
    saveDraft(updated);
  };

  const deleteContactLink = (id) => {
    const updated = {
      ...data,
      contactLinks: (data.contactLinks || []).filter((c) => c.id !== id),
    };
    saveDraft(updated);
  };

  const updateResume = (resumeUrl, resumeFilename, mediaFile) => {
    const updated = {
      ...data,
      profile: {
        ...data.profile,
        resumeUrl,
        resumeFilename: resumeFilename || data.profile?.resumeFilename || 'resume.pdf',
      },
    };
    if (mediaFile) addPendingMediaFile(mediaFile);
    saveDraft(updated);
  };

  const revertDraftToPublished = () => {
    setData(publishedData);
    setHasUnpublishedChanges(false);
    setPendingMediaFiles([]);
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (e) {}
  };

  const resetToDefaults = () => {
    saveDraft(initialPortfolioData);
  };

  // Publish changes to GitHub via secure server endpoint
  const publishToGitHub = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch('/api/sync-to-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioData: data,
          mediaFiles: pendingMediaFiles,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || result.message || 'Failed to publish to GitHub');
      }

      setPublishedData(data);
      setHasUnpublishedChanges(false);
      setLastPublished(result.timestamp || new Date().toISOString());
      setPendingMediaFiles([]);

      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
      } catch (e) {}

      return { success: true, result };
    } catch (err) {
      console.error('Publishing error:', err);
      return { success: false, error: err.message };
    } finally {
      setIsPublishing(false);
    }
  };

  const exportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'portfolio-data.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importData = (importedJson) => {
    try {
      const parsed = typeof importedJson === 'string' ? JSON.parse(importedJson) : importedJson;
      saveDraft(parsed);
      return true;
    } catch (e) {
      console.error('Invalid JSON imported', e);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        publishedData,
        isLoaded,
        hasUnpublishedChanges,
        lastPublished,
        isPublishing,
        pendingMediaFiles,
        addPendingMediaFile,
        saveDraft,
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
        revertDraftToPublished,
        resetToDefaults,
        publishToGitHub,
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

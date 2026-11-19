import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialPortfolioData } from '../data/initialData';

const PortfolioContext = createContext(null);

const STORAGE_KEY = 'hloni_portfolio_data_v3';

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(initialPortfolioData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(prev => ({
          ...initialPortfolioData,
          ...parsed,
          profile: { ...initialPortfolioData.profile, ...(parsed.profile || {}) },
          projectsSection: { ...initialPortfolioData.projectsSection, ...(parsed.projectsSection || {}) },
          experienceSection: { ...initialPortfolioData.experienceSection, ...(parsed.experienceSection || {}) },
          aboutSection: { ...initialPortfolioData.aboutSection, ...(parsed.aboutSection || {}) },
          contactSection: { ...initialPortfolioData.contactSection, ...(parsed.contactSection || {}) },
          projects: parsed.projects !== undefined ? parsed.projects : initialPortfolioData.projects,
          experiences: parsed.experiences || initialPortfolioData.experiences,
          skills: parsed.skills || initialPortfolioData.skills,
          contactLinks: parsed.contactLinks || initialPortfolioData.contactLinks,
        }));
      }
    } catch (err) {
      console.error("Error loading portfolio data from localStorage", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveToStorage = (newData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (err) {
      console.error("Error saving to localStorage", err);
    }
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

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: `proj-${Date.now()}`,
      number: String(data.projects.length + 1).padStart(2, '0')
    };
    const updated = {
      ...data,
      projects: [newProject, ...data.projects]
    };
    saveToStorage(updated);
  };

  const updateProject = (id, projectUpdates) => {
    const updated = {
      ...data,
      projects: data.projects.map(p => p.id === id ? { ...p, ...projectUpdates } : p)
    };
    saveToStorage(updated);
  };

  const deleteProject = (id) => {
    const updated = {
      ...data,
      projects: data.projects.filter(p => p.id !== id)
    };
    saveToStorage(updated);
  };

  const addExperience = (exp) => {
    const newExp = {
      ...exp,
      id: `exp-${Date.now()}`,
      number: String(data.experiences.length + 1).padStart(2, '0')
    };
    const updated = {
      ...data,
      experiences: [newExp, ...data.experiences]
    };
    saveToStorage(updated);
  };

  const updateExperience = (id, expUpdates) => {
    const updated = {
      ...data,
      experiences: data.experiences.map(e => e.id === id ? { ...e, ...expUpdates } : e)
    };
    saveToStorage(updated);
  };

  const deleteExperience = (id) => {
    const updated = {
      ...data,
      experiences: data.experiences.filter(e => e.id !== id)
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
      contactLinks: [...data.contactLinks, newLink]
    };
    saveToStorage(updated);
  };

  const updateContactLink = (id, linkUpdates) => {
    const updated = {
      ...data,
      contactLinks: data.contactLinks.map(c => c.id === id ? { ...c, ...linkUpdates } : c)
    };
    saveToStorage(updated);
  };

  const deleteContactLink = (id) => {
    const updated = {
      ...data,
      contactLinks: data.contactLinks.filter(c => c.id !== id)
    };
    saveToStorage(updated);
  };

  const updateResume = (resumeUrl, resumeFilename) => {
    const updated = {
      ...data,
      profile: {
        ...data.profile,
        resumeUrl,
        resumeFilename: resumeFilename || data.profile.resumeFilename || 'resume.pdf'
      }
    };
    saveToStorage(updated);
  };

  const resetToDefaults = () => {
    saveToStorage(initialPortfolioData);
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

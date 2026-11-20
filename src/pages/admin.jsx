import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Plus, Trash2, Save, FileText, Upload, 
  ExternalLink, Eye, RefreshCw, Download, Sparkles, Briefcase, 
  Layers, User, Mail, CheckCircle2, Image as ImageIcon, ArrowUpRight,
  Pencil, X, GitBranch, CloudUpload, Loader2, Key, AlertCircle,
  Lock, LogOut, Check, Undo2
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export default function AdminPage() {
  const {
    data,
    publishedData,
    isLoaded,
    hasUnpublishedChanges,
    lastPublished,
    isPublishing,
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
    deleteContactLink,
    updateResume,
    revertDraftToPublished,
    resetToDefaults,
    publishToGitHub,
    exportData,
  } = usePortfolio();

  // Authentication states
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Navigation & feedback
  const [activeTab, setActiveTab] = useState('work'); // 'work', 'about', 'experience', 'skills', 'contact', 'resume', 'backup', 'github'
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Changes saved live!');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState(null); // { type: 'success' | 'error', message, commitUrl, commitSha }

  // Check auth status on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/status');
        const json = await res.json();
        setIsAuthenticated(Boolean(json.authenticated));
      } catch (e) {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setLoginError(result.message || 'Incorrect admin password.');
      }
    } catch (err) {
      setLoginError('Login request failed. Check server connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setIsAuthenticated(false);
  };

  const showNotification = (msg = 'Changes saved to draft!') => {
    setToastMessage(msg);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handlePublish = async () => {
    setPublishFeedback(null);
    showNotification('Publishing to GitHub repository...');
    const res = await publishToGitHub();
    if (res.success) {
      setPublishFeedback({
        type: 'success',
        message: res.result?.message || 'Published to GitHub main branch! Vercel is now deploying your changes live to all visitors.',
        commitUrl: res.result?.commitUrl,
        commitSha: res.result?.commitSha?.substring(0, 7),
      });
      showNotification('🚀 Successfully published to GitHub & Live Site!');
    } else {
      setPublishFeedback({
        type: 'error',
        message: res.error || 'Failed to publish to GitHub.',
      });
      showNotification('Publish failed. See details below.');
    }
  };

  // 1. Work Creation Form
  const [workForm, setWorkForm] = useState({
    name: '',
    date: '2026',
    description: '',
    image: '',
    imageFileName: '',
    tag: 'Robotics, Embedded C++, Sensor Fusion',
    url: 'https://github.com/Hloni207',
  });

  // Editing states for experiences & projects
  const [editingExpId, setEditingExpId] = useState(null);
  const [editExpForm, setEditExpForm] = useState({ name: '', position: '', description: '', date: '', image: '' });
  const [editingProjId, setEditingProjId] = useState(null);
  const [editProjForm, setEditProjForm] = useState({ title: '', date: '', description: '', image: '', tags: '', link: '' });

  // 2. About section form
  const [aboutForm, setAboutForm] = useState({
    p1: data.aboutSection?.paragraph1 || '',
    p2: data.aboutSection?.paragraph2 || '',
    p3: data.aboutSection?.paragraph3 || '',
    line1: data.aboutSection?.headingLines?.[0] || 'A Robotist man,',
    line2: data.aboutSection?.headingLines?.[1] || 'A productive mind,',
    line3: data.aboutSection?.headingLines?.[2] || 'An explorer',
    titleTag: data.profile?.titleTag || 'Welcome to my personal Portfolio',
    bio: data.profile?.bio || '',
    avatar: data.profile?.avatar || '/media/profileimage.jpg',
  });

  // Sync aboutForm when data updates
  useEffect(() => {
    if (data.aboutSection) {
      setAboutForm({
        p1: data.aboutSection.paragraph1 || '',
        p2: data.aboutSection.paragraph2 || '',
        p3: data.aboutSection.paragraph3 || '',
        line1: data.aboutSection.headingLines?.[0] || 'A Robotist man,',
        line2: data.aboutSection.headingLines?.[1] || 'A productive mind,',
        line3: data.aboutSection.headingLines?.[2] || 'An explorer',
        titleTag: data.profile?.titleTag || 'Welcome to my personal Portfolio',
        bio: data.profile?.bio || '',
        avatar: data.profile?.avatar || '/media/profileimage.jpg',
      });
    }
  }, [data]);

  // 3. Experience Form
  const [experienceForm, setExperienceForm] = useState({
    name: '',
    position: '',
    description: '',
    date: '2026',
    image: '',
  });

  // 4. Skill Form
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Robotics',
  });

  // 5. Contact Form
  const [contactForm, setContactForm] = useState({
    name: '',
    url: '',
    displayUrl: '',
    icon: 'globe',
    iconUrl: '',
  });

  // Image upload handler
  const handleImageUpload = async (e, targetForm) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();

    reader.onload = async (uploadEvent) => {
      try {
        const base64Data = uploadEvent.target.result;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            base64Data,
          }),
        });

        const result = await res.json();
        if (res.ok && result.success) {
          const finalUrl = result.url;
          const finalFileName = result.fileName || file.name;

          if (targetForm === 'work') {
            setWorkForm((prev) => ({
              ...prev,
              image: finalUrl,
              imageFileName: finalFileName,
            }));
          } else if (targetForm === 'avatar') {
            setAboutForm((prev) => ({ ...prev, avatar: finalUrl }));
            updateProfile({ avatar: finalUrl });
          } else if (targetForm === 'experience') {
            setExperienceForm((prev) => ({ ...prev, image: finalUrl }));
          }
          showNotification(`Image uploaded and saved! Click 'Publish' to make it live.`);
        } else {
          alert(`Image upload error: ${result.message || result.error || 'Failed to upload image.'}`);
        }
      } catch (err) {
        alert(`Upload error: ${err.message}`);
      } finally {
        setUploadingImage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // 1. Submit Work
  const handleAddWork = (e) => {
    e.preventDefault();
    if (!workForm.name.trim()) return alert('Project Name is required');

    addProject({
      title: workForm.name,
      date: workForm.date,
      description: workForm.description,
      image: workForm.image || '/media/profileimage.jpg',
      tags: workForm.tag,
      category: `0${(data.projects?.length || 0) + 1} / PROJECT`,
      link: workForm.url || 'https://github.com/Hloni207',
    });

    setWorkForm({
      name: '',
      date: '2026',
      description: '',
      image: '',
      imageFileName: '',
      tag: '',
      url: 'https://github.com/Hloni207',
    });

    showNotification('Project added to draft! Click "Publish to Live Site" to deploy.');
  };

  // 2. Submit About
  const handleSaveAbout = (e) => {
    e.preventDefault();
    updateAbout({
      paragraph1: aboutForm.p1,
      paragraph2: aboutForm.p2,
      paragraph3: aboutForm.p3,
      headingLines: [aboutForm.line1, aboutForm.line2, aboutForm.line3],
    });
    updateProfile({
      titleTag: aboutForm.titleTag,
      bio: aboutForm.bio,
      avatar: aboutForm.avatar,
    });
    showNotification('About story updated in draft! Click "Publish to Live Site" to deploy.');
  };

  // 3. Submit Experience
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!experienceForm.name.trim() || !experienceForm.position.trim()) {
      return alert('Company/Name and Position are required');
    }
    addExperience(experienceForm);
    setExperienceForm({
      name: '',
      position: '',
      description: '',
      date: '2026',
      image: '',
    });
    showNotification('Experience added to draft! Click "Publish to Live Site" to deploy.');
  };

  // Edit Experience handlers
  const startEditExperience = (exp) => {
    setEditingExpId(exp.id);
    setEditExpForm({
      name: exp.name || '',
      position: exp.position || '',
      description: exp.description || '',
      date: exp.date || '',
      image: exp.image || '',
    });
  };

  const handleSaveExperience = (id) => {
    if (!editExpForm.name.trim() || !editExpForm.position.trim()) {
      return alert('Company/Name and Position are required');
    }
    updateExperience(id, editExpForm);
    setEditingExpId(null);
    showNotification('Experience updated in draft!');
  };

  const cancelEditExperience = () => {
    setEditingExpId(null);
    setEditExpForm({ name: '', position: '', description: '', date: '', image: '' });
  };

  // Edit Project handlers
  const startEditProject = (proj) => {
    setEditingProjId(proj.id);
    setEditProjForm({
      title: proj.title || '',
      date: proj.date || '',
      description: proj.description || '',
      image: proj.image || '',
      tags: proj.tags || '',
      link: proj.link || '',
    });
  };

  const handleSaveProject = (id) => {
    if (!editProjForm.title.trim()) return alert('Project name is required');
    updateProject(id, editProjForm);
    setEditingProjId(null);
    showNotification('Project updated in draft!');
  };

  const cancelEditProject = () => {
    setEditingProjId(null);
    setEditProjForm({ title: '', date: '', description: '', image: '', tags: '', link: '' });
  };

  // 4. Submit Skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    addSkill(skillForm);
    setSkillForm({ name: '', category: 'Robotics' });
    showNotification('Skill added to draft!');
  };

  // 5. Submit Contact Link
  const handleAddContact = (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.url.trim()) return alert('Name and URL required');
    addContactLink(contactForm);
    setContactForm({
      name: '',
      url: '',
      displayUrl: '',
      icon: 'globe',
      iconUrl: '',
    });
    showNotification('Contact link added to draft!');
  };

  // Resume PDF upload
  const handleResumeFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') return alert('Please upload a PDF file.');

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      try {
        const base64Data = uploadEvent.target.result;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'resume.pdf',
            base64Data,
          }),
        });
        const result = await res.json();
        if (res.ok && result.success) {
          updateResume('/media/resume.pdf', 'resume.pdf');
          showNotification('Resume PDF uploaded and saved! Click "Publish to Live Site" to deploy.');
        } else {
          alert(`Resume upload error: ${result.message || result.error || 'Failed to upload PDF'}`);
        }
      } catch (err) {
        alert(`Resume upload error: ${err.message}`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Loading state while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-neutral-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Checking authorization...</span>
        </div>
      </div>
    );
  }

  // ─── LOGIN SCREEN (Server-side Authentication) ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F6F5F1] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-white">
        <header className="w-full pt-8 pb-6 px-6 md:px-12 lg:px-16 flex items-center justify-between border-b border-black/10">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold bg-white border border-black/10 hover:border-black px-4 py-2 rounded-full transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>View Live Site</span>
          </Link>
          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
            Hloni Studio Access
          </span>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-xl space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#111111]">
                Portfolio Studio
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500">
                Enter your admin password to manage projects, upload media, and publish to GitHub.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-neutral-800 text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Unlock Studio</span>
                )}
              </button>
            </form>

            <p className="text-[11px] text-center text-neutral-400">
              Protected by server-side session authentication.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ─── AUTHENTICATED DASHBOARD ───
  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-white">
      {/* Top Header matching main site aesthetic */}
      <header className="w-full pt-8 pb-6 px-6 md:px-12 lg:px-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold bg-white border border-black/10 hover:border-black px-4 py-2 rounded-full transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>View Live Site</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400 block">
                Admin / Studio
              </span>
              {hasUnpublishedChanges ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Unpublished Draft
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live & Synced
                </span>
              )}
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#111111]">
              Portfolio Editor
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-black/10 hover:border-black text-black px-4 py-2.5 rounded-full transition-all shadow-sm"
          >
            <span>Preview</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {hasUnpublishedChanges && (
            <button
              onClick={() => {
                if (confirm('Discard your local draft and revert to the published live version?')) {
                  revertDraftToPublished();
                  showNotification('Draft discarded. Reverted to live version.');
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-black/10 hover:border-black text-neutral-600 hover:text-black px-4 py-2.5 rounded-full transition-all shadow-sm"
              title="Discard draft and revert to live version"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Discard Draft</span>
            </button>
          )}

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-md active:scale-95 disabled:opacity-60 ${
              hasUnpublishedChanges
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400/50 animate-pulse'
                : 'bg-[#111111] hover:bg-neutral-800 text-white'
            }`}
            title="Publish all content live to GitHub (triggers Vercel deployment)"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing to GitHub...</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-3.5 h-3.5 text-white" />
                <span>Publish to Live Site</span>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 text-neutral-400 hover:text-red-600 rounded-full hover:bg-black/5 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Live Publishing Feedback Banner */}
      {publishFeedback && (
        <div className={`w-full px-6 md:px-12 lg:px-16 py-3.5 border-b text-xs sm:text-sm font-medium flex items-center justify-between gap-4 ${
          publishFeedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : 'bg-red-50 text-red-900 border-red-200'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {publishFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span className="truncate">{publishFeedback.message}</span>
            {publishFeedback.commitUrl && (
              <a
                href={publishFeedback.commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-emerald-700 hover:text-emerald-900 flex-shrink-0 inline-flex items-center gap-1"
              >
                <span>Commit {publishFeedback.commitSha}</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
          <button 
            onClick={() => setPublishFeedback(null)}
            className="p-1 rounded hover:bg-black/5 text-neutral-500 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-neutral-800 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-6 md:px-12 lg:px-16 py-10 flex-1">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-8 border-b border-black/10">
          {[
            { id: 'work', label: '01 / Work & Projects', icon: Layers },
            { id: 'about', label: '02 / About & Bio', icon: User },
            { id: 'experience', label: '03 / Experience', icon: Briefcase },
            { id: 'skills', label: '04 / Skills', icon: Sparkles },
            { id: 'contact', label: '05 / Contact Links', icon: Mail },
            { id: 'resume', label: '06 / Resume PDF', icon: FileText },
            { id: 'backup', label: '07 / Backup & Export', icon: Download },
            { id: 'github', label: '08 / Sync to GitHub 🚀', icon: GitBranch },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'bg-white/80 hover:bg-white text-neutral-600 hover:text-black border border-black/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: WORK & PROJECTS */}
        {activeTab === 'work' && (
          <div className="mt-10 space-y-12">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-sm space-y-8">
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400 block mb-1">
                  01 / Publish Work
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#111111]">
                  Add New Project
                </h2>
                <p className="text-sm text-neutral-500 mt-1 max-w-xl">
                  Uploaded project images are committed directly to your repository in <code className="bg-black/5 px-2 py-0.5 rounded text-neutral-800 font-mono text-xs">public/media</code> and served automatically across your website.
                </p>
              </div>

              <form onSubmit={handleAddWork} className="space-y-6">
                {/* 1. Name & 2. Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                      1. Name / Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CAMPUS SAFETY"
                      value={workForm.name}
                      onChange={(e) => setWorkForm({ ...workForm, name: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                      2. Date *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2026 — In development"
                      value={workForm.date}
                      onChange={(e) => setWorkForm({ ...workForm, date: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                {/* 3. Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                    3. Description *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide full details of what you engineered, algorithms, microcontrollers used, challenges, and results..."
                    value={workForm.description}
                    onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                    required
                  />
                </div>

                {/* 4. Image with Real-Time Preview */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                    4. Image *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <label className="flex items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-black/20 hover:border-black cursor-pointer bg-[#F6F5F1] transition-colors text-center">
                      <Upload className="w-5 h-5 text-neutral-500" />
                      <div className="text-left">
                        <span className="text-xs font-bold text-neutral-800 block">
                          {uploadingImage ? 'Uploading & saving...' : 'Upload Image File'}
                        </span>
                        <span className="text-[11px] text-neutral-400 block">
                          Commits file to public/media on GitHub
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'work')}
                        className="hidden"
                      />
                    </label>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Or type path: /media/project-image.jpg"
                        value={workForm.image}
                        onChange={(e) => setWorkForm({ ...workForm, image: e.target.value })}
                        className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-mono"
                      />

                      {/* Real Image Preview */}
                      {workForm.image && (
                        <div className="flex items-center gap-3 p-3 bg-[#F6F5F1] rounded-2xl border border-black/10">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-200 border border-black/10 flex-shrink-0">
                            <img
                              src={workForm.image}
                              alt="Uploaded Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/media/profileimage.jpg';
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-neutral-800 block truncate">
                              {workForm.imageFileName || workForm.image}
                            </span>
                            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" /> Image attached
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setWorkForm((prev) => ({ ...prev, image: '', imageFileName: '' }))}
                            className="p-1.5 text-neutral-400 hover:text-red-500 rounded-full hover:bg-white transition-colors"
                            title="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Tag & 6. URL link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                      5. Tag / Technologies *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mobile App, Careers, Robotics"
                      value={workForm.tag}
                      onChange={(e) => setWorkForm({ ...workForm, tag: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                      6. URL Link *
                    </label>
                    <input
                      type="text"
                      placeholder="https://github.com/Hloni207/..."
                      value={workForm.url}
                      onChange={(e) => setWorkForm({ ...workForm, url: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#111111] text-white hover:bg-neutral-800 px-8 py-4 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Project to Draft</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List of Published Works with Edit & Delete */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#111111]">
                    Portfolio Projects ({data.projects?.length || 0})
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Click the pencil to edit any project. Remember to click "Publish to Live Site" to deploy.
                  </p>
                </div>
              </div>

              {data.projects && data.projects.length > 0 ? (
                <div className="divide-y divide-black/5">
                  {data.projects.map((proj) => (
                    <div key={proj.id} className="py-5">
                      {editingProjId === proj.id ? (
                        /* ── Inline Edit Form ── */
                        <div className="bg-[#F6F5F1] rounded-2xl p-6 space-y-5 border border-black/10">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                              Editing: {proj.title}
                            </span>
                            <button
                              onClick={cancelEditProject}
                              className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-white transition-colors"
                              title="Cancel editing"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                                Name / Title *
                              </label>
                              <input
                                type="text"
                                value={editProjForm.title}
                                onChange={(e) => setEditProjForm({ ...editProjForm, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                                Date
                              </label>
                              <input
                                type="text"
                                value={editProjForm.date}
                                onChange={(e) => setEditProjForm({ ...editProjForm, date: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              value={editProjForm.description}
                              onChange={(e) => setEditProjForm({ ...editProjForm, description: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                                Image URL
                              </label>
                              <input
                                type="text"
                                value={editProjForm.image}
                                onChange={(e) => setEditProjForm({ ...editProjForm, image: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                                Tags / Technologies
                              </label>
                              <input
                                type="text"
                                value={editProjForm.tags}
                                onChange={(e) => setEditProjForm({ ...editProjForm, tags: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                              URL Link
                            </label>
                            <input
                              type="text"
                              value={editProjForm.link}
                              onChange={(e) => setEditProjForm({ ...editProjForm, link: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                              onClick={cancelEditProject}
                              className="px-5 py-2.5 rounded-full text-sm font-semibold text-neutral-600 bg-white border border-black/10 hover:bg-neutral-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveProject(proj.id)}
                              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-[#111111] text-white hover:bg-neutral-800 transition-all shadow-md"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Changes</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ── Display Row ── */
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-14 h-14 rounded-2xl bg-[#F6F5F1] overflow-hidden flex-shrink-0 border border-black/10">
                              <img
                                src={proj.image || '/media/profileimage.jpg'}
                                alt={proj.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/media/profileimage.jpg';
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-neutral-900 truncate">{proj.title}</h4>
                              <p className="text-xs text-neutral-500">{proj.date} • {proj.tags || proj.category}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {proj.link && (
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 text-neutral-500 hover:text-black rounded-full hover:bg-black/5 transition-colors"
                                title="Visit link"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => startEditProject(proj)}
                              className="p-2.5 text-neutral-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                              title="Edit project"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${proj.title}"?`)) {
                                  deleteProject(proj.id);
                                  showNotification('Project removed from draft!');
                                }
                              }}
                              className="p-2.5 text-neutral-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                              title="Delete project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-neutral-400 border border-dashed border-black/10 rounded-2xl">
                  No projects added yet. Use the form above to add your first work!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT & BIO */}
        {activeTab === 'about' && (
          <div className="mt-10 bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400 block mb-1">
                02 / Story & Bio
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#111111]">
                Edit About Section & Profile Photo
              </h2>
            </div>

            <form onSubmit={handleSaveAbout} className="space-y-6">
              {/* Profile Photo Settings */}
              <div className="p-6 rounded-2xl bg-[#F6F5F1] border border-black/10 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-neutral-200">
                  <img
                    src={aboutForm.avatar || '/media/profileimage.jpg'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/media/profileimage.jpg';
                    }}
                  />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                    Profile Photo (Displayed next to "Comming to Know Me")
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 bg-white text-black border border-black/20 hover:border-black text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-all shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload New Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'avatar')}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-neutral-400 font-mono">
                      Current: {aboutForm.avatar}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Headline Lines */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                  Headline Lines (Section 03)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={aboutForm.line1}
                    onChange={(e) => setAboutForm({ ...aboutForm, line1: e.target.value })}
                    className="px-4 py-3 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-semibold"
                  />
                  <input
                    type="text"
                    value={aboutForm.line2}
                    onChange={(e) => setAboutForm({ ...aboutForm, line2: e.target.value })}
                    className="px-4 py-3 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-semibold"
                  />
                  <input
                    type="text"
                    value={aboutForm.line3}
                    onChange={(e) => setAboutForm({ ...aboutForm, line3: e.target.value })}
                    className="px-4 py-3 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-semibold"
                  />
                </div>
              </div>

              {/* The 3 Paragraphs */}
              <div className="space-y-4 pt-4 border-t border-black/5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  The 3 Story Sentences / Paragraphs
                </label>

                <div>
                  <span className="text-xs text-neutral-500 mb-1 block">Paragraph 1 (Robotics & Programming Early Start)</span>
                  <textarea
                    rows={3}
                    value={aboutForm.p1}
                    onChange={(e) => setAboutForm({ ...aboutForm, p1: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <span className="text-xs text-neutral-500 mb-1 block">Paragraph 2 (Lumotech, Robo Rumble Soweto, W3node Cape Town)</span>
                  <textarea
                    rows={4}
                    value={aboutForm.p2}
                    onChange={(e) => setAboutForm({ ...aboutForm, p2: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <span className="text-xs text-neutral-500 mb-1 block">Paragraph 3 (Student & Builder Mindset)</span>
                  <textarea
                    rows={3}
                    value={aboutForm.p3}
                    onChange={(e) => setAboutForm({ ...aboutForm, p3: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                  />
                </div>
              </div>

              {/* Hero Bio */}
              <div className="pt-4 border-t border-black/5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Hero Intro Bio
                </label>
                <textarea
                  rows={2}
                  value={aboutForm.bio}
                  onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                  className="w-full px-5 py-3 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#111111] text-white hover:bg-neutral-800 px-8 py-4 rounded-full font-semibold text-sm transition-all shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save About Updates</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="mt-10 space-y-12">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-sm space-y-8">
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400 block mb-1">
                  03 / Professional Background
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#111111]">
                  Add Experience
                </h2>
              </div>

              <form onSubmit={handleAddExperience} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lumotech"
                      value={experienceForm.name}
                      onChange={(e) => setExperienceForm({ ...experienceForm, name: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                      Position / Role *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Shaddower, Maintanance Department Assistance"
                      value={experienceForm.position}
                      onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                      Date Range *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2026 — June"
                      value={experienceForm.date}
                      onChange={(e) => setExperienceForm({ ...experienceForm, date: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                      Image (saved in public/media)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <label className="flex items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-black/20 hover:border-black cursor-pointer bg-[#F6F5F1] transition-colors text-center">
                        <Upload className="w-5 h-5 text-neutral-500" />
                        <div className="text-left">
                          <span className="text-xs font-bold text-neutral-800 block">
                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                          </span>
                          <span className="text-[11px] text-neutral-400 block">
                            Commits to public/media
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'experience')}
                          className="hidden"
                        />
                      </label>

                      <div>
                        <input
                          type="text"
                          placeholder="Or type path: /media/image.jpg"
                          value={experienceForm.image}
                          onChange={(e) => setExperienceForm({ ...experienceForm, image: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-mono"
                        />
                        {experienceForm.image && (
                          <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1 font-medium">
                            <Check className="w-3 h-3" /> Image set: {experienceForm.image}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                    Full Description (Shown in details modal) *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your maintenance duties, technical machinery handled, troubleshooting..."
                    value={experienceForm.description}
                    onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#111111] text-white hover:bg-neutral-800 px-8 py-4 rounded-full font-semibold text-sm transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Experience to Draft</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Current Experiences with Edit & Delete */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#111111]">
                    Active Experiences ({data.experiences?.length || 0})
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Live experiences displayed in Section 02 (Background). Click the pencil to edit.
                  </p>
                </div>
              </div>

              {data.experiences && data.experiences.length > 0 ? (
                <div className="divide-y divide-black/5">
                  {(data.experiences || []).map((exp) => (
                    <div key={exp.id} className="py-5">
                      {editingExpId === exp.id ? (
                        /* ── Inline Edit Form ── */
                        <div className="bg-[#F6F5F1] rounded-2xl p-6 space-y-5 border border-black/10">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                              Editing: {exp.name}
                            </span>
                            <button
                              onClick={cancelEditExperience}
                              className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-white transition-colors"
                              title="Cancel editing"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                                Company / Name *
                              </label>
                              <input
                                type="text"
                                value={editExpForm.name}
                                onChange={(e) => setEditExpForm({ ...editExpForm, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                                Position / Role *
                              </label>
                              <input
                                type="text"
                                value={editExpForm.position}
                                onChange={(e) => setEditExpForm({ ...editExpForm, position: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                                Date Range
                              </label>
                              <input
                                type="text"
                                value={editExpForm.date}
                                onChange={(e) => setEditExpForm({ ...editExpForm, date: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                                Image URL
                              </label>
                              <input
                                type="text"
                                value={editExpForm.image}
                                onChange={(e) => setEditExpForm({ ...editExpForm, image: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              value={editExpForm.description}
                              onChange={(e) => setEditExpForm({ ...editExpForm, description: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                              onClick={cancelEditExperience}
                              className="px-5 py-2.5 rounded-full text-sm font-semibold text-neutral-600 bg-white border border-black/10 hover:bg-neutral-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveExperience(exp.id)}
                              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-[#111111] text-white hover:bg-neutral-800 transition-all shadow-md"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Changes</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ── Display Row ── */
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            {exp.image && (
                              <div className="w-12 h-12 rounded-xl bg-[#F6F5F1] overflow-hidden flex-shrink-0 border border-black/10">
                                <img
                                  src={exp.image}
                                  alt={exp.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <h4 className="font-bold text-neutral-900 truncate">{exp.name}</h4>
                              <p className="text-xs text-neutral-500">{exp.position} • {exp.date}</p>
                              {exp.description && (
                                <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-md">{exp.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => startEditExperience(exp)}
                              className="p-2.5 text-neutral-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                              title="Edit experience"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${exp.name}"?`)) {
                                  deleteExperience(exp.id);
                                  showNotification('Experience removed from draft!');
                                }
                              }}
                              className="p-2.5 text-neutral-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                              title="Delete experience"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-neutral-400 border border-dashed border-black/10 rounded-2xl">
                  No experiences added yet. Use the form above to add your first experience!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SKILLS */}
        {activeTab === 'skills' && (
          <div className="mt-10 space-y-12">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-sm space-y-8">
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400 block mb-1">
                  04 / Skills & Capabilities
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#111111]">
                  Manage Skills
                </h2>
              </div>

              <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="e.g. Robot Operating System (ROS2)"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                  required
                />
                <input
                  type="text"
                  placeholder="Category (Robotics, Software)"
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="sm:w-56 px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-neutral-800 px-7 py-3.5 rounded-full font-semibold text-sm transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#111111]">
                Active Skills ({data.skills?.length || 0})
              </h3>

              <div className="flex flex-wrap gap-3">
                {(data.skills || []).map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F5F1] border border-black/10 text-sm font-medium text-neutral-800"
                  >
                    <span>{skill.name}</span>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="text-neutral-400 hover:text-red-500 transition-colors ml-1"
                      title="Remove skill"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT LINKS */}
        {activeTab === 'contact' && (
          <div className="mt-10 space-y-12">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-sm space-y-8">
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400 block mb-1">
                  05 / Get In Touch
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#111111]">
                  Contact Channels
                </h2>
              </div>

              <form onSubmit={handleAddContact} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                      Channel Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Discord, Telegram"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                      Full URL *
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={contactForm.url}
                      onChange={(e) => setContactForm({ ...contactForm, url: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                      Display Handle / Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. discord.gg/hloni"
                      value={contactForm.displayUrl}
                      onChange={(e) => setContactForm({ ...contactForm, displayUrl: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                      Icon Image / SVG URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://cdn.simpleicons.org/..."
                      value={contactForm.iconUrl}
                      onChange={(e) => setContactForm({ ...contactForm, iconUrl: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#F6F5F1] border border-black/10 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#111111] text-white hover:bg-neutral-800 px-8 py-4 rounded-full font-semibold text-sm transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Channel to Draft</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Current Contact Links */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#111111]">
                Active Contact Channels ({data.contactLinks?.length || 0})
              </h3>

              <div className="space-y-4">
                {(data.contactLinks || []).map((link) => (
                  <div key={link.id} className="p-4 rounded-2xl bg-[#F6F5F1] border border-black/10 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-neutral-900">{link.name}</h4>
                      <p className="text-xs text-neutral-500 font-mono truncate">{link.url}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-neutral-500 hover:text-black rounded-full hover:bg-black/5 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => deleteContactLink(link.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete channel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: RESUME PDF */}
        {activeTab === 'resume' && (
          <div className="mt-10 bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400 block mb-1">
                06 / Documents
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#111111]">
                Resume PDF Manager
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Your full resume is stored at <code className="bg-black/5 px-2 py-0.5 rounded font-mono text-neutral-800">public/media/resume.pdf</code> and served live across all devices.
              </p>
            </div>

            {/* Current Resume Info Card */}
            <div className="p-6 rounded-2xl bg-[#F6F5F1] border border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">
                    {data.profile?.resumeFilename || 'resume.pdf'}
                  </h4>
                  <p className="text-xs text-neutral-500 font-mono">
                    Active & ready for download on live site
                  </p>
                </div>
              </div>

              <a
                href={data.profile?.resumeUrl || '/media/resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#111111] text-white hover:bg-neutral-800 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm"
              >
                <Eye className="w-4 h-4" />
                <span>View / Download Current</span>
              </a>
            </div>

            {/* Upload New Resume */}
            <div className="pt-4 border-t border-black/5 space-y-4">
              <label className="block w-full border-2 border-dashed border-black/20 hover:border-black rounded-3xl p-10 text-center cursor-pointer transition-colors bg-[#F6F5F1]">
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <span className="text-sm font-bold text-neutral-800 block">
                  Click to Upload or Replace Resume (PDF)
                </span>
                <span className="text-xs text-neutral-400 block mt-1">
                  Commits directly to public/media/resume.pdf on GitHub
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 7: BACKUP & EXPORT */}
        {activeTab === 'backup' && (
          <div className="mt-10 bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400 block mb-1">
                07 / Version Control & Reset
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#111111]">
                Export & Data Management
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#F6F5F1] border border-black/10 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-neutral-900 mb-1">
                    Download Portfolio Data (JSON)
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Export all your projects, experiences, and content as a single JSON file.
                  </p>
                </div>
                <button
                  onClick={exportData}
                  className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white hover:bg-neutral-800 px-6 py-3.5 rounded-full font-semibold text-sm transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download portfolio-data.json</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-red-900 mb-1">
                    Restore Defaults
                  </h3>
                  <p className="text-xs text-red-600/80 leading-relaxed">
                    Reset portfolio content back to initial setup.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Reset to initial defaults?')) {
                      resetToDefaults();
                      showNotification('Defaults restored');
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-full font-semibold text-sm transition-all shadow-md"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Restore Initial Defaults</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SYNC TO GITHUB & LIVE SITE */}
        {activeTab === 'github' && (
          <div className="mt-10 bg-white rounded-3xl p-8 md:p-10 border border-black/10 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400 block mb-1">
                08 / Production Deployment
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#111111]">
                Sync to GitHub & Live Site
              </h2>
              <p className="text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                When you make edits, add projects, or upload a resume in this admin panel, click <strong>Publish to Live Site</strong> to commit all changes directly to your GitHub repository (<code>Hloni207/Hloni-Portfolio</code>). Vercel then automatically rebuilds and deploys them to <code>hloni.vercel.app</code> so every visitor on any phone or computer sees them!
              </p>
            </div>

            {/* Big Action Card */}
            <div className="p-8 rounded-3xl bg-[#0F1010] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Repository: Hloni207/Hloni-Portfolio • Branch: main
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Publish All Content Live
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-lg">
                  Applies projects ({data.projects?.length || 0}), experiences ({data.experiences?.length || 0}), skills, resume PDF, and images to GitHub main branch.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {hasUnpublishedChanges && (
                  <button
                    onClick={() => {
                      if (confirm('Discard your local draft and revert to the live published version?')) {
                        revertDraftToPublished();
                        showNotification('Draft discarded.');
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-4 rounded-full text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                  >
                    Discard Draft
                  </button>
                )}

                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-neutral-200 px-8 py-4 rounded-full font-bold text-sm sm:text-base transition-all shadow-lg active:scale-95 disabled:opacity-50 flex-shrink-0"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-black" />
                      <span>Publishing to GitHub...</span>
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-5 h-5 text-emerald-600" />
                      <span>Publish Changes to Live Site</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Vercel Environment Setup Instructions Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-[#F6F5F1] border border-black/10 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Key className="w-5 h-5 text-neutral-700" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900">
                    Vercel Environment Setup Guide
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Publishing from Vercel is powered securely on the server using environment variables. Your GitHub token is never exposed to visitors or client browsers.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-black/10 space-y-3 text-xs text-neutral-700">
                <p className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                  Required Vercel Environment Variables:
                </p>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded-lg bg-black/5 flex items-center justify-between">
                    <span><strong>GITHUB_TOKEN</strong> = ghp_yourPersonalAccessTokenHere</span>
                    <span className="text-[10px] text-neutral-400 font-sans">Contents: Read and Write</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/5 flex items-center justify-between">
                    <span><strong>GITHUB_OWNER</strong> = Hloni207</span>
                    <span className="text-[10px] text-neutral-400 font-sans">Optional (defaults to Hloni207)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/5 flex items-center justify-between">
                    <span><strong>GITHUB_REPO</strong> = Hloni-Portfolio</span>
                    <span className="text-[10px] text-neutral-400 font-sans">Optional (defaults to Hloni-Portfolio)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/5 flex items-center justify-between">
                    <span><strong>ADMIN_PASSWORD</strong> = yourSecretPassword</span>
                    <span className="text-[10px] text-neutral-400 font-sans">Defaults to hloni2026</span>
                  </div>
                </div>

                <div className="pt-2 text-neutral-600 space-y-1.5 text-xs">
                  <p className="font-semibold text-neutral-900">How to add in Vercel:</p>
                  <ol className="list-decimal list-inside space-y-1 pl-1">
                    <li>Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-black">vercel.com/dashboard</a> and select your project.</li>
                    <li>Click <strong>Settings</strong> → <strong>Environment Variables</strong>.</li>
                    <li>Add <strong>GITHUB_TOKEN</strong> with your GitHub token value.</li>
                    <li>Redeploy or make a commit, and live publishing from any device will work seamlessly!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

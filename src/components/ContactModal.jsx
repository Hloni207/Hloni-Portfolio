import React, { useState, useEffect } from 'react';
import { X, Check, Copy, ExternalLink, Mail, MessageCircle, Globe } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

// Clean SVG components for brand icons
function GithubIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-5 h-5 text-[#0A66C2]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );
}

function WhatsappIcon({ className = "w-5 h-5 text-[#25D366]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
    </svg>
  );
}

export default function ContactModal({ isOpen, onClose }) {
  const { data } = usePortfolio();
  const { contactLinks = [] } = data;
  const [copiedId, setCopiedId] = useState(null);

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

  if (!isOpen) return null;

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderIcon = (link) => {
    if (link.iconUrl) {
      return (
        <img
          src={link.iconUrl}
          alt={link.name}
          className="w-5 h-5 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }

    const name = (link.name || '').toLowerCase();
    const icon = (link.icon || '').toLowerCase();

    if (name.includes('github') || icon.includes('github')) {
      return <GithubIcon className="w-5 h-5 text-black" />;
    }
    if (name.includes('linkedin') || icon.includes('linkedin')) {
      return <LinkedinIcon className="w-5 h-5" />;
    }
    if (name.includes('whats') || icon.includes('message') || icon.includes('whatsapp')) {
      return <WhatsappIcon className="w-5 h-5" />;
    }
    if (name.includes('mail') || icon.includes('mail') || link.url.startsWith('mailto:')) {
      return <Mail className="w-5 h-5 text-red-500" />;
    }

    return <Globe className="w-5 h-5 text-neutral-600" />;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#F7F5F0] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-black/10 text-[#111111] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag bar */}
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/5 hover:bg-black hover:text-white flex items-center justify-center text-neutral-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5 sm:mb-6 pr-6">
          <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-neutral-500 block mb-1">
            Connect & Collaborate
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Get in touch
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Click any option below to open or copy the direct link.
          </p>
        </div>

        {/* Links List: github.com, linkedin.com, whats.me, email as requested */}
        <div className="space-y-3">
          {contactLinks.map((link) => (
            <div
              key={link.id}
              className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-black/10 hover:border-black/30 shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#F7F5F0] flex items-center justify-center flex-shrink-0 border border-black/5">
                  {renderIcon(link)}
                </div>
                <div className="min-w-0 pr-2">
                  <h3 className="text-sm font-bold text-neutral-900 truncate">
                    {link.name}
                  </h3>
                  <p className="text-xs text-neutral-500 truncate font-mono">
                    {link.displayUrl || link.url.replace(/^mailto:/, '').replace(/^https?:\/\//, '')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(link.id, link.url.replace(/^mailto:/, ''))}
                  className="p-2.5 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                  title="Copy link"
                >
                  {copiedId === link.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors inline-flex items-center justify-center"
                  title={`Open ${link.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between text-xs text-neutral-500">
          <span>Looking forward to connecting with you.</span>
          <button
            onClick={onClose}
            className="font-semibold text-black hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

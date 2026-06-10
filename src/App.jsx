import React, { useState, useEffect } from 'react';
import Auth from './pages/Auth';
import Todo from './pages/Todo';
import TaskAssignment from './pages/TaskAssignment';
import ProgressTracking from './pages/ProgressTracking';
import MeetingNotes from './pages/MeetingNotes';
import { authService } from './services/db';
import { Avatar } from './components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import AccountSettingsModal from './components/AccountSettingsModal';

// ─── SVG icons (inline, matching Claude Orange theme) ──────────────────────
const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" fill="var(--color-primary)" />
    <circle cx="12" cy="4" r="2" fill="var(--color-primary)" opacity="0.7" />
    <circle cx="12" cy="20" r="2" fill="var(--color-primary)" opacity="0.7" />
    <circle cx="4" cy="8" r="2" fill="var(--color-primary)" opacity="0.5" />
    <circle cx="20" cy="8" r="2" fill="var(--color-primary)" opacity="0.5" />
    <circle cx="4" cy="16" r="2" fill="var(--color-primary)" opacity="0.5" />
    <circle cx="20" cy="16" r="2" fill="var(--color-primary)" opacity="0.5" />
    <line x1="12" y1="9" x2="12" y2="6" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" />
    <line x1="12" y1="18" x2="12" y2="15" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" />
    <line x1="9.5" y1="10.5" x2="6" y2="9" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" />
    <line x1="14.5" y1="10.5" x2="18" y2="9" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" />
    <line x1="9.5" y1="13.5" x2="6" y2="15" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" />
    <line x1="14.5" y1="13.5" x2="18" y2="15" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// Pages list
const PAGES = [
  { key: 'todo', label: 'To Do List', component: Todo },
  { key: 'tasks', label: 'Task Assignment', component: TaskAssignment },
  { key: 'progress', label: 'Progress Tracking', component: ProgressTracking },
  { key: 'meetings', label: 'Meeting Notes', component: MeetingNotes }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeDept, setActiveDept] = useState('mobile');
  const [activePage, setActivePage] = useState('todo');
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };
  
  // Theme state: defaults to system preference or saved value
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('erp_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('erp_theme', theme);
  }, [theme]);

  // Authenticate user on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setActiveDept(user.department || 'mobile');
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    const unsubscribe = authService.onAuthStateChange((user) => {
      if (user) {
        setCurrentUser(user);
        setActiveDept(user.department || 'mobile');
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      setShowProfileMenu(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveDept(user.department || 'mobile');
    setActivePage('todo');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="text-center flex flex-col items-center gap-3">
          <svg className="animate-spin text-primary" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M4 12a8 8 0 0 1 8-8" />
          </svg>
          <span className="type-label-lg text-on-surface-variant">Initialising ERP System...</span>
        </div>
      </div>
    );
  }

  // Redirect to Auth if unauthenticated
  if (!currentUser) {
    return <Auth onAuthSuccess={handleLoginSuccess} />;
  }

  // Locate active page component
  const currentPageObj = PAGES.find((p) => p.key === activePage) || PAGES[0];
  const PageComponent = currentPageObj.component;

  return (
    <div className="min-h-screen bg-background text-on-surface transition-colors duration-300">
      {/* ── Level 1: Top bar with Brand, Department Switcher, User Menu ── */}
      <header className="sticky top-0 z-20 bg-surface border-b border-outline-variant shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <LogoIcon />
            <div className="hidden sm:block">
              <span className="type-headline-sm text-on-surface tracking-tight font-bold">Juan ERP</span>
              <span className="ml-1 text-[11px] uppercase bg-primary-fixed text-primary px-1.5 py-0.5 rounded font-bold">PROD</span>
            </div>
          </div>

          {/* Department Switcher */}
          <div className="neu-inset-sm flex p-1 gap-1 items-center shrink-0 relative">
            <button
              onClick={() => setActiveDept('iot')}
              className={`relative z-10 px-4 py-1.5 rounded-lg type-label-md transition-colors ${
                activeDept === 'iot'
                  ? 'text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low/50'
              }`}
            >
              {activeDept === 'iot' && (
                <motion.div
                  layoutId="activeDept"
                  className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              IoT Department
            </button>
            <button
              onClick={() => setActiveDept('mobile')}
              className={`relative z-10 px-4 py-1.5 rounded-lg type-label-md transition-colors ${
                activeDept === 'mobile'
                  ? 'text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low/50'
              }`}
            >
              {activeDept === 'mobile' && (
                <motion.div
                  layoutId="activeDept"
                  className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Mobile Department
            </button>
          </div>

          {/* Right Actions: Theme Toggle + User Menu */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-xl hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-all border border-transparent hover:border-outline-variant"
              aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" fill="currentColor" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant"
                aria-expanded={showProfileMenu}
                aria-label="User Menu"
              >
                <Avatar name={currentUser.name} src={currentUser.avatar_url} size="sm" />
                <span className="type-label-lg text-on-surface hidden md:block">
                  {currentUser.name || 'User'}
                </span>
                <svg className={`text-on-surface-variant transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-lg border border-outline-variant py-2 z-30 origin-top-right"
                  >
                    <div className="px-4 py-2 border-b border-outline-variant/40">
                      <p className="type-label-lg text-on-surface font-semibold truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] bg-secondary-container text-on-surface px-2 py-0.5 rounded font-mono uppercase">
                        {currentUser.role || 'Member'}
                      </span>
                    </div>
                    
                    <div className="py-1">
                      <div className="px-4 py-1.5 flex items-center gap-2 type-label-md text-on-surface-variant">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Sync Active</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowSettingsModal(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-surface-container-low text-on-surface transition-colors flex items-center gap-2 type-label-md border-t border-outline-variant/40"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83 2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500 transition-colors flex items-center gap-2 type-label-md border-t border-outline-variant/40"
                    >
                      <LogoutIcon />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ── Level 2: Sub-nav Page selection (To Do, Tasks, Progress, Meetings) ── */}
      <div className="sticky top-16 z-10 bg-surface border-b border-outline-variant shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 px-6 h-12 overflow-x-auto scrollbar-none relative">
          {PAGES.map((p) => {
            const isActive = activePage === p.key;
            return (
              <button
                key={p.key}
                onClick={() => {
                  setActivePage(p.key);
                  setShowProfileMenu(false);
                }}
                className={`relative z-10 px-4 py-1.5 rounded-lg type-label-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePageTab"
                    className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Workspace Page Component Content ── */}
      <AnimatePresence mode="wait">
        <motion.main
          key={`${activePage}-${activeDept}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="pb-12"
        >
          <PageComponent department={activeDept} />
        </motion.main>
      </AnimatePresence>

      {/* ── Account Settings Modal Overlay ── */}
      <AnimatePresence>
        {showSettingsModal && (
          <AccountSettingsModal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            currentUser={currentUser}
            onUpdate={handleUserUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

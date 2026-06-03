import React, { useState } from 'react';
import IoTWorkspace from './pages/IoTWorkspace';
import TaskAssignment from './pages/TaskAssignment';
import MobileTodo from './pages/MobileTodo';
import MeetingNotes from './pages/MeetingNotes';

// ─── Navigation structure ────────────────────────────────────────────────
// Two-level nav: Section tabs (top bar) → Page tabs (sub-bar).
const SECTIONS = [
  {
    key: 'iot',
    label: 'IoT Workspace',
    pages: [
      { key: 'iot-progress', label: 'Progress Tracking', component: IoTWorkspace },
    ],
  },
  {
    key: 'mobile',
    label: 'Mobile Workspace',
    pages: [
      { key: 'mobile-todo', label: 'To Do List', component: MobileTodo },
      { key: 'mobile-tasks', label: 'Task Assignment', component: TaskAssignment },
      { key: 'mobile-meetings', label: 'Meeting Notes', component: MeetingNotes },
    ],
  },
];

// ─── SVG icons (inline, no external deps) ────────────────────────────────
const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" fill="#4A90E2" />
    <circle cx="12" cy="4" r="2" fill="#4A90E2" opacity="0.7" />
    <circle cx="12" cy="20" r="2" fill="#4A90E2" opacity="0.7" />
    <circle cx="4" cy="8" r="2" fill="#4A90E2" opacity="0.5" />
    <circle cx="20" cy="8" r="2" fill="#4A90E2" opacity="0.5" />
    <circle cx="4" cy="16" r="2" fill="#4A90E2" opacity="0.5" />
    <circle cx="20" cy="16" r="2" fill="#4A90E2" opacity="0.5" />
    <line x1="12" y1="9" x2="12" y2="6" stroke="#4A90E2" strokeWidth="1.5" opacity="0.5" />
    <line x1="12" y1="18" x2="12" y2="15" stroke="#4A90E2" strokeWidth="1.5" opacity="0.5" />
    <line x1="9.5" y1="10.5" x2="6" y2="9" stroke="#4A90E2" strokeWidth="1.5" opacity="0.5" />
    <line x1="14.5" y1="10.5" x2="18" y2="9" stroke="#4A90E2" strokeWidth="1.5" opacity="0.5" />
    <line x1="9.5" y1="13.5" x2="6" y2="15" stroke="#4A90E2" strokeWidth="1.5" opacity="0.5" />
    <line x1="14.5" y1="13.5" x2="18" y2="15" stroke="#4A90E2" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

const GearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState('mobile');
  const [activePage, setActivePage] = useState('mobile-todo');

  const currentSection = SECTIONS.find((s) => s.key === activeSection) || SECTIONS[0];
  const currentPage = currentSection.pages.find((p) => p.key === activePage) || currentSection.pages[0];
  const ActivePage = currentPage.component;

  const handleSectionChange = (key) => {
    setActiveSection(key);
    const section = SECTIONS.find((s) => s.key === key);
    if (section?.pages.length) setActivePage(section.pages[0].key);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      {/* ── Level 1: Top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white border-b border-[#dce9ff]">
        <div className="flex items-center justify-between h-14 px-6">
          {/* Left: Logo + brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <LogoIcon />
            <span className="type-headline-sm text-[#0b1c30] tracking-tight">SoftGrid Team ERP</span>
          </div>

          {/* Center: Section tabs */}
          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => handleSectionChange(s.key)}
                className="relative px-4 py-2 type-label-lg text-[#414751] hover:text-[#0b1c30] transition-colors"
              >
                {s.label}
                {activeSection === s.key && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#4A90E2] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="p-2 rounded-full text-[#414751] hover:bg-[#e5eeff] transition-colors" aria-label="Settings">
              <GearIcon />
            </button>
            <button className="p-2 rounded-full text-[#414751] hover:bg-[#e5eeff] transition-colors" aria-label="Account">
              <UserIcon />
            </button>
          </div>
        </div>
      </header>

      {/* ── Level 2: Sub-nav (page tabs) ──────────────────────────────── */}
      <div className="sticky top-14 z-10 bg-white border-b border-[#dce9ff]">
        <div className="flex items-center gap-1 px-6 h-11">
          {currentSection.pages.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePage(p.key)}
              className={`px-4 py-1.5 rounded-lg type-label-lg transition-colors ${
                activePage === p.key
                  ? 'bg-[#4A90E2] text-white'
                  : 'text-[#414751] hover:bg-[#e5eeff]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Page content ──────────────────────────────────────────────── */}
      <ActivePage />
    </div>
  );
}

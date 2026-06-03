import React, { useState } from 'react';
import { Card, Button, Chip, Avatar, Input, ProgressBar, ProgressRing } from '../components/ui';

// ─── Sample data ─────────────────────────────────────────────────────────
const allTasks = [
  {
    id: 'M-301',
    title: 'Audit Field Equipment',
    desc: 'Conduct quarterly audit of all sensors in Sector 4G. Ensure firmware is updated to v2.4.',
    time: 'Today, 2:00 PM',
    location: 'Sector 4G',
    priority: 'High',
    status: 'active',
  },
  {
    id: 'M-302',
    title: 'Review Mobile Sync Logs',
    desc: 'Check logs for offline sync errors reported by field team Alpha yesterday.',
    time: 'Today, 4:00 PM',
    location: 'Mobile Dashboard',
    priority: 'Medium',
    status: 'overdue',
    overdueText: 'Overdue by 1 day',
  },
  {
    id: 'M-303',
    title: 'Deploy Mobile App Update',
    desc: 'Push v1.2 to staging environment for QA testing.',
    time: 'Yesterday',
    location: 'Staging',
    priority: 'Low',
    status: 'completed',
    completedText: 'Completed Yesterday',
  },
];

const deadlines = [
  { label: 'Audit Field Eq.', time: '2:00 PM', badge: 'Tdy', badgeBg: '#e5eeff' },
  { label: 'Team Sync', time: '10:00 AM', badge: 'Tmr', badgeBg: '#d3e4fe' },
];

const filters = ['All Tasks', 'High Priority', 'Completed'];

// ─── Page: Mobile Workspace → To Do List ─────────────────────────────────
export default function MobileTodo() {
  const [activeFilter, setActiveFilter] = useState('All Tasks');
  const [checked, setChecked] = useState({});

  const filtered = allTasks.filter((t) => {
    if (activeFilter === 'High Priority') return t.priority === 'High';
    if (activeFilter === 'Completed') return t.status === 'completed';
    return true;
  });

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-6">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="type-headline-lg text-[#0b1c30]">To Do List</h1>
          <p className="type-body-md text-[#414751] mt-1">Manage and track your mobile workforce tasks.</p>
        </div>
        <div className="neu-inset-sm flex items-center gap-2 px-4 py-2 min-w-[280px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search tasks..."
            className="flex-1 bg-transparent border-0 outline-none text-[14px] text-[#0b1c30] placeholder:text-[#64748b]"
          />
        </div>
      </div>

      {/* ── Two-column layout ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* ── Left: Task list ───────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Filter bar */}
          <Card variant="extruded-sm" padding="px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-1.5 rounded-lg type-label-lg transition-colors ${
                      activeFilter === f
                        ? 'bg-[#4A90E2] text-white'
                        : 'text-[#414751] hover:bg-[#e5eeff]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-[#414751] hover:bg-[#e5eeff]" aria-label="Sort">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
                </button>
                <button className="p-2 rounded-lg text-[#414751] hover:bg-[#e5eeff]" aria-label="Filter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                </button>
              </div>
            </div>
          </Card>

          {/* Task cards */}
          <div className="space-y-4">
            {filtered.map((t) => {
              const isChecked = checked[t.id] || t.status === 'completed';
              return (
                <Card key={t.id} variant="extruded" padding="p-5">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggle(t.id)}
                      aria-label={isChecked ? 'Mark incomplete' : 'Mark complete'}
                      className={`mt-1 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        isChecked ? 'bg-[#4A90E2] border-[#4A90E2]' : 'border-[#c1c7d3]'
                      }`}
                    >
                      {isChecked && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className={`type-label-lg leading-snug ${isChecked ? 'line-through text-[#717783]' : 'text-[#0b1c30]'}`}>
                          {t.title}
                        </h4>
                        <Chip size="sm" variant={t.priority === 'High' ? 'error' : t.priority === 'Medium' ? 'in-progress' : 'neutral'}>
                          {t.priority}
                        </Chip>
                      </div>
                      <p className={`type-body-md mt-1 ${isChecked ? 'line-through text-[#717783]' : 'text-[#414751]'}`}>
                        {t.desc}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="type-label-md text-[#414751] flex items-center gap-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                          {t.time}
                        </span>
                        <span className="type-label-md text-[#414751] flex items-center gap-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {t.location}
                        </span>
                        {t.overdueText && (
                          <span className="type-label-md text-[#ba1a1a] flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            {t.overdueText}
                          </span>
                        )}
                        {t.completedText && isChecked && (
                          <span className="type-label-md text-[#414751] flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            {t.completedText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Load more */}
          <div className="text-center">
            <button className="type-label-lg text-[#4A90E2] hover:underline">
              Load More Tasks ↓
            </button>
          </div>
        </div>

        {/* ── Right sidebar ─────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Sprint Progress */}
          <Card padding="p-6">
            <div className="flex items-center gap-2 mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.8 1 6.5 2.5"/>
                <path d="M21 3v6h-6"/>
              </svg>
              <h3 className="type-headline-sm text-[#0b1c30]">Sprint Progress</h3>
            </div>
            <div className="flex justify-center mb-6">
              <ProgressRing value={65} size={140} stroke={12} variant="primary" label="65%" sublabel="Done" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card variant="extruded-sm" padding="p-3 text-center">
                <div className="type-headline-md text-[#0b1c30]">24</div>
                <div className="type-label-md text-[#414751]">Total Tasks</div>
              </Card>
              <Card variant="extruded-sm" padding="p-3 text-center">
                <div className="type-headline-md text-[#0b1c30]">16</div>
                <div className="type-label-md text-[#414751]">Completed</div>
              </Card>
            </div>
            <Card variant="extruded-sm" padding="p-3 mt-3 text-center">
              <div className="type-headline-md text-[#ba1a1a]">8</div>
              <div className="type-label-md text-[#414751]">Pending Action</div>
            </Card>
          </Card>

          {/* Upcoming Deadlines */}
          <Card padding="p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
              </svg>
              <h3 className="type-headline-sm text-[#0b1c30]">Upcoming Deadlines</h3>
            </div>
            <div className="space-y-3">
              {deadlines.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f0f2f5] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center type-label-md font-semibold" style={{ background: d.badgeBg, color: '#4A90E2' }}>
                      {d.badge}
                    </div>
                    <div>
                      <p className="type-label-lg text-[#0b1c30]">{d.label}</p>
                      <p className="type-label-md text-[#414751]">{d.time}</p>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717783" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

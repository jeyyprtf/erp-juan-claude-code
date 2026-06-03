import React, { useState } from 'react';
import { Card, Button, Chip, Avatar, Input, SectionHeader } from '../components/ui';

// ==== Sample data ====
const attendees = [
  { name: 'Mira', role: 'Ops Lead' },
  { name: 'Dewi', role: 'Logistics' },
  { name: 'Rio', role: 'Finance' },
  { name: 'Arif', role: 'Engineer' },
  { name: 'Sari', role: 'Procurement' },
];

const agenda = [
  { id: 'a1', title: 'Plant A — line press downtime review', duration: '10 min' },
  { id: 'a2', title: 'Q2 budget check-in', duration: '15 min' },
  { id: 'a3', title: 'New shift roster proposal', duration: '15 min' },
  { id: 'a4', title: 'Vendor escalation (PT. Sinar)', duration: '10 min' },
  { id: 'a5', title: 'Open table', duration: '10 min' },
];

const initialNotes = [
  {
    id: 'n1',
    type: 'decision',
    text: 'Approve the second-shift rotation. Mira to publish the roster by EOD Friday.',
    author: 'Mira',
    time: '10:12',
  },
  {
    id: 'n2',
    type: 'action',
    text: 'Rio to reconcile March utility invoices and share variance report.',
    author: 'Rio',
    time: '10:18',
  },
  {
    id: 'n3',
    type: 'note',
    text: 'Boiler output trending 5% below target — calibration ticket already open (#4419).',
    author: 'Arif',
    time: '10:24',
  },
];

const previous = [
  { date: 'Tue, 27 May', title: 'Weekly Ops Sync', count: 7 },
  { date: 'Tue, 20 May', title: 'Weekly Ops Sync', count: 5 },
  { date: 'Tue, 13 May', title: 'Weekly Ops Sync', count: 9 },
];

// ==== Page: Meeting Notes (No Sidebar) ====
export default function MeetingNotes() {
  const [notes, setNotes] = useState(initialNotes);
  const [draft, setDraft] = useState('');
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'agenda' | 'summary'

  const addNote = (e) => {
    e?.preventDefault();
    if (!draft.trim()) return;
    setNotes((xs) => [
      ...xs,
      { id: `n-${Date.now()}`, type: 'note', text: draft.trim(), author: 'Mira', time: 'Now' },
    ]);
    setDraft('');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="type-headline-lg text-[#0b1c30]">Weekly Ops Sync</h1>
          <p className="type-body-md text-[#414751] mt-1">Tue, 03 Jun 2026 · 10:00 – 11:00 · Conf Room A</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="neu-inset-sm flex items-center gap-2 px-4 py-2 min-w-[280px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input type="search" placeholder="Search notes, decisions, attendees…" className="flex-1 bg-transparent border-0 outline-none text-[14px] text-[#0b1c30] placeholder:text-[#64748b]" />
          </div>
          <Button variant="secondary">Share</Button>
          <Button variant="primary">End Meeting</Button>
        </div>
      </div>

      {/* Top row — meta + attendees + stats */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <Card className="md:col-span-4">
            <span className="type-label-md uppercase text-on-surface-variant">Meeting</span>
            <h3 className="type-headline-sm text-on-surface">Weekly Ops Sync</h3>
            <p className="type-body-md text-on-surface-variant mt-1">Tue, 03 Jun · 10:00 – 11:00</p>
            <div className="mt-4 flex items-center gap-2">
              <Chip variant="in-progress">Live</Chip>
              <Chip variant="neutral">In-Person</Chip>
            </div>
          </Card>

          <Card className="md:col-span-5">
            <span className="type-label-md uppercase text-on-surface-variant">Attendees</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {attendees.map((a) => (
                <div key={a.name} className="neu-extruded-sm flex items-center gap-2 px-3 py-1.5">
                  <Avatar name={a.name} size="sm" status="online" />
                  <div>
                    <p className="type-label-md text-on-surface leading-tight">{a.name}</p>
                    <p className="type-label-md text-on-surface-variant leading-tight">{a.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="md:col-span-3 grid grid-cols-2 gap-4">
            <Card>
              <span className="type-label-md uppercase text-on-surface-variant">Notes</span>
              <div className="type-headline-md text-on-surface mt-1">{notes.length}</div>
            </Card>
            <Card>
              <span className="type-label-md uppercase text-on-surface-variant">Actions</span>
              <div className="type-headline-md text-on-surface mt-1">
                {notes.filter((n) => n.type === 'action').length + 1}
              </div>
            </Card>
          </div>
        </section>

        {/* Tabs */}
        <section className="flex items-center gap-2">
          {[
            { key: 'notes', label: 'Notes' },
            { key: 'agenda', label: 'Agenda' },
            { key: 'summary', label: 'Summary' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-full type-label-md transition ${
                activeTab === t.key ? 'bg-primary text-white' : 'neu-extruded-sm text-on-surface-variant'
              }`}
            >
              {t.label}
            </button>
          ))}
        </section>

        {/* Active tab content */}
        {activeTab === 'notes' && (
          <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-4">
              <Card padding="p-0">
                <ul className="divide-y divide-outline-variant/40">
                  {notes.map((n) => (
                    <li key={n.id} className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Chip
                            size="sm"
                            variant={n.type === 'decision' ? 'final-check' : n.type === 'action' ? 'warning' : 'in-progress'}
                          >
                            {n.type === 'decision' ? 'Decision' : n.type === 'action' ? 'Action' : 'Note'}
                          </Chip>
                          <span className="type-label-md text-on-surface-variant">{n.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar name={n.author} size="xs" />
                          <span className="type-label-md text-on-surface-variant">{n.author}</span>
                        </div>
                      </div>
                      <p className="type-body-lg text-on-surface mt-3 leading-relaxed">{n.text}</p>
                    </li>
                  ))}
                </ul>
                <form onSubmit={addNote} className="p-4 border-t border-outline-variant/40">
                  <Input
                    placeholder="Type a new note, decision, or action item…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    trailingIcon={
                      <button type="submit" className="text-slate-blue hover:opacity-80" aria-label="Add note">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                      </button>
                    }
                  />
                </form>
              </Card>
            </div>

            <div className="md:col-span-4 space-y-4">
              <SectionHeader eyebrow="Quick" title="Templates" />
              <div className="space-y-3">
                {[
                  { label: 'Decision template', icon: '✓' },
                  { label: 'Action item', icon: '→' },
                  { label: 'Risk flagged', icon: '!' },
                  { label: 'Follow-up question', icon: '?' },
                ].map((tpl) => (
                  <Card key={tpl.label} variant="extruded-sm" padding="p-3" className="flex items-center gap-3 cursor-pointer hover:brightness-105">
                    <div className="neu-extruded-sm w-9 h-9 flex items-center justify-center text-slate-blue font-semibold">{tpl.icon}</div>
                    <span className="type-label-lg text-on-surface">{tpl.label}</span>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'agenda' && (
          <section>
            <Card padding="p-0">
              <ul className="divide-y divide-outline-variant/40">
                {agenda.map((a, i) => (
                  <li key={a.id} className="flex items-center gap-4 p-5">
                    <span className="neu-extruded-sm w-9 h-9 flex items-center justify-center type-label-lg text-on-surface">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="type-label-lg text-on-surface">{a.title}</h4>
                      <p className="type-label-md text-on-surface-variant mt-0.5">{a.duration}</p>
                    </div>
                    <Chip size="sm" variant="neutral">Queued</Chip>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}

        {activeTab === 'summary' && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <SectionHeader eyebrow="Auto-generated" title="Executive Summary" className="mb-3" />
              <p className="type-body-lg text-on-surface leading-relaxed">
                The team approved the second-shift rotation and assigned Rio to reconcile March utility invoices.
                Boiler output remains 5% below target with a calibration ticket already in progress. Vendor
                escalation for PT. Sinar was deferred to next week pending new quotations.
              </p>
            </Card>
            <Card>
              <SectionHeader eyebrow="Carry-over" title="From Last Meeting" className="mb-3" />
              <ul className="space-y-3">
                {previous.map((p) => (
                  <li key={p.date} className="flex items-center justify-between">
                    <div>
                      <p className="type-label-lg text-on-surface">{p.title}</p>
                      <p className="type-label-md text-on-surface-variant">{p.date}</p>
                    </div>
                    <Chip size="sm" variant="neutral">{p.count} notes</Chip>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}
      </div>
  );
}

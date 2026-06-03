import React, { useState } from 'react';
import { Card, Button, Chip, Avatar, Input, SectionHeader } from '../components/ui';

// ==== Sample data ====
const tasks = [
  {
    id: 'T-204',
    title: 'Calibrate Line Press 01 sensors',
    project: 'Plant A',
    due: 'Today',
    priority: 'High',
    status: 'in-progress',
    assignees: ['Mira', 'Rio'],
  },
  {
    id: 'T-205',
    title: 'Prepare Q2 inventory report',
    project: 'Logistics',
    due: 'Wed, 04 Jun',
    priority: 'Medium',
    status: 'todo',
    assignees: ['Dewi'],
  },
  {
    id: 'T-206',
    title: 'HVAC loop firmware update',
    project: 'Plant A',
    due: 'Fri, 06 Jun',
    priority: 'Medium',
    status: 'todo',
    assignees: ['Arif'],
  },
  {
    id: 'T-207',
    title: 'Vendor contract review (PT. Sinar)',
    project: 'Procurement',
    due: 'Today',
    priority: 'High',
    status: 'review',
    assignees: ['Sari', 'Dewi'],
  },
  {
    id: 'T-208',
    title: 'Onboard new shift lead',
    project: 'HR',
    due: 'Mon, 09 Jun',
    priority: 'Low',
    status: 'review',
    assignees: ['Sari'],
  },
  {
    id: 'T-209',
    title: 'Reconcile last month utility bills',
    project: 'Finance',
    due: 'Yesterday',
    priority: 'Low',
    status: 'done',
    assignees: ['Rio'],
  },
];

const team = [
  { name: 'Mira', role: 'Ops Lead', load: 78 },
  { name: 'Dewi', role: 'Logistics', load: 52 },
  { name: 'Rio', role: 'Finance', load: 34 },
  { name: 'Arif', role: 'Engineer', load: 65 },
  { name: 'Sari', role: 'Procurement', load: 88 },
  { name: 'Bima', role: 'Engineer', load: 41 },
];

const columns = [
  { key: 'todo', label: 'To Do', status: 'Neutral' },
  { key: 'in-progress', label: 'In Progress', status: 'In Progress' },
  { key: 'review', label: 'In Review', status: 'Final Check' },
  { key: 'done', label: 'Done', status: 'Success' },
];

// ==== Page: Task Assignment (No Sidebar) ====
export default function TaskAssignment() {
  const [query, setQuery] = useState('');

  const filtered = tasks.filter((t) =>
    [t.title, t.project, t.id, t.assignees.join(' ')].join(' ').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="type-headline-lg text-[#0b1c30]">Task Assignment</h1>
          <p className="type-body-md text-[#414751] mt-1">Distribute, prioritize, and track work across teams</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="neu-inset-sm flex items-center gap-2 px-4 py-2 min-w-[280px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input type="search" placeholder="Search tasks, projects, people…" onChange={(e) => setQuery(e.target.value)} className="flex-1 bg-transparent border-0 outline-none text-[14px] text-[#0b1c30] placeholder:text-[#64748b]" />
          </div>
          <Button variant="secondary">Filter</Button>
          <Button variant="primary">+ New Task</Button>
        </div>
      </div>

      {/* Top metrics */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Open Tasks', value: 24, tone: 'primary' },
            { label: 'Due Today', value: 6, tone: 'warning' },
            { label: 'In Review', value: 8, tone: 'pastel' },
            { label: 'Completed this week', value: 17, tone: 'success' },
          ].map((m) => (
            <Card key={m.label}>
              <span className="type-label-md uppercase text-on-surface-variant">{m.label}</span>
              <div className="type-headline-md text-on-surface mt-1">{m.value}</div>
              <Chip size="sm" variant={m.tone === 'pastel' ? 'in-progress' : m.tone === 'primary' ? 'final-check' : m.tone === 'warning' ? 'warning' : 'success'} className="mt-3">
                {m.tone === 'pastel' ? 'In Progress' : m.tone === 'primary' ? 'Final Check' : m.tone === 'warning' ? 'Heads up' : 'On track'}
              </Chip>
            </Card>
          ))}
        </section>

        {/* Main: kanban (8 cols) + team (4 cols) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Kanban board */}
          <div className="md:col-span-8 space-y-4">
            <SectionHeader eyebrow="Board" title="Workflow" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {columns.map((col) => {
                const list = filtered.filter((t) => t.status === col.key);
                return (
                  <div key={col.key} className="bg-surface-container-low/50 rounded-xl p-3 min-h-[260px]">
                    <div className="flex items-center justify-between px-2 py-2">
                      <div className="flex items-center gap-2">
                        <span className="type-label-lg text-on-surface">{col.label}</span>
                        <Chip size="sm" variant={col.key === 'in-progress' ? 'in-progress' : col.key === 'review' ? 'final-check' : col.key === 'done' ? 'success' : 'neutral'}>
                          {list.length}
                        </Chip>
                      </div>
                      <button className="text-neutral-grey hover:text-on-surface" aria-label="Add">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                      </button>
                    </div>
                    <div className="space-y-3 mt-2">
                      {list.map((t) => (
                        <Card key={t.id} variant="extruded-sm" padding="p-4">
                          <div className="flex items-center justify-between">
                            <span className="type-label-md text-on-surface-variant">{t.id} · {t.project}</span>
                            <Chip size="sm" variant={t.priority === 'High' ? 'error' : t.priority === 'Medium' ? 'warning' : 'neutral'}>
                              {t.priority}
                            </Chip>
                          </div>
                          <h4 className="type-label-lg text-on-surface mt-2 leading-snug">{t.title}</h4>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex -space-x-2">
                              {t.assignees.map((a) => (
                                <Avatar key={a} name={a} size="sm" className="ring-2 ring-white" />
                              ))}
                            </div>
                            <span className="type-label-md text-on-surface-variant">{t.due}</span>
                          </div>
                        </Card>
                      ))}
                      {list.length === 0 && (
                        <div className="text-center type-label-md text-on-surface-variant py-6">No tasks</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team panel */}
          <div className="md:col-span-4 space-y-4">
            <SectionHeader eyebrow="Roster" title="Team Workload" />
            <Card padding="p-0">
              <ul className="divide-y divide-outline-variant/40">
                {team.map((m) => (
                  <li key={m.name} className="flex items-center gap-3 p-4">
                    <Avatar name={m.name} size="md" status={m.load > 80 ? 'busy' : 'online'} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="type-label-lg text-on-surface">{m.name}</h4>
                        <span className="type-label-md text-on-surface-variant">{m.load}%</span>
                      </div>
                      <p className="type-label-md text-on-surface-variant">{m.role}</p>
                      <div className="mt-2 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${m.load > 80 ? 'bg-amber-500' : m.load > 50 ? 'bg-primary' : 'bg-emerald-500'}`}
                          style={{ width: `${m.load}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-4">
                <Input
                  label="Quick assign"
                  placeholder="Type a name and press Enter…"
                />
              </div>
            </Card>
          </div>
        </section>
    </div>
  );
}

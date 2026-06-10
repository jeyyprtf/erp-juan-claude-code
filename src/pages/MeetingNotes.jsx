import React, { useState, useEffect } from 'react';
import { Card, Button, Chip, Avatar, Input, SectionHeader } from '../components/ui';
import { meetingService, profileService } from '../services/db';
import { motion, AnimatePresence } from 'framer-motion';

export default function MeetingNotes({ department }) {
  const [meetings, setMeetings] = useState([]);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [notes, setNotes] = useState([]);
  const [team, setTeam] = useState([]);

  // Search and view states
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'summary'
  const [draft, setDraft] = useState('');
  const [noteType, setNoteType] = useState('note'); // 'note' | 'decision' | 'action'
  const [loading, setLoading] = useState(true);

  // New meeting form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newSummary, setNewSummary] = useState('');

  // Load meetings & team profiles
  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedMeetings = await meetingService.getMeetingNotes(department);
      setMeetings(fetchedMeetings);
      
      const workers = await profileService.getWorkers(department);
      setTeam(workers);

      // Select first meeting as active by default if available
      if (fetchedMeetings.length > 0) {
        const active = fetchedMeetings[0];
        setActiveMeeting(active);
        const fetchedItems = await meetingService.getMeetingNoteItems(active.id);
        setNotes(fetchedItems);
      } else {
        setActiveMeeting(null);
        setNotes([]);
      }
    } catch (err) {
      console.error('Error loading meeting notes data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [department]);

  // Handle active meeting switch
  const handleMeetingSelect = async (meeting) => {
    setActiveMeeting(meeting);
    try {
      const fetchedItems = await meetingService.getMeetingNoteItems(meeting.id);
      setNotes(fetchedItems);
    } catch (err) {
      console.error('Error loading meeting items:', err);
    }
  };

  // Add meeting note item
  const handleAddNoteItem = async (e) => {
    e?.preventDefault();
    if (!draft.trim() || !activeMeeting) return;

    try {
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const author = team.length > 0 ? team[0].name : 'System';
      
      const newItem = await meetingService.addMeetingNoteItem(
        activeMeeting.id,
        noteType,
        draft.trim(),
        author,
        timeNow
      );

      setNotes((prev) => [...prev, newItem]);
      setDraft('');
    } catch (err) {
      console.error('Error adding meeting note item:', err);
    }
  };

  // Add a new meeting
  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const dateVal = newDate || new Date().toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short' });
      const timeVal = newTime || '10:00 – 11:00';
      const locVal = newLoc || 'Main Office';
      
      const createdMeeting = await meetingService.createMeetingNote(
        newTitle.trim(),
        dateVal,
        timeVal,
        locVal,
        department,
        newSummary.trim()
      );

      setMeetings((prev) => [createdMeeting, ...prev]);
      setActiveMeeting(createdMeeting);
      setNotes([]);
      
      // Reset form
      setNewTitle('');
      setNewDate('');
      setNewTime('');
      setNewLoc('');
      setNewSummary('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Error creating meeting:', err);
    }
  };

  // Filter notes in active meeting by query
  const filteredNotes = notes.filter((n) =>
    n.text.toLowerCase().includes(query.toLowerCase()) ||
    n.type.toLowerCase().includes(query.toLowerCase()) ||
    n.author_name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="type-headline-lg text-on-surface">Meeting Notes</h1>
          <p className="type-body-md text-on-surface-variant mt-1">
            Log meeting discussions, actions, and decisions for the <span className="font-semibold text-primary uppercase">{department}</span> team.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="neu-inset-sm flex items-center gap-2 px-4 py-2 min-w-[280px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-on-surface-variant">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input 
              type="search" 
              placeholder="Search active notes..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-[14px] text-on-surface placeholder:text-on-surface-variant/60" 
            />
          </div>
          <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ New Meeting'}
          </Button>
        </div>
      </div>

      {/* New Meeting Form Card */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden max-w-xl"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Card variant="extruded" className="border border-outline-variant">
              <form onSubmit={handleCreateMeeting} className="space-y-4">
                <h3 className="type-headline-sm text-on-surface">Create New Meeting Log</h3>
                <Input
                  label="Meeting Title"
                  placeholder="e.g. Weekly Ops Sync or Sprint Retro"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Date"
                    placeholder="e.g. Tue, 09 Jun 2026"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                  <Input
                    label="Time"
                    placeholder="e.g. 10:00 – 11:00"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Location"
                    placeholder="e.g. Conf Room A or Discord"
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
                  />
                  <Input
                    label="Brief Summary"
                    placeholder="Core agenda topic"
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="secondary" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Create Meeting</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-12 flex flex-col items-center gap-3">
          <svg className="animate-spin text-primary" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M4 12a8 8 0 0 1 8-8" />
          </svg>
          <span className="type-label-lg text-on-surface-variant">Loading meeting notes...</span>
        </div>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Meeting Selector / Previous Meetings list */}
          <div className="lg:col-span-4 space-y-4">
            <SectionHeader eyebrow="Archive" title="Previous Meetings" />
            <Card padding="p-0" className="border border-outline-variant/40 max-h-[500px] overflow-y-auto">
              <ul className="divide-y divide-outline-variant/20">
                {meetings.map((m) => {
                  const isActive = activeMeeting && activeMeeting.id === m.id;
                  return (
                    <li key={m.id}>
                      <button
                        onClick={() => handleMeetingSelect(m)}
                        className={`w-full text-left p-4 hover:bg-primary-fixed/20 transition-colors flex flex-col gap-1 ${
                          isActive ? 'bg-primary-fixed/30 border-l-4 border-primary' : ''
                        }`}
                      >
                        <span className="type-label-md text-on-surface-variant/80">{m.date}</span>
                        <h4 className="type-label-lg text-on-surface font-semibold leading-tight">{m.title}</h4>
                        <span className="type-label-md text-on-surface-variant truncate">{m.location} · {m.time}</span>
                      </button>
                    </li>
                  );
                })}
                {meetings.length === 0 && (
                  <li className="p-6 text-center text-on-surface-variant type-label-md">No meetings logged yet.</li>
                )}
              </ul>
            </Card>
          </div>

          {/* Right Side: Active Meeting Workspace */}
          {activeMeeting ? (
            <div className="lg:col-span-8 space-y-6">
              {/* Meeting Header Metadata */}
              <Card className="border border-outline-variant/40">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="type-label-md uppercase text-on-surface-variant/80 tracking-wider">Active Workspace</span>
                    <h3 className="type-headline-sm text-on-surface mt-1">{activeMeeting.title}</h3>
                    <p className="type-body-md text-on-surface-variant mt-1">
                      {activeMeeting.date} · {activeMeeting.time} · {activeMeeting.location}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Chip variant="in-progress">Interactive</Chip>
                    <Chip variant="neutral">{activeMeeting.location.includes('Room') ? 'In-Person' : 'Remote'}</Chip>
                  </div>
                </div>

                {activeMeeting.summary && (
                  <div className="mt-4 pt-4 border-t border-outline-variant/20">
                    <h5 className="type-label-md uppercase text-on-surface-variant/80 tracking-wider">Discussion Context</h5>
                    <p className="type-body-md text-on-surface mt-1 italic leading-relaxed">
                      "{activeMeeting.summary}"
                    </p>
                  </div>
                )}
              </Card>

              {/* Workspaces Tabs */}
              <div className="flex items-center gap-2">
                {[
                  { key: 'notes', label: 'Notes & Transcriptions' },
                  { key: 'summary', label: 'Actions & Decisions Summary' },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-4 py-2 rounded-full type-label-md transition-all ${
                      activeTab === t.key 
                        ? 'bg-primary text-white shadow-sm font-semibold' 
                        : 'neu-extruded-sm text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Note view contents */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  {/* Notes List */}
                  <Card padding="p-0" className="border border-outline-variant/40">
                    <ul className="divide-y divide-outline-variant/20 max-h-[400px] overflow-y-auto">
                      {filteredNotes.map((n) => (
                        <li key={n.id} className="p-5 hover:bg-surface-container-low/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Chip
                                size="sm"
                                variant={n.type === 'decision' ? 'final-check' : n.type === 'action' ? 'warning' : 'in-progress'}
                              >
                                {n.type === 'decision' ? 'Decision' : n.type === 'action' ? 'Action' : 'General'}
                              </Chip>
                              <span className="type-label-md text-on-surface-variant/80">{n.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Avatar name={n.author_name} src={team.find(t => t.name === n.author_name)?.avatar_url} size="xs" />
                              <span className="type-label-md text-on-surface-variant">{n.author_name}</span>
                            </div>
                          </div>
                          <p className="type-body-lg text-on-surface mt-3 leading-relaxed">{n.text}</p>
                        </li>
                      ))}
                      {filteredNotes.length === 0 && (
                        <li className="p-8 text-center text-on-surface-variant type-label-md">
                          No notes recorded yet. Type below to insert one.
                        </li>
                      )}
                    </ul>

                    {/* Note Input Form */}
                    <form onSubmit={handleAddNoteItem} className="p-4 border-t border-outline-variant/30 bg-surface-container-low/40 rounded-b-2xl">
                      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        {/* Note Type Switcher */}
                        <div className="flex gap-1 shrink-0 bg-surface-container p-1 rounded-xl">
                          {[
                            { key: 'note', label: 'Note' },
                            { key: 'decision', label: 'Decision' },
                            { key: 'action', label: 'Action' }
                          ].map((type) => (
                            <button
                              key={type.key}
                              type="button"
                              onClick={() => setNoteType(type.key)}
                              className={`px-3 py-1 rounded-lg type-label-md transition-all ${
                                noteType === type.key
                                  ? 'bg-primary text-white shadow-sm font-semibold'
                                  : 'text-on-surface-variant hover:bg-surface-container-high'
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>

                        {/* Note Input */}
                        <div className="flex-1">
                          <Input
                            placeholder={`Type a new ${noteType} and press Enter...`}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            trailingIcon={
                              <button type="submit" className="text-primary hover:opacity-80" aria-label="Add note">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                              </button>
                            }
                          />
                        </div>
                      </div>
                    </form>
                  </Card>
                </div>
              )}

              {/* Action items and decisions list */}
              {activeTab === 'summary' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-outline-variant/40">
                    <SectionHeader eyebrow="Logged" title="Decisions Made" className="mb-3" />
                    <ul className="space-y-3">
                      {notes.filter(n => n.type === 'decision').map((n, i) => (
                        <li key={n.id} className="flex gap-2.5 items-start p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                          <div>
                            <p className="type-label-lg text-on-surface leading-snug">{n.text}</p>
                            <span className="text-[11px] text-on-surface-variant/80">{n.author_name} at {n.time}</span>
                          </div>
                        </li>
                      ))}
                      {notes.filter(n => n.type === 'decision').length === 0 && (
                        <p className="type-body-md text-on-surface-variant italic">No decisions logged.</p>
                      )}
                    </ul>
                  </Card>

                  <Card className="border border-outline-variant/40">
                    <SectionHeader eyebrow="Logged" title="Action Items" className="mb-3" />
                    <ul className="space-y-3">
                      {notes.filter(n => n.type === 'action').map((n, i) => (
                        <li key={n.id} className="flex gap-2.5 items-start p-3 bg-primary-fixed/20 border border-primary/20 rounded-xl">
                          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">!</span>
                          <div>
                            <p className="type-label-lg text-on-surface leading-snug">{n.text}</p>
                            <span className="text-[11px] text-on-surface-variant/80">{n.author_name} at {n.time}</span>
                          </div>
                        </li>
                      ))}
                      {notes.filter(n => n.type === 'action').length === 0 && (
                        <p className="type-body-md text-on-surface-variant italic">No actions logged.</p>
                      )}
                    </ul>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="lg:col-span-8">
              <Card variant="flat" className="text-center py-12 text-on-surface-variant border-2 border-dashed border-outline-variant rounded-2xl">
                No active meeting found. Click "+ New Meeting" to log one.
              </Card>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

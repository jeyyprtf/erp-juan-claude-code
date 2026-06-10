import React, { useState, useEffect } from 'react';
import { Card, Button, Chip, Avatar, Input, SectionHeader } from '../components/ui';
import { taskService, profileService } from '../services/db';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to format calendar YYYY-MM-DD input to "Wed, 10 Jun"
const formatDateToHuman = (dateStr) => {
  if (!dateStr) return 'Today';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};

export default function TaskAssignment({ department }) {
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newDue, setNewDue] = useState('');
  const [newAssignees, setNewAssignees] = useState([]);

  // Load team and tasks
  const loadData = async () => {
    setLoading(true);
    try {
      const allTasks = await taskService.getTasks(department);
      setTasks(allTasks);
      const allWorkers = await profileService.getWorkers(department);
      setTeam(allWorkers);
    } catch (err) {
      console.error('Error loading task assignment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [department]);

  // Handle status movements
  const handleMoveStatus = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      await taskService.updateTaskStatus(taskId, newStatus);
      
      // Refresh team workload
      const allWorkers = await profileService.getWorkers(department);
      setTeam(allWorkers);
    } catch (err) {
      console.error('Error moving task status:', err);
      loadData();
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      await taskService.deleteTask(taskId);
      const allWorkers = await profileService.getWorkers(department);
      setTeam(allWorkers);
    } catch (err) {
      console.error('Error deleting task:', err);
      loadData();
    }
  };

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const formattedDue = newDue ? formatDateToHuman(newDue) : 'Today';
      const newTask = await taskService.createTask({
        title: newTitle.trim(),
        description: newDesc.trim(),
        due_date: formattedDue,
        priority: newPriority,
        status: 'todo',
        department,
        assignees: newAssignees
      });
      setTasks((prev) => [...prev, newTask]);
      
      // Reset form
      setNewTitle('');
      setNewDesc('');
      setNewPriority('Medium');
      setNewDue('');
      setNewAssignees([]);
      setShowAddForm(false);
      
      // Refresh team workload
      const allWorkers = await profileService.getWorkers(department);
      setTeam(allWorkers);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleToggleAssignee = (name) => {
    setNewAssignees((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      await handleMoveStatus(taskId, targetStatus);
    }
    setDragOverColumn(null);
  };

  // Filter tasks by query
  const filtered = tasks.filter((t) =>
    [t.title, t.description, t.id, t.assignees?.join(' ')].join(' ').toLowerCase().includes(query.toLowerCase())
  );

  // Core metrics
  const totalTasks = tasks.length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High' && t.status !== 'done').length;
  const reviewCount = tasks.filter((t) => t.status === 'review').length;
  const completedCount = tasks.filter((t) => t.status === 'done').length;

  const columns = [
    { key: 'todo', label: 'To Do', theme: 'bg-surface-container-low/60 border border-outline-variant/40' },
    { key: 'in-progress', label: 'In Progress', theme: 'bg-primary-fixed/30 border border-primary/20' },
    { key: 'review', label: 'In Review', theme: 'bg-surface-container/60 border border-outline-variant/40' },
    { key: 'done', label: 'Done', theme: 'bg-emerald-500/10 border border-emerald-500/20' }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="type-headline-lg text-on-surface">Task Assignment</h1>
          <p className="type-body-md text-on-surface-variant mt-1">
            Distribute, prioritize, and track work for the <span className="font-semibold text-primary uppercase">{department}</span> team.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="neu-inset-sm flex items-center gap-2 px-4 py-2 flex-1 sm:flex-initial sm:min-w-[280px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-on-surface-variant">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input 
              type="search" 
              placeholder="Search tasks, projects, people…" 
              value={query}
              onChange={(e) => setQuery(e.target.value)} 
              className="flex-1 bg-transparent border-0 outline-none text-[14px] text-on-surface placeholder:text-on-surface-variant/60" 
            />
          </div>
          <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)} className="w-full sm:w-auto">
            {showAddForm ? 'Cancel' : '+ New Task'}
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Tasks', value: totalTasks, tone: 'primary', desc: 'Active backlog' },
          { label: 'High Priority', value: highPriorityCount, tone: 'warning', desc: 'Awaiting resolution' },
          { label: 'In Review', value: reviewCount, tone: 'pastel', desc: 'Needs confirmation' },
          { label: 'Completed', value: completedCount, tone: 'success', desc: 'Resolved this session' },
        ].map((m) => (
          <Card key={m.label} variant="extruded-sm" className="hover:scale-[1.01] transition-transform border border-outline-variant/30">
            <span className="type-label-md uppercase text-on-surface-variant">{m.label}</span>
            <div className="type-headline-md text-on-surface mt-1">{m.value}</div>
            <Chip size="sm" variant={m.tone === 'pastel' ? 'in-progress' : m.tone === 'primary' ? 'final-check' : m.tone === 'warning' ? 'warning' : 'success'} className="mt-3">
              {m.desc}
            </Chip>
          </Card>
        ))}
      </section>

      {/* Add Task Form Section */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden max-w-2xl"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Card variant="extruded" className="border border-outline-variant">
              <form onSubmit={handleAddTask} className="space-y-4">
                <h3 className="type-headline-sm text-on-surface">Create New Department Task</h3>
                <Input
                  label="Task Title"
                  placeholder="e.g. Calibrate thermal telemetry sensors"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
                <Input
                  label="Description"
                  placeholder="What does this task entail?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Due Date / Timeline"
                    type="date"
                    value={newDue}
                    onChange={(e) => setNewDue(e.target.value)}
                    required
                    leadingIcon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-grey">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    }
                  />
                  <div className="flex flex-col gap-1.5">
                    <span className="type-label-md text-on-surface-variant uppercase">Priority</span>
                    <div className="flex gap-2">
                      {['Low', 'Medium', 'High'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewPriority(p)}
                          className={`px-3 py-2 rounded-lg type-label-md transition-colors ${
                            newPriority === p
                              ? 'bg-primary text-white shadow-sm font-semibold'
                              : 'neu-extruded-sm text-on-surface-variant hover:bg-surface-container-low'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="type-label-md text-on-surface-variant uppercase">Assign Members</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {team.map((worker) => {
                      const isAssigned = newAssignees.includes(worker.name);
                      return (
                        <button
                          key={worker.id}
                          type="button"
                          onClick={() => handleToggleAssignee(worker.name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full type-label-md transition-all border ${
                            isAssigned
                              ? 'border-primary bg-primary-fixed text-primary'
                              : 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant'
                          }`}
                        >
                          <Avatar name={worker.name} src={worker.avatar_url} size="xs" />
                          <span>{worker.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="secondary" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Create Task</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Kanban + Workload */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Kanban board */}
        <div className="xl:col-span-8 space-y-4">
          <SectionHeader eyebrow="Board" title="Department Workflow" />
          {loading ? (
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <svg className="animate-spin text-primary" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="12" cy="12" r="10" opacity="0.25" />
                <path d="M4 12a8 8 0 0 1 8-8" />
              </svg>
              <span className="type-label-lg text-on-surface-variant">Loading workflow...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {columns.map((col) => {
                const list = filtered.filter((t) => t.status === col.key);
                const isOver = dragOverColumn === col.key;
                const colThemeClass = isOver
                  ? 'bg-primary-fixed/40 border-2 border-dashed border-primary ring-2 ring-primary/20 scale-[0.99]'
                  : col.theme;

                return (
                  <div
                    key={col.key}
                    onDragOver={handleDragOver}
                    onDragEnter={() => setDragOverColumn(col.key)}
                    onDragLeave={() => setDragOverColumn(null)}
                    onDrop={(e) => handleDrop(e, col.key)}
                    className={`${colThemeClass} rounded-2xl p-3 min-h-[300px] flex flex-col transition-all duration-200`}
                  >
                    <div className="flex items-center justify-between px-2 py-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="type-label-lg text-on-surface">{col.label}</span>
                        <Chip size="sm" variant={col.key === 'in-progress' ? 'in-progress' : col.key === 'review' ? 'final-check' : col.key === 'done' ? 'success' : 'neutral'}>
                          {list.length}
                        </Chip>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {list.map((t) => (
                        <Card
                          key={t.id}
                          variant="extruded-sm"
                          padding="p-4"
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, t.id)}
                          className="border border-outline-variant/40 relative hover:scale-[1.01] transition-all cursor-grab active:cursor-grabbing hover:shadow-md"
                        >
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="absolute top-2 right-2 p-1 text-on-surface-variant hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                            aria-label="Delete task"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                          </button>
                          
                          <div className="flex items-center justify-between mt-1">
                            <span className="type-label-md text-on-surface-variant/80 font-mono">{t.id.slice(0, 5)}</span>
                            <Chip size="sm" variant={t.priority === 'High' ? 'error' : t.priority === 'Medium' ? 'warning' : 'neutral'}>
                              {t.priority}
                            </Chip>
                          </div>
                          
                          <h4 className="type-label-lg text-on-surface mt-2 font-medium leading-snug pr-4">{t.title}</h4>
                          <p className="type-body-md text-on-surface-variant mt-1 line-clamp-2">{t.description}</p>
                          
                          <div className="flex items-center justify-between mt-4 border-t border-outline-variant/20 pt-3">
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {t.assignees?.map((a) => (
                                <Avatar key={a} name={a} src={team.find((w) => w.name === a)?.avatar_url} size="xs" className="ring-2 ring-surface" />
                              ))}
                              {(!t.assignees || t.assignees.length === 0) && (
                                <span className="type-label-md text-on-surface-variant/60">Unassigned</span>
                              )}
                            </div>
                            
                            {/* Direction Arrows for quick workflow updates */}
                            <div className="flex gap-1">
                              {col.key !== 'todo' && (
                                <button
                                  onClick={() => {
                                    const prevStatuses = ['todo', 'in-progress', 'review', 'done'];
                                    const idx = prevStatuses.indexOf(col.key);
                                    handleMoveStatus(t.id, prevStatuses[idx - 1]);
                                  }}
                                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low border border-outline-variant"
                                  aria-label="Move back"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                                </button>
                              )}
                              {col.key !== 'done' && (
                                <button
                                  onClick={() => {
                                    const nextStatuses = ['todo', 'in-progress', 'review', 'done'];
                                    const idx = nextStatuses.indexOf(col.key);
                                    handleMoveStatus(t.id, nextStatuses[idx + 1]);
                                  }}
                                  className="p-1.5 rounded-lg text-primary bg-primary-fixed hover:bg-primary-fixed/80 border border-primary/20"
                                  aria-label="Move forward"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                      {list.length === 0 && (
                        <div className="text-center type-label-md text-on-surface-variant/60 py-8">No tasks</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Team panel */}
        <div className="xl:col-span-4 space-y-4">
          <SectionHeader eyebrow="Roster" title="Team Workload" />
          <Card padding="p-0" className="border border-outline-variant/40">
            <ul className="divide-y divide-outline-variant/30">
              {team.map((m) => (
                <li key={m.name} className="flex items-center gap-3 p-4">
                  <Avatar name={m.name} src={m.avatar_url} size="md" status={m.load > 80 ? 'busy' : 'online'} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="type-label-lg text-on-surface">{m.name}</h4>
                      <span className="type-label-md text-on-surface-variant">{m.load}%</span>
                    </div>
                    <p className="type-label-md text-on-surface-variant">{m.role}</p>
                    <div className="mt-2 h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          m.load > 80 ? 'bg-amber-500' : m.load > 50 ? 'bg-primary' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${m.load}%` }}
                      />
                    </div>
                  </div>
                </li>
              ))}
              {team.length === 0 && (
                <li className="p-4 text-center text-on-surface-variant type-label-md">No team members active.</li>
              )}
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}

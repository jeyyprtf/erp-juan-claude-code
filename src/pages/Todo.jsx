import React, { useState, useEffect } from 'react';
import { Card, Button, Chip, Input, ProgressRing } from '../components/ui';
import { taskService, authService } from '../services/db';

export default function Todo({ department }) {
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Tasks'); // 'All Tasks' | 'My Tasks' | 'High Priority' | 'Completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load User & Tasks
  const loadData = async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      const fetchedTasks = await taskService.getTasks(department);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [department]);

  // Toggle completion
  const handleToggleComplete = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
      );
      await taskService.updateTaskStatus(taskId, nextStatus);
    } catch (err) {
      console.error('Error updating task status:', err);
      loadData(); // Revert
    }
  };

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const assigneeList = currentUser ? [currentUser.name] : [];
      const newTask = await taskService.createTask({
        title: newTitle.trim(),
        description: `Created via To Do list. Scoped to ${department.toUpperCase()} department.`,
        due_date: 'Today',
        priority: newPriority,
        status: 'todo',
        department,
        assignees: assigneeList
      });
      setTasks((prev) => [newTask, ...prev]);
      setNewTitle('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  // Filter and Search logic
  const filteredTasks = tasks.filter((t) => {
    // 1. Search Query
    if (
      searchQuery &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }

    // 2. Filter Tab
    if (activeFilter === 'My Tasks') {
      return currentUser && t.assignees?.includes(currentUser.name);
    }
    if (activeFilter === 'High Priority') {
      return t.priority === 'High' && t.status !== 'done';
    }
    if (activeFilter === 'Completed') {
      return t.status === 'done';
    }
    return true; // All Tasks
  });

  // Sprint stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="type-headline-lg text-on-surface">To Do List</h1>
          <p className="type-body-md text-on-surface-variant mt-1">
            Manage checklist items for the <span className="font-semibold text-primary uppercase">{department}</span> department.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="neu-inset-sm flex items-center gap-2 px-4 py-2 min-w-[280px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-on-surface-variant">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search checklist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-[14px] text-on-surface placeholder:text-on-surface-variant/60"
            />
          </div>
          <Button variant="primary" size="md" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ New Item'}
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left Column: List */}
        <div className="space-y-6">
          {/* Add form */}
          {showAddForm && (
            <Card variant="extruded" className="border border-outline-variant/60 animate-fadeIn">
              <form onSubmit={handleAddTask} className="space-y-4">
                <h3 className="type-headline-sm text-on-surface">Create New Item</h3>
                <Input
                  label="Task Title"
                  placeholder="What needs to be done?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="type-label-md text-on-surface-variant uppercase">Priority</span>
                    <div className="flex gap-2">
                      {['Low', 'Medium', 'High'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewPriority(p)}
                          className={`px-3 py-1.5 rounded-lg type-label-md transition-colors ${
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
                  <Button type="submit" variant="primary" className="ml-auto mt-5">
                    Add Task
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Filter Bar */}
          <Card variant="extruded-sm" padding="px-5 py-3" className="border border-outline-variant/40">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {['All Tasks', 'My Tasks', 'High Priority', 'Completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-1.5 rounded-lg type-label-lg transition-all ${
                      activeFilter === f
                        ? 'bg-primary text-white shadow-sm font-semibold'
                        : 'text-on-surface-variant hover:bg-primary-fixed hover:text-primary'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* List items */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 flex flex-col items-center gap-3">
                <svg className="animate-spin text-primary" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M4 12a8 8 0 0 1 8-8" />
                </svg>
                <span className="type-label-lg text-on-surface-variant">Loading checklist...</span>
              </div>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((t) => {
                const isChecked = t.status === 'done';
                return (
                  <Card key={t.id} variant="extruded" padding="p-5" className="hover:scale-[1.01] transition-transform duration-200 border border-outline-variant/40">
                    <div className="flex items-start gap-4">
                      {/* Checkbox button */}
                      <button
                        onClick={() => handleToggleComplete(t.id, t.status)}
                        aria-label={isChecked ? 'Mark incomplete' : 'Mark complete'}
                        className={`mt-1 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-primary border-primary'
                            : 'border-outline hover:border-primary'
                        }`}
                      >
                        {isChecked && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className={`type-label-lg leading-snug transition-all ${isChecked ? 'line-through text-on-surface-variant/50' : 'text-on-surface'}`}>
                            {t.title}
                          </h4>
                          <Chip
                            size="sm"
                            variant={t.priority === 'High' ? 'error' : t.priority === 'Medium' ? 'warning' : 'neutral'}
                          >
                            {t.priority}
                          </Chip>
                        </div>
                        {t.description && (
                          <p className={`type-body-md mt-1 transition-all ${isChecked ? 'line-through text-on-surface-variant/50' : 'text-on-surface-variant'}`}>
                            {t.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <span className="type-label-md text-on-surface-variant flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                            {t.due_date}
                          </span>
                          {t.assignees && t.assignees.length > 0 && (
                            <span className="type-label-md text-on-surface-variant flex items-center gap-1.5">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                              Assigned: {t.assignees.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card variant="flat" className="text-center py-12 text-on-surface-variant border-2 border-dashed border-outline-variant rounded-2xl">
                <svg className="mx-auto text-on-surface-variant/70 mb-3" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                <div className="type-headline-sm text-on-surface">All clear!</div>
                <p className="type-body-md mt-1">No checklist tasks match the active filters.</p>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column: Sidebar Stats */}
        <div className="space-y-6">
          {/* Sprint Progress */}
          <Card padding="p-6" className="border border-outline-variant/40">
            <div className="flex items-center gap-2 mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.8 1 6.5 2.5" />
                <path d="M21 3v6h-6" />
              </svg>
              <h3 className="type-headline-sm text-on-surface">Workload Progress</h3>
            </div>
            <div className="flex justify-center mb-6">
              <ProgressRing
                value={completionRate}
                size={140}
                stroke={12}
                variant="primary"
                label={`${completionRate}%`}
                sublabel="Done"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card variant="extruded-sm" padding="p-3 text-center" className="border border-outline-variant/30">
                <div className="type-headline-md text-on-surface">{totalTasks}</div>
                <div className="type-label-md text-on-surface-variant">Total Tasks</div>
              </Card>
              <Card variant="extruded-sm" padding="p-3 text-center" className="border border-outline-variant/30">
                <div className="type-headline-md text-on-surface">{completedTasks}</div>
                <div className="type-label-md text-on-surface-variant">Completed</div>
              </Card>
            </div>
            <Card variant="extruded-sm" padding="p-3 mt-3 text-center" className="border border-outline-variant/30">
              <div className="type-headline-md text-primary">{pendingTasks}</div>
              <div className="type-label-md text-on-surface-variant">Pending Action</div>
            </Card>
          </Card>
        </div>
      </div>
    </div>
  );
}

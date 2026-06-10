import React, { useState, useEffect } from 'react';
import { Card, Chip, Avatar, ProgressRing, SectionHeader } from '../components/ui';
import { taskService, profileService } from '../services/db';

export default function ProgressTracking({ department }) {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load roster and tasks
  const loadData = async () => {
    setLoading(true);
    try {
      const allWorkers = await profileService.getWorkers(department);
      setWorkers(allWorkers);

      // Select first worker by default if none selected
      if (allWorkers.length > 0) {
        const stillExists = selectedWorker ? allWorkers.find(w => w.name === selectedWorker.name) : null;
        const active = stillExists || allWorkers[0];
        setSelectedWorker(active);

        const fetchedTasks = await taskService.getTasks(department);
        setTasks(fetchedTasks);
      } else {
        setSelectedWorker(null);
        setTasks([]);
      }
    } catch (err) {
      console.error('Error loading worker progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [department]);

  // When selected worker changes, recalculate tasks
  const handleWorkerSelect = (worker) => {
    setSelectedWorker(worker);
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

  // Move task status
  const handleMoveStatus = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      await taskService.updateTaskStatus(taskId, newStatus);
      
      // Update local workloads/data
      const updatedTasks = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
      const workerTasks = updatedTasks.filter((t) => t.assignees?.includes(selectedWorker.name));
      const activeCount = workerTasks.filter((t) => t.status !== 'done').length;
      const total = workerTasks.length;
      const newLoad = total > 0 ? Math.min(100, Math.round((activeCount / total) * 100)) : 0;
      
      // Update worker card state
      setWorkers(prev => prev.map(w => w.id === selectedWorker.id ? { ...w, load: newLoad } : w));
      setSelectedWorker(prev => prev ? { ...prev, load: newLoad } : null);
    } catch (err) {
      console.error('Error updating task status:', err);
      loadData();
    }
  };

  // Filter tasks for the selected worker
  const workerTasks = tasks.filter((t) =>
    selectedWorker ? t.assignees?.includes(selectedWorker.name) : false
  );

  // Compute stats for selected worker
  const completedCount = workerTasks.filter((t) => t.status === 'done').length;
  const totalCount = workerTasks.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const columns = [
    { key: 'todo', label: 'To Do', themeClass: 'bg-surface-container-low/60 border border-outline-variant/40' },
    { key: 'in-progress', label: 'In Progress', themeClass: 'bg-primary-fixed/20 border border-primary/20' },
    { key: 'review', label: 'In Review', themeClass: 'bg-surface-container/60 border border-outline-variant/40' },
    { key: 'done', label: 'Completed', themeClass: 'bg-emerald-500/10 border border-emerald-500/20' }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="type-headline-lg text-on-surface">Worker Progress</h1>
        <p className="type-body-md text-on-surface-variant mt-1">
          Monitor individual worker tasks and workload progression for the <span className="font-semibold text-primary uppercase">{department}</span> department.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 flex flex-col items-center gap-3">
          <svg className="animate-spin text-primary" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M4 12a8 8 0 0 1 8-8" />
          </svg>
          <span className="type-label-lg text-on-surface-variant">Loading worker rosters...</span>
        </div>
      ) : (
        <>
          {/* Worker Selector Carousel */}
          <section className="space-y-3">
            <SectionHeader eyebrow="Roster" title="Select Worker to Track" className="mb-0" />
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin pt-2">
              {workers.map((w) => {
                const isActive = selectedWorker && selectedWorker.id === w.id;
                // Calculate completion percent for each worker
                const wTasks = tasks.filter(t => t.assignees?.includes(w.name));
                const wDone = wTasks.filter(t => t.status === 'done').length;
                const wTotal = wTasks.length;
                const wPercent = wTotal > 0 ? Math.round((wDone / wTotal) * 100) : 0;

                return (
                  <button
                    key={w.id}
                    onClick={() => handleWorkerSelect(w)}
                    className="text-left focus:outline-none shrink-0"
                  >
                    <Card
                      variant={isActive ? 'extruded-lg' : 'extruded-sm'}
                      padding="p-4"
                      className={`w-[240px] border transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                        isActive
                          ? 'border-primary ring-1 ring-primary/30 bg-surface-bright shadow-md'
                          : 'border-outline-variant hover:border-outline'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={w.name} src={w.avatar_url} size="md" status={w.load > 80 ? 'busy' : 'online'} />
                        <div className="min-w-0">
                          <h4 className="type-label-lg text-on-surface truncate">{w.name}</h4>
                          <p className="type-label-md text-on-surface-variant truncate">{w.role}</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-1">
                        <div className="flex items-center justify-between type-label-md text-on-surface-variant">
                          <span>Completion Rate</span>
                          <span className="font-semibold text-on-surface">{wPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${wPercent}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-on-surface-variant/80 pt-1 flex justify-between">
                          <span>Active: {wTasks.filter(t => t.status !== 'done').length} tasks</span>
                          <span>Workload: {w.load}%</span>
                        </div>
                      </div>
                    </Card>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Individual Kanban Board */}
          {selectedWorker ? (
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container border border-outline-variant rounded-2xl p-4 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar name={selectedWorker.name} src={selectedWorker.avatar_url} size="lg" />
                  <div>
                    <h3 className="type-headline-sm text-on-surface">{selectedWorker.name}'s Progress Board</h3>
                    <p className="type-body-md text-on-surface-variant">{selectedWorker.role} · Active load: {selectedWorker.load}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 mt-3 sm:mt-0">
                  <ProgressRing
                    value={completionPercent}
                    size={72}
                    stroke={7}
                    variant="primary"
                    label={`${completionPercent}%`}
                  />
                  <div className="text-right">
                    <span className="type-label-md uppercase text-on-surface-variant/80">Completed Tasks</span>
                    <div className="type-headline-sm text-on-surface">{completedCount} <span className="type-body-md text-on-surface-variant">/ {totalCount}</span></div>
                  </div>
                </div>
              </div>

              {/* Kanban Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {columns.map((col) => {
                  const list = workerTasks.filter((t) => t.status === col.key);
                  const isOver = dragOverColumn === col.key;
                  const colThemeClass = isOver
                    ? 'bg-primary-fixed/40 border-2 border-dashed border-primary ring-2 ring-primary/20 scale-[0.99]'
                    : col.themeClass;

                  return (
                    <div
                      key={col.key}
                      onDragOver={handleDragOver}
                      onDragEnter={() => setDragOverColumn(col.key)}
                      onDragLeave={() => setDragOverColumn(null)}
                      onDrop={(e) => handleDrop(e, col.key)}
                      className={`${colThemeClass} rounded-2xl p-4 min-h-[350px] flex flex-col transition-all duration-200`}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-3 px-1">
                        <span className="type-label-lg text-on-surface">{col.label}</span>
                        <Chip
                          size="sm"
                          variant={col.key === 'in-progress' ? 'in-progress' : col.key === 'review' ? 'final-check' : col.key === 'done' ? 'success' : 'neutral'}
                        >
                          {list.length}
                        </Chip>
                      </div>

                      {/* Card stack */}
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
                            <div className="flex items-center justify-between gap-2">
                              <span className="type-label-md text-on-surface-variant/80 font-mono truncate">{t.id.slice(0, 5)}</span>
                              <Chip
                                size="sm"
                                variant={t.priority === 'High' ? 'error' : t.priority === 'Medium' ? 'warning' : 'neutral'}
                              >
                                {t.priority}
                              </Chip>
                            </div>
                            <h4 className="type-label-lg text-on-surface mt-2 font-medium leading-snug">{t.title}</h4>
                            <p className="type-body-md text-on-surface-variant mt-1 line-clamp-2">{t.description}</p>
                            
                            {/* Actions / Interactive Shifts */}
                            <div className="flex items-center justify-between mt-4 border-t border-outline-variant/10 pt-3">
                              <span className="type-label-md text-on-surface-variant">{t.due_date}</span>
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
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
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
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                        {list.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-24 border border-dashed border-outline-variant/40 rounded-xl text-on-surface-variant/60 type-label-md">
                            No tasks
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            <Card variant="flat" className="text-center py-12 text-on-surface-variant border-2 border-dashed border-outline-variant rounded-2xl">
              No workers found for this department.
            </Card>
          )}
        </>
      )}
    </div>
  );
}

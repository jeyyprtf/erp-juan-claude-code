import React, { useState } from 'react';
import { Card, Button, Chip, Avatar, ProgressBar, ProgressRing, SectionHeader } from '../components/ui';

// ==== Sample data (placeholder content for the IoT workspace) ====
const sensors = [
  { id: 's-01', name: 'Line Press 01', value: 78, unit: 'bar', status: 'in-progress', location: 'Plant A · Bay 1' },
  { id: 's-02', name: 'HVAC Loop B', value: 42, unit: '°C', status: 'final-check', location: 'Plant A · Roof' },
  { id: 's-03', name: 'Conveyor Torque', value: 65, unit: 'Nm', status: 'in-progress', location: 'Plant B · Line 2' },
  { id: 's-04', name: 'Coolant Flow', value: 92, unit: 'L/m', status: 'final-check', location: 'Plant B · Bay 1' },
  { id: 's-05', name: 'Boiler Output', value: 55, unit: 'kPa', status: 'in-progress', location: 'Plant A · Utility' },
  { id: 's-06', name: 'Tank Level 03', value: 30, unit: '%', status: 'final-check', location: 'Plant C · Storage' },
];

const liveEvents = [
  { time: '09:42', label: 'Calibration completed', who: 'Mira', variant: 'success' },
  { time: '09:38', label: 'Threshold breach: Boiler', who: 'System', variant: 'warning' },
  { time: '09:30', label: 'Shift handover from D. Tan', who: 'Dewi', variant: 'default' },
  { time: '09:21', label: 'New firmware deployed', who: 'DevOps', variant: 'in-progress' },
  { time: '09:14', label: 'Maintenance ticket closed', who: 'Rio', variant: 'success' },
];

// ==== Page: IoT Workspace – Progress Tracker (No Sidebar) ====
export default function IoTWorkspace() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="type-headline-lg text-[#0b1c30]">IoT Workspace</h1>
          <p className="type-body-md text-[#414751] mt-1">Progress Tracker · Plant Operations Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="neu-inset-sm flex items-center gap-2 px-4 py-2 min-w-[280px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input type="search" placeholder="Search sensors, devices, events…" className="flex-1 bg-transparent border-0 outline-none text-[14px] text-[#0b1c30] placeholder:text-[#64748b]" />
          </div>
          <Button variant="secondary" size="md">Export</Button>
          <Button variant="primary" size="md">+ Add Device</Button>
        </div>
      </div>

      {/* Hero metrics — bento grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Card className="md:col-span-4 flex items-center gap-6">
          <ProgressRing value={74} size={120} stroke={10} label="74%" sublabel="OEE" />
          <div>
            <span className="type-label-md uppercase text-[#414751]">Overall Equipment</span>
            <h3 className="type-headline-sm text-[#0b1c30]">Plant Health · Strong</h3>
            <p className="type-body-md text-[#414751] mt-1">6 active devices · 2 alerts</p>
          </div>
        </Card>

        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <span className="type-label-md uppercase text-[#414751]">Uptime</span>
            <div className="type-headline-md text-[#0b1c30] mt-1">99.2%</div>
            <ProgressBar value={99} variant="success" size="sm" className="mt-3" />
          </Card>
          <Card>
            <span className="type-label-md uppercase text-[#414751]">Throughput</span>
            <div className="type-headline-md text-[#0b1c30] mt-1">1,284 <span className="type-body-md text-[#414751]">u/h</span></div>
            <ProgressBar value={64} variant="primary" size="sm" className="mt-3" />
          </Card>
          <Card>
            <span className="type-label-md uppercase text-[#414751]">Energy</span>
            <div className="type-headline-md text-[#0b1c30] mt-1">312 <span className="type-body-md text-[#414751]">kWh</span></div>
            <ProgressBar value={48} variant="pastel" size="sm" className="mt-3" />
          </Card>
        </div>
      </section>

      {/* Sensor list + Live feed */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Card className="md:col-span-8" padding="p-0">
          <div className="flex items-center justify-between p-6 pb-4">
            <SectionHeader eyebrow="Devices" title="Sensor Progress" className="mb-0" action={
              <div className="flex items-center gap-2">
                {['All', 'In Progress', 'Final Check'].map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg type-label-lg transition-colors ${filter === f ? 'bg-[#4A90E2] text-white' : 'neu-extruded-sm text-[#414751]'}`}>{f}</button>
                ))}
              </div>
            } />
          </div>
          <div className="divide-y divide-[#c1c7d3]/40">
            {sensors.filter((s) => filter === 'All' ? true : filter === 'In Progress' ? s.status === 'in-progress' : s.status === 'final-check')
              .map((s) => (
                <div key={s.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="neu-extruded-sm w-10 h-10 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" strokeWidth="2"><path d="M3 12h3l3-8 4 16 3-8h5"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="type-label-lg text-[#0b1c30]">{s.name}</h4>
                      <Chip size="sm" variant={s.status === 'in-progress' ? 'in-progress' : 'final-check'}>{s.status === 'in-progress' ? 'In Progress' : 'Final Check'}</Chip>
                    </div>
                    <p className="type-body-md text-[#414751] mt-0.5">{s.location}</p>
                    <div className="mt-2"><ProgressBar value={s.value} variant={s.status === 'final-check' ? 'success' : 'primary'} size="sm" /></div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="type-headline-sm text-[#0b1c30]">{s.value}<span className="type-body-md text-[#414751] ml-1">{s.unit}</span></div>
                    <span className="type-label-md text-[#414751]">live</span>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card className="md:col-span-4" padding="p-0">
          <div className="p-6">
            <SectionHeader eyebrow="Telemetry" title="Live Event Feed" className="mb-0" />
          </div>
          <ul className="px-6 pb-6 space-y-3">
            {liveEvents.map((e, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="type-label-md text-[#414751] w-12 shrink-0">{e.time}</span>
                <div className="flex-1">
                  <p className="type-body-md text-[#0b1c30]">{e.label}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar name={e.who} size="xs" />
                    <span className="type-label-md text-[#414751]">{e.who}</span>
                  </div>
                </div>
                <Chip size="sm" variant={e.variant}>{e.variant === 'warning' ? 'Alert' : e.variant === 'success' ? 'OK' : 'Info'}</Chip>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Team footer */}
      <section>
        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="type-label-md uppercase text-[#414751]">On Shift</span>
              <h3 className="type-headline-sm text-[#0b1c30]">Operations Team</h3>
            </div>
            <div className="flex items-center -space-x-2">
              {['Mira', 'Dewi', 'Rio', 'Arif', 'Sari'].map((n) => (
                <Avatar key={n} name={n} size="md" status="online" className="ring-2 ring-white" />
              ))}
            </div>
            <Button variant="secondary">View Roster</Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

-- =========================================================================
-- SoftGrid ERP — Supabase Database Schema
-- =========================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.meeting_note_items CASCADE;
DROP TABLE IF EXISTS public.meeting_notes CASCADE;
DROP TABLE IF EXISTS public.task_assignees CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Profiles (Workers) Table
-- Stores user information, role, current workload, and department.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Team Member',
  avatar_url TEXT,
  department TEXT NOT NULL CHECK (department IN ('iot', 'mobile')),
  load INTEGER DEFAULT 0 CHECK (load >= 0 AND load <= 100),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tasks Table
-- Core task records, scoped by department.
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  status TEXT NOT NULL CHECK (status IN ('todo', 'in-progress', 'review', 'done')),
  department TEXT NOT NULL CHECK (department IN ('iot', 'mobile')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Task Assignees Join Table
-- Many-to-many relationship between Tasks and Profiles.
CREATE TABLE public.task_assignees (
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (task_id, profile_id)
);

-- 4. Meeting Notes Table
CREATE TABLE public.meeting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  department TEXT NOT NULL CHECK (department IN ('iot', 'mobile')),
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Meeting Note Items Table
-- Individual items recorded during a meeting (notes, decisions, actions).
CREATE TABLE public.meeting_note_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.meeting_notes(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('note', 'decision', 'action')),
  text TEXT NOT NULL,
  author_name TEXT NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- Enable Row Level Security (RLS)
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_note_items ENABLE ROW LEVEL SECURITY;

-- Allow all actions for authenticated users (Production-ready simplicity)
CREATE POLICY "Allow read/write access to authenticated users on profiles" 
  ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow read/write access to authenticated users on tasks" 
  ON public.tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow read/write access to authenticated users on task_assignees" 
  ON public.task_assignees FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow read/write access to authenticated users on meeting_notes" 
  ON public.meeting_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow read/write access to authenticated users on meeting_note_items" 
  ON public.meeting_note_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow public reads on profiles for Login/Register checking (before auth token fully maps)
CREATE POLICY "Allow public read access to profiles" 
  ON public.profiles FOR SELECT TO public USING (true);

-- =========================================================================
-- Seed Initial Sample Data
-- =========================================================================

-- Seed Workers/Profiles
INSERT INTO public.profiles (id, email, name, role, department, load, avatar_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'mira@softgrid.com', 'Mira', 'Ops Lead', 'iot', 78, NULL),
  ('22222222-2222-2222-2222-222222222222', 'dewi@softgrid.com', 'Dewi', 'Logistics Lead', 'mobile', 52, NULL),
  ('33333333-3333-3333-3333-333333333333', 'rio@softgrid.com', 'Rio', 'Finance Officer', 'mobile', 34, NULL),
  ('44444444-4444-4444-4444-444444444444', 'arif@softgrid.com', 'Arif', 'IoT Engineer', 'iot', 65, NULL),
  ('55555555-5555-5555-5555-555555555555', 'sari@softgrid.com', 'Sari', 'Procurement Specialist', 'mobile', 88, NULL),
  ('66666666-6666-6666-6666-666666666666', 'bima@softgrid.com', 'Bima', 'Mobile Developer', 'mobile', 41, NULL);

-- Seed Tasks (IoT Department)
INSERT INTO public.tasks (id, title, description, due_date, priority, status, department) VALUES
  ('10000000-1000-1000-1000-100000000001', 'Calibrate Line Press 01 sensors', 'Conduct physical recalibration of sensors on Bay 1 Line 01. Inspect pressure values.', 'Today', 'High', 'in-progress', 'iot'),
  ('10000000-1000-1000-1000-100000000002', 'HVAC loop firmware update', 'Deploy security patch firmware v2.4.1 to HVAC Loop B Controller.', 'Fri, 12 Jun', 'Medium', 'todo', 'iot'),
  ('10000000-1000-1000-1000-100000000003', 'Audit Field Equipment', 'Conduct quarterly audit of all IoT sensors in Sector 4G. Ensure all batteries are replaced.', 'Today, 2:00 PM', 'High', 'todo', 'iot'),
  ('10000000-1000-1000-1000-100000000004', 'Calibrate Plant B boiler telemetry', 'Inspect thermal sensors on Boiler Output. Calibration ticket #4419.', 'Mon, 15 Jun', 'Low', 'done', 'iot');

-- Assign Tasks (IoT)
INSERT INTO public.task_assignees (task_id, profile_id) VALUES
  ('10000000-1000-1000-1000-100000000001', '11111111-1111-1111-1111-111111111111'), -- Mira to Calibrate Line Press
  ('10000000-1000-1000-1000-100000000002', '44444444-4444-4444-4444-444444444444'), -- Arif to HVAC Loop
  ('10000000-1000-1000-1000-100000000003', '11111111-1111-1111-1111-111111111111'), -- Mira to Audit Field Eq
  ('10000000-1000-1000-1000-100000000004', '44444444-4444-4444-4444-444444444444'); -- Arif to Calibrate Plant B

-- Seed Tasks (Mobile Department)
INSERT INTO public.tasks (id, title, description, due_date, priority, status, department) VALUES
  ('20000000-2000-2000-2000-200000000001', 'Prepare Q2 inventory report', 'Consolidate raw material log updates from warehouse Bay 2. Share with procurement.', 'Wed, 10 Jun', 'Medium', 'todo', 'mobile'),
  ('20000000-2000-2000-2000-200000000002', 'Vendor contract review (PT. Sinar)', 'Review SLA parameters and delivery schedule adjustments for the upcoming Q3 shipment.', 'Today', 'High', 'review', 'mobile'),
  ('20000000-2000-2000-2000-200000000003', 'Onboard new shift lead', 'Setup access passes, email accounts, and conduct standard system workflow training.', 'Mon, 15 Jun', 'Low', 'review', 'mobile'),
  ('20000000-2000-2000-2000-200000000004', 'Reconcile last month utility bills', 'Match invoice items with smart meter readings for Plant A & B.', 'Yesterday', 'Low', 'done', 'mobile'),
  ('20000000-2000-2000-2000-200000000005', 'Review Mobile Sync Logs', 'Check logs for offline sync errors reported by field team Alpha yesterday.', 'Today, 4:00 PM', 'Medium', 'todo', 'mobile'),
  ('20000000-2000-2000-2000-200000000006', 'Deploy Mobile App Update', 'Push client app v1.2 to staging environment for internal QA team testing.', 'Yesterday', 'Low', 'done', 'mobile');

-- Assign Tasks (Mobile)
INSERT INTO public.task_assignees (task_id, profile_id) VALUES
  ('20000000-2000-2000-2000-200000000001', '22222222-2222-2222-2222-222222222222'), -- Dewi to Q2 inventory
  ('20000000-2000-2000-2000-200000000002', '55555555-5555-5555-5555-555555555555'), -- Sari to Vendor contract
  ('20000000-2000-2000-2000-200000000002', '22222222-2222-2222-2222-222222222222'), -- Dewi to Vendor contract (co-assignee)
  ('20000000-2000-2000-2000-200000000003', '55555555-5555-5555-5555-555555555555'), -- Sari to Onboard
  ('20000000-2000-2000-2000-200000000004', '33333333-3333-3333-3333-333333333333'), -- Rio to Reconcile bills
  ('20000000-2000-2000-2000-200000000005', '66666666-6666-6666-6666-666666666666'); -- Bima to Review Sync Logs

-- Seed Meeting Notes (IoT Department)
INSERT INTO public.meeting_notes (id, title, date, time, location, department, summary) VALUES
  ('30000000-3000-3000-3000-300000000001', 'Weekly IoT Ops Sync', 'Tue, 09 Jun 2026', '10:00 – 11:00', 'Conf Room A', 'iot', 'The team approved the second-shift rotation and scheduled calibration for Boiler Output. HVAC controller security updates are slated for Friday.');

INSERT INTO public.meeting_note_items (meeting_id, type, text, author_name, time) VALUES
  ('30000000-3000-3000-3000-300000000001', 'decision', 'Approve the second-shift rotation. Mira to publish the roster by EOD Friday.', 'Mira', '10:12'),
  ('30000000-3000-3000-3000-300000000001', 'action', 'Arif to schedule and complete sensor calibration for Boiler Output.', 'Arif', '10:18'),
  ('30000000-3000-3000-3000-300000000001', 'note', 'Boiler output trending 5% below target — calibration ticket already open (#4419).', 'Arif', '10:24');

-- Seed Meeting Notes (Mobile Department)
INSERT INTO public.meeting_notes (id, title, date, time, location, department, summary) VALUES
  ('40000000-4000-4000-4000-400000000001', 'Weekly Mobile Sync', 'Wed, 10 Jun 2026', '11:00 – 12:00', 'Conf Room B', 'mobile', 'Reviewed Q2 deliverables. Rio will reconcile March utility bills. The vendor contract with PT. Sinar will undergo minor delivery revisions.');

INSERT INTO public.meeting_note_items (meeting_id, type, text, author_name, time) VALUES
  ('40000000-4000-4000-4000-400000000001', 'decision', 'Revisions approved for PT. Sinar contract regarding Q3 timelines.', 'Sari', '11:15'),
  ('40000000-4000-4000-4000-400000000001', 'action', 'Rio to match utility bills with smart meters by Friday afternoon.', 'Rio', '11:35');

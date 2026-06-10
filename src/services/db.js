import { supabase } from './supabaseClient';

// =========================================================================
// Dual-Engine Database Service Layer
// =========================================================================
const isSupabaseActive = () => {
  return supabase !== null;
};

// =========================================================================
// Mock Data (matches schema.sql)
// =========================================================================
const MOCK_PROFILES = [
  { id: '11111111-1111-1111-1111-111111111111', email: 'mira@softgrid.com', name: 'Mira', role: 'Ops Lead', department: 'iot', load: 78 },
  { id: '22222222-2222-2222-2222-222222222222', email: 'dewi@softgrid.com', name: 'Dewi', role: 'Logistics Lead', department: 'mobile', load: 52 },
  { id: '33333333-3333-3333-3333-333333333333', email: 'rio@softgrid.com', name: 'Rio', role: 'Finance Officer', department: 'mobile', load: 34 },
  { id: '44444444-4444-4444-4444-444444444444', email: 'arif@softgrid.com', name: 'Arif', role: 'IoT Engineer', department: 'iot', load: 65 },
  { id: '55555555-5555-5555-5555-555555555555', email: 'sari@softgrid.com', name: 'Sari', role: 'Procurement Specialist', department: 'mobile', load: 88 },
  { id: '66666666-6666-6666-6666-666666666666', email: 'bima@softgrid.com', name: 'Bima', role: 'Mobile Developer', department: 'mobile', load: 41 }
];

const MOCK_TASKS = [
  { id: '10000000-1000-1000-1000-100000000001', title: 'Calibrate Line Press 01 sensors', description: 'Conduct physical recalibration of sensors on Bay 1 Line 01. Inspect pressure values.', due_date: 'Today', priority: 'High', status: 'in-progress', department: 'iot', assignees: ['Mira'] },
  { id: '10000000-1000-1000-1000-100000000002', title: 'HVAC loop firmware update', description: 'Deploy security patch firmware v2.4.1 to HVAC Loop B Controller.', due_date: 'Fri, 12 Jun', priority: 'Medium', status: 'todo', department: 'iot', assignees: ['Arif'] },
  { id: '10000000-1000-1000-1000-100000000003', title: 'Audit Field Equipment', description: 'Conduct quarterly audit of all IoT sensors in Sector 4G. Ensure all batteries are replaced.', due_date: 'Today, 2:00 PM', priority: 'High', status: 'todo', department: 'iot', assignees: ['Mira'] },
  { id: '10000000-1000-1000-1000-100000000004', title: 'Calibrate Plant B boiler telemetry', description: 'Inspect thermal sensors on Boiler Output. Calibration ticket #4419.', due_date: 'Mon, 15 Jun', priority: 'Low', status: 'done', department: 'iot', assignees: ['Arif'] },
  { id: '20000000-2000-2000-2000-200000000001', title: 'Prepare Q2 inventory report', description: 'Consolidate raw material log updates from warehouse Bay 2. Share with procurement.', due_date: 'Wed, 10 Jun', priority: 'Medium', status: 'todo', department: 'mobile', assignees: ['Dewi'] },
  { id: '20000000-2000-2000-2000-200000000002', title: 'Vendor contract review (PT. Sinar)', description: 'Review SLA parameters and delivery schedule adjustments for the upcoming Q3 shipment.', due_date: 'Today', priority: 'High', status: 'review', department: 'mobile', assignees: ['Sari', 'Dewi'] },
  { id: '20000000-2000-2000-2000-200000000003', title: 'Onboard new shift lead', description: 'Setup access passes, email accounts, and conduct standard system workflow training.', due_date: 'Mon, 15 Jun', priority: 'Low', status: 'review', department: 'mobile', assignees: ['Sari'] },
  { id: '20000000-2000-2000-2000-200000000004', title: 'Reconcile last month utility bills', description: 'Match invoice items with smart meter readings for Plant A & B.', due_date: 'Yesterday', priority: 'Low', status: 'done', department: 'mobile', assignees: ['Rio'] },
  { id: '20000000-2000-2000-2000-200000000005', title: 'Review Mobile Sync Logs', description: 'Check logs for offline sync errors reported by field team Alpha yesterday.', due_date: 'Today, 4:00 PM', priority: 'Medium', status: 'todo', department: 'mobile', assignees: ['Bima'] },
  { id: '20000000-2000-2000-2000-200000000006', title: 'Deploy Mobile App Update', description: 'Push client app v1.2 to staging environment for internal QA team testing.', due_date: 'Yesterday', priority: 'Low', status: 'done', department: 'mobile', assignees: ['Bima'] }
];

const MOCK_MEETINGS = [
  { id: '30000000-3000-3000-3000-300000000001', title: 'Weekly IoT Ops Sync', date: 'Tue, 09 Jun 2026', time: '10:00 – 11:00', location: 'Conf Room A', department: 'iot', summary: 'The team approved the second-shift rotation and scheduled calibration for Boiler Output. HVAC controller security updates are slated for Friday.' },
  { id: '40000000-4000-4000-4000-400000000001', title: 'Weekly Mobile Sync', date: 'Wed, 10 Jun 2026', time: '11:00 – 12:00', location: 'Conf Room B', department: 'mobile', summary: 'Reviewed Q2 deliverables. Rio will reconcile March utility bills. The vendor contract with PT. Sinar will undergo minor delivery revisions.' }
];

const MOCK_MEETING_ITEMS = [
  { id: '301', meeting_id: '30000000-3000-3000-3000-300000000001', type: 'decision', text: 'Approve the second-shift rotation. Mira to publish the roster by EOD Friday.', author_name: 'Mira', time: '10:12' },
  { id: '302', meeting_id: '30000000-3000-3000-3000-300000000001', type: 'action', text: 'Arif to schedule and complete sensor calibration for Boiler Output.', author_name: 'Arif', time: '10:18' },
  { id: '303', meeting_id: '30000000-3000-3000-3000-300000000001', type: 'note', text: 'Boiler output trending 5% below target — calibration ticket already open (#4419).', author_name: 'Arif', time: '10:24' },
  { id: '401', meeting_id: '40000000-4000-4000-4000-400000000001', type: 'decision', text: 'Revisions approved for PT. Sinar contract regarding Q3 timelines.', author_name: 'Sari', time: '11:15' },
  { id: '402', meeting_id: '40000000-4000-4000-4000-400000000001', type: 'action', text: 'Rio to match utility bills with smart meters by Friday afternoon.', author_name: 'Rio', time: '11:35' }
];

// Initialize LocalStorage Mock DB if empty
const initMockDB = () => {
  if (!localStorage.getItem('erp_profiles')) {
    localStorage.setItem('erp_profiles', JSON.stringify(MOCK_PROFILES));
  }
  if (!localStorage.getItem('erp_tasks')) {
    localStorage.setItem('erp_tasks', JSON.stringify(MOCK_TASKS));
  }
  if (!localStorage.getItem('erp_meetings')) {
    localStorage.setItem('erp_meetings', JSON.stringify(MOCK_MEETINGS));
  }
  if (!localStorage.getItem('erp_meeting_items')) {
    localStorage.setItem('erp_meeting_items', JSON.stringify(MOCK_MEETING_ITEMS));
  }
};
initMockDB();

// Helper to simulate network latency
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// =========================================================================
// 1. Auth Services
// =========================================================================
export const authService = {
  getCurrentUser: async () => {
    if (isSupabaseActive()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      // Get supplementary profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return profile ? { ...user, ...profile } : user;
    } else {
      await delay(100);
      const user = localStorage.getItem('erp_current_user');
      return user ? JSON.parse(user) : null;
    }
  },

  signIn: async (email, password) => {
    if (isSupabaseActive()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (pError) throw pError;
      return { ...data.user, ...profile };
    } else {
      await delay(300);
      const profiles = JSON.parse(localStorage.getItem('erp_profiles') || '[]');
      const user = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('User not found. Use mock credentials like mira@softgrid.com or register.');
      }
      // Simulate successful login
      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        load: user.load
      };
      localStorage.setItem('erp_current_user', JSON.stringify(sessionUser));
      return sessionUser;
    }
  },

  signUp: async (email, password, name, department, role) => {
    if (isSupabaseActive()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, department, role }
        }
      });
      if (error) throw error;

      // Check if a profile with this email already exists (e.g., from seed data)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      const profileData = {
        id: data.user.id,
        email,
        name,
        department,
        role: role || 'Team Member',
        load: 0
      };

      if (existingProfile) {
        // Update the existing profile's ID to the new auth user ID (cascades tasks via ON UPDATE CASCADE)
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ id: data.user.id, name, department, role: role || 'Team Member' })
          .eq('email', email);
        if (updateError) throw updateError;
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData);
        if (insertError) throw insertError;
      }
      
      return { ...data.user, ...profileData };
    } else {
      await delay(400);
      const profiles = JSON.parse(localStorage.getItem('erp_profiles') || '[]');
      if (profiles.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already registered.');
      }
      const newProfile = {
        id: crypto.randomUUID ? crypto.randomUUID() : 'user-' + Date.now(),
        email,
        name,
        role: role || 'Team Member',
        department,
        load: 0
      };
      profiles.push(newProfile);
      localStorage.setItem('erp_profiles', JSON.stringify(profiles));
      localStorage.setItem('erp_current_user', JSON.stringify(newProfile));
      return newProfile;
    }
  },

  signOut: async () => {
    if (isSupabaseActive()) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      await delay(100);
      localStorage.removeItem('erp_current_user');
    }
  },

  updateProfile: async (name, avatarUrl) => {
    if (isSupabaseActive()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');
      
      const { error: authError } = await supabase.auth.updateUser({
        data: { name, avatar_url: avatarUrl }
      });
      if (authError) throw authError;

      const { error } = await supabase
        .from('profiles')
        .update({ name, avatar_url: avatarUrl })
        .eq('id', user.id);
      if (error) throw error;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return { ...user, ...profile };
    } else {
      await delay(200);
      const currentUser = JSON.parse(localStorage.getItem('erp_current_user'));
      if (!currentUser) throw new Error('No user logged in');
      
      const updatedUser = { ...currentUser, name, avatar_url: avatarUrl };
      localStorage.setItem('erp_current_user', JSON.stringify(updatedUser));
      
      const profiles = JSON.parse(localStorage.getItem('erp_profiles') || '[]');
      const idx = profiles.findIndex(p => p.id === currentUser.id);
      if (idx !== -1) {
        profiles[idx] = { ...profiles[idx], name, avatar_url: avatarUrl };
        localStorage.setItem('erp_profiles', JSON.stringify(profiles));
      }
      return updatedUser;
    }
  },

  updatePassword: async (newPassword) => {
    if (isSupabaseActive()) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return true;
    } else {
      await delay(200);
      return true;
    }
  },

  onAuthStateChange: (callback) => {
    if (isSupabaseActive()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          callback(profile ? { ...session.user, ...profile } : session.user);
        } else {
          callback(null);
        }
      });
      return () => subscription.unsubscribe();
    } else {
      // Return dummy unsubscribe
      return () => {};
    }
  }
};

// =========================================================================
// 2. Profiles (Workers) Services
// =========================================================================
export const profileService = {
  getWorkers: async (department) => {
    if (isSupabaseActive()) {
      let query = supabase.from('profiles').select('*');
      if (department) {
        query = query.eq('department', department.toLowerCase());
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } else {
      await delay(100);
      const profiles = JSON.parse(localStorage.getItem('erp_profiles') || '[]');
      if (department) {
        return profiles.filter((p) => p.department.toLowerCase() === department.toLowerCase());
      }
      return profiles;
    }
  },

  updateWorkload: async (workerName, load) => {
    if (isSupabaseActive()) {
      const { error } = await supabase
        .from('profiles')
        .update({ load })
        .eq('name', workerName);
      if (error) throw error;
    } else {
      const profiles = JSON.parse(localStorage.getItem('erp_profiles') || '[]');
      const idx = profiles.findIndex((p) => p.name === workerName);
      if (idx !== -1) {
        profiles[idx].load = load;
        localStorage.setItem('erp_profiles', JSON.stringify(profiles));
      }
    }
  }
};

// =========================================================================
// 3. Tasks Services
// =========================================================================
export const taskService = {
  getTasks: async (department) => {
    if (isSupabaseActive()) {
      // Query tasks and join their assignees
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_assignees (
            profiles (
              name
            )
          )
        `)
        .eq('department', department.toLowerCase());
      
      if (error) throw error;

      // Map Supabase return structure to match our React representation
      return data.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description || '',
        due_date: t.due_date,
        priority: t.priority,
        status: t.status,
        department: t.department,
        assignees: t.task_assignees?.map((ta) => ta.profiles?.name).filter(Boolean) || []
      }));
    } else {
      await delay(150);
      const tasks = JSON.parse(localStorage.getItem('erp_tasks') || '[]');
      return tasks.filter((t) => t.department.toLowerCase() === department.toLowerCase());
    }
  },

  createTask: async (taskData) => {
    // taskData: { title, description, due_date, priority, status, department, assignees: ['Mira', 'Arif'] }
    if (isSupabaseActive()) {
      // 1. Insert Task
      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.due_date,
          priority: taskData.priority,
          status: taskData.status || 'todo',
          department: taskData.department.toLowerCase()
        })
        .select()
        .single();
      
      if (error) throw error;

      // 2. Fetch profile IDs for assignees names
      if (taskData.assignees && taskData.assignees.length > 0) {
        const { data: profiles, error: pError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('name', taskData.assignees);
        
        if (pError) throw pError;

        if (profiles && profiles.length > 0) {
          const assigneeRows = profiles.map((p) => ({
            task_id: task.id,
            profile_id: p.id
          }));

          const { error: linkError } = await supabase
            .from('task_assignees')
            .insert(assigneeRows);
          
          if (linkError) throw linkError;
        }
      }

      return {
        ...task,
        assignees: taskData.assignees || []
      };
    } else {
      await delay(150);
      const tasks = JSON.parse(localStorage.getItem('erp_tasks') || '[]');
      const newTask = {
        id: crypto.randomUUID ? crypto.randomUUID() : 'task-' + Date.now(),
        title: taskData.title,
        description: taskData.description || '',
        due_date: taskData.due_date,
        priority: taskData.priority,
        status: taskData.status || 'todo',
        department: taskData.department.toLowerCase(),
        assignees: taskData.assignees || []
      };
      tasks.unshift(newTask);
      localStorage.setItem('erp_tasks', JSON.stringify(tasks));
      
      // Update workload load dynamically for testing
      await updateWorkloadFromTasks(taskData.assignees);
      
      return newTask;
    }
  },

  updateTaskStatus: async (taskId, status) => {
    if (isSupabaseActive()) {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);
      if (error) throw error;
    } else {
      await delay(50);
      const tasks = JSON.parse(localStorage.getItem('erp_tasks') || '[]');
      const idx = tasks.findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        tasks[idx].status = status;
        localStorage.setItem('erp_tasks', JSON.stringify(tasks));
        await updateWorkloadFromTasks(tasks[idx].assignees);
      }
    }
  },

  updateTaskAssignees: async (taskId, assignees) => {
    if (isSupabaseActive()) {
      // 1. Delete existing connections
      await supabase.from('task_assignees').delete().eq('task_id', taskId);
      // 2. Fetch profile IDs
      const { data: profiles } = await supabase.from('profiles').select('id, name').in('name', assignees);
      if (profiles && profiles.length > 0) {
        const rows = profiles.map((p) => ({ task_id: taskId, profile_id: p.id }));
        await supabase.from('task_assignees').insert(rows);
      }
    } else {
      const tasks = JSON.parse(localStorage.getItem('erp_tasks') || '[]');
      const idx = tasks.findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        tasks[idx].assignees = assignees;
        localStorage.setItem('erp_tasks', JSON.stringify(tasks));
        await updateWorkloadFromTasks(assignees);
      }
    }
  },

  deleteTask: async (taskId) => {
    if (isSupabaseActive()) {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
    } else {
      await delay(100);
      const tasks = JSON.parse(localStorage.getItem('erp_tasks') || '[]');
      const taskToDelete = tasks.find((t) => t.id === taskId);
      const filtered = tasks.filter((t) => t.id !== taskId);
      localStorage.setItem('erp_tasks', JSON.stringify(filtered));
      if (taskToDelete) {
        await updateWorkloadFromTasks(taskToDelete.assignees);
      }
    }
  }
};

// Helper function to dynamically recalculate and update worker workload values
async function updateWorkloadFromTasks(assignees) {
  if (!assignees || assignees.length === 0) return;
  const tasks = JSON.parse(localStorage.getItem('erp_tasks') || '[]');
  const profiles = JSON.parse(localStorage.getItem('erp_profiles') || '[]');
  
  for (const name of assignees) {
    // Count active tasks (todo, in-progress, review) vs completed
    const workerTasks = tasks.filter(t => t.assignees?.includes(name));
    const activeTasks = workerTasks.filter(t => t.status !== 'done').length;
    const total = workerTasks.length;
    
    // Compute workload load (e.g. 20% load per active task, cap at 100)
    const load = total > 0 ? Math.min(100, Math.round((activeTasks / total) * 100)) : 0;
    
    const idx = profiles.findIndex(p => p.name === name);
    if (idx !== -1) {
      profiles[idx].load = load;
    }
  }
  localStorage.setItem('erp_profiles', JSON.stringify(profiles));
}

// =========================================================================
// 4. Meeting Notes Services
// =========================================================================
export const meetingService = {
  getMeetingNotes: async (department) => {
    if (isSupabaseActive()) {
      const { data, error } = await supabase
        .from('meeting_notes')
        .select('*')
        .eq('department', department.toLowerCase())
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      await delay(100);
      const meetings = JSON.parse(localStorage.getItem('erp_meetings') || '[]');
      return meetings.filter((m) => m.department.toLowerCase() === department.toLowerCase());
    }
  },

  createMeetingNote: async (title, date, time, location, department, summary) => {
    if (isSupabaseActive()) {
      const { data, error } = await supabase
        .from('meeting_notes')
        .insert({ title, date, time, location, department: department.toLowerCase(), summary })
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      await delay(150);
      const meetings = JSON.parse(localStorage.getItem('erp_meetings') || '[]');
      const newMeeting = {
        id: crypto.randomUUID ? crypto.randomUUID() : 'meeting-' + Date.now(),
        title,
        date,
        time,
        location,
        department: department.toLowerCase(),
        summary: summary || ''
      };
      meetings.unshift(newMeeting);
      localStorage.setItem('erp_meetings', JSON.stringify(meetings));
      return newMeeting;
    }
  },

  getMeetingNoteItems: async (meetingId) => {
    if (isSupabaseActive()) {
      const { data, error } = await supabase
        .from('meeting_note_items')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    } else {
      await delay(50);
      const items = JSON.parse(localStorage.getItem('erp_meeting_items') || '[]');
      return items.filter((it) => it.meeting_id === meetingId);
    }
  },

  addMeetingNoteItem: async (meetingId, type, text, authorName, time) => {
    if (isSupabaseActive()) {
      const { data, error } = await supabase
        .from('meeting_note_items')
        .insert({ meeting_id: meetingId, type, text, author_name: authorName, time })
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      await delay(50);
      const items = JSON.parse(localStorage.getItem('erp_meeting_items') || '[]');
      const newItem = {
        id: 'item-' + Date.now(),
        meeting_id: meetingId,
        type,
        text,
        author_name: authorName,
        time
      };
      items.push(newItem);
      localStorage.setItem('erp_meeting_items', JSON.stringify(items));
      return newItem;
    }
  }
};

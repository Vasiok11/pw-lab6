import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:3000/api';

const apiCall = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'API Error');
  }
  
  return method === 'GET' ? res.json() : null;
};

export const useStore = create((set, get) => ({
  // --- AUTH & INIT STATE ---
  token: localStorage.getItem('api_token') || null,
  isInitialized: false,
  
  initData: async () => {
    // 1. Authenticate (Auto-login as admin for lab purposes)
    let token = get().token;
    if (!token) {
        try {
            const res = await fetch(`${API_URL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', role: 'admin' })
            });
            const data = await res.json();
            token = data.token;
            localStorage.setItem('api_token', token);
            set({ token });
        } catch (err) {
            console.error("[Auth] Failed to generate token.");
        }
    }
    
    // 2. Fetch Data from SQLite Backend
    try {
        const [skills, projects, jobs, learningResources] = await Promise.all([
          apiCall('/skills'),
          apiCall('/projects'),
          apiCall('/jobs'),
          apiCall('/learning')
        ]);
        set({ skills, projects, jobs, learningResources, isInitialized: true });
    } catch(e) {
        console.error("[Data] Failed to load entities from backend.", e);
    }
  },

  // --- SKILLS STATE ---
  skills: [],
  addSkill: async (skill) => {
    const newSkill = { id: uuidv4(), ...skill };
    await apiCall('/skills', 'POST', newSkill, get().token);
    set((state) => ({ skills: [...state.skills, newSkill] }));
  },
  removeSkill: async (id) => {
    await apiCall(`/skills/${id}`, 'DELETE', null, get().token);
    set((state) => ({ skills: state.skills.filter(s => s.id !== id) }));
  },
  updateSkill: async (id, updatedSkill) => {
    await apiCall(`/skills/${id}`, 'PUT', updatedSkill, get().token);
    set((state) => ({ skills: state.skills.map(s => s.id === id ? { ...s, ...updatedSkill } : s) }));
  },

  // --- PROJECTS STATE ---
  projects: [],
  addProject: async (project) => {
    const newProject = { id: uuidv4(), ...project };
    await apiCall('/projects', 'POST', newProject, get().token);
    set((state) => ({ projects: [...state.projects, newProject] }));
  },
  removeProject: async (id) => {
    await apiCall(`/projects/${id}`, 'DELETE', null, get().token);
    set((state) => ({ projects: state.projects.filter(p => p.id !== id) }));
  },
  updateProject: async (id, updatedProject) => {
    await apiCall(`/projects/${id}`, 'PUT', updatedProject, get().token);
    set((state) => ({ projects: state.projects.map(p => p.id === id ? { ...p, ...updatedProject } : p) }));
  },
  toggleProjectHighlight: async (id) => {
    const project = get().projects.find(p => p.id === id);
    if (project) {
        const toggledStatus = project.highlighted ? 0 : 1;
        await apiCall(`/projects/${id}`, 'PUT', { highlighted: toggledStatus }, get().token);
        set((state) => ({
          projects: state.projects.map(p => p.id === id ? { ...p, highlighted: toggledStatus } : p)
        }));
    }
  },

  // --- LEARNING RESOURCES STATE ---
  learningResources: [],
  addResource: async (resource) => {
    const newRes = { id: uuidv4(), ...resource };
    await apiCall('/learning', 'POST', newRes, get().token);
    set((state) => ({ learningResources: [...state.learningResources, newRes] }));
  },
  updateResourceProgress: async (id, progress) => {
    const status = progress === 100 ? 'completed' : 'learning';
    await apiCall(`/learning/${id}`, 'PUT', { progress, status }, get().token);
    set((state) => ({
      learningResources: state.learningResources.map(r => r.id === id ? { ...r, progress, status } : r)
    }));
  },
  updateResource: async (id, updatedResource) => {
    await apiCall(`/learning/${id}`, 'PUT', updatedResource, get().token);
    set((state) => ({
      learningResources: state.learningResources.map(r => r.id === id ? { ...r, ...updatedResource } : r)
    }));
  },
  removeResource: async (id) => {
    await apiCall(`/learning/${id}`, 'DELETE', null, get().token);
    set((state) => ({ learningResources: state.learningResources.filter(r => r.id !== id) }));
  },

  // --- JOB APPLICATIONS STATE ---
  jobs: [],
  addJob: async (job) => {
    const newJob = { id: uuidv4(), ...job };
    await apiCall('/jobs', 'POST', newJob, get().token);
    set((state) => ({ jobs: [...state.jobs, newJob] }));
  },
  updateJobStatus: async (id, status) => {
    await apiCall(`/jobs/${id}`, 'PUT', { status }, get().token);
    set((state) => ({ jobs: state.jobs.map(j => j.id === id ? { ...j, status } : j) }));
  },
  updateJob: async (id, updatedJob) => {
    await apiCall(`/jobs/${id}`, 'PUT', updatedJob, get().token);
    set((state) => ({ jobs: state.jobs.map(j => j.id === id ? { ...j, ...updatedJob } : j) }));
  },
  removeJob: async (id) => {
    await apiCall(`/jobs/${id}`, 'DELETE', null, get().token);
    set((state) => ({ jobs: state.jobs.filter(j => j.id !== id) }));
  }
}));
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';

// Custom storage object to tell Zustand to use idb-keyval (IndexedDB) instead of localStorage
const storage = {
  getItem: async (name) => {
    const value = await get(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    await set(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await del(name);
  },
};

export const useStore = create(
  persist(
    (set) => ({
      // --- SKILLS STATE ---
      skills: [],
      addSkill: (skill) => set((state) => ({ 
        skills: [...state.skills, { id: uuidv4(), ...skill }] 
      })),
      removeSkill: (id) => set((state) => ({ 
        skills: state.skills.filter(s => s.id !== id) 
      })),
      updateSkill: (id, updatedSkill) => set((state) => ({
        skills: state.skills.map(s => s.id === id ? { ...s, ...updatedSkill } : s)
      })),

      // --- PROJECTS STATE ---
      projects: [],
      addProject: (project) => set((state) => ({
        projects: [...state.projects, { id: uuidv4(), ...project }]
      })),
      removeProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      })),
      updateProject: (id, updatedProject) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updatedProject } : p)
      })),
      toggleProjectHighlight: (id) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, highlighted: !p.highlighted } : p
        )
      })),

      // --- LEARNING RESOURCES STATE ---
      learningResources: [],
      addResource: (resource) => set((state) => ({
        learningResources: [...state.learningResources, { id: uuidv4(), ...resource }]
      })),
      updateResourceProgress: (id, progress) => set((state) => ({
        learningResources: state.learningResources.map(r =>
          r.id === id ? { ...r, progress, status: progress === 100 ? 'completed' : 'learning' } : r
        )
      })),
      updateResource: (id, updatedResource) => set((state) => ({
        learningResources: state.learningResources.map(r => 
          r.id === id ? { ...r, ...updatedResource } : r
        )
      })),
      removeResource: (id) => set((state) => ({
        learningResources: state.learningResources.filter(r => r.id !== id)
      })),

      // --- JOB APPLICATIONS STATE ---
      jobs: [],
      addJob: (job) => set((state) => ({
        jobs: [...state.jobs, { id: uuidv4(), ...job }]
      })),
      updateJobStatus: (id, status) => set((state) => ({
        jobs: state.jobs.map(j => j.id === id ? { ...j, status } : j)
      })),
      updateJob: (id, updatedJob) => set((state) => ({
        jobs: state.jobs.map(j => j.id === id ? { ...j, ...updatedJob } : j)
      })),
      removeJob: (id) => set((state) => ({
        jobs: state.jobs.filter(j => j.id !== id)
      }))
    }),
    {
      name: 'career-tracker-storage', // unique name for the IndexedDB key
      storage: createJSONStorage(() => storage),
    }
  )
);

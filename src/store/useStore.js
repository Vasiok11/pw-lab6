import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:3000/api';

const apiCall = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'API Error');
  }

  return method === 'GET' ? res.json() : null;
};

export const useStore = create((set, get) => ({
  // --- AUTH STATE ---
  token: localStorage.getItem('api_token') || null,
  role: localStorage.getItem('api_role') || null,
  username: localStorage.getItem('api_username') || null,
  isInitialized: false,

  login: async (username, role) => {
    const res = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, role }),
    });
    if (!res.ok) throw new Error('Failed to get token');
    const data = await res.json();
    localStorage.setItem('api_token', data.token);
    localStorage.setItem('api_role', role);
    localStorage.setItem('api_username', username);
    set({ token: data.token, role, username });
  },

  logout: () => {
    localStorage.removeItem('api_token');
    localStorage.removeItem('api_role');
    localStorage.removeItem('api_username');
    set({ token: null, role: null, username: null });
  },

  initData: async () => {
    try {
      const [skills, projects, jobs, learningResources] = await Promise.all([
        apiCall('/skills'),
        apiCall('/projects'),
        apiCall('/jobs'),
        apiCall('/learning'),
      ]);
      set({ skills, projects, jobs, learningResources, isInitialized: true });
    } catch (e) {
      console.error('[Data] Failed to load entities from backend.', e);
      set({ isInitialized: true });
    }
  },

  // --- SKILLS STATE ---
  skills: [],
  addSkill: async (skill) => {
    const proficiencyToLevel = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
    const newSkill = {
      id: uuidv4(),
      level: proficiencyToLevel[skill.proficiency] ?? 1,
      ...skill,
    };
    await apiCall('/skills', 'POST', newSkill, get().token);
    set((state) => ({ skills: [...state.skills, newSkill] }));
  },
  removeSkill: async (id) => {
    await apiCall(`/skills/${id}`, 'DELETE', null, get().token);
    set((state) => ({ skills: state.skills.filter((s) => s.id !== id) }));
  },
  updateSkill: async (id, updatedSkill) => {
    const proficiencyToLevel = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
    const payload = updatedSkill.proficiency
      ? { ...updatedSkill, level: proficiencyToLevel[updatedSkill.proficiency] ?? 1 }
      : updatedSkill;
    await apiCall(`/skills/${id}`, 'PUT', payload, get().token);
    set((state) => ({
      skills: state.skills.map((s) => (s.id === id ? { ...s, ...payload } : s)),
    }));
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
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
  },
  updateProject: async (id, updatedProject) => {
    await apiCall(`/projects/${id}`, 'PUT', updatedProject, get().token);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updatedProject } : p)),
    }));
  },
  toggleProjectHighlight: async (id) => {
    const project = get().projects.find((p) => p.id === id);
    if (project) {
      const toggledStatus = project.highlighted ? 0 : 1;
      await apiCall(`/projects/${id}`, 'PUT', { highlighted: toggledStatus }, get().token);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, highlighted: toggledStatus } : p
        ),
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
      learningResources: state.learningResources.map((r) =>
        r.id === id ? { ...r, progress, status } : r
      ),
    }));
  },
  updateResource: async (id, updatedResource) => {
    await apiCall(`/learning/${id}`, 'PUT', updatedResource, get().token);
    set((state) => ({
      learningResources: state.learningResources.map((r) =>
        r.id === id ? { ...r, ...updatedResource } : r
      ),
    }));
  },
  removeResource: async (id) => {
    await apiCall(`/learning/${id}`, 'DELETE', null, get().token);
    set((state) => ({
      learningResources: state.learningResources.filter((r) => r.id !== id),
    }));
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
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, status } : j)),
    }));
  },
  updateJob: async (id, updatedJob) => {
    await apiCall(`/jobs/${id}`, 'PUT', updatedJob, get().token);
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...updatedJob } : j)),
    }));
  },
  removeJob: async (id) => {
    await apiCall(`/jobs/${id}`, 'DELETE', null, get().token);
    set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) }));
  },
}));

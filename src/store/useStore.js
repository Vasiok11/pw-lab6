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

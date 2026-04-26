import { useState } from 'react';
import { useStore } from '../store/useStore';
import { PlusSquare } from 'lucide-react';

export default function AddProjectForm() {
  const addProject = useStore((state) => state.addProject);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techKeys, setTechKeys] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [highlighted, setHighlighted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    // Convert comma string to an array: "React, Tailwind, Node" -> ["React", "Tailwind", "Node"]
    const techStack = techKeys
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addProject({
      name: name.trim(),
      description: description.trim(),
      techStack,
      repoLink: repoLink.trim(),
      liveLink: liveLink.trim(),
      highlighted,
      status: 'completed', // defaulted
    });

    // Reset form
    setName('');
    setDescription('');
    setTechKeys('');
    setRepoLink('');
    setLiveLink('');
    setHighlighted(false);
  };

  return (
    <div className="cyber-panel mb-8 p-6">
      <h3 className="text-xl font-bold uppercase tracking-widest text-[var(--border-accent)] mb-4">
        + Add_Project
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Name */}
          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Project Name *</label>
            <input 
              required
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Career Tracker Dashboard"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow text-sm"
            />
          </div>

          {/* Tech Stack */}
          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Tech Stack (Comma Separated)</label>
            <input 
              type="text" 
              value={techKeys} 
              onChange={(e) => setTechKeys(e.target.value)}
              placeholder="e.g., React, Tailwind, Zustand"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col w-full">
          <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Description *</label>
          <textarea 
            required
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the application's core functionality..."
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow text-sm min-h-[80px]"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Repo Link */}
          <div className="flex flex-col w-full md:w-2/5">
            <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Repository URL</label>
            <input 
              type="url" 
              value={repoLink} 
              onChange={(e) => setRepoLink(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow text-sm"
            />
          </div>

          {/* Live Link */}
          <div className="flex flex-col w-full md:w-2/5">
            <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Live Deployment URL</label>
            <input 
              type="url" 
              value={liveLink} 
              onChange={(e) => setLiveLink(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow text-sm"
            />
          </div>

          {/* Highlight Toggle */}
          <div className="w-full md:w-1/5 flex items-center gap-2 h-[38px]">
            <input 
              type="checkbox" 
              id="highlight" 
              checked={highlighted}
              onChange={(e) => setHighlighted(e.target.checked)}
              className="accent-[var(--border-accent)] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="highlight" className="text-xs uppercase font-bold cursor-pointer opacity-80">
              Star Project?
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="cyber-button mt-4 w-full md:w-auto self-end flex items-center justify-center gap-2 h-[42px] px-8 bg-[var(--bg-primary)] text-neon-pink border-[var(--border-accent)] hover:bg-[var(--hover-accent)] hover:text-[var(--hover-text)]"
        >
          <PlusSquare size={18} />
          <span>COMMIT_RECORD</span>
        </button>
      </form>
    </div>
  );
}

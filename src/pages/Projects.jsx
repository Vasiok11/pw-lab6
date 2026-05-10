import { useState, useMemo } from 'react';
import AddProjectForm from '../components/AddProjectForm';
import ProjectCard from '../components/ProjectCard';
import { useStore } from '../store/useStore';
import { Search, Star } from 'lucide-react';

export default function Projects() {
  const projects = useStore((state) => state.projects);
  const role = useStore((state) => state.role);
  const canWrite = role === 'admin' || role === 'writer';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHighlight, setFilterHighlight] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = 
        (project.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||       
        (project.techStack || []).some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesHighlight = filterHighlight ? project.highlighted : true;
      return matchesSearch && matchesHighlight;
    });
  }, [projects, searchQuery, filterHighlight]);

  return (
    <div className="flex flex-col gap-6">
      <div className="cyber-panel p-8">
        <h2 className="text-3xl font-black text-neon-pink uppercase tracking-widest mb-6">
          &gt;&gt; PROJECTS
        </h2>
        <p className="opacity-80 flex items-center justify-between">
          Showcase your portfolio and track your successful projects.
        </p>
      </div>

      {canWrite && <AddProjectForm />}

      {/* Projects Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-[var(--border-accent)] border-opacity-30 pb-4">
        {/* Search */}
        <div className="relative w-full md:w-2/3">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--border-accent)] opacity-70" />
          <input 
            type="text" 
            placeholder="Search records or stack tags (e.g., React, Node)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] pl-10 pr-4 py-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow placeholder-opacity-40"
          />
        </div>

        {/* Highlight Filter Toggle */}
        <button
          onClick={() => setFilterHighlight(!filterHighlight)}
          className={`cyber-button w-full md:w-auto shrink-0 flex justify-center items-center gap-2 h-[42px] px-6 text-xs transition-shadow ${
            filterHighlight 
              ? 'bg-neon-pink text-[var(--bg-panel)] shadow-[0_0_10px_rgba(255,0,255,0.6)]' 
              : 'bg-transparent text-[var(--text-muted)] hover:text-neon-pink border-[var(--border-accent)]'
          }`}
        >
          <Star size={16} fill={filterHighlight ? "currentColor" : "none"} />
          <span>{filterHighlight ? 'SHOW ALL' : 'SHOW STARRED ONLY'}</span>
        </button>
      </div>

      {/* Render Grid of Projects */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center opacity-50 border border-dashed border-[var(--border-accent)] mt-4 font-mono uppercase tracking-widest text-sm">
          [QUERY_FAILED: NO_DEPLOYMENTS_FOUND]
        </div>
      )}
    </div>
  );
}

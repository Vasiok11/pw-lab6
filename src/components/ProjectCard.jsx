import { useState } from 'react';
import { Trash2, Edit2, X, Check, Star, GitBranch, ExternalLink, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ProjectCard({ project }) {
  const removeProject = useStore((state) => state.removeProject);
  const updateProject = useStore((state) => state.updateProject);
  const toggleProjectHighlight = useStore((state) => state.toggleProjectHighlight);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name || '');
  const [editDescription, setEditDescription] = useState(project.description || '');  
  const [editTechKeys, setEditTechKeys] = useState((project.techStack || []).join(', '));
  const [editRepoLink, setEditRepoLink] = useState(project.repoLink || '');
  const [editLiveLink, setEditLiveLink] = useState(project.liveLink || '');

  const handleSave = () => {
    if (!editName.trim() || !editDescription.trim()) return;
    
    updateProject(project.id, {
      name: editName.trim(),
      description: editDescription.trim(),
      techStack: editTechKeys.split(',').map(t => t.trim()).filter(Boolean),
      repoLink: editRepoLink.trim(),
      liveLink: editLiveLink.trim(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(project.name || '');
    setEditDescription(project.description || '');
    setEditTechKeys((project.techStack || []).join(', '));
    setEditRepoLink(project.repoLink || '');
    setEditLiveLink(project.liveLink || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="cyber-panel p-5 border-l-[3px] border-l-neon-pink">
        <div className="flex flex-col gap-3">
          <label className="text-[10px] uppercase font-bold opacity-70">Project Name</label>
          <input 
            type="text" 
            value={editName} 
            onChange={(e) => setEditName(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm"
          />
          
          <label className="text-[10px] uppercase font-bold opacity-70 mt-1">Description</label>
          <textarea 
            value={editDescription} 
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm min-h-[60px]"
          />
          
          <label className="text-[10px] uppercase font-bold opacity-70 mt-1">Tech Stack (comma separated)</label>
          <input 
            type="text" 
            value={editTechKeys} 
            onChange={(e) => setEditTechKeys(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm"
          />

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 shrink-0">
               <label className="text-[10px] uppercase font-bold opacity-70 mt-1">Repo URL</label>
               <input 
                 type="url" 
                 value={editRepoLink} 
                 onChange={(e) => setEditRepoLink(e.target.value)}
                 className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm"
               />
            </div>
            <div className="flex-1 shrink-0">
               <label className="text-[10px] uppercase font-bold opacity-70 mt-1">Live URL</label>
               <input 
                 type="url" 
                 value={editLiveLink} 
                 onChange={(e) => setEditLiveLink(e.target.value)}
                 className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm"
               />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-3">
            <button onClick={handleCancel} className="flex items-center gap-1 p-2 text-[var(--text-muted)] hover:text-red-500 transition-all text-xs font-bold uppercase border border-transparent hover:border-red-500">
              <X size={14} /> Abort
            </button>
            <button onClick={handleSave} className="flex items-center gap-1 p-2 text-neon-pink transition-all text-xs font-bold uppercase border border-[var(--border-accent)] hover:border-neon-pink">
              <Check size={14} /> Re-Inject
            </button>
          </div>
        </div>
      </div>
    );
  }

  const borderClass = project.highlighted ? 'border-l-[4px] border-l-neon-pink shadow-[0_0_15px_rgba(255,0,255,0.4)]' : 'border-l-[2px] border-l-[var(--border-accent)] opacity-90 hover:opacity-100';

  return (
    <div className={`cyber-panel p-5 transition-transform duration-200 cursor-default flex flex-col ${borderClass}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3 border-b border-[var(--border-accent)] border-opacity-30 pb-3">
        <h4 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2">
          <Activity size={20} className={project.highlighted ? 'text-neon-pink' : 'text-[var(--border-accent)]'} /> 
          {project.name}
        </h4>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Liking/starring a project */}
          <button
            onClick={() => toggleProjectHighlight(project.id)}
            className={`transition-all p-1 ${project.highlighted ? 'text-neon-pink hover:text-white drop-shadow-[0_0_8px_#f0f]' : 'text-[var(--text-muted)] hover:text-neon-pink'}`}
            aria-label="Toggle Highlight"
          >
            <Star size={18} fill={project.highlighted ? "currentColor" : "none"} />
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="text-[var(--text-muted)] hover:text-[var(--hover-accent)] p-1 ml-2"
            aria-label="Edit Record"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => removeProject(project.id)}
            className="text-[var(--text-muted)] hover:text-red-500 p-1"
            aria-label="Erase Record"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="text-sm opacity-80 mb-4 flex-1">
        {project.description}
      </div>

      {/* Tech Stack Tags */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, idx) => (
            <span key={idx} className="text-[var(--border-accent)] border border-[var(--border-accent)] text-[10px] font-mono uppercase px-2 py-1">
              #{tech}
            </span>
          ))}
        </div>
      )}

      {/* External Links */}
      <div className="flex gap-4 mt-auto pt-2 border-t border-[var(--border-accent)] border-opacity-20 text-xs font-bold uppercase tracking-wider">
        {project.repoLink && (
           <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-neon-pink transition-colors">
             <GitBranch size={14} /> Repository
           </a>
        )}
        {project.liveLink && (
           <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-neon-pink transition-colors">
             <ExternalLink size={14} /> Live Node
           </a>
        )}
      </div>

    </div>
  );
}

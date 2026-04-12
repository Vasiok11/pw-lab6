import { useState } from 'react';
import { Trash2, Terminal, Edit2, X, Check, BrainCircuit } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function SkillCard({ skill }) {
  const removeSkill = useStore((state) => state.removeSkill);
  const updateSkill = useStore((state) => state.updateSkill);
  const learningResources = useStore((state) => state.learningResources);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(skill.name);
  const [editCategory, setEditCategory] = useState(skill.category);
  const [editProficiency, setEditProficiency] = useState(skill.proficiency);    
  const [editLinkedResources, setEditLinkedResources] = useState(skill.linkedResources || []);

  // Map proficiency strings to numerical levels (1 to 4) for our visual blocks 
  const proficiencyLevels = {
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3,
    'Expert': 4
  };

  const level = proficiencyLevels[skill.proficiency] || 1;

  const toggleResourceLink = (resourceId) => {
    if (editLinkedResources.includes(resourceId)) {
      setEditLinkedResources(editLinkedResources.filter(id => id !== resourceId));
    } else {
      setEditLinkedResources([...editLinkedResources, resourceId]);
    }
  };

  const handleSave = () => {
    if (!editName.trim()) return;
    updateSkill(skill.id, {
      name: editName.trim(),
      category: editCategory,
      proficiency: editProficiency,
      linkedResources: editLinkedResources
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(skill.name);
    setEditCategory(skill.category);
    setEditProficiency(skill.proficiency);
    setEditLinkedResources(skill.linkedResources || []);
    setIsEditing(false);
  };

  // Find linked resources mapped
  const linkedResourcesData = (skill.linkedResources || []).map(id => learningResources.find(r => r.id === id)).filter(Boolean);
  if (isEditing) {
    return (
      <div className="cyber-panel p-5 border-l-[3px] border-l-neon-pink">
        <div className="flex flex-col gap-3">
          <label className="text-[10px] uppercase font-bold opacity-70">Node Name</label>
          <input 
            type="text" 
            value={editName} 
            onChange={(e) => setEditName(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm"
          />
          
          <label className="text-[10px] uppercase font-bold opacity-70 mt-1">Category</label>
          <select 
            value={editCategory} 
            onChange={(e) => setEditCategory(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm cursor-pointer"
          >
            <option value="Language">Language</option>
            <option value="Framework">Framework</option>
            <option value="Database">Database</option>
            <option value="Tools">Dev Tool / DevOps</option>
            <option value="Soft Skill">Soft Skill</option>
          </select>
          
          <label className="text-[10px] uppercase font-bold opacity-70 mt-1">Proficiency</label>
          <select 
            value={editProficiency} 
            onChange={(e) => setEditProficiency(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm cursor-pointer"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>

          {/* New Linked Resources Selection Array */}
          <label className="text-[10px] uppercase font-bold opacity-70 mt-1 block">Linked Modules [Course Links]</label>
          <div className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-sm max-h-32 overflow-y-auto cyber-scrollbar">
            {learningResources.length === 0 ? (
              <span className="text-xs text-[var(--text-muted)] italic">No modules detected in system.</span>
            ) : (
               learningResources.map(resource => (
                 <label key={resource.id} className="flex items-center gap-2 cursor-pointer mb-1 hover:text-neon-pink transition-colors">
                   <input 
                     type="checkbox"
                     checked={editLinkedResources.includes(resource.id)}
                     onChange={(e) => {
                       if (e.target.checked) {
                         setEditLinkedResources([...editLinkedResources, resource.id]);
                       } else {
                         setEditLinkedResources(editLinkedResources.filter(id => id !== resource.id));
                       }
                     }}
                     className="cyber-checkbox"
                   />
                   <span className="truncate">{resource.title}</span>
                 </label>
               ))
            )}
          </div>

          <div className="flex justify-end gap-3 mt-3">
            <button 
              onClick={handleCancel} 
              className="flex items-center gap-1 p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500 hover:bg-opacity-10 border border-transparent hover:border-red-500 transition-all text-xs font-bold uppercase"
            >
              <X size={14} /> Abort
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 p-2 text-[var(--color-cyber-pink)] hover:bg-[var(--color-cyber-pink)] hover:bg-opacity-10 border border-[var(--border-accent)] hover:border-[var(--color-cyber-pink)] transition-all text-xs font-bold uppercase"
            >
              <Check size={14} /> Re-Inject
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-panel p-5 border-l-[3px] border-l-neon-pink hover:scale-[1.02] transition-transform duration-200 cursor-default">

      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
            <Terminal size={18} className="text-[var(--border-accent)]" /> {skill.name}
          </h4>
          <span className="text-xs font-mono font-bold uppercase text-[var(--border-accent)] px-2 py-1 rounded-sm border border-[var(--border-accent)] inline-block">
            {skill.category}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-[var(--text-muted)] hover:text-[var(--hover-accent)] hover:shadow-[0_0_8px_var(--shadow-accent)] transition-all p-1"
            aria-label="Edit Node"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => removeSkill(skill.id)}
            className="text-[var(--text-muted)] hover:text-red-500 hover:shadow-[0_0_8px_red] transition-all p-1"
            aria-label="Delete Node"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Proficiency Visualization */}
      <div className="mt-4">
        <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase opacity-80 mb-1">
          <span>Proficiency_Lv</span>
          <span className="text-neon-pink font-bold">{skill.proficiency}</span>
        </div>
        
        {/* Cyberpunk Progress Blocks */}
        <div className="flex gap-1 h-2">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`flex-1 transition-all ${
                i <= level 
                  ? 'bg-[var(--border-accent)] shadow-[0_0_5px_var(--border-accent)]' 
                  : 'bg-transparent border border-[var(--border-accent)] opacity-30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Linked Resources ReadOnly View */}
      {(skill.linkedResources && skill.linkedResources.length > 0) && (
        <div className="mt-4 pt-4 border-t border-[var(--border-accent)] border-opacity-30">
          <div className="text-[10px] font-mono tracking-widest uppercase opacity-80 mb-2 flex items-center gap-1">
            <BrainCircuit size={12} className="text-neon-pink" />
            <span>Linked_Modules</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skill.linkedResources.map(id => {
              const res = learningResources.find(r => r.id === id);
              if (!res) return null;
              return (
                <a 
                  key={id}
                  href={res.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[var(--bg-primary)] border border-neon-pink text-neon-pink px-2 py-1 flex items-center gap-1 hover:bg-[var(--color-cyber-pink)] hover:text-white hover:shadow-[0_0_5px_var(--color-cyber-pink)] transition-all truncate max-w-full"
                  title={res.title}
                >
                  {res.title}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


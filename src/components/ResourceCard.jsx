import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, Edit2, Link as LinkIcon, BookOpen, MonitorPlay, FileText, CheckCircle2 } from 'lucide-react';

export default function ResourceCard({ resource }) {
  const removeResource = useStore((state) => state.removeResource);
  const updateResourceProgress = useStore((state) => state.updateResourceProgress);

  // We will expand on this edit state in step 7.4! 
  // For now, we only handle tracking progress and removing the resource.
  const [isEditing, setIsEditing] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'Course': return <MonitorPlay size={16} />;
      case 'Book': return <BookOpen size={16} />;
      case 'Video': return <MonitorPlay size={16} />;
      case 'Docs': return <FileText size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const handleProgressChange = (e) => {
    const newProgress = parseInt(e.target.value, 10);
    updateResourceProgress(resource.id, newProgress);
  };

  const isCompleted = resource.progress === 100;

  return (
    <div className={`cyber-panel p-5 transition-transform duration-200 flex flex-col ${isCompleted ? 'border-l-[4px] border-l-neon-pink opacity-80' : 'border-l-[2px] border-l-[var(--border-accent)]'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3 border-b border-[var(--border-accent)] border-opacity-30 pb-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest flex items-center gap-1 mb-1">
            {getIcon(resource.type)} {resource.type}
          </span>
          <h4 className="text-lg font-bold uppercase tracking-widest text-[var(--text-primary)]">
            {resource.title}
          </h4>
          {resource.author && (
            <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1 uppercase">
              By: {resource.author}
            </span>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* We will attach the edit toggle here in 7.4 */}
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-[var(--text-muted)] hover:text-[var(--hover-accent)] p-1 transition-colors"
            title="Edit Resource"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => removeResource(resource.id)}
            className="text-[var(--text-muted)] hover:text-red-500 p-1 transition-colors"
            title="Delete Resource"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* External Link */}
      {resource.source && (
        <a 
          href={resource.source} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs font-mono text-[var(--border-accent)] hover:text-neon-pink flex items-center gap-1 mb-4 opacity-80"
        >
          <LinkIcon size={12} /> Source Data Node
        </a>
      )}

      {/* Progress Section */}
      <div className="mt-auto pt-2 grid grid-cols-[1fr_auto] gap-4 items-center">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest opacity-80">
            <span>Download Progress</span>
            <span className={isCompleted ? 'text-neon-pink' : 'text-[var(--text-primary)]'}>
              {resource.progress}%
            </span>
          </div>
          
          {/* Slider */}
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="5"
            value={resource.progress}
            onChange={handleProgressChange}
            className="w-full h-2 bg-[var(--bg-primary)] border border-[var(--border-accent)] appearance-none cursor-pointer outline-none accent-neon-pink slider-thumb-cyber"
            // Example of a fallback styling trick if custom slider thumb isn't defined explicitly:
            style={{ accentColor: 'var(--color-cyber-pink)' }}
          />
        </div>

        {/* Completion checkmark */}
        <div className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-full border border-[var(--border-accent)] ${isCompleted ? 'bg-neon-pink bg-opacity-20 text-neon-pink border-neon-pink shadow-[0_0_10px_#f0f]' : 'text-[var(--text-muted)] opacity-50'}`}>
          <CheckCircle2 size={18} />
        </div>
      </div>

    </div>
  );
}

import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, Edit2, Link as LinkIcon, BookOpen, MonitorPlay, FileText, CheckCircle2, X, Check } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

export default function ResourceCard({ resource }) {
  const removeResource = useStore((state) => state.removeResource);
  const updateResourceProgress = useStore((state) => state.updateResourceProgress);
  const updateResource = useStore((state) => state.updateResource);
  const role = useStore((state) => state.role);
  const canWrite = role === 'admin' || role === 'writer';
  const canDelete = role === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editTitle, setEditTitle] = useState(resource.title || '');
  const [editAuthor, setEditAuthor] = useState(resource.author || '');
  const [editType, setEditType] = useState(resource.type || 'Course');
  const [editSource, setEditSource] = useState(resource.source || '');

  const handleSave = () => {
    if (!editTitle.trim()) return;
    updateResource(resource.id, {
      title: editTitle.trim(),
      author: editAuthor.trim(),
      type: editType,
      source: editSource.trim()
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(resource.title || '');
    setEditAuthor(resource.author || '');
    setEditType(resource.type || 'Course');
    setEditSource(resource.source || '');
    setIsEditing(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Course': return <MonitorPlay size={16} />;
      case 'Book': return <BookOpen size={16} />;
      case 'Video': return <MonitorPlay size={16} />;
      case 'Docs': return <FileText size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const [localProgress, setLocalProgress] = useState(resource.progress);

  const handleProgressChange = (e) => {
    setLocalProgress(parseInt(e.target.value, 10));
  };

  const handleProgressCommit = () => {
    if (localProgress !== resource.progress) {
      updateResourceProgress(resource.id, localProgress);
    }
  };

  const isCompleted = localProgress === 100;

  if (isEditing) {
    return (
      <div className="cyber-panel p-5 border-l-[3px] border-l-neon-pink">
        <div className="flex flex-col gap-3">
          <label className="text-[10px] uppercase font-bold opacity-70">Resource Title</label>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm"
          />

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold opacity-70 mt-1">Author</label>
              <input
                type="text"
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold opacity-70 mt-1">Format</label>
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                className="w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none cursor-pointer uppercase text-xs font-bold tracking-wider"
              >
                <option value="Course">COURSE</option>
                <option value="Book">BOOK</option>
                <option value="Article">ARTICLE</option>
                <option value="Video">VIDEO</option>
                <option value="Docs">DOCUMENTATION</option>
              </select>
            </div>
          </div>

          <label className="text-[10px] uppercase font-bold opacity-70 mt-1">
            {editType === 'Book' ? 'Publisher / ISBN' : 'Source URL'}
          </label>
          <input
            type="text"
            value={editSource}
            onChange={(e) => setEditSource(e.target.value)}
            placeholder={editType === 'Book' ? "e.g., O'Reilly — 978-1491950357" : 'https://...'}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm"
          />

          <div className="flex justify-end gap-3 mt-3">
            <button onClick={handleCancel} className="flex items-center gap-1 p-2 text-[var(--text-muted)] hover:text-red-500 transition-all text-xs font-bold uppercase border border-transparent hover:border-red-500">
              <X size={14} /> Abort
            </button>
              <button onClick={handleSave} className="flex items-center gap-1 p-2 text-[var(--color-cyber-pink)] hover:bg-[var(--color-cyber-pink)] hover:text-white transition-all text-xs font-bold uppercase border border-[var(--border-accent)] hover:border-[var(--color-cyber-pink)]">
              <Check size={14} /> Re-Inject
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          {canWrite && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[var(--text-muted)] hover:text-[var(--hover-accent)] p-1 transition-colors"
              title="Edit Resource"
            >
              <Edit2 size={16} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-[var(--text-muted)] hover:text-red-500 p-1 transition-colors"
              title="Delete Resource"
            >
              <Trash2 size={16} />
            </button>
          )}
          {confirmDelete && (
            <ConfirmDialog
              message={`Permanently delete "${resource.title}"?`}
              onConfirm={() => { setConfirmDelete(false); removeResource(resource.id); }}
              onCancel={() => setConfirmDelete(false)}
            />
          )}
        </div>
      </div>

      {/* External Link — hidden for books since source is publisher/ISBN, not a URL */}
      {resource.source && resource.type !== 'Book' && (
        <a
          href={resource.source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-[var(--border-accent)] hover:text-neon-pink flex items-center gap-1 mb-4 opacity-80"
        >
          <LinkIcon size={12} /> Source
        </a>
      )}

      {/* Progress Section */}
      <div className="mt-auto pt-2 grid grid-cols-[1fr_auto] gap-4 items-center">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest opacity-80">
            <span>Progress</span>
            <span className={isCompleted ? 'text-neon-pink' : 'text-[var(--text-primary)]'}>
              {localProgress}%
            </span>
          </div>
          
          {/* Slider — updates locally on drag, saves to API only on release */}
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={localProgress}
            onChange={canWrite ? handleProgressChange : undefined}
            onMouseUp={canWrite ? handleProgressCommit : undefined}
            onTouchEnd={canWrite ? handleProgressCommit : undefined}
            readOnly={!canWrite}
            className={`w-full h-2 bg-[var(--bg-primary)] border border-[var(--border-accent)] appearance-none outline-none accent-neon-pink slider-thumb-cyber ${canWrite ? 'cursor-pointer' : 'cursor-default opacity-60'}`}
            style={{ accentColor: 'var(--color-cyber-pink)' }}
          />
        </div>

        {/* Completion checkmark */}
        <div className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-full border border-[var(--border-accent)] ${isCompleted ? 'bg-transparent text-neon-pink border-neon-pink shadow-[0_0_10px_#f0f]' : 'text-[var(--text-muted)] opacity-50'}`}>
          <CheckCircle2 size={18} />
        </div>
      </div>

    </div>
  );
}


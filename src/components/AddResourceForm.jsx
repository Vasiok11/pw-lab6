import { useState } from 'react';
import { useStore } from '../store/useStore';
import { BrainCircuit } from 'lucide-react';

export default function AddResourceForm() {
  const addResource = useStore((state) => state.addResource);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Course');
  const [source, setSource] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addResource({
      title: title.trim(),
      type,
      source: source.trim(),
      progress: 0,
      status: 'learning', // Default initialization
    });

    // Reset form
    setTitle('');
    setType('Course');
    setSource('');
  };

  return (
    <div className="cyber-panel mb-8 p-6">
      <h3 className="text-xl font-bold uppercase tracking-widest text-[var(--border-accent)] mb-4">
        + Inject_Knowledge_Stream
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        {/* Title */}
        <div className="flex flex-col w-full md:w-2/5">
          <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Resource Title *</label>
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Epic React by Kent C. Dodds"
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow text-sm"
          />
        </div>

        {/* Source URL/Platform */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Source URL</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="https://..."
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow text-sm"
          />
        </div>

        {/* Type Dropdown */}
        <div className="flex flex-col w-full md:w-1/5">
          <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Format</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow cursor-pointer text-sm font-bold uppercase tracking-wider"
          >
            <option value="Course">COURSE</option>
            <option value="Book">BOOK</option>
            <option value="Article">ARTICLE</option>
            <option value="Video">VIDEO</option>
            <option value="Docs">DOCUMENTATION</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="cyber-button w-full md:w-auto shrink-0 flex items-center justify-center gap-2 h-[38px] px-6 bg-[var(--bg-primary)] text-neon-pink border-[var(--border-accent)] hover:bg-[var(--hover-accent)] hover:text-[var(--hover-text)]"
        >
          <BrainCircuit size={16} />
          <span>INITIALIZE</span>
        </button>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { useStore } from '../store/useStore';
import { PlusSquare } from 'lucide-react';

export default function AddSkillForm() {
  const addSkill = useStore((state) => state.addSkill);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Language');
  const [proficiency, setProficiency] = useState('Beginner');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSkill({
      name: name.trim(),
      category,
      proficiency,
    });

    setName('');
    // Resetting category/proficiency is optional, but often nice to leave them for rapid multi-add
  };

  return (
    <div className="cyber-panel mb-8 p-6">
      <h3 className="text-xl font-bold uppercase tracking-widest text-[var(--border-accent)] mb-4">
        + Add_New_Skill
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        {/* Name Input */}
        <div className="flex flex-col w-full">
          <label className="text-xs uppercase font-bold opacity-70 mb-1">
            Skill Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., React, Python, Docker"
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow placeholder-opacity-40"
          />
        </div>

        {/* Category Select */}
        <div className="flex flex-col w-full md:w-48 shrink-0">
          <label className="text-xs uppercase font-bold opacity-70 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow cursor-pointer"
          >
            <option value="Language">Language</option>
            <option value="Framework">Framework</option>
            <option value="Database">Database</option>
            <option value="Tools">Dev Tool / DevOps</option>
            <option value="Soft Skill">Soft Skill</option>
          </select>
        </div>

        {/* Proficiency Select */}
        <div className="flex flex-col w-full md:w-48 shrink-0">
          <label className="text-xs uppercase font-bold opacity-70 mb-1">
            Proficiency
          </label>
          <select
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow cursor-pointer"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="cyber-button flex items-center justify-center gap-2 h-[42px] px-6 bg-[var(--bg-primary)] text-neon-pink border-[var(--border-accent)] hover:bg-[var(--hover-accent)] hover:text-[var(--hover-text)]"
        >
          <PlusSquare size={18} />
          <span>INJECT</span>
        </button>
      </form>
    </div>
  );
}

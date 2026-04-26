import { useState, useMemo } from 'react';
import AddSkillForm from '../components/AddSkillForm';
import SkillCard from '../components/SkillCard';
import { useStore } from '../store/useStore';
import { Search, Filter } from 'lucide-react';

export default function Skills() {
  const skills = useStore((state) => state.skills);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch = (skill.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || skill.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [skills, searchQuery, categoryFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="cyber-panel p-8">
        <h2 className="text-3xl font-black text-neon-pink uppercase tracking-widest mb-6">
          &gt;&gt; SKILLS
        </h2>
        <p className="opacity-80">
          Manage and organize your technical and professional skills.
        </p>
      </div>

      {/* Render the form here! */}
      <AddSkillForm />

      {/* Search and Filters Toolbar */}
      <div className="w-full flex  flex-col md:flex-row gap-4 items-center justify-between border-b border-[var(--border-accent)] border-opacity-30 pb-4">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-1/2">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--border-accent)] opacity-70" />
          <input 
            type="text" 
            placeholder="Query skill names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] pl-10 pr-4 py-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow placeholder-opacity-40"
          />
        </div>

        {/* Category Filter */}
        <div className="relative w-full md:w-auto min-w-[200px]">
          <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--border-accent)] opacity-70 pointer-events-none" />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border-accent)] pl-10 pr-8 py-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow cursor-pointer uppercase text-xs font-bold tracking-wider"
          >
            <option value="All">ALL_CATEGORIES</option>
            <option value="Language">LANGUAGE</option>
            <option value="Framework">FRAMEWORK</option>
            <option value="Database">DATABASE</option>
            <option value="Tools">DEV_TOOLS</option>
            <option value="Soft Skill">SOFT_SKILLS</option>
          </select>
        </div>

      </div>

      {/* Render the filtered grid of skills */}
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center opacity-50 border border-dashed border-[var(--border-accent)] mt-4 font-mono uppercase tracking-widest text-sm">
          [QUERY_FAILED: NO_MATCHING_DATA_FOUND]
        </div>
      )}
    </div>
  );
}
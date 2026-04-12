import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import AddResourceForm from '../components/AddResourceForm';
import ResourceCard from '../components/ResourceCard';
import { Search, Filter } from 'lucide-react';

export default function Learning() {
  const learningResources = useStore((state) => state.learningResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredResources = useMemo(() => {
    if (!learningResources) return [];
    return learningResources.filter((resource) => {
      const matchesSearch = 
        (resource.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (resource.author || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || resource.type === filterType; 
      return matchesSearch && matchesType;
    });
  }, [learningResources, searchQuery, filterType]);

  return (
    <div className="flex flex-col gap-6">
      <div className="cyber-panel p-8">
        <h2 className="text-3xl font-black text-neon-pink uppercase tracking-widest mb-6">
          &gt;&gt; DATA_ACQUISITION
        </h2>
        <p className="opacity-80 flex items-center justify-between">
          Course feeds and book uploads active. Download in progress...
        </p>
      </div>

      <AddResourceForm />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-[var(--border-accent)] border-opacity-30 pb-4">
        <div className="relative w-full md:w-1/2">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--border-accent)] opacity-70" />
          <input
            type="text"
            placeholder="Search titles or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] pl-10 pr-4 py-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow placeholder-opacity-40"
          />
        </div>

        <div className="relative w-full md:w-auto min-w-[200px]">
          <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--border-accent)] opacity-70 pointer-events-none" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border-accent)] pl-10 pr-8 py-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow cursor-pointer uppercase text-xs font-bold tracking-wider"
          >
            <option value="All">ALL_FORMATS</option>
            <option value="Course">COURSE</option>
            <option value="Book">BOOK</option>
            <option value="Article">ARTICLE</option>
            <option value="Video">VIDEO</option>
            <option value="Docs">DOCUMENTATION</option>
          </select>
        </div>
      </div>

      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center opacity-50 border border-dashed border-[var(--border-accent)] mt-4 font-mono uppercase tracking-widest text-sm">
          [QUERY_FAILED: NO_KNOWLEDGE_BANKS_FOUND]
        </div>
      )}
    </div>
  );
}
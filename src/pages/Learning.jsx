import { useStore } from '../store/useStore';
import AddResourceForm from '../components/AddResourceForm';
import ResourceCard from '../components/ResourceCard';

export default function Learning() {
  const learningResources = useStore((state) => state.learningResources);

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

      {learningResources && learningResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
          {learningResources.map((resource) => (
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
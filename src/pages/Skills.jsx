import AddSkillForm from '../components/AddSkillForm';
import SkillCard from '../components/SkillCard';
import { useStore } from '../store/useStore';

export default function Skills() {
  const skills = useStore((state) => state.skills);

  return (
    <div className="flex flex-col gap-6">
      <div className="cyber-panel p-8">
        <h2 className="text-3xl font-black text-neon-pink uppercase tracking-widest mb-6">
          &gt;&gt; SKILL_DATABASE
        </h2>
        <p className="opacity-80">
          Neural link stable. Standardize and inject your proficiency nodes below.
        </p>
      </div>

      {/* Render the form here! */}
      <AddSkillForm />
      
      {/* Render the grid of skills */}
      {skills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center opacity-50 border border-dashed border-[var(--border-accent)] mt-4">
          [DATABASE EMPTY: NO SKILLS DETECTED]
        </div>
      )}
    </div>
  );
}
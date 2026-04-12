import { Trash2, Terminal } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function SkillCard({ skill }) {
  const removeSkill = useStore((state) => state.removeSkill);

  // Map proficiency strings to numerical levels (1 to 4) for our visual blocks
  const proficiencyLevels = {
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3,
    'Expert': 4
  };
  
  const level = proficiencyLevels[skill.proficiency] || 1;

  return (
    <div className="cyber-panel p-5 border-l-[3px] border-l-neon-pink hover:scale-[1.02] transition-transform duration-200 cursor-default">
      
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
            <Terminal size={18} className="text-[var(--border-accent)]" /> {skill.name}
          </h4>
          <span className="text-xs font-mono font-bold uppercase bg-[var(--border-accent)] bg-opacity-20 text-[var(--text-primary)] px-2 py-1 rounded-sm border border-[var(--border-accent)] border-opacity-50 inline-block">
            {skill.category}
          </span>
        </div>
        
        <button 
          onClick={() => removeSkill(skill.id)}
          className="text-[var(--text-muted)] hover:text-red-500 hover:shadow-[0_0_8px_red] transition-all p-1"
          aria-label="Delete Node"
        >
          <Trash2 size={18} />
        </button>
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

    </div>
  );
}

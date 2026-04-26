import { useStore } from '../store/useStore';
import { Activity, Briefcase, Code2, BrainCircuit, Star, ExternalLink, Calendar, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { skills, projects, learningResources, jobs } = useStore();

  // Quick Analytics
  const topProjects = projects.filter(p => p.highlighted).slice(0, 3);
  const activeJobs = jobs.filter(j => j.status === 'Interviewing' || j.status === 'Offer');
  
  const completedResources = learningResources.filter(r => r.progress === 100).length;
  const learningProgress = learningResources.filter(r => r.progress > 0 && r.progress < 100).length;

  const handleExport = () => {
    const data = { skills, projects, learningResources, jobs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cyber-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Panel */}
      <div className="cyber-panel p-8 border-l-[4px] border-l-neon-pink">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-neon-pink uppercase tracking-widest mb-2 flex items-center gap-3">
              <Activity size={28} /> &gt;&gt; OVERVIEW
            </h2>
            <p className="opacity-80 font-mono text-sm">
              Overview of your career progress. Tracking {skills.length + projects.length + learningResources.length + jobs.length} total items.
            </p>
          </div>
          <div className="text-right flex flex-col md:items-end">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--border-accent)] opacity-70">System Status</span>
            <span className="font-mono text-green-400 bg-green-400 bg-opacity-10 px-2 py-1 border border-green-500 uppercase tracking-widest text-xs font-bold inline-block mt-1">
              OPTIMAL
            </span>
          </div>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Skills Metric */}
        <Link to="/skills" className="cyber-panel p-6 hover:shadow-[0_0_15px_var(--color-cyber-blue)] transition-shadow group flex flex-col items-center justify-center text-center gap-2 border-l-[2px] border-[var(--border-accent)] hover:border-neon-pink cursor-pointer">
          <Code2 size={24} className="text-[var(--text-muted)] group-hover:text-neon-pink transition-colors" />
          <span className="text-4xl font-black text-[var(--text-primary)]">{skills.length}</span>
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Injected Skills</span>
        </Link>
        
        {/* Projects Metric */}
        <Link to="/projects" className="cyber-panel p-6 hover:shadow-[0_0_15px_var(--color-cyber-blue)] transition-shadow group flex flex-col items-center justify-center text-center gap-2 border-l-[2px] border-[var(--border-accent)] hover:border-neon-pink cursor-pointer">
          <Star size={24} className="text-[var(--text-muted)] group-hover:text-neon-pink transition-colors" />
          <span className="text-4xl font-black text-[var(--text-primary)]">{projects.length}</span>
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Deployments</span>
        </Link>

        {/* Learning Metric */}
        <Link to="/learning" className="cyber-panel p-6 hover:shadow-[0_0_15px_var(--color-cyber-blue)] transition-shadow group flex flex-col items-center justify-center text-center gap-2 border-l-[2px] border-[var(--border-accent)] hover:border-neon-pink cursor-pointer">
          <BrainCircuit size={24} className="text-[var(--text-muted)] group-hover:text-neon-pink transition-colors" />
          <span className="text-4xl font-black text-[var(--text-primary)]">{learningResources.length}</span>
          <div className="flex gap-2 text-[10px] uppercase font-bold tracking-widest opacity-70 mt-1 justify-center w-full">
            <span className="text-green-400">{completedResources} Done</span>
            <span>|</span>
            <span className="text-yellow-400">{learningProgress} Act</span>
          </div>
        </Link>

        {/* Jobs Metric */}
        <Link to="/jobs" className="cyber-panel p-6 hover:shadow-[0_0_15px_var(--color-cyber-blue)] transition-shadow group flex flex-col items-center justify-center text-center gap-2 border-l-[2px] border-[var(--border-accent)] hover:border-neon-pink cursor-pointer">
          <Briefcase size={24} className="text-[var(--text-muted)] group-hover:text-neon-pink transition-colors" />
          <span className="text-4xl font-black text-[var(--text-primary)]">{jobs.length}</span>
          <div className="flex gap-2 text-[10px] uppercase font-bold tracking-widest opacity-70 mt-1 justify-center w-full">
            <span className="text-blue-400">{jobs.filter(j => j.status === 'Applied').length} App</span>
            <span>|</span>
            <span className="text-yellow-400">{activeJobs.length} Int</span>
          </div>
        </Link>
      </div>

      {/* Featured Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Starred Projects Panel */}
        <div className="cyber-panel flex flex-col h-full">
          <div className="p-4 border-b border-[var(--border-accent)] border-opacity-30 flex justify-between items-center bg-[var(--border-accent)] bg-opacity-5">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Star size={16} className="text-neon-pink" /> 
              Starred Deployments
            </h3>
            <Link to="/projects" className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:text-neon-pink">View All</Link>
          </div>
          <div className="p-4 flex-1 flex flex-col gap-3">
            {topProjects.length > 0 ? topProjects.map(p => (
              <div key={p.id} className="p-3 border border-[var(--border-accent)] border-opacity-40 hover:border-neon-pink transition-colors flex justify-between items-center bg-[var(--bg-primary)]">
                <div className="flex flex-col max-w-[70%]">
                  <span className="font-bold text-sm truncate">{p.name}</span>
                  <span className="text-[10px] uppercase font-mono opacity-70 truncate">{p.techStack.slice(0, 3).join(', ')}</span>
                </div>
                {p.liveLink && (
                  <a href={p.liveLink} target="_blank" rel="noopener noreferrer" className="p-2 text-[var(--text-muted)] hover:text-neon-pink transition-colors">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            )) : (
              <div className="flex-1 flex items-center justify-center text-[10px] font-mono uppercase tracking-widest opacity-50 border border-dashed border-[var(--border-accent)] p-6">
                [NO_STARRED_DEPLOYMENTS_FOUND]
              </div>
            )}
          </div>
        </div>

        {/* Active Communications Panel (Jobs) */}
        <div className="cyber-panel flex flex-col h-full">
          <div className="p-4 border-b border-[var(--border-accent)] border-opacity-30 flex justify-between items-center bg-[var(--border-accent)] bg-opacity-5">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Briefcase size={16} className="text-neon-pink" /> 
              Active Transmissions
            </h3>
            <Link to="/jobs" className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:text-neon-pink">View All</Link>
          </div>
          <div className="p-4 flex-1 flex flex-col gap-3">
            {activeJobs.length > 0 ? activeJobs.map(j => (
              <div key={j.id} className="p-3 border border-[var(--border-accent)] border-opacity-40 hover:border-yellow-400 transition-colors flex justify-between items-center bg-[var(--bg-primary)]">
                <div className="flex flex-col">
                  <span className="font-bold text-sm truncate">{j.company}</span>
                  <span className="text-[10px] uppercase font-mono opacity-70 border border-[var(--border-accent)] px-1 py-[2px] mt-1 w-max">
                    {j.position}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 ${j.status === 'Offer' ? 'bg-green-400 bg-opacity-20 text-green-400' : 'bg-yellow-400 bg-opacity-20 text-yellow-400'}`}>
                    {j.status}
                  </span>
                  <span className="text-[10px] font-mono opacity-50 flex items-center gap-1">
                    <Calendar size={10} /> {new Date(j.dateApplied).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )) : (
               <div className="flex-1 flex items-center justify-center text-[10px] font-mono uppercase tracking-widest opacity-50 border border-dashed border-[var(--border-accent)] p-6">
                [NO_ACTIVE_INTERVIEWS_FOUND]
              </div>
            )}
          </div>
        </div>

      </div>

      {/* DATA CONTROLLER - EXPORT */}
      <div className="cyber-panel p-6 border-l-[4px] border-neon-pink mt-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2 text-neon-pink">
               DATA_BACKUP_SYS
            </h3>
            <p className="text-xs font-mono opacity-70 mt-1">
              Extract and download a local copy of your system data arrays.
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={handleExport}
              className="cyber-button flex-1 md:flex-none flex items-center justify-center gap-2 border-neon-pink text-neon-pink hover:bg-[var(--color-cyber-pink)] hover:text-white hover:border-[var(--color-cyber-pink)]"
            >
              <Download size={16} />
              <span>Extract Backup</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
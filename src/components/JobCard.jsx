import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, Edit2, Building2, MapPin, ExternalLink, Calendar, Briefcase } from 'lucide-react';

export default function JobCard({ job }) {
  const removeJob = useStore((state) => state.removeJob);

  // Reserved for inline editing block in step 8.4
  const [isEditing, setIsEditing] = useState(false);

  const formattedDate = new Date(job.dateApplied).toLocaleDateString();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'text-[var(--text-primary)] border-[var(--border-accent)] bg-transparent';
      case 'Interviewing': return 'text-yellow-400 border-yellow-400 bg-yellow-400 bg-opacity-10';
      case 'Offer': return 'text-green-400 border-green-400 bg-green-400 bg-opacity-10 shadow-[0_0_10px_rgba(74,222,128,0.4)]';
      case 'Rejected': return 'text-red-500 border-red-500 bg-red-500 bg-opacity-10 opacity-70';
      default: return 'text-[var(--border-accent)] border-[var(--border-accent)] bg-transparent';
    }
  };

  return (
    <div className="cyber-panel p-5 transition-transform duration-200 flex flex-col border-l-[2px] border-l-[var(--border-accent)] hover:border-l-neon-pink">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3 border-b border-[var(--border-accent)] border-opacity-30 pb-3">
        <div className="flex flex-col">
          <h4 className="text-lg font-bold uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-2">
            <Briefcase size={18} className="text-neon-pink" />
            {job.position}
          </h4>
          <span className="text-xs text-[var(--text-muted)] font-mono mt-1 uppercase flex items-center gap-1">
            <Building2 size={12} /> {job.company}
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* We will map the inline form drop here in 8.4 */}
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-[var(--text-muted)] hover:text-[var(--hover-accent)] p-1 transition-colors"
            title="Edit Application"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => removeJob(job.id)}
            className="text-[var(--text-muted)] hover:text-red-500 p-1 transition-colors"
            title="Delete Application"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 mb-4 flex-1">
        {job.location && (
          <span className="text-xs uppercase font-bold opacity-70 flex items-center gap-2">
            <MapPin size={14} className="text-[var(--border-accent)]" /> {job.location}
          </span>
        )}
        <span className="text-xs uppercase font-bold opacity-70 flex items-center gap-2">
          <Calendar size={14} className="text-[var(--border-accent)]" /> {formattedDate}
        </span>
      </div>

      {/* Footer - Status Box & URL Outbound */}
      <div className="mt-auto pt-3 border-t border-[var(--border-accent)] border-opacity-20 flex justify-between items-center gap-2">
        <div className={`px-3 py-1 border text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 ${getStatusColor(job.status)}`}>
          <span className="relative flex h-2 w-2">
            {job.status === 'Interviewing' || job.status === 'Offer' ? (
              <>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${job.status === 'Offer' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${job.status === 'Offer' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              </>
            ) : (
              <span className={`relative inline-flex rounded-full h-2 w-2 ${job.status === 'Rejected' ? 'bg-red-500' : 'bg-[var(--border-accent)]'}`}></span>
            )}
          </span>
          {job.status}
        </div>
        
        {job.url && (
          <a 
            href={job.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-mono text-[var(--border-accent)] hover:text-neon-pink flex items-center gap-1 uppercase tracking-wider shrink-0"
          >
            <ExternalLink size={12} /> Req_Link
          </a>
        )}
      </div>

    </div>
  );
}

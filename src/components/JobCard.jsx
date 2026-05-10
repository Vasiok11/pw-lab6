import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, Edit2, Building2, MapPin, ExternalLink, Calendar, Briefcase, X, Check, Cpu } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

export default function JobCard({ job }) {
  const removeJob = useStore((state) => state.removeJob);
  const updateJob = useStore((state) => state.updateJob);
  const skills = useStore((state) => state.skills);
  const role = useStore((state) => state.role);
  const canWrite = role === 'admin' || role === 'writer';
  const canDelete = role === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editCompany, setEditCompany] = useState(job.company || '');
  const [editPosition, setEditPosition] = useState(job.position || '');
  const [editLocation, setEditLocation] = useState(job.location || '');
  const [editUrl, setEditUrl] = useState(job.url || '');
  const [editStatus, setEditStatus] = useState(job.status || 'Applied');
  const [editLinkedSkills, setEditLinkedSkills] = useState(job.linkedSkills || []);

  const handleSave = () => {
    if (!editCompany.trim() || !editPosition.trim()) return;
    updateJob(job.id, {
      company: editCompany.trim(),
      position: editPosition.trim(),
      location: editLocation.trim(),
      url: editUrl.trim(),
      status: editStatus,
      linkedSkills: editLinkedSkills,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditCompany(job.company || '');
    setEditPosition(job.position || '');
    setEditLocation(job.location || '');
    setEditUrl(job.url || '');
    setEditStatus(job.status || 'Applied');
    setEditLinkedSkills(job.linkedSkills || []);
    setIsEditing(false);
  };

  const formattedDate = new Date(job.dateApplied).toLocaleDateString();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'text-[var(--text-primary)] border-[var(--border-accent)] bg-transparent';
      case 'Interviewing': return 'text-yellow-600 dark:text-yellow-400 border-yellow-500 bg-transparent';
      case 'Offer': return 'text-green-600 dark:text-green-400 border-green-500 bg-transparent shadow-[0_0_10px_rgba(74,222,128,0.4)]';
      case 'Rejected': return 'text-red-500 border-red-500 bg-transparent opacity-70';
      default: return 'text-[var(--border-accent)] border-[var(--border-accent)] bg-transparent';
    }
  };

  if (isEditing) {
    return (
      <div className="cyber-panel p-5 border-l-[3px] border-l-neon-pink">
        <div className="flex flex-col gap-3">
          <label className="text-[10px] uppercase font-bold opacity-70">Company</label>
          <input
            type="text"
            value={editCompany}
            onChange={(e) => setEditCompany(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm"
          />

          <label className="text-[10px] uppercase font-bold opacity-70 mt-1">Position</label>
          <input
            type="text"
            value={editPosition}
            onChange={(e) => setEditPosition(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm"
          />

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold opacity-70 mt-1">Location</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold opacity-70 mt-1">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none cursor-pointer uppercase text-xs font-bold tracking-wider"
              >
                <option value="Applied">APPLIED</option>
                <option value="Interviewing">INTERVIEWING</option>
                <option value="Offer">OFFER</option>
                <option value="Rejected">REJECTED</option>
              </select>
            </div>
          </div>

          <label className="text-[10px] uppercase font-bold opacity-70 mt-1">Job Link</label>
          <input
            type="url"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none text-sm"
          />

          <label className="text-[10px] uppercase font-bold opacity-70 mt-1 block">REQ_SKILLS [Stack Alignment]</label>
          <div className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-sm max-h-32 overflow-y-auto cyber-scrollbar flex flex-wrap gap-2">
            {skills.length === 0 ? (
              <span className="text-xs text-[var(--text-muted)] italic">No skills detected.</span>
            ) : (
               skills.map(skill => (
                 <label key={skill.id} className="flex items-center gap-1 cursor-pointer text-xs p-1 border hover:border-neon-pink transition-colors select-none" style={{
                     borderColor: editLinkedSkills.includes(skill.id) ? 'var(--neon-pink)' : 'var(--border-accent)',
                     color: editLinkedSkills.includes(skill.id) ? 'var(--neon-pink)' : 'var(--text-primary)',
                     backgroundColor: editLinkedSkills.includes(skill.id) ? 'rgba(255, 0, 102, 0.1)' : 'transparent'
                 }}>
                   <input 
                     type="checkbox"
                     checked={editLinkedSkills.includes(skill.id)}
                     onChange={(e) => {
                       if (e.target.checked) {
                         setEditLinkedSkills([...editLinkedSkills, skill.id]);
                       } else {
                         setEditLinkedSkills(editLinkedSkills.filter(id => id !== skill.id));
                       }
                     }}
                     className="hidden"
                   />
                   <span>{skill.name}</span>
                 </label>
               ))
            )}
          </div>

          <div className="flex justify-end gap-3 mt-3">
            <button onClick={handleCancel} className="flex items-center gap-1 p-2 text-[var(--text-muted)] hover:text-red-500 transition-all text-xs font-bold uppercase border border-transparent hover:border-red-500">
              <X size={14} /> Abort
            </button>
            <button onClick={handleSave} className="flex items-center gap-1 p-2 text-neon-pink transition-all text-xs font-bold uppercase border border-[var(--border-accent)] hover:border-neon-pink">
              <Check size={14} /> Update
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          {canWrite && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[var(--text-muted)] hover:text-[var(--hover-accent)] p-1 transition-colors"
              title="Edit Application"
            >
              <Edit2 size={16} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-[var(--text-muted)] hover:text-red-500 p-1 transition-colors"
              title="Delete Application"
            >
              <Trash2 size={16} />
            </button>
          )}
          {confirmDelete && (
            <ConfirmDialog
              message={`Permanently delete application for "${job.position}" at ${job.company}?`}
              onConfirm={() => { setConfirmDelete(false); removeJob(job.id); }}
              onCancel={() => setConfirmDelete(false)}
            />
          )}
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

      {/* Linked Skills ReadOnly View */}
      {(job.linkedSkills && job.linkedSkills.length > 0) && (
        <div className="mb-4 pt-2 border-t border-[var(--border-accent)] border-opacity-30">
          <div className="text-[10px] font-mono tracking-widest uppercase opacity-80 mb-2 flex items-center gap-1 mt-2">
            <Cpu size={12} className="text-neon-pink" />
            <span>Req_Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.linkedSkills.map(id => {
              const skill = skills.find(s => s.id === id);
              if (!skill) return null;
              return (
                <span 
                  key={id}
                  className="text-xs bg-[var(--bg-primary)] border border-neon-pink text-neon-pink px-2 py-1 flex items-center gap-1 cursor-default truncate max-w-full font-mono"
                  title={skill.name}
                >
                  {skill.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

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

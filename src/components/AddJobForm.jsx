import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Send } from 'lucide-react';

export default function AddJobForm() {
  const addJob = useStore((state) => state.addJob);
  const skills = useStore((state) => state.skills);

  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('Applied');
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    addJob({
      company: company.trim(),
      position: position.trim(),
      location: location.trim(),
      url: url.trim(),
      status, // "Applied", "Interviewing", "Offer", "Rejected"
      dateApplied: new Date().toISOString(),
      linkedSkills: selectedSkills
    });

    // Reset form
    setCompany('');
    setPosition('');
    setLocation('');
    setUrl('');
    setStatus('Applied');
    setSelectedSkills([]);
  };

  return (
    <div className="cyber-panel mb-8 p-6">
      <h3 className="text-xl font-bold uppercase tracking-widest text-[var(--border-accent)] mb-4">
        + Track_Application
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Company Name *</label>
            <input
              required
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google Corp."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow text-sm"
            />
          </div>

          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Position / Role *</label>
            <input
              required
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex flex-col w-full md:w-1/3">
            <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Location / Setup</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Remote"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow text-sm"
            />
          </div>

          <div className="flex flex-col w-full md:w-1/3">
            <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Job Listing URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow text-sm"
            />
          </div>

          <div className="flex flex-col w-full md:w-1/6">
            <label className="text-[10px] uppercase font-bold opacity-70 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow cursor-pointer text-sm font-bold uppercase tracking-wider"
            >
              <option value="Applied">APPLIED</option>
              <option value="Interviewing">INTERVIEWING</option>
              <option value="Offer">OFFER</option>
              <option value="Rejected">REJECTED</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col w-full mt-2">
          <label className="text-[10px] uppercase font-bold opacity-70 mb-1">REQ_SKILLS [Stack Alignment]</label>
          <div className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] p-2 max-h-32 overflow-y-auto cyber-scrollbar flex flex-wrap gap-2">
             {skills.length === 0 ? (
               <span className="text-xs text-[var(--text-muted)] italic">No skills detected.</span>
             ) : (
                skills.map(skill => (
                  <label key={skill.id} className="flex items-center gap-1 cursor-pointer text-xs p-1 border hover:border-neon-pink transition-colors select-none" style={{
                      borderColor: selectedSkills.includes(skill.id) ? 'var(--neon-pink)' : 'var(--border-accent)',
                      color: selectedSkills.includes(skill.id) ? 'var(--neon-pink)' : 'var(--text-primary)',
                      backgroundColor: selectedSkills.includes(skill.id) ? 'rgba(255, 0, 102, 0.1)' : 'transparent'
                  }}>
                    <input 
                      type="checkbox"
                      checked={selectedSkills.includes(skill.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSkills([...selectedSkills, skill.id]);
                        } else {
                          setSelectedSkills(selectedSkills.filter(id => id !== skill.id));
                        }
                      }}
                      className="hidden"
                    />
                    <span>{skill.name}</span>
                  </label>
                ))
             )}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="cyber-button w-full md:w-auto min-w-[200px] flex items-center justify-center gap-2 h-[38px] px-4 bg-[var(--bg-primary)] text-neon-pink border-[var(--border-accent)] hover:bg-[var(--hover-accent)] hover:text-[var(--hover-text)]"
          >
            <Send size={16} />
            <span>TRANSMIT</span>
          </button>
        </div>
      </form>
    </div>
  );
}

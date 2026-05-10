import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import AddJobForm from '../components/AddJobForm';
import JobCard from '../components/JobCard';
import { Search, Filter } from 'lucide-react';

export default function Jobs() {
  const jobs = useStore((state) => state.jobs);
  const role = useStore((state) => state.role);
  const canWrite = role === 'admin' || role === 'writer';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      const matchSearch =
        (job.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.position || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === 'All' || job.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [jobs, searchQuery, filterStatus]);

  return (
    <div className="flex flex-col gap-6">
      <div className="cyber-panel p-8">
        <h2 className="text-3xl font-black text-neon-pink uppercase tracking-widest mb-6">
          &gt;&gt; JOBS
        </h2>
        <p className="opacity-80">
          Manage your job applications and track interview progress.
        </p>
      </div>

      {/* Render the Add Job Form */}
      {canWrite && <AddJobForm />}

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-[var(--border-accent)] border-opacity-30 pb-4">
        <div className="relative w-full md:w-1/2">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--border-accent)] opacity-70" />
          <input
            type="text"
            placeholder="Search company or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-accent)] pl-10 pr-4 py-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow placeholder-opacity-40"
          />
        </div>

        <div className="relative w-full md:w-auto min-w-[200px]">
          <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--border-accent)] opacity-70 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border-accent)] pl-10 pr-8 py-2 text-[var(--text-primary)] outline-none focus:shadow-[var(--shadow-accent)] transition-shadow cursor-pointer uppercase text-xs font-bold tracking-wider"
          >
            <option value="All">ALL_STATUSES</option>
            <option value="Applied">APPLIED</option>
            <option value="Interviewing">INTERVIEWING</option>
            <option value="Offer">OFFER</option>
            <option value="Rejected">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid Display */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center opacity-50 border border-dashed border-[var(--border-accent)] mt-4 font-mono uppercase tracking-widest text-sm">
          [RADAR_SILENT: NO_ACTIVE_MISSIONS_FOUND]
        </div>
      )}
    </div>
  );
}
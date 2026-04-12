import { useStore } from '../store/useStore';
import AddJobForm from '../components/AddJobForm';
import JobCard from '../components/JobCard';

export default function Jobs() {
  const jobs = useStore((state) => state.jobs);

  return (
    <div className="flex flex-col gap-6">
      <div className="cyber-panel p-8">
        <h2 className="text-3xl font-black text-neon-pink uppercase tracking-widest mb-6">
          &gt;&gt; MISSION_TARGETS
        </h2>
        <p className="opacity-80">
          Job hunt radar online. Scanning for priority targets.
        </p>
      </div>

      {/* Render the Add Job Form */}
      <AddJobForm />

      {/* Jobs Grid Display */}
      {jobs && jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {jobs.map((job) => (
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
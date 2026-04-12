import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Printer, FileText, Cpu, MapPin, Mail, Phone, ExternalLink, Briefcase, TerminalSquare, BookOpen, Plus, Trash2, Download } from 'lucide-react';

const CATEGORIES = ["Language", "Framework", "Database", "Tools", "Soft Skill"];

const renderFormattedText = (text, className = "") => {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const pushList = () => {
    if (currentList.length > 0) {
      // Use list-outside and ml-4 to align bullet points properly
      elements.push(<ul className="list-disc list-outside ml-4 mt-1 mb-1 space-y-1" key={`ul-${elements.length}`}>{currentList}</ul>);
      currentList = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      currentList.push(<li key={`li-${i}`}>{trimmed.substring(2)}</li>);
    } else {
      pushList();
      if (trimmed) {
        elements.push(<div key={`p-${i}`} className="min-h-[1.2em]">{trimmed}</div>);
      }
    }
  });
  pushList();

  return <div className={className}>{elements}</div>;
};

export default function ResumeBuilder() {
  const { skills, projects, learningResources } = useStore();

  const [personalInfo, setPersonalInfo] = useState({
    name: 'Firstname Lastname',
    title: 'Software Engineer',
    email: 'email@example.com',
    phone: '(555) 123-4567',
    location: 'City, State',
    website: 'github.com/username',
    summary: 'A highly motivated software engineer with experience building scalable web applications and interfacing with complex data architectures.',
  });

  const [resEducation, setResEducation] = useState([]);
  const [resExperience, setResExperience] = useState([]);
  const [resProjects, setResProjects] = useState([]);
  const [resSkills, setResSkills] = useState([]);

  // For the Skill Import filter
  const [selectedSkillCat, setSelectedSkillCat] = useState("Language");

  const handleInfoChange = (e) => setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });

  // Add / Edit Education/Courses from Store
  const addEdu = (e) => {
    const storeId = e.target.value;
    if (!storeId) return;
    const c = learningResources.find(x => x.id === storeId);
    if (!c || resEducation.some(re => re.storeId === storeId)) return;
    setResEducation([...resEducation, { 
      id: crypto.randomUUID(), storeId: c.id, title: c.title, provider: c.author || '', duration: '', details: ''
    }]);
    e.target.value = "";
  };
  const addEmptyEdu = () => setResEducation([...resEducation, { id: crypto.randomUUID(), storeId: null, title: '', provider: '', duration: '', details: '' }]);
  const updateEdu = (id, field, val) => setResEducation(resEducation.map(x => x.id === id ? { ...x, [field]: val } : x));
  const removeEdu = (id) => setResEducation(resEducation.filter(x => x.id !== id));

  // Add / Edit Experience
  const addExp = () => setResExperience([...resExperience, { id: crypto.randomUUID(), company: '', role: '', duration: '', description: '' }]);
  const updateExp = (id, field, val) => setResExperience(resExperience.map(x => x.id === id ? { ...x, [field]: val } : x));
  const removeExp = (id) => setResExperience(resExperience.filter(x => x.id !== id));

  // Add / Edit Projects from Store
  const addProject = (e) => {
    const storeId = e.target.value;
    if (!storeId) return;
    const p = projects.find(x => x.id === storeId);
    if (!p || resProjects.some(rp => rp.storeId === storeId)) return;
    setResProjects([...resProjects, { 
      id: crypto.randomUUID(), storeId: p.id, name: p.name, duration: '',
      description: p.description, techStack: (p.techStack || []).join(', '), link: p.liveLink || p.repoLink || '' 
    }]);
    e.target.value = ""; // reset dropdown
  };
  const updateProj = (id, field, val) => setResProjects(resProjects.map(x => x.id === id ? { ...x, [field]: val } : x));
  const removeProj = (id) => setResProjects(resProjects.filter(x => x.id !== id));

  // Add / Edit Skills from Store
  const addSkill = (e) => {
    const storeId = e.target.value;
    if (!storeId) return;
    const s = skills.find(x => x.id === storeId);
    if (!s || resSkills.some(rs => rs.storeId === storeId)) return;
    setResSkills([...resSkills, { 
      id: crypto.randomUUID(), storeId: s.id, name: s.name, level: s.proficiency, category: s.category || 'Language' 
    }]);
    e.target.value = ""; 
  };
  const updateSkill = (id, field, val) => setResSkills(resSkills.map(x => x.id === id ? { ...x, [field]: val } : x));
  const removeSkill = (id) => setResSkills(resSkills.filter(x => x.id !== id));

  const handlePrint = () => {
    window.print();
  };

  const filteredStoreSkills = skills.filter(s => s.category === selectedSkillCat);

  return (
    <div className="flex flex-col gap-6 h-full pb-20">
      
      {/* HEADER -> Not printed */}
      <div className="cyber-panel p-8 border-l-[4px] border-l-[var(--border-accent)] no-print">       
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-3">
              <FileText size={28} className="text-[var(--border-accent)]" /> 
              RESUME_BUILDER_V2
            </h2>
            <p className="opacity-80 font-mono text-sm mt-1">
              Select objects from your database to populate local resume fields. Edit text manually before compilation without affecting the root database.
            </p>
          </div>
          <button 
            onClick={handlePrint}
            className="cyber-button flex items-center gap-2 border-[var(--border-accent)] text-[var(--text-primary)] hover:bg-[var(--border-accent)] hover:text-[var(--bg-primary)]"
          >
            <Download size={18} />
            <span>SAVE_AS_PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CONTROLS (Left side) -> Not printed */}
        <div className="col-span-1 flex flex-col gap-6 no-print h-max max-h-[85vh] overflow-y-auto cyber-scrollbar pr-2">

          <div className="cyber-panel p-5">
            <h3 className="font-bold tracking-widest uppercase border-b border-[var(--border-accent)] pb-2 mb-4 text-sm text-[var(--border-accent)]">1. Personal Info</h3>
            <div className="flex flex-col gap-3 font-mono text-xs">
              <input type="text" name="name" value={personalInfo.name} onChange={handleInfoChange} placeholder="Full Name" className="w-full bg-transparent border border-[var(--border-accent)] p-2 outline-none focus:border-neon-pink transition-colors"/>
              <input type="text" name="title" value={personalInfo.title} onChange={handleInfoChange} placeholder="Job Title" className="w-full bg-transparent border border-[var(--border-accent)] p-2 outline-none focus:border-neon-pink transition-colors"/>
              <div className="flex gap-2">
                <input type="text" name="email" value={personalInfo.email} onChange={handleInfoChange} placeholder="Email" className="w-full bg-transparent border border-[var(--border-accent)] p-2 outline-none focus:border-neon-pink transition-colors"/>
                <input type="text" name="phone" value={personalInfo.phone} onChange={handleInfoChange} placeholder="Phone" className="w-full bg-transparent border border-[var(--border-accent)] p-2 outline-none focus:border-neon-pink transition-colors"/>
              </div>
              <div className="flex gap-2">
                <input type="text" name="location" value={personalInfo.location} onChange={handleInfoChange} placeholder="Location" className="w-full bg-transparent border border-[var(--border-accent)] p-2 outline-none focus:border-neon-pink transition-colors"/>
                <input type="text" name="website" value={personalInfo.website} onChange={handleInfoChange} placeholder="Website/LinkedIn" className="w-full bg-transparent border border-[var(--border-accent)] p-2 outline-none focus:border-neon-pink transition-colors"/>
              </div>
              <textarea name="summary" value={personalInfo.summary} onChange={handleInfoChange} placeholder="Summary overlay / Bio" rows={4} className="w-full bg-transparent border border-[var(--border-accent)] p-2 outline-none focus:border-neon-pink transition-colors resize-none"></textarea>
            </div>
          </div>

          <div className="cyber-panel p-5">
             <div className="flex justify-between items-center border-b border-[var(--border-accent)] pb-2 mb-4">
              <h3 className="font-bold tracking-widest uppercase text-sm text-[var(--border-accent)]">2. Education / Training</h3>
              <div className="flex gap-2 items-center">
                <select defaultValue="" onChange={addEdu} className="bg-transparent border border-[var(--border-accent)] outline-none text-[10px] uppercase font-bold p-1 max-w-[120px]">
                  <option value="" disabled>+ Import</option>
                  {learningResources.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
                <button onClick={addEmptyEdu} className="text-[var(--text-muted)] hover:text-neon-pink transition-colors"><Plus size={16} /></button>
              </div>
            </div>
            <div className="flex flex-col gap-4 font-mono text-xs">
              {resEducation.map(edu => (
                <div key={edu.id} className="relative border border-[var(--border-accent)] p-3 group border-opacity-50">
                  <button onClick={() => removeEdu(edu.id)} className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-red-500"><Trash2 size={14}/></button>
                  <label className="opacity-50 text-[10px] mb-1 block">Title & Provider</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={edu.title} onChange={(e) => updateEdu(edu.id, 'title', e.target.value)} placeholder="Degree / Course" className="w-1/2 bg-transparent border-b border-[var(--border-accent)] p-1 outline-none focus:border-neon-pink"/>
                    <input type="text" value={edu.provider} onChange={(e) => updateEdu(edu.id, 'provider', e.target.value)} placeholder="Institution / Provider" className="w-1/2 bg-transparent border-b border-[var(--border-accent)] p-1 outline-none focus:border-neon-pink"/>
                  </div>
                  <label className="opacity-50 text-[10px] mb-1 block mt-1">Timeline</label>
                  <input type="text" value={edu.duration} onChange={(e) => updateEdu(edu.id, 'duration', e.target.value)} placeholder="e.g. Completed Dec 2024" className="w-full bg-transparent border border-[var(--border-accent)] p-1 mb-2 outline-none focus:border-neon-pink"/>
                  <label className="opacity-50 text-[10px] mb-1 block mt-2">Extra Details (Use - for bullets)</label>
                  <textarea value={edu.details} onChange={(e) => updateEdu(edu.id, 'details', e.target.value)} placeholder="Degrees, GPA, Cert ID, etc..." rows={2} className="w-full bg-transparent border border-[var(--border-accent)] p-1 outline-none focus:border-neon-pink resize-none"></textarea>
                </div>
              ))}
              {resEducation.length === 0 && <span className="opacity-50 italic text-[10px]">No education added.</span>}
            </div>
          </div>

          <div className="cyber-panel p-5">
            <div className="flex justify-between items-center border-b border-[var(--border-accent)] pb-2 mb-4">
              <h3 className="font-bold tracking-widest uppercase text-sm text-[var(--border-accent)]">3. Work Experience</h3>
              <button onClick={addExp} className="text-[var(--text-muted)] hover:text-neon-pink transition-colors"><Plus size={16} /></button>
            </div>
            <div className="flex flex-col gap-4 font-mono text-xs">
              {resExperience.map(exp => (
                <div key={exp.id} className="relative border border-[var(--border-accent)] p-3 group">
                  <button onClick={() => removeExp(exp.id)} className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-red-500"><Trash2 size={14}/></button>
                  <label className="opacity-50 text-[10px] mb-1 block">Company & Role</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={exp.company} onChange={(e) => updateExp(exp.id, 'company', e.target.value)} placeholder="Company Name" className="w-1/2 bg-transparent border-b border-[var(--border-accent)] p-1 outline-none focus:border-neon-pink"/>
                    <input type="text" value={exp.role} onChange={(e) => updateExp(exp.id, 'role', e.target.value)} placeholder="Job Title" className="w-1/2 bg-transparent border-b border-[var(--border-accent)] p-1 outline-none focus:border-neon-pink"/>
                  </div>
                  <label className="opacity-50 text-[10px] mb-1 block mt-2">Duration / Dates</label>
                  <input type="text" value={exp.duration} onChange={(e) => updateExp(exp.id, 'duration', e.target.value)} placeholder="e.g. Jan 2021 - Present" className="w-full bg-transparent border border-[var(--border-accent)] p-1 mb-2 outline-none focus:border-neon-pink"/>
                  <label className="opacity-50 text-[10px] mb-1 block mt-2">Work Description (Use - for bullets)</label>
                  <textarea value={exp.description} onChange={(e) => updateExp(exp.id, 'description', e.target.value)} placeholder="Describe responsibilities" rows={3} className="w-full bg-transparent border border-[var(--border-accent)] p-1 outline-none focus:border-neon-pink resize-none"></textarea>
                </div>
              ))}
              {resExperience.length === 0 && <span className="opacity-50 italic text-[10px]">No work history added.</span>}
            </div>
          </div>

          <div className="cyber-panel p-5">
             <div className="flex justify-between items-center border-b border-[var(--border-accent)] pb-2 mb-4">
              <h3 className="font-bold tracking-widest uppercase text-sm text-[var(--border-accent)]">4. Projects</h3>
              <select defaultValue="" onChange={addProject} className="bg-transparent border border-[var(--border-accent)] outline-none text-[10px] uppercase font-bold p-1 max-w-[120px]">
                <option value="" disabled>+ Import</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-4 font-mono text-xs">
              {resProjects.map(proj => (
                <div key={proj.id} className="relative border border-[var(--border-accent)] p-3 group border-opacity-50">
                  <button onClick={() => removeProj(proj.id)} className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-red-500"><Trash2 size={14}/></button>
                  <label className="opacity-50 text-[10px] mb-1 block mt-1">Project Link & Dates</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={proj.link} onChange={(e) => updateProj(proj.id, 'link', e.target.value)} placeholder="github.com/link" className="w-1/2 bg-transparent border-b border-[var(--border-accent)] p-1 outline-none focus:border-neon-pink"/>
                    <input type="text" value={proj.duration} onChange={(e) => updateProj(proj.id, 'duration', e.target.value)} placeholder="e.g. Fall 2023" className="w-1/2 bg-transparent border-b border-[var(--border-accent)] p-1 outline-none focus:border-neon-pink"/>
                  </div>
                  <label className="opacity-50 text-[10px] mb-1 block mt-2">Description Overrides (Use - for bullets)</label>
                  <textarea value={proj.description} onChange={(e) => updateProj(proj.id, 'description', e.target.value)} rows={3} className="w-full bg-transparent border border-[var(--border-accent)] p-1 mb-2 outline-none focus:border-neon-pink resize-none"></textarea>
                  <label className="opacity-50 text-[10px] mb-1 block mt-2">Tech Stack Display</label>
                  <input type="text" value={proj.techStack} onChange={(e) => updateProj(proj.id, 'techStack', e.target.value)} className="w-full bg-transparent border border-[var(--border-accent)] p-1 outline-none focus:border-neon-pink"/>
                </div>
              ))}
            </div>
          </div>

           <div className="cyber-panel p-5">
             <div className="flex justify-between items-center border-b border-[var(--border-accent)] pb-2 mb-4">
              <h3 className="font-bold tracking-widest uppercase text-sm text-[var(--border-accent)] flex-1">5. Skills List</h3>
              
              <div className="flex gap-2 text-[10px]">
                <select 
                  value={selectedSkillCat} 
                  onChange={(e) => setSelectedSkillCat(e.target.value)}
                  className="bg-transparent border border-[var(--border-accent)] outline-none uppercase font-bold p-1 max-w-[80px]"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select defaultValue="" onChange={addSkill} className="bg-transparent border border-[var(--border-accent)] outline-none uppercase font-bold p-1 max-w-[100px]">
                  <option value="" disabled>+ Import</option>
                  {filteredStoreSkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

            </div>
            <div className="flex flex-col gap-2 font-mono text-xs">
              {resSkills.map(skill => (
                <div key={skill.id} className="flex justify-between items-center border border-[var(--border-accent)] p-2">
                   <div className="flex flex-col w-3/4">
                     <span className="font-bold">{skill.name}</span>
                     <select 
                       value={skill.category} 
                       onChange={(e) => updateSkill(skill.id, 'category', e.target.value)} 
                       className="w-full text-[10px] bg-transparent outline-none opacity-80 mt-1 cursor-pointer"
                     >
                       {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                   </div>
                   <button onClick={() => removeSkill(skill.id)} className="text-[var(--text-muted)] hover:text-red-500"><Trash2 size={14}/></button>
                </div>
              ))}
              {resSkills.length === 0 && <span className="opacity-50 italic text-[10px]">No skills added yet. Select a category and import.</span>}
            </div>
          </div>

        </div>

        {/* RESUME PREVIEW (Right side) -> This gets printed dynamically */}
        <div className="col-span-1 lg:col-span-2 bg-white print-area text-black p-10 min-h-[1056px] shadow-2xl relative font-sans overflow-hidden">
          
          <div className="border-b-[3px] border-black pb-5 mb-5">
            <h1 className="text-4xl font-black uppercase tracking-tight text-black mb-1">{personalInfo.name}</h1>
            <h2 className="text-lg font-bold text-gray-700 uppercase tracking-widest mb-3">{personalInfo.title}</h2>
            
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold text-gray-800">
              {personalInfo.email && <span className="flex items-center gap-1"><Mail size={12} /> {personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12} /> {personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1"><MapPin size={12} /> {personalInfo.location}</span>}
              {personalInfo.website && <span className="flex items-center gap-1"><ExternalLink size={12} /> {personalInfo.website}</span>}
            </div>
          </div>

          {personalInfo.summary && (
             <div className="mb-6">
               <p className="text-sm leading-snug text-gray-800">{personalInfo.summary}</p>
             </div>
          )}

          {resEducation.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest border-b border-black pb-1 mb-4 flex items-center gap-2">
                <BookOpen size={14} /> Education & Training
              </h3>
              <div className="flex flex-col gap-3 text-sm text-gray-800">
                {resEducation.map(c => (
                  <div key={c.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-sm bg-transparent border-none text-black p-0">{c.title} <span className="font-normal italic text-gray-600"> - {c.provider}</span></span>
                      <span className="text-xs font-bold text-gray-500 whitespace-nowrap">{c.duration}</span>
                    </div>
                    {renderFormattedText(c.details, "text-xs text-gray-700 leading-tight whitespace-pre-wrap mt-1")}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resExperience.length > 0 && (
             <div className="mb-6">
               <h3 className="text-sm font-black uppercase tracking-widest border-b border-black pb-1 mb-4 flex items-center gap-2">
                 <Briefcase size={14} /> Work Experience
               </h3>
               <div className="flex flex-col gap-4">
                 {resExperience.map(exp => (
                   <div key={exp.id}>
                     <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-black">{exp.role} <span className="font-normal text-gray-600">at {exp.company}</span></h4>
                        <span className="text-xs font-bold text-gray-500 whitespace-nowrap">{exp.duration}</span>
                     </div>
                     {renderFormattedText(exp.description, "text-sm text-gray-800 leading-snug break-words whitespace-pre-wrap")}
                   </div>
                 ))}
               </div>
             </div>
          )}

          {resProjects.length > 0 && (
            <div className="mb-6 text-black">
              <h3 className="text-sm font-black uppercase tracking-widest border-b border-black pb-1 mb-4 flex items-center gap-2">
                <TerminalSquare size={14} /> Projects
              </h3>
              <div className="flex flex-col gap-4">
                {resProjects.map(p => (
                  <div key={p.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-sm text-black inline-flex items-center gap-2">
                        {p.name}
                        {p.link && <span className="text-[10px] font-mono text-gray-500 font-normal">{p.link}</span>}
                      </h4>
                      <span className="text-xs font-bold text-gray-500 whitespace-nowrap">{p.duration}</span>
                    </div>
                    {renderFormattedText(p.description, "text-sm text-gray-800 leading-snug mb-1 whitespace-pre-wrap")}
                    {p.techStack && (
                      <div className="text-xs font-mono font-bold text-gray-600">
                        [ {p.techStack} ]
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resSkills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest border-b border-black pb-1 mb-3 flex items-center gap-2">
                <Cpu size={14} /> Skills
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                {CATEGORIES.map(cat => {
                  const catSkills = resSkills.filter(s => s.category === cat);
                  if (catSkills.length === 0) return null;
                  return (
                    <div key={cat} className="flex mb-1">
                      <span className="w-28 shrink-0 font-bold text-gray-800 text-xs uppercase pt-[2px]">
                        {cat === 'Tools' ? 'Dev Tools' : cat}
                      </span>
                      <span className="text-gray-700 text-sm leading-tight">
                        {catSkills.map(s => s.name).join(', ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
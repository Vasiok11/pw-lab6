import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Hexagon, Code2, Briefcase, BookOpen, Target, Settings, TerminalSquare, FileText, Menu, X } from 'lucide-react';

export default function RootLayout({ toggleTheme, isDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navItems = [
    { to: '/', icon: <Hexagon size={20} />, label: 'Dashboard' },
    { to: '/skills', icon: <Code2 size={20} />, label: 'Skills Db' },
    { to: '/projects', icon: <TerminalSquare size={20} />, label: 'Projects' }, 
    { to: '/learning', icon: <BookOpen size={20} />, label: 'Data Feeds' },     
    { to: '/jobs', icon: <Target size={20} />, label: 'Job Matrix' },
    { to: '/resume', icon: <FileText size={20} />, label: 'Compile Resume' },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden text-[var(--text-primary)]">

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-64 border-r-2 border-[var(--border-accent)] bg-[var(--bg-panel)] flex flex-col justify-between shadow-[var(--shadow-accent)] z-50 absolute md:relative inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        {/* Subtle glowing edge overlay inside the sidebar */}
        <div className="absolute top-0 right-0 h-full w-1 bg-[var(--border-accent)] opacity-20 blur-sm"></div>

          <div className="flex flex-col p-4 md:p-6 h-full">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase size={32} className="text-neon-pink animate-pulse" />
                <h1 className="text-xl font-black uppercase tracking-widest leading-tight">
                  System // <br /> <span className="text-neon-pink">Tracker</span>
                </h1>
              </div>
              <button className="md:hidden text-[var(--border-accent)] hover:text-neon-pink transition-colors focus:outline-none" onClick={closeMobileMenu}>
                <X size={24} />
              </button>
          </div>

          <nav className="flex flex-col gap-3 flex-1 relative z-20">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 font-bold uppercase tracking-wider text-sm transition-all duration-200 border border-[var(--border-accent)] ${
                    isActive
                      ? '!bg-[var(--hover-accent)] text-[var(--hover-text)]'
                      : 'hover:!bg-[var(--border-accent)] hover:text-[var(--hover-text)] opacity-70 hover:opacity-100 bg-transparent'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          
          {/* Bottom Settings / Theme Toggle */}
          <div className="pt-6 border-t font-mono text-xs border-[var(--border-accent)] opacity-80 uppercase relative z-20">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full p-2 hover:text-neon-pink transition-colors font-bold tracking-widest"
            >
              <Settings size={18} className="animate-[spin_4s_linear_infinite]" />
              {isDarkMode ? 'INIT LIGHT_MODE' : 'INIT DARK_MODE'}
            </button>
            <div className="mt-4 flex flex-col gap-1 opacity-50">
              <span>STATUS: ONLINE</span>
              <span>PORT: 5173</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Top decorative header strip */}
        <header className="h-12 border-b border-[var(--border-accent)] bg-[var(--bg-panel)] flex items-center px-4 md:px-6 justify-between opacity-90 shadow-sm z-10 shrink-0">
           <div className="flex items-center gap-3">
             <button 
               className="md:hidden text-[var(--text-primary)] hover:text-neon-pink transition-colors focus:outline-none"
               onClick={() => setMobileMenuOpen(true)}
             >
               <Menu size={24} />
             </button>
             <div className="font-mono text-sm opacity-60 flex gap-4">
                <span className="truncate max-w-[150px] md:max-w-max">ROOT_DIR: /home</span>
                <span className="hidden md:inline">ACCESS_LEVEL: ADMIN</span>
             </div>
           </div>
           <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#00ff00] animate-pulse"></div>
        </header>

        {/* Scrollable page container */}
        <div className="flex-1 overflow-auto p-4 md:p-8 z-0">
          <div className="max-w-6xl mx-auto w-full pb-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

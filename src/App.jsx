import { useEffect, useState } from 'react'
import './index.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or system preference during initialization
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Apply 'dark' class to html element when isDarkMode changes
  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    // Save preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      
      {/* Container simulating a Cyberpunk panel/window */}
      <div className="cyber-panel max-w-2xl w-full flex flex-col items-center justify-center gap-8 py-10">
        
        {/* Header section demonstrating the neon text class */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-neon-pink mb-4 tracking-wider">
            SYSTEM // INITIALIZING
          </h1>
          <p className="opacity-80 md:text-lg">
            v1.0.0 [Developer Career Tracker] is booting up...
          </p>
          <div className="w-full h-1 bg-[var(--border-accent)] mt-4 shadow-[var(--shadow-accent)] relative">
            <div className="absolute top-0 right-0 h-full w-1/3 bg-[var(--bg-panel)] animate-pulse"></div>
          </div>
        </div>

        {/* Content showing off the dark mode toggles */}
        <div className="flex flex-col md:flex-row items-center gap-6 mt-8">
          <button 
            onClick={toggleTheme}
            className="cyber-button text-lg font-bold"
          >
            {isDarkMode ? '> SWITCH TO LIGHT_MODE' : '> INIT DARK_MODE'}  
          </button>

          <button
            className="cyber-button text-lg font-bold opacity-50 cursor-not-allowed"
          >
            {'>'} RUN DIAGNOSTICS
          </button>
        </div>

        <p className="mt-8 text-xs uppercase opacity-60 font-mono text-center max-w-md">
          Warning: Unauthorized access is strictly prohibited. This terminal is configured for [USER_ID: STUDENT].
        </p>
      </div>

    </div>
  )
}

export default App

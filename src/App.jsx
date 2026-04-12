import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Dashboard from './pages/Dashboard'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Learning from './pages/Learning'
import Jobs from './pages/Jobs'
import ResumeBuilder from './pages/ResumeBuilder'
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
    <HashRouter>
      <Routes>
        <Route path="/" element={<RootLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}>
          <Route index element={<Dashboard />} />
          <Route path="skills" element={<Skills />} />
          <Route path="projects" element={<Projects />} />
          <Route path="learning" element={<Learning />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="resume" element={<ResumeBuilder />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App

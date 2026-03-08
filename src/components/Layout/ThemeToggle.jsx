import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeContext'

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl transition-all duration-300 
        bg-slate-100 text-slate-600 hover:bg-slate-200
        dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}

export default ThemeToggle
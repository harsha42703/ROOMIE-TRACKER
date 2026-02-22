import { Sun, Moon } from 'lucide-react'
import useStore from '../store'

export default function ThemeSwitcher() {
  const { darkMode, toggleDarkMode } = useStore()

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full"
      aria-label="Toggle theme"
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  )
}

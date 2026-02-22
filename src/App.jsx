import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useStore from './store'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Dashboard from './components/Dashboard'
import SplitExpense from './components/SplitExpense'
import Charts from './components/Charts'
import Report from './components/Report'

export default function App() {
  const darkMode = useStore((s) => s.darkMode)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'}`}>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/split" element={<SplitExpense />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col">
        <main className="flex-1 p-4 pb-24">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/split" element={<SplitExpense />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

import { NavLink } from 'react-router-dom'
import { LayoutDashboard, SplitSquareHorizontal, BarChart2, FileText, Home } from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/split', icon: SplitSquareHorizontal, label: 'Split Expense' },
  { to: '/charts', icon: BarChart2, label: 'Charts' },
  { to: '/report', icon: FileText, label: 'Report' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-white/20 flex flex-col p-6 z-40">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
          <Home size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white text-lg leading-tight">Roomie</h1>
          <p className="text-white/50 text-xs">Expense Tracker</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      <ThemeSwitcher />
    </aside>
  )
}

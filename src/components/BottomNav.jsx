import { NavLink } from 'react-router-dom'
import { LayoutDashboard, SplitSquareHorizontal, BarChart2, FileText } from 'lucide-react'

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/split', icon: SplitSquareHorizontal, label: 'Split' },
  { to: '/charts', icon: BarChart2, label: 'Charts' },
  { to: '/report', icon: FileText, label: 'Report' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/20 flex justify-around items-center h-16 px-2 z-50">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
              isActive ? 'text-indigo-400' : 'text-white/60 hover:text-white'
            }`
          }
        >
          <Icon size={20} />
          <span className="text-xs">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

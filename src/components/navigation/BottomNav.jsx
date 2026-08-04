import { NavLink } from 'react-router-dom'
import { House, Trophy, ChartNoAxesColumn, User } from 'lucide-react'

const links = [
  { name: 'Jogos', path: '/', icon: House },
  { name: 'Ligas', path: '/leagues', icon: Trophy },
  { name: 'Ranking', path: '/rankings', icon: ChartNoAxesColumn },
  { name: 'Perfil', path: '/profile', icon: User },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-zinc-900 bg-black/25 px-4 py-3 backdrop-blur-md">
      {links.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition ${
                isActive ? 'text-lime-400' : 'text-zinc-500'
              }`
            }
          >
            <Icon size={22} />
            <span>{item.name}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
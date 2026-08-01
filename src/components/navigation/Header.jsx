import { Bell, Menu } from 'lucide-react'
import logo from '../../assets/images/logo.png';

export default function Header() {
    return (
        <header className='flex items-center justify-around px-5 py-4 border-b border-zinc-900 ' >

        <div className="w-25 h-15">
            <img src={logo} alt="Logo do Site"  />

        </div>

         <div className="flex items-center gap-3">
        <button
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300"
          aria-label="Notificações"
        >
          <Bell size={20} />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-lime-400" />
        </button>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300"
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>
      </div>
        </header>
        
    )
}
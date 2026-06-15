import { Bell, Menu } from 'lucide-react'

export default function Header() {
    return (
        <header className='flex items-center justify-around px-5 py-4 border-b border-zinc-900 ' >

        <div className="w-12 h-12 rounded-full overflow-hidden border border-lime-500">
            <img src="" alt="" />

        </div>

        <h1 className='text-2xl text-white'>
            <span>CopaLive</span>
        </h1>

        <div className="flex items-center gap-3">
            <button className=' flex w-11 h-11 rounded-full bg-zinc-950 border border-zinc-700 items-center justify-center text-zinc-300'>
                <Bell size={20}/>
            </button>

            <button className=' flex w-11 h-11 rounded-full bg-zinc-950 border border-zinc-700 items-center justify-center text-zinc-300'>
                <Menu size={20}/>
            </button>
        </div>
        </header>
        
    )
}
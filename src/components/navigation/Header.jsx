import { Bell, Menu } from "lucide-react";
import logo from "../../assets/images/logo.png";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/65 backdrop-blur-md border-b border-zinc-800">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">

        <div className="w-30">
          <img src={logo} alt="Logo do Site" />
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

      </div>
    </header>
  );
}
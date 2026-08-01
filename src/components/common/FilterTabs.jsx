export default function FilterTabs() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">

      <button className="bg-lime-500 text-black font-semibold px-4 py-2 rounded-full whitespace-nowrap">
        Todos
      </button>

      <button className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-full whitespace-nowrap">
        Ao Vivo
      </button>

      <button className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-full whitespace-nowrap">
        Hoje
      </button>

      <button className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-full whitespace-nowrap">
        Finalizados
      </button>

    </div>
  )
}
export default function HomeHero({stats}) {
  const { totalMatches, liveMatches, totalCompetitions } = stats;

  return (
    <section className="px-5 mt-6">

      <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6">

        <p className="text-zinc-400 text-sm">
          Bem-vindo ao
        </p>

        <h1 className="text-4xl font-black mt-2">
          Copa<span className="text-lime-400">Live</span>
        </h1>

        <p className="text-zinc-500 mt-2">
          Todos os jogos em tempo real.
        </p>

        <div className="grid grid-cols-3 gap-3 mt-6">

          <div className="bg-zinc-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-lime-400">{totalMatches}</p>
            <span className="text-xs text-zinc-400">
              Jogos
            </span>
          </div>

          <div className="bg-zinc-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-red-500">{liveMatches}</p>
            <span className="text-xs text-zinc-400">
              Ao Vivo
            </span>
          </div>

          <div className="bg-zinc-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{totalCompetitions}</p>
            <span className="text-xs text-zinc-400">
              Ligas
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
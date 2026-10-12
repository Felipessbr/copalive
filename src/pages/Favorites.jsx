import { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Star, Search } from "lucide-react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import useFavoriteLeagues from "../hooks/useFavoriteLeagues";

export default function Favorites() {
  const { favoriteLeagues } = useFavoriteLeagues();
  const [activeFilter, setActiveFilter] = useState("ligas");

  const filters = [
    { id: "ligas", label: "LIGAS", count: favoriteLeagues.length },
    { id: "clubes", label: "CLUBES", count: null },
  ];

  return (
    <main className="min-h-screen bg-black px-4 pb-28 pt-6 text-white">
      {/* Cabeçalho */}
      <header className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-lime-400/40 bg-zinc-800 p-1">
            <Star className="h-4 w-4 text-lime-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Favoritos</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Ligas, Clubes & Atletas
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Pesquisar favoritos"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800 transition hover:text-lime-400"
        >
          <HiMagnifyingGlass className="h-4 w-4" />
        </button>
      </header>

      {/* Filtros */}
      <div className="mb-8 flex gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`rounded-full px-5 py-2 text-sm transition ${
                isActive
                  ? "bg-lime-400 font-bold text-black"
                  : "bg-zinc-800 font-semibold text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {filter.label}
              {filter.count !== null && ` ${filter.count}`}
            </button>
          );
        })}
      </div>

      {activeFilter === "ligas" && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <span className="h-5 w-1 rounded-full bg-lime-400" />
               Ligas Favoritas 
            </h2>

            <span className="text-sm font-bold text-lime-400">
              {favoriteLeagues.length}
            </span>
          </div>

          {favoriteLeagues.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {favoriteLeagues.map((league) => (
                <Link
                  key={league.id}
                  to={`/leagues/${league.id}`}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-lime-400/50"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                    {league.logo ? (
                      <img
                        src={league.logo}
                        alt={`Logo ${league.name}`}
                        className="h-7 w-7 object-contain"
                      />
                    ) : (
                      <Trophy className="h-5 w-5 text-lime-400" />
                    )}
                  </div>

                  <h3 className="font-bold">{league.name}</h3>

                  <p className="mt-1 text-xs text-zinc-400">
                    {league.country || "Competição"}
                  </p>

                  <p className="mt-4 text-xs font-semibold text-lime-400">
                    Ver liga →
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-center text-sm text-zinc-400">
              Você ainda não favoritou nenhuma liga.
            </p>
          )}
        </section>
      )}

      {activeFilter === "clubes" && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-5 py-10 text-center">
          <Star className="mx-auto mb-3 h-7 w-7 text-zinc-500" />

          <h2 className="font-semibold">Seus clubes favoritos</h2>

          <p className="mt-2 text-sm text-zinc-400">
            Em breve, você poderá favoritar clubes pelos escudos nos cards
            dos jogos e acompanhar todos aqui.
          </p>
        </section>
      )}
    </main>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Star, Search } from "lucide-react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { HiShieldCheck } from "react-icons/hi2";
import useFavoriteLeagues from "../hooks/useFavoriteLeagues";
import useFavorites from "../hooks/useFavorites";
import BottomNav from "../components/navigation/BottomNav";
import useFavoriteClubDetails from "../hooks/useFavoriteClubDetails";

export default function Favorites() {
  const { favoriteLeagues } = useFavoriteLeagues();
  const {
    favorites: favoriteClubs,
    toggleFavorite,
  } = useFavorites();
  const [activeFilter, setActiveFilter] = useState("todos");

  const featuredClub = favoriteClubs[0];

  const {
    recentMatches,
    nextMatch,
    standings,
    loading: clubDetailsLoading,
    error: clubDetailsError,
  } = useFavoriteClubDetails(featuredClub, favoriteLeagues);

  const filters = [
    { id: "todos", label: "TODOS", count: favoriteLeagues.length + favoriteClubs.length },
    { id: "ligas", label: "LIGAS", count: favoriteLeagues.length },
    { id: "clubes", label: "CLUBES", count: favoriteClubs.length },
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
              className={`rounded-full px-5 py-2 text-sm transition ${isActive
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

      {(activeFilter === "todos" || activeFilter === "ligas") && (
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
            <div
              className="-mx-4 flex w-[calc(100%+2rem)] gap-4 overflow-x-auto overscroll-x-contain px-4 pb-4 snap-x snap-mandatory cursor-grab touch-pan-x"
              style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            >
              {favoriteLeagues.map((league) => (
                <Link
                  key={league.id}
                  to={`/leagues/${league.id}`}
                  className="flex w-[300px] min-w-[300px] shrink-0 snap-start flex-col rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-lime-400/50"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800">
                      {league.logo ? (
                        <img
                          src={league.logo}
                          alt={`Logo ${league.name}`}
                          className="h-10 w-10 object-contain"
                        />
                      ) : (
                        <Trophy className="h-7 w-7 text-lime-400" />
                      )}
                    </div>

                    <Star className="h-5 w-5 text-lime-400" />
                  </div>

                  <h3 className="text-xl font-bold">{league.name}</h3>

                  <p className="mt-1 text-sm text-zinc-400">
                    {league.country || "Competição"}
                  </p>

                  <div className="mt-6 border-t border-zinc-800 pt-4">
                    <p className="text-sm font-semibold text-lime-400">
                      Ver liga
                      <span className="ml-2">→</span>
                    </p>
                  </div>
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

      {(activeFilter === "todos" || activeFilter === "clubes") && (
        <section className="space-y-5">
          {/* Cabeçalho da seção */}
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-xl font-bold">
              <span className="h-6 w-1.5 rounded-full bg-lime-400" />
              Clubes Favoritos
            </h2>

            <span className="text-sm font-bold text-lime-400">
              {favoriteClubs.length} clubes
            </span>
          </div>

          {favoriteClubs.length > 0 ? (
            <>
              {/* Clube em destaque */}
              <div className="overflow-hidden rounded-[28px] border border-zinc-700 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800 p-5">
                {/* Informações principais */}
                <div className="flex items-center gap-4">
                  <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-[3px] border-lime-400/50 bg-zinc-800">
                    {favoriteClubs[0].logo ? (
                      <img
                        src={favoriteClubs[0].logo}
                        alt={`Escudo ${favoriteClubs[0].name}`}
                        className="h-12 w-12 object-contain"
                      />
                    ) : (
                      <HiShieldCheck className="h-9 w-9 text-lime-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-extrabold leading-tight">
                        {favoriteClubs[0].name}
                      </h3>
                      <Star className="h-6 w-6 shrink-0 fill-lime-400 text-lime-400" />
                    </div>

                    {standings && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-zinc-400">
                          {standings.leagueName}
                        </span>

                        <span className="rounded-md bg-lime-400/10 px-2 py-1 font-semibold text-lime-400">
                          {standings.rank}º lugar
                        </span>

                        <span className="text-zinc-300">
                          {standings.points} pts
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Forma recente */}
                  <div className="hidden shrink-0 text-center sm:block">
                    <p className="mb-3 text-sm font-bold tracking-wide text-zinc-300">
                      FORMA
                    </p>

                    <div className="flex gap-2">
                      {clubDetailsLoading ? (
                        <span className="text-xs text-zinc-400">Carregando...</span>
                      ) : recentMatches.length > 0 ? (
                        [...recentMatches].reverse().slice(-3).map((match) => (
                          <span
                            key={match.id}
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold ${match.result === "V"
                              ? "bg-lime-400 text-black"
                              : match.result === "E"
                                ? "bg-zinc-600 text-white"
                                : match.result === "D"
                                  ? "bg-red-500 text-white"
                                  : "bg-zinc-700 text-white"
                              }`}
                          >
                            {match.result ?? "-"}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-400">
                          Sem resultados
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Próximo jogo: aguardando integração com os dados da API */}

                {/* Próxima partida */}
                <div className="mt-6 rounded-[22px] border border-zinc-700/70 bg-zinc-800/80 p-4">
                  {clubDetailsLoading ? (
                    <p className="text-sm text-zinc-400">
                      Buscando próxima partida...
                    </p>
                  ) : nextMatch ? (
                    <>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="rounded-lg bg-lime-400 px-3 py-2 text-xs font-extrabold text-black">
                          PRÓXIMO JOGO
                        </span>

                        <span className="truncate text-xs text-zinc-400">
                          {nextMatch.league?.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
                          {nextMatch.teams?.home?.logo && (
                            <img
                              src={nextMatch.teams.home.logo}
                              alt={nextMatch.teams.home.name}
                              className="h-12 w-12 object-contain"
                            />
                          )}
                          <span className="text-sm font-bold">
                            {nextMatch.teams?.home?.name}
                          </span>
                        </div>

                        <span className="shrink-0 text-sm font-extrabold text-zinc-400">
                          VS
                        </span>

                        <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
                          {nextMatch.teams?.away?.logo && (
                            <img
                              src={nextMatch.teams.away.logo}
                              alt={nextMatch.teams.away.name}
                              className="h-12 w-12 object-contain"
                            />
                          )}
                          <span className="text-sm font-bold">
                            {nextMatch.teams?.away?.name}
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 text-center text-sm text-zinc-300">
                        {new Date(nextMatch.fixture.date).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "America/Sao_Paulo",
                        })}
                      </p>
                    </>
                  ) : (
                    <div>
                      <p className="font-bold">Nenhuma próxima partida encontrada</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        Não há jogo futuro disponível para este clube na API.
                      </p>
                    </div>
                  )}
                </div>


                {/* Outros clubes seguidos */}
                {favoriteClubs.length > 1 && (
                  <div className="mt-5 border-t border-zinc-700 pt-5">
                    <p className="mb-3 text-sm text-zinc-300">
                      Outros clubes seguidos:
                    </p>

                    <div
                      className="flex gap-2 overflow-x-auto overscroll-x-contain pb-2 snap-x snap-mandatory"
                      style={{
                        scrollbarWidth: "none",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      {favoriteClubs.slice(1).map((club) => (
                        <div
                          key={club.id}
                          className="flex shrink-0 snap-start items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-2"
                        >
                          {club.logo ? (
                            <img
                              src={club.logo}
                              alt=""
                              className="h-5 w-5 shrink-0 object-contain"
                            />
                          ) : (
                            <HiShieldCheck className="h-4 w-4 shrink-0 text-lime-400" />
                          )}

                          <span className="whitespace-nowrap text-sm font-semibold">
                            {club.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-5 py-10 text-center">
              <Star className="mx-auto mb-3 h-7 w-7 text-zinc-500" />

              <h3 className="font-semibold">
                Nenhum clube favorito
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                Favorite um clube pela estrela nos cards de jogos para vê-lo aqui.
              </p>

              <Link
                to="/"
                className="mt-5 inline-block rounded-full bg-lime-400 px-5 py-2 text-sm font-bold text-black"
              >
                Explorar jogos
              </Link>
            </div>
          )}
        </section>
      )}
      <BottomNav />
    </main>
  );
}
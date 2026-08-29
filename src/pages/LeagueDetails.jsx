import { useNavigate, useParams } from "react-router-dom";
import useLeagueDetails from "../hooks/useLeagueDetails";
import useLeagueStandings from "../hooks/useLeagueStandings";

import { useState } from "react";

export default function LeagueDetails() {
    const [activeTab, setActiveTab] = useState("classification");
    const navigate = useNavigate();
    const { id } = useParams();

    const {
        league,
        loading,
        error,
    } = useLeagueDetails(id);

  const {
    standings,
    loading: standingsLoading,
    error: standingsError,
} = useLeagueStandings(id, 2024);
  

    if (loading) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white">
                <p className="p-5">
                    Carregando liga...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white">
                <p className="p-5 text-red-400">
                    {error}
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-white">

            {/* HEADER */}
            <header className="relative h-16 border-b border-zinc-900">

                {/* BOTÃO VOLTAR */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-5 top-1/2 -translate-y-1/2
                    flex h-10 w-10 items-center justify-center
                    rounded-full bg-zinc-900 text-2xl
                    text-zinc-300 transition
                    hover:bg-zinc-800"
                >
                    ‹
                </button>

                {/* TÍTULO */}
                <h1 className="flex h-full items-center justify-center text-lg font-bold">
                    Detalhes da Liga
                </h1>

            </header>

            {league && (
                <section>

                    {/* HERO */}
                    <div className="relative h-64 overflow-hidden bg-zinc-900">

                        {/* FUNDO */}
                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-950" />

                        {/* CONTEÚDO */}
                        <div className="relative flex h-full flex-col items-center justify-end pb-6">

                            {/* LOGO */}
                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-800/80 p-4 shadow-lg">
                                <img
                                    src={league.logo}
                                    alt={league.name}
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            {/* NOME */}
                            <h2 className="text-center text-2xl font-bold">
                                {league.name}
                            </h2>

                            {/* PAÍS */}
                            <p className="mt-1 text-sm text-zinc-400">
                                {league.country}
                            </p>

                            {/* LIGA OFICIAL */}
                            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-lime-400">
                                <span>✓</span>
                                <span>LIGA OFICIAL</span>
                            </div>

                        </div>

                    </div>

                    {/* ABaS */}
                    <div className="border-b border-zinc-800 bg-zinc-950">

                        <div className="flex">


                            <button
                                onClick={() => setActiveTab('classification')}
                                className={`flex-1 py-4 text-sm font-semibold ${activeTab === 'classification'
                                    ? 'border-b-2 border-lime-400 text-lime-400'
                                    : 'text-zinc-500'
                                    }`}
                            >
                                CLASSIFICAÇÃO

                            </button>

                            <button
                                onClick={() => setActiveTab('matches')}
                                className={`flex-1 py-4 text-sm font-semibold ${activeTab === 'matches'
                                    ? 'border-b-2 border-lime-400 text-lime-400'
                                    : 'text-zinc-500'
                                    }`}
                            >
                                JOGOS

                            </button>

                            <button
                                onClick={() => setActiveTab('statistics')}
                                className={`flex-1 py-4 text-sm font-semibold ${activeTab === 'statistics'
                                    ? 'border-b-2 border-lime-400 text-lime-400'
                                    : 'text-zinc-500'
                                    }`}
                            >
                                ESTATÍSTICAS

                            </button>
                        </div>
                    </div>

                    {/* CONTEÚDO DA ABA */}
                    <section className="p-5">

                        {activeTab === "classification" && (
                            <div>
                                

                                {standingsLoading && (
                                    <div className="rounded-xl bg-zinc-900 p-5">
                                        <p className="text-sm text-zinc-400">
                                            Carregando classificação...
                                        </p>
                                    </div>
                                )}

                                {standingsError && (
                                    <div className="rounded-xl bg-zinc-900 p-5">
                                        <p className="text-sm text-red-400">
                                            {standingsError}
                                        </p>
                                    </div>
                                )}

                                {!standingsLoading &&
                                    !standingsError &&
                                    standings.length > 0 && (
                                        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">

                                            {/* CABEÇALHO */}

                                            <div className="grid grid-cols-[40px_1fr_40px_40px_40px] items-center border-b border-zinc-800 bg-zinc-800/60 px-4 py-3 text-xs font-semibold text-zinc-400">

                                                <span>#</span>

                                                <span>Clube</span>

                                                <span className="text-center">
                                                    J
                                                </span>

                                                <span className="text-center">
                                                    V
                                                </span>

                                                <span className="text-center">
                                                    P
                                                </span>

                                            </div>

                                            {/* TIMES */}

                                            {standings.map((team) => (
                                                <div
                                                    key={team.team.id}
                                                    className="grid grid-cols-[40px_1fr_40px_40px_40px] items-center border-b border-zinc-800 px-4 py-4 last:border-b-0"
                                                >

                                                    {/* POSIÇÃO */}

                                                    <span className="text-sm font-semibold text-zinc-400">
                                                        {team.rank}
                                                    </span>

                                                    {/* TIME */}

                                                    <div className="flex min-w-0 items-center gap-3">

                                                        <img
                                                            src={team.team.logo}
                                                            alt={team.team.name}
                                                            className="h-7 w-7 shrink-0 object-contain"
                                                        />

                                                        <span className="truncate text-sm font-semibold">
                                                            {team.team.name}
                                                        </span>

                                                    </div>

                                                    {/* JOGOS */}

                                                    <span className="text-center text-sm text-zinc-300">
                                                        {team.all.played}
                                                    </span>

                                                    {/* VITÓRIAS */}

                                                    <span className="text-center text-sm text-zinc-300">
                                                        {team.all.win}
                                                    </span>

                                                    {/* PONTOS */}

                                                    <span className="text-center text-sm font-bold text-white">
                                                        {team.points}
                                                    </span>

                                                </div>
                                            ))}
                                        </div>
                                    )}

                                {!standingsLoading &&
                                    !standingsError &&
                                    standings.length === 0 && (
                                        <div className="rounded-xl bg-zinc-900 p-5">
                                            <p className="text-sm text-zinc-400">
                                                Nenhuma classificação encontrada.
                                            </p>
                                        </div>
                                    )}
                            </div>
                        )}

                        {activeTab === "matches" && (
                            <div>
                                <h2 className="mb-4 text-lg font-bold">
                                    Jogos
                                </h2>

                                <div className="rounded-xl bg-zinc-900 p-5">
                                    <p className="text-sm text-zinc-400">
                                        Os jogos da liga serão carregados aqui.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === "statistics" && (
                            <div>
                                <h2 className="mb-4 text-lg font-bold">
                                    Estatísticas
                                </h2>

                                <div className="rounded-xl bg-zinc-900 p-5">
                                    <p className="text-sm text-zinc-400">
                                        As estatísticas serão carregadas aqui.
                                    </p>
                                </div>
                            </div>
                        )}

                    </section>

                </section>
            )}

        </main>
    );

}
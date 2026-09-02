import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useLeagueDetails from "../hooks/useLeagueDetails";
import useLeagueStandings from "../hooks/useLeagueStandings";

function getPositionStyle(standing) {
    const description = standing.description?.toLowerCase() || "";

    if (description.includes("relegation")) {
        return "border-l-4 border-red-300 bg-red-950/20";
    }

    if (
        description.includes("champions league") ||
        description.includes("libertadores")
    ) {
        return "border-l-4 border-lime-400 bg-lime-400/5";
    }

    if (
        description.includes("europa league") ||
        description.includes("conference league") ||
        description.includes("sudamericana")
    ) {
        return "border-l-4 border-zinc-300 bg-zinc-300/5";
    }

    return "border-l-4 border-transparent";
}

function getQualificationColor(description) {
    const text = description.toLowerCase();

    if (text.includes("relegation")) {
        return "bg-red-300";
    }

    if (
        text.includes("champions league") ||
        text.includes("libertadores")
    ) {
        return "bg-lime-400";
    }

    if (
        text.includes("europa league") ||
        text.includes("conference league") ||
        text.includes("sudamericana")
    ) {
        return "bg-zinc-300";
    }

    return "bg-white";
}

function formatQualification(description) {
    const text = description.toLowerCase();

    if (text.includes("relegation")) {
        return "Rebaixamento";
    }

    if (text.includes("champions league")) {
        return "Champions League";
    }

    if (text.includes("europa league")) {
        return "Europa League";
    }

    if (text.includes("conference league")) {
        return "Conference League";
    }

    if (text.includes("libertadores")) {
        return "Libertadores";
    }

    if (text.includes("sudamericana")) {
        return "Copa Sul-Americana";
    }

    return description;
}
export default function LeagueDetails() {
    const [activeTab, setActiveTab] = useState("classification");
    const navigate = useNavigate();
    const { id } = useParams();

    const { league, loading, error } = useLeagueDetails(id);
    const {
        standings,
        loading: standingsLoading,
        error: standingsError,
    } = useLeagueStandings(id, 2024);
    const qualifications = [
        ...new Map(
            standings
                .filter((standing) => standing.description)
                .map((standing) => [
                    standing.description,
                    standing.description,
                ])
        ).values(),
    ];

    console.log("Classificação:", standings);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
                <p className="text-sm text-zinc-400">Carregando liga...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-white">
                <p className="text-sm text-red-400">{error}</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <header className="relative flex h-16 items-center justify-center border-b border-zinc-900">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-2xl text-zinc-300 transition hover:bg-zinc-800"
                >
                    ‹
                </button>
                <h1 className="text-base font-bold">Detalhes da Liga</h1>
            </header>

            {league && (
                <section>
                    <div className="relative h-64 overflow-hidden bg-zinc-900">
                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-950" />

                        <div className="relative flex h-full flex-col items-center justify-end pb-6">
                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-800/80 p-4 shadow-lg">
                                <img
                                    src={league.logo}
                                    alt={league.name}
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <h2 className="text-2xl font-bold">{league.name}</h2>

                            <p className="mt-1 text-sm text-zinc-400">
                                {league.country}
                            </p>

                            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-lime-400">
                                <span className="text-sm">✓</span>
                                <span>LIGA OFICIAL</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-zinc-800 bg-zinc-950">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab("classification")}
                                className={`relative flex-1 py-4 text-xs font-bold transition ${activeTab === "classification"
                                    ? "text-lime-400"
                                    : "text-zinc-500"
                                    }`}
                            >
                                CLASSIFICAÇÃO

                                {activeTab === "classification" && (
                                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-lime-400" />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab("matches")}
                                className={`relative flex-1 py-4 text-xs font-bold transition ${activeTab === "matches"
                                    ? "text-lime-400"
                                    : "text-zinc-500"
                                    }`}
                            >
                                JOGOS

                                {activeTab === "matches" && (
                                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-lime-400" />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab("statistics")}
                                className={`relative flex-1 py-4 text-xs font-bold transition ${activeTab === "statistics"
                                    ? "text-lime-400"
                                    : "text-zinc-500"
                                    }`}
                            >
                                ESTATÍSTICAS

                                {activeTab === "statistics" && (
                                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-lime-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <section className="p-5">
                        {activeTab === "classification" && (
                            <div>
                                <h2 className="mb-4 text-lg font-bold">
                                    Classificação
                                </h2>

                                {standingsLoading ? (
                                    <div className="rounded-xl bg-zinc-900 p-5">
                                        <p className="text-sm text-zinc-400">
                                            Carregando classificação...
                                        </p>
                                    </div>
                                ) : standingsError ? (
                                    <div className="rounded-xl bg-zinc-900 p-5">
                                        <p className="text-sm text-red-400">
                                            {standingsError}
                                        </p>
                                    </div>
                                ) : standings.length === 0 ? (
                                    <div className="rounded-xl bg-zinc-900 p-5">
                                        <p className="text-sm text-zinc-400">
                                            Nenhuma classificação encontrada.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
                                        <div className="min-w-[600px]">
                                            {/* Cabeçalho */}
                                            <div className="flex items-center gap-4 border-b border-zinc-800 px-3 py-3">
                                                <div className="flex w-[260px] shrink-0 items-center gap-3">
                                                    <span className="w-5 text-center text-xs text-zinc-500">
                                                        #
                                                    </span>
                                                    <span className="text-xs text-zinc-400">
                                                        Clube
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-6 gap-2 text-center text-xs font-semibold text-zinc-500">
                                                    <span className="w-7">J</span>
                                                    <span className="w-7">V</span>
                                                    <span className="w-7">E</span>
                                                    <span className="w-7">D</span>
                                                    <span className="w-8">SG</span>
                                                    <span className="w-8">PTS</span>
                                                </div>
                                            </div>

                                            {standings.map((standing) => (
                                                <div
                                                    key={standing.team.id}
                                                    className={`flex items-center gap-4 border-b border-zinc-800 px-3 py-3 last:border-b-0 ${getPositionStyle(standing)}`}
                                                >
                                                    <div className="flex w-[260px] shrink-0 items-center gap-3">
                                                        <span className="w-5 text-center text-sm text-zinc-500">
                                                            {standing.rank}
                                                        </span>

                                                        <img
                                                            src={standing.team.logo}
                                                            alt={standing.team.name}
                                                            className="h-7 w-7 shrink-0 object-contain"
                                                        />

                                                        <span className="truncate text-sm font-semibold text-white">
                                                            {standing.team.name}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-6 gap-2 text-center text-sm">
                                                        <span className="w-7 text-zinc-300">
                                                            {standing.all.played}
                                                        </span>

                                                        <span className="w-7 text-zinc-300">
                                                            {standing.all.win}
                                                        </span>

                                                        <span className="w-7 text-zinc-300">
                                                            {standing.all.draw}
                                                        </span>

                                                        <span className="w-7 text-zinc-300">
                                                            {standing.all.lose}
                                                        </span>

                                                        <span
                                                            className={`w-8 font-semibold ${standing.goalsDiff > 0
                                                                ? "text-lime-400"
                                                                : standing.goalsDiff < 0
                                                                    ? "text-red-400"
                                                                    : "text-zinc-400"
                                                                }`}
                                                        >
                                                            {standing.goalsDiff > 0
                                                                ? `+${standing.goalsDiff}`
                                                                : standing.goalsDiff}
                                                        </span>

                                                        <span className="w-8 font-bold text-white">
                                                            {standing.points}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Legenda */}
                                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                                    <div className="mb-4 flex items-center gap-2">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-500 text-xs text-zinc-300">
                                            i
                                        </span>

                                        <h3 className="text-sm font-bold text-zinc-300">
                                            Qualificações
                                        </h3>
                                    </div>

                                    {qualifications.length === 0 ? (
                                        <p className="text-xs text-zinc-500">
                                            Nenhuma qualificação encontrada.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {qualifications.map((qualification) => (
                                                <div
                                                    key={qualification}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span
                                                        className={`h-2.5 w-2.5 rounded-full ${getQualificationColor(
                                                            qualification
                                                        )}`}
                                                    />

                                                    <span className="text-xs font-semibold text-zinc-300">
                                                        {formatQualification(qualification)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "matches" && (
                            <div>
                                <h2 className="mb-4 text-lg font-bold">Jogos</h2>

                                <div className="rounded-xl bg-zinc-900 p-5">
                                    <p className="text-sm text-zinc-400">
                                        Jogos da competição aparecerão aqui.
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
                                        Estatísticas da competição aparecerão aqui.
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
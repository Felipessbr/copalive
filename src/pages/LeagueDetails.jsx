import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { RiShakeHandsLine } from "react-icons/ri";
import { BsHandThumbsUp } from "react-icons/bs";
import { CiWarning } from "react-icons/ci";
import { IoStatsChartOutline } from "react-icons/io5";
import { LiaFireAltSolid } from "react-icons/lia";
import { RiShieldCheckLine } from "react-icons/ri";
import { GrTrophy } from "react-icons/gr";

import useLeagueDetails from "../hooks/useLeagueDetails";
import useLeagueStandings from "../hooks/useLeagueStandings";
import useLeagueMatches from "../hooks/useLeagueMatches";
import useLeagueTopScorers from "../hooks/useLeagueTopScorers";
import useLeagueTopAssists from "../hooks/useLeagueTopAssists";
import useLeagueGoalkeepers from "../hooks/useLeagueGoalkeepers";
import useLeaguePossession from "../hooks/useLeaguePossession";
import useFavoriteLeagues from "../hooks/useFavoriteLeagues";
import calculateLeagueStatistics from "../utils/calculateLeagueStatistics";
import leagueStatistics from "../data/leagueStatistics";

function getPositionStyle(standing) {
  const description = standing.description?.toLowerCase() || "";

  if (description.includes("relegation")) {
    return "border-l-4 border-red-300 bg-red-950/20";
  }

  if (description.includes("champions league") || description.includes("libertadores")) {
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

  if (text.includes("relegation")) return "bg-red-300";
  if (text.includes("champions league") || text.includes("libertadores")) return "bg-lime-400";
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

  if (text.includes("relegation")) return "Rebaixamento";
  if (text.includes("champions league")) return "Champions League";
  if (text.includes("europa league")) return "Europa League";
  if (text.includes("conference league")) return "Conference League";
  if (text.includes("libertadores")) return "Libertadores";
  if (text.includes("sudamericana")) return "Copa Sul-Americana";

  return description;
}

export default function LeagueDetails() {
  const [activeTab, setActiveTab] = useState("classification");
  const navigate = useNavigate();
  const { id } = useParams();

  const { favoriteLeagues } = useFavoriteLeagues();

  const favoriteLeague = favoriteLeagues.find((league) => String(league.id) === String(id));

  const { league, loading, error } = useLeagueDetails(id, favoriteLeague);

  const {
    standings,
    loading: standingsLoading,
    error: standingsError,
  } = useLeagueStandings(id, 2024);

  const {
    matches,
    loading: matchesLoading,
    error: matchesError,
  } = useLeagueMatches(id, 2024);

  const {
    possession,
    loading: possessionLoading,
    error: possessionError,
  } = useLeaguePossession(
    id,
    2024,
    matches
  );
  const {
    topScorers,
    iLoading: topScorersLoading,
    error: topScorersError,
  } = useLeagueTopScorers(id, 2024);

  const {
    topAssists,
    loading: topAssistsLoading,
    error: topAssistsError,
  } = useLeagueTopAssists(id, 2024);

  const {
    goalkeepers,
    loading: goalkeepersLoading,
    error: goalkeepersError,
  } = useLeagueGoalkeepers(id, 2024);


  const statistics = calculateLeagueStatistics(matches);

  const displayedMatches = matches.map((match) => ({
    id: match.fixture.id,
    date: match.fixture.date,

    status:
      match.fixture.status === "FT" ||
        match.fixture.status === "AET" ||
        match.fixture.status === "PEN"
        ? "ENCERRADO"
        : match.fixture.status.short === "NS"
          ? "AGENDADO"
          : "AO VIVO",

    home: match.teams.home.name,
    homeLogo: match.teams.home.logo,
    homeScore: match.goals.home,

    away: match.teams.away.name,
    awayLogo: match.teams.away.logo,
    awayScore: match.goals.away,


    league: match.league.name,

  }))

  const qualifications = [
    ...new Map(
      standings
        .filter((standing) => standing.description)
        .map((standing) => ({
          description: standing.description,
          label: formatQualification(standing.description),
        }))
        .map((qualification) => [qualification.label, qualification])
    ).values(),
  ];

  console.log("Classificação:", standings);

  // LOADING DA LIGA

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-sm text-zinc-400">Carregando liga...</p>
      </main>
    );
  }

  // ERRO DA LIGA

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-white">
        <p className="text-sm text-red-400">{error}</p>
      </main>
    );
  }

  const possessionRanking = possession
    .map((team, index) => ({
      position: index + 1,
      team: team.teamName,
      value: team.averagePossession,
    }))
    .sort((a, b) => b.value - a.value);

  const possessionAverage =
    possessionRanking.length > 0
      ? Number(
        (
          possessionRanking.reduce(
            (total, team) =>
              total + team.value,
            0
          ) / possessionRanking.length
        ).toFixed(1)
      )
      : 0;

  const possessionLeader =
    possessionRanking[0]?.team || "-";

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/*  HEADER  */}
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
          {/* INFORMAÇÕES DA LIGA */}
          <div className="relative h-64 overflow-hidden bg-zinc-900">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-950" />

            <div className="relative flex h-full flex-col items-center justify-end pb-6">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-800/80 p-4 shadow-lg">
                <img src={league.logo} alt={league.name} className="h-full w-full object-contain" />
              </div>

              <h2 className="text-2xl font-bold">{league.name}</h2>

              <p className="mt-1 text-sm text-zinc-400">{league.country}</p>

              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-lime-400">
                <span className="text-sm">✓</span>
                <span>LIGA OFICIAL</span>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="border-b border-zinc-800 bg-zinc-950">
            <div className="flex">
              {/* CLASSIFICAÇÃO */}
              <button
                onClick={() => setActiveTab("classification")}
                className={`relative flex-1 py-4 text-xs font-bold transition ${activeTab === "classification" ? "text-lime-400" : "text-zinc-500"
                  }`}
              >
                CLASSIFICAÇÃO
                {activeTab === "classification" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-lime-400" />
                )}
              </button>

              {/* JOGOS */}
              <button
                onClick={() => setActiveTab("matches")}
                className={`relative flex-1 py-4 text-xs font-bold transition ${activeTab === "matches" ? "text-lime-400" : "text-zinc-500"
                  }`}
              >
                JOGOS
                {activeTab === "matches" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-lime-400" />
                )}
              </button>

              {/* ESTATÍSTICAS */}
              <button
                onClick={() => setActiveTab("statistics")}
                className={`relative flex-1 py-4 text-xs font-bold transition ${activeTab === "statistics" ? "text-lime-400" : "text-zinc-500"
                  }`}
              >
                ESTATÍSTICAS
                {activeTab === "statistics" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-lime-400" />
                )}
              </button>
            </div>
          </div>

          {/*  CONTEÚDO */}
          <section className="p-3">
            {/* CLASSIFICAÇÃO */}
            {activeTab === "classification" && (
              <div>
                <h2 className="mb-4 text-lg font-bold">Classificação</h2>

                {standingsLoading ? (
                  <div className="rounded-xl bg-zinc-900 p-5">
                    <p className="text-sm text-zinc-400">Carregando classificação...</p>
                  </div>
                ) : standingsError ? (
                  <div className="rounded-xl bg-zinc-900 p-5">
                    <p className="text-sm text-red-400">{standingsError}</p>
                  </div>
                ) : standings.length === 0 ? (
                  <div className="rounded-xl bg-zinc-900 p-5">
                    <p className="text-sm text-zinc-400">Nenhuma classificação encontrada.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
                    <div className="min-w-[600px]">
                      {/* Cabeçalho */}
                      <div className="flex items-center gap-4 border-b border-zinc-800 px-3 py-3">
                        <div className="flex w-[260px] shrink-0 items-center gap-3">
                          <span className="w-5 text-center text-xs text-zinc-500">#</span>
                          <span className="text-xs text-zinc-400">Clube</span>
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

                      {/* Times */}
                      {standings.map((standing) => (
                        <div
                          key={standing.team.id}
                          className={`flex items-center gap-4 border-b border-zinc-800 px-3 py-3 last:border-b-0 ${getPositionStyle(
                            standing
                          )}`}
                        >
                          <div className="flex w-[260px] shrink-0 items-center gap-3">
                            <span className="w-5 text-center text-sm text-zinc-500">{standing.rank}</span>

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
                            <span className="w-7 text-zinc-300">{standing.all.played}</span>
                            <span className="w-7 text-zinc-300">{standing.all.win}</span>
                            <span className="w-7 text-zinc-300">{standing.all.draw}</span>
                            <span className="w-7 text-zinc-300">{standing.all.lose}</span>

                            <span
                              className={`w-8 font-semibold ${standing.goalsDiff > 0
                                ? "text-lime-400"
                                : standing.goalsDiff < 0
                                  ? "text-red-400"
                                  : "text-zinc-400"
                                }`}
                            >
                              {standing.goalsDiff > 0 ? `+${standing.goalsDiff}` : standing.goalsDiff}
                            </span>

                            <span className="w-8 font-bold text-white">{standing.points}</span>
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
                    <h3 className="text-sm font-bold text-zinc-300">Qualificações</h3>
                  </div>

                  {qualifications.length === 0 ? (
                    <p className="text-xs text-zinc-500">Nenhuma qualificação encontrada.</p>
                  ) : (
                    <div className="space-y-3">
                      {qualifications.map((qualification) => (
                        <div key={qualification.label} className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${getQualificationColor(
                              qualification.description
                            )}`}
                          />
                          <span className="text-xs font-semibold text-zinc-300">
                            {qualification.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* JOGOS */}
            {activeTab === "matches" && (
              <div>
                {/* TÍTULO */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold">Jogos</h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Partidas da temporada 2024
                  </p>
                </div>

                {/* CARREGANDO */}
                {matchesLoading ? (
                  <div className="rounded-xl bg-zinc-900 p-5">
                    <p className="text-sm text-zinc-400">
                      Carregando jogos...
                    </p>
                  </div>

                ) : matchesError ? (
                  /* ERRO */
                  <div className="rounded-xl bg-zinc-900 p-5">
                    <p className="text-sm text-red-400">
                      {matchesError}
                    </p>
                  </div>

                ) : displayedMatches.length === 0 ? (
                  /* NENHUM JOGO */
                  <div className="rounded-xl bg-zinc-900 p-5">
                    <p className="text-sm text-zinc-400">
                      Nenhum jogo encontrado.
                    </p>
                  </div>

                ) : (
                  /* LISTA DE JOGOS */
                  <div className="space-y-4">
                    {displayedMatches.map((match) => {
                      const date = new Date(match.date);

                      const formattedDate = date.toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "short",
                        }
                      );

                      const formattedTime = date.toLocaleTimeString(
                        "pt-BR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      );

                      return (
                        <div
                          key={match.id}
                          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
                        >
                          {/* DATA + STATUS */}
                          <div className="mb-4 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-zinc-500">
                              {formattedDate}
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${match.status === "ENCERRADO"
                                ? "bg-zinc-800 text-zinc-400"
                                : match.status === "AO VIVO"
                                  ? "bg-lime-400/10 text-lime-400"
                                  : "bg-zinc-800 text-zinc-300"
                                }`}
                            >
                              {match.status}
                            </span>
                          </div>

                          {/* PARTIDA */}
                          <div className="flex items-center justify-between">

                            {/* MANDANTE */}
                            <div className="flex w-[35%] flex-col items-center gap-2 text-center">
                              <img
                                src={match.homeLogo}
                                alt={match.home}
                                className="h-10 w-10 object-contain"
                              />

                              <span className="text-xs font-bold text-white">
                                {match.home}
                              </span>
                            </div>

                            {/* PLACAR / HORÁRIO */}
                            <div className="flex flex-col items-center">

                              {match.homeScore !== null &&
                                match.awayScore !== null ? (
                                <span className="text-xl font-black text-white">
                                  {match.homeScore} - {match.awayScore}
                                </span>
                              ) : (
                                <span className="text-sm font-black text-lime-400">
                                  {formattedTime}
                                </span>
                              )}

                              <span className="mt-1 text-[10px] font-bold uppercase text-zinc-600">
                                {match.league}
                              </span>
                            </div>

                            {/* VISITANTE */}
                            <div className="flex w-[35%] flex-col items-center gap-2 text-center">
                              <img
                                src={match.awayLogo}
                                alt={match.away}
                                className="h-10 w-10 object-contain"
                              />

                              <span className="text-xs font-bold text-white">
                                {match.away}
                              </span>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ESTATÍSTICAS*/}

            {activeTab === "statistics" && (
              <div>
                {/* TITULO */}
                <div className="mb-5">
                  <h2>Estatísticas</h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Temporada 2024
                  </p>

                </div>

                {/* RESUMO */}
                <div className="grid grid-cols-2 gap-3">

                  {/* MÉDIAS DE GOLS */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-lime-100/70">
                        Média de gols
                      </span>

                      <IoStatsChartOutline className="text-lime-400 h-4 w-4" />
                    </div>

                    <div className="mt-3">
                      <span className="text-[20px] font-bold text-white">
                        {statistics.averageGoals.toFixed(2)}
                      </span>

                      <span className="ml-1 text-[9px] font-bold text-lime-400">
                        gols / jogo
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] text-lime-100/70">
                      {statistics.totalGoals} gols em{" "}
                      {statistics.totalMatches} partidas
                    </p>
                  </div>

                  {/* MELHOR ATAQUE */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-lime-100/70">
                        Melhor ataque
                      </span>

                      <LiaFireAltSolid className="text-lime-400 h-4 w-4" />
                    </div>

                    <div className="mt-3">
                      <span className="text-[20px] font-bold text-white">
                        {statistics.bestAttack?.goals ?? 0}
                      </span>

                      <span className="ml-1 text-[9px] font-bold text-lime-400">
                        {statistics.bestAttack?.name ?? "—"}
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-lime-400"
                        style={{
                          width: "85%",
                        }}
                      />
                    </div>
                  </div>

                  {/* MELHOR DEFESA */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-lime-100/70">
                        Melhor defesa
                      </span>

                      <RiShieldCheckLine className="text-lime-400 h-4 w-4" />
                    </div>

                    <div className="mt-3">
                      <span className="text-[20px] font-bold text-white">
                        {statistics.bestDefense?.goalsAgainst ?? 0}
                      </span>

                      <span className="ml-1 text-[9px] font-bold text-lime-400">
                        {statistics.bestDefense?.name ?? "—"}
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] text-lime-100/70">
                      Menos gols sofridos
                    </p>
                  </div>

                  {/* DISCIPLINA */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-lime-100/70">
                        disciplina
                      </span>

                      <span>
                        🟨🟥
                      </span>
                    </div>

                    <div className="mt-3">
                      <span className="text-[20px] font-bold text-white">
                        —
                      </span>

                      <span className="ml-1 text-[9px] font-bold text-lime-400">
                        em breve
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] text-lime-100/70">
                      Estatísticas disciplinares serão integradas depois.
                    </p>
                  </div>

                </div>

                {/* ARTILHARIA */}
                <div className="mt-6">
                  {/* Cabeçalho */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GrTrophy className="h-4 w-4 text-lime-400" />

                      <h3 className="text-lg font-bold text-white">
                        Artilharia
                      </h3>
                    </div>

                    <span className="text-xs font-bold text-lime-400">
                      Temporada 2024
                    </span>
                  </div>

                  {/* Card */}
                  <div
                    className="max-h-[430px] overflow-y-auto overflow-x-hidden rounded-2xl bg-zinc-900 px-4"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#3f3f46 transparent",
                    }}
                  >
                    {topScorersLoading ? (
                      <p className="py-6 text-center text-sm text-zinc-500">
                        Carregando artilharia...
                      </p>
                    ) : topScorersError ? (
                      <p className="py-6 text-center text-sm text-red-400">
                        {topScorersError}
                      </p>
                    ) : topScorers.length === 0 ? (
                      <p className="py-6 text-center text-sm text-zinc-500">
                        Nenhum artilheiro encontrado.
                      </p>
                    ) : (
                      topScorers.map((player, index) => {
                        const playerData = player.player;
                        const statisticsData = player.statistics?.[0];

                        const goals = statisticsData?.goals?.total ?? 0;

                        const maxGoals =
                          topScorers[0]?.statistics?.[0]?.goals?.total ?? 1;

                        const progress = (goals / maxGoals) * 100;

                        const playerName =
                          playerData?.name ?? "Jogador";

                        const playerPhoto =
                          playerData?.photo;

                        const teamName =
                          statisticsData?.team?.name ?? "—";

                        const position =
                          statisticsData?.games?.position ?? "—";

                        return (
                          <div
                            key={playerData?.id ?? index}
                            className="border-b border-zinc-800 py-5 last:border-b-0"
                          >
                            {/* Informações do jogador */}
                            <div className="flex items-center justify-between">

                              {/* Esquerda */}
                              <div className="flex min-w-0 items-center gap-3">

                                {/* Posição */}
                                <span className="w-5 shrink-0 text-center text-sm font-bold text-lime-400">
                                  {index + 1}
                                </span>

                                {/* Foto */}
                                {playerPhoto ? (
                                  <img
                                    src={playerPhoto}
                                    alt={playerName}
                                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-800" />
                                )}

                                {/* Jogador */}
                                <div className="min-w-0">
                                  <h4 className="truncate text-sm font-bold text-white">
                                    {playerName}
                                  </h4>

                                  <p className="text-xs font-semibold text-lime-100/70">
                                    {teamName} • {position}
                                  </p>
                                </div>
                              </div>

                              {/* Gols */}
                              <div className="ml-3 shrink-0 text-right">
                                <span
                                  className={`text-2xl font-bold ${index === 0
                                    ? "text-lime-400"
                                    : "text-white"
                                    }`}
                                >
                                  {goals}
                                </span>

                                <span className="text-[11px] text-lime-100/70">
                                  gols
                                </span>
                              </div>
                            </div>

                            {/* Barra de progresso */}
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${index === 0
                                  ? "bg-lime-400"
                                  : "bg-zinc-700"
                                  }`}
                                style={{
                                  width: `${progress}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* LÍDERES DE GARÇOM & DEFESA */}
                <div className="mt-6">

                  <div className="mb-4">
                    <h1 className="text-lg font-bold text-white">
                      Líderes de Garçom & Defesa
                    </h1>
                  </div>

                  {/* Card de assistências */}
                  <div className="overflow-hidden rounded-2xl bg-zinc-900 px-4 py-4">

                    {/* Cabeçalho */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RiShakeHandsLine className="text-2xl text-lime-400">
                        </RiShakeHandsLine>

                        <h2 className="text-lg font-bold text-white">
                          Mais Assistências
                        </h2>
                      </div>

                      <span className="text-sm font-medium text-zinc-300">
                        Passes decisivos
                      </span>
                    </div>

                    {/* Jogadores */}
                    <div className="max-h-[430px] overflow-y-auto overflow-x-hidden rounded-2xl bg-zinc-900 space-y-4"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#3f3f46 transparent",
                      }}>

                      {topAssistsLoading ? (
                        <p className="py-6 text-center text-sm text-zinc-500">
                          Carregando assistências...
                        </p>
                      ) : topAssistsError ? (
                        <p className="py-6 text-center text-sm text-red-400">
                          {topAssistsError}
                        </p>
                      ) : topAssists.length === 0 ? (
                        <p className="py-6 text-center text-sm text-zinc-500">
                          Nenhum jogador encontrado.
                        </p>
                      ) : (
                        topAssists.map((player, index) => {
                          const playerData = player.player;
                          const statisticsData = player.statistics?.[0];

                          const assists =
                            statisticsData?.goals?.assists ?? 0;

                          const playerName =
                            playerData?.name ?? "Jogador";

                          const teamName =
                            statisticsData?.team?.name ?? "—";

                          return (
                            <div
                              key={playerData?.id ?? index}
                              className="flex items-center justify-between rounded-2xl bg-zinc-950/12 px-4 py-5"
                            >
                              {/* Jogador */}
                              <div className="flex items-center gap-4">

                                {/* Posição */}
                                <span
                                  className={`w-5 text-center text-lg font-bold ${index === 0
                                    ? "text-lime-400"
                                    : "text-zinc-300"
                                    }`}
                                >
                                  #{index + 1}
                                </span>

                                {/* Informações */}
                                <div>
                                  <h3 className="text-[18px] font-semibold text-white">
                                    {playerName}
                                  </h3>

                                  <p className="mt-1 text-sm font-medium text-zinc-300">
                                    {teamName}
                                  </p>
                                </div>
                              </div>

                              {/* Assistências */}
                              <div className="flex items-baseline gap-1">
                                <span
                                  className={`text-2xl font-bold ${index === 0
                                    ? "text-lime-400"
                                    : "text-white"
                                    }`}
                                >
                                  {assists}
                                </span>

                                <span className="text-sm text-zinc-300">
                                  ast
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}

                    </div>

                  </div>
                </div>

                {/* COLEIROS MENOS VAZADOS */}
                <div className="mt-6">
                  <div className="overflow-hidden rounded-2xl bg-zinc-900 px-4 py-4">

                    {/* Cabeçalho */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">

                        <h2 className="text-lg font-bold text-white">
                          Goleiros Menos Vazados
                        </h2>
                        <span className="text-lime-100/70">
                          Gols sofridos por jogo
                        </span>
                      </div>


                    </div>
                    <div className="space-y-4">

                      {goalkeepersLoading ? (

                        <p className="px-4 py-4 text-sm text-lime-100/70">
                          Carregando goleiros...
                        </p>

                      ) : goalkeepersError ? (

                        <p className="px-4 py-4 text-sm text-red-400">
                          {goalkeepersError}
                        </p>

                      ) : goalkeepers.length === 0 ? (

                        <p className="px-4 py-4 text-sm text-lime-100/70">
                          Nenhum goleiro encontrado.
                        </p>

                      ) : (

                        goalkeepers.slice(0, 3).map((player, index) => (

                          <div
                            key={player.id}
                            className="flex items-center justify-between rounded-2xl bg-zinc-950/12 px-4 py-5"
                          >

                            {/* Jogador */}
                            <div className="flex items-center gap-4">

                              {/* Posição */}
                              <span
                                className={`w-5 text-center text-lg font-bold ${index === 0
                                  ? "text-lime-400"
                                  : "text-zinc-300"
                                  }`}
                              >
                                #{index + 1}
                              </span>

                              {/* Informações */}
                              <div>

                                <h3 className="text-[18px] font-semibold text-white">
                                  {player.name}
                                </h3>

                                <p className="mt-1 text-sm font-medium text-lime-100/70">
                                  {player.team} • {player.goalsConcededPerGame}/j
                                </p>

                              </div>

                            </div>

                            {/* Gols sofridos */}
                            <div className="flex items-baseline gap-1">

                              <span
                                className={`text-2xl font-bold ${index === 0
                                  ? "text-lime-400"
                                  : "text-white"
                                  }`}
                              >
                                {player.goalsConceded}
                              </span>

                              <span className="text-lime-100/70">
                                Gols sofridos por jogo
                              </span>

                            </div>

                          </div>

                        ))

                      )}

                    </div>
                  </div>
                </div>

                {/* DOMÍNIO & POSSE DE BOLA */}

                <div className="mt-6">

                  {/* Cabeçalho */}
                  <div className="mb-4 flex items-start justify-between gap-4">

                    <h1 className="text-2xl font-bold leading-tight text-white">
                      Posse de Bola
                    </h1>

                    <span className="pt-1 text-right text-sm font-semibold leading-tight text-lime-400">
                      Média da Série A
                    </span>

                  </div>

                  {/* Card */}
                  <div
                    className="max-h-[430px] overflow-y-auto overflow-x-hidden rounded-2xl bg-zinc-900 px-4 py-6"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#3f3f46 transparent",
                    }}
                  >

                    {possessionLoading ? (

                      <div className="py-10 text-center text-sm text-zinc-400">
                        Carregando posse de bola...
                      </div>

                    ) : possession.length === 0 ? (

                      <div className="py-10 text-center text-sm text-zinc-400">
                        Nenhum dado de posse encontrado.
                      </div>

                    ) : (

                      <>

                        {/* Resumo */}
                        <div className="flex items-start justify-between">

                          {/* Média */}
                          <div>

                            <span className="text-4xl font-bold text-white">
                              {possessionAverage}%
                            </span>

                            <p className="mt-2 text-sm text-lime-100/70">
                              Maior Posse Média:{" "}

                              <span className="font-bold text-white">
                                {possessionLeader}
                              </span>
                            </p>

                          </div>

                          {/* Círculo */}
                          <div className="relative h-[88px] w-[88px]">

                            <div
                              className="h-full w-full rounded-full"
                              style={{
                                background: `conic-gradient(
                  #a3ff12 ${possessionAverage * 3.6}deg,
                  #3f4146 0deg
                )`,
                              }}
                            />

                            <div className="absolute inset-[8px] flex items-center justify-center rounded-full bg-zinc-900">

                              <span className="text-sm font-bold text-lime-400">
                                {Math.round(
                                  possessionAverage
                                )}%
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* Ranking */}
                        <div className="mt-8 space-y-5">

                          {possessionRanking.map(
                            (team) => (

                              <div key={team.team}>

                                {/* Nome + porcentagem */}
                                <div className="mb-2 flex items-center justify-between">

                                  <span className="text-sm font-semibold text-white">
                                    {team.position}.{" "}
                                    {team.team}
                                  </span>

                                  <span
                                    className={`text-sm font-bold ${team.position === 1
                                      ? "text-lime-400"
                                      : "text-zinc-300"
                                      }`}
                                  >
                                    {team.value}%
                                  </span>

                                </div>

                                {/* Barra */}
                                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">

                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${team.position === 1
                                      ? "bg-lime-400"
                                      : "bg-zinc-700"
                                      }`}
                                    style={{
                                      width: `${team.value}%`,
                                    }}
                                  />

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      </>

                    )}

                  </div>

                </div>

                {/* FAIR PLAY & FALTAS */}
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-white">
                      Fair Play & Faltas
                    </h1>

                    <span className="text-sm text-zinc-400">
                      ⓘ
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    {/* Mais disciplinada */}
                    <div className="rounded-2xl bg-zinc-900 px-4 py-6">

                      <div className="flex items-center gap-2 text-lime-400">
                        <BsHandThumbsUp className="h-5 w-5" />

                        <span className="text-[11px] font-bold">
                          + DISCIPLINADA
                        </span>
                      </div>

                      <div className="mt-8">
                        <h2 className="text-xl font-bold text-white">
                          {leagueStatistics.fairPlay.mostDisciplined.team}
                        </h2>

                        <p className="mt-3 text-sm text-lime-100/70">
                          {leagueStatistics.fairPlay.mostDisciplined.yellowCards} amarelos
                          {" • "}
                          {leagueStatistics.fairPlay.mostDisciplined.redCards} vermelho
                        </p>
                      </div>

                      <div className="mt-6 rounded-xl bg-zinc-800 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-lime-400">
                            Méd. faltas
                          </span>

                          <span className="text-sm font-bold text-lime-400">
                            {leagueStatistics.fairPlay.mostDisciplined.averageFouls}/j
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mais faltosa */}
                    <div className="rounded-2xl bg-zinc-900 px-4 py-6">

                      <div className="flex items-center gap-2 text-red-400">
                        <CiWarning className="h-5 w-5" />

                        <span className="text-[11px] font-bold">
                          + FALTOSA
                        </span>
                      </div>

                      <div className="mt-8">
                        <h2 className="text-xl font-bold text-white">
                          {leagueStatistics.fairPlay.mostFouls.team}
                        </h2>

                        <p className="mt-3 text-sm text-lime-100/70">
                          {leagueStatistics.fairPlay.mostFouls.yellowCards} amarelos
                          {" • "}
                          {leagueStatistics.fairPlay.mostFouls.redCards} vermelhos
                        </p>
                      </div>

                      <div className="mt-6 rounded-xl bg-zinc-800 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-red-400">
                            Méd. faltas
                          </span>

                          <span className="text-sm font-bold text-red-400">
                            {leagueStatistics.fairPlay.mostFouls.averageFouls}/j
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </section>

        </section>
      )}
    </main>
  );
}
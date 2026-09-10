import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ShieldCheckIcon,
  ChartBarIcon,
  FireIcon,
  HandThumbUpIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import useLeagueDetails from "../hooks/useLeagueDetails";
import useLeagueStandings from "../hooks/useLeagueStandings";
import useLeagueMatches from "../hooks/useLeagueMatches";
import useFavoriteLeagues from "../hooks/useFavoriteLeagues";

import leagueMatches from "../data/leagueMatches";
import leagueStatistics from "../data/leagueStatistics";
import api from './../services/api';
import { TrophyIcon } from "lucide-react";

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

  // MOCK DOS JOGOS
  // Usado enquanto a API está sem cota

  const displayedMatches = leagueMatches;

  console.log("Jogos da liga 2024:", matches);

  // QUALIFICAÇÕES

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
  // ========================================
  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-white">
        <p className="text-sm text-red-400">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* ========================================
          HEADER
      ======================================== */}
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
          {/* ========================================
              INFORMAÇÕES DA LIGA
          ======================================== */}
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
          <section className="p-5">
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
                <div className="mb-5">
                  <h2 className="text-lg font-bold">Jogos</h2>
                  <p className="mt-1 text-sm text-zinc-500">Partidas da temporada 2024</p>
                </div>

                {displayedMatches.length === 0 ? (
                  <div className="rounded-xl bg-zinc-900 p-5">
                    <p className="text-sm text-zinc-400">Nenhum jogo encontrado.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayedMatches.map((match) => {
                      const date = new Date(match.date);

                      const formattedDate = date.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      });

                      const formattedTime = date.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <div key={match.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                          {/* Data + status */}
                          <div className="mb-4 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-zinc-500">
                              {formattedDate}
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${match.status === "ENCERRADO"
                                ? "bg-zinc-800 text-zinc-400"
                                : "bg-lime-400/10 text-lime-400"
                                }`}
                            >
                              {match.status}
                            </span>
                          </div>

                          {/* Partida */}
                          <div className="flex items-center justify-between">
                            {/* Mandante */}
                            <div className="flex w-[35%] flex-col items-center gap-2 text-center">
                              <img src={match.homeLogo} alt={match.home} className="h-10 w-10 object-contain" />
                              <span className="text-xs font-bold text-white">{match.home}</span>
                            </div>

                            {/* Placar / Horário */}
                            <div className="flex flex-col items-center">
                              {match.homeScore !== null && match.awayScore !== null ? (
                                <span className="text-xl font-black text-white">
                                  {match.homeScore} - {match.awayScore}
                                </span>
                              ) : (
                                <span className="text-sm font-black text-lime-400">{formattedTime}</span>
                              )}

                              <span className="mt-1 text-[10px] font-bold uppercase text-zinc-600">
                                Brasileirão
                              </span>
                            </div>

                            {/* Visitante */}
                            <div className="flex w-[35%] flex-col items-center gap-2 text-center">
                              <img src={match.awayLogo} alt={match.away} className="h-10 w-10 object-contain" />
                              <span className="text-xs font-bold text-white">{match.away}</span>
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
                    Temporada {leagueStatistics.season}
                  </p>

                </div>

                {/* RESUMO*/}

                <div className="grid grid-cols-2 gap-3">

                  {/* MÉDIAS DE GOLS */}

                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">

                    <div className="flex items-center justify-between">

                      <span className="text-[10px] font-bold uppercase 
                      text-lime-100/70">
                        Média de gols
                      </span>

                      <ChartBarIcon className="text-lime-400 h-4 w-4" />
                    </div>

                    <div className="mt-3">

                      <span className="text-sm font-bold text-white text-[20px]">
                        {leagueStatistics.summary.averageGoals.toFixed(2)}
                      </span>

                      <span className="ml-1 text-[9px] font-bold text-lime-400">
                        gols / jogo
                      </span>

                    </div>

                    <p className="mt-1 text-[10px] text-lime-100/70">
                      {leagueStatistics.summary.totalGoals} gols em {" "}{leagueStatistics.summary.totalMatches} partidas
                    </p>

                  </div>

                  {/* MELHOR ATAQUE */}

                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">

                    <div className="flex items-center justify-between">

                      <span className="text-[10px] font-bold uppercase 
                      text-lime-100/70">
                        Melhor ataque
                      </span>

                      <FireIcon className="text-lime-400 h-4 w-4" />
                    </div>

                    <div className="mt-3">

                      <span className="text-sm font-bold text-white text-[20px]">
                        {leagueStatistics.summary.bestAttack.value}
                      </span>

                      <span className="ml-1 text-[9px] font-bold text-lime-400">
                        {leagueStatistics.summary.bestAttack.team}
                      </span>

                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800 ">
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

                      <span className="text-[10px] font-bold uppercase 
                      text-lime-100/70">
                        Melhor defesa
                      </span>

                      <ShieldCheckIcon className="text-lime-400 h-4 w-4" />
                    </div>

                    <div className="mt-3">

                      <span className="text-sm font-bold text-white text-[20px]">
                        {leagueStatistics.summary.bestDefense.value}
                      </span>

                      <span className="ml-1 text-[9px] font-bold text-lime-400">
                        {leagueStatistics.summary.bestDefense.team}
                      </span>

                    </div>

                    <p className="mt-1 text-[10px] text-lime-100/70">
                      Apenas {leagueStatistics.summary.bestDefense.media} {" "}
                      {leagueStatistics.summary.bestDefense.label}
                    </p>

                  </div>

                  {/* DISCIPLINA */}

                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">

                    <div className="flex items-center justify-between">

                      <span className="text-[10px] font-bold uppercase 
                      text-lime-100/70">
                        disciplina
                      </span>

                      <span>
                        🟨🟥
                      </span>

                    </div>

                    <div className="mt-3">

                      <span className="text-sm font-bold text-white text-[20px]">
                        {leagueStatistics.summary.discipline.averageCards}
                      </span>

                      <span className="ml-1 text-[9px] font-bold text-lime-400">
                        {leagueStatistics.summary.discipline.label}
                      </span>

                    </div>

                    <p className="mt-1 text-[10px] text-lime-100/70">
                      {leagueStatistics.summary.discipline.yellowCards} amarelo . {" "}
                      {leagueStatistics.summary.discipline.redCards} vermelho
                    </p>

                  </div>

                </div>

                {/* ARTILHARIA */}
                <div className="mt-6">
                  {/* Cabeçalho */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrophyIcon className="h-5 w-5 text-lime-400" />

                      <h3 className="text-lg font-bold text-white">
                        Artilharia
                      </h3>
                    </div>

                    <span className="text-xs font-bold text-lime-400">
                      Temporada {leagueStatistics.season.toString().slice(-2)}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="overflow-hidden rounded-2xl bg-zinc-900 px-4">
                    {leagueStatistics.topScorers.map((player, index) => {
                      const maxGoals = leagueStatistics.topScorers[0].goals;
                      const progress = (player.goals / maxGoals) * 100;

                      return (
                        <div
                          key={player.name}
                          className="border-b border-zinc-800 py-5 last:border-b-0"
                        >
                          {/* Informações do jogador */}
                          <div className="flex items-center justify-between">
                            {/* Esquerda */}
                            <div className="flex min-w-0 items-center gap-3">
                              {/* posição */}
                              <span className="w-5 shrink-0 text-center text-sm font-bold text-lime-400">
                                {player.position}
                              </span>

                              {/* foto */}
                              <img
                                src={player.playerPhoto}
                                alt={player.name}
                                className="h-10 w-10 shrink-0 rounded-full object-cover"
                              />

                              {/* jogador */}
                              <div className="min-w-0">
                                <h4 className="truncate text-sm font-bold text-white">
                                  {player.name}
                                </h4>

                                <p className="text-xs font-semibold text-lime-100/70">
                                  {player.team} • {player.pos}
                                </p>
                              </div>
                            </div>

                            {/* Gols */}
                            <div className="ml-3 shrink-0 text-right">
                              <span c className={`text-2xl font-bold ${player.position === 1
                                ? "text-lime-400"
                                : "text-white"
                                }`}
                              >
                                {player.goals}
                              </span>

                              <span className="text-[11px] text-lime-100/70">
                                gols
                              </span>
                            </div>
                          </div>

                          {/* Barra de progresso */}
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${index === 0 ? "bg-lime-400" : "bg-zinc-700"
                                }`}
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* LÍDERES DE GARÇOM & DEFESA */}
                <div className="mt-6">
                  {/* Título da seção */}
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
                        <span className="text-2xl text-lime-400">
                          🤝
                        </span>

                        <h2 className="text-lg font-bold text-white">
                          Mais Assistências
                        </h2>
                      </div>

                      <span className="text-sm font-medium text-zinc-300">
                        Passes decisivos
                      </span>
                    </div>

                    {/* Jogadores */}
                    <div className="space-y-4">
                      {leagueStatistics.assists.map((player) => (
                        <div
                          key={player.name}
                          className="flex items-center justify-between rounded-2xl bg-zinc-950/12 px-4 py-5"
                        >
                          {/* Jogador */}
                          <div className="flex items-center gap-4">

                            {/* Posição */}
                            <span
                              className={`w-5 text-center text-lg font-bold ${player.position === 1
                                ? "text-lime-400"
                                : "text-zinc-300"
                                }`}
                            >
                              #{player.position}
                            </span>

                            {/* Informações */}
                            <div>
                              <h3 className="text-[18px] font-semibold text-white">
                                {player.name}
                              </h3>

                              <p className="mt-1 text-sm font-medium text-zinc-300">
                                {player.team}
                              </p>
                            </div>
                          </div>

                          {/* Assistências */}
                          <div className="flex items-baseline gap-1">
                            <span
                              className={`text-2xl font-bold ${player.position === 1
                                ? "text-lime-400"
                                : "text-white"
                                }`}
                            >
                              {player.assists}
                            </span>

                            <span className="text-sm text-zinc-300">
                              ast
                            </span>
                          </div>
                        </div>
                      ))}
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
                          Jogos s/ sofrer gol
                        </span>
                      </div>


                    </div>

                    {/* Jogadores */}
                    <div className="space-y-4">
                      {leagueStatistics.goalkeepers.map((player) => (
                        <div
                          key={player.name}
                          className="flex items-center justify-between rounded-2xl bg-zinc-950/12 px-4 py-5"
                        >
                          {/* Jogador */}
                          <div className="flex items-center gap-4">

                            {/* Posição */}
                            <span
                              className={`w-5 text-center text-lg font-bold ${player.position === 1
                                ? "text-lime-400"
                                : "text-zinc-300"
                                }`}
                            >
                              #{player.position}
                            </span>

                            {/* Informações */}
                            <div>
                              <h3 className="text-[18px] font-semibold text-white">
                                {player.name}
                              </h3>

                              <p className="mt-1 text-sm font-medium text-lime-100/70">
                                {player.team}  • {player.goalsConcededPerGame}/j
                              </p>
                            </div>
                          </div>

                          {/* Assistências */}
                          <div className="flex items-baseline gap-1">
                            <span
                              className={`text-2xl font-bold ${player.position === 1
                                ? "text-lime-400"
                                : "text-white"
                                }`}
                            >
                              {player.cleanSheets}
                            </span>

                            <span className="text-sm text-lime-100/70">
                              clean
                            </span>
                          </div>
                        </div>
                      ))}
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
                  <div className="rounded-2xl bg-zinc-900 px-4 py-6">

                    {/* Resumo */}
                    <div className="flex items-start justify-between">

                      {/* Média */}
                      <div>
                        <span className="text-4xl font-bold text-white">
                          {leagueStatistics.possession.average}%
                        </span>

                        <p className="mt-2 text-sm text-lime-100/70">
                          Maior Posse Média:{" "}
                          <span className="font-bold text-white">
                            {leagueStatistics.possession.leader.team}
                          </span>
                        </p>
                      </div>

                      {/* Círculo */}
                      <div className="relative h-[88px] w-[88px]">
                        <div
                          className="h-full w-full rounded-full"
                          style={{
                            background: `conic-gradient(#a3ff12 ${leagueStatistics.possession.average * 3.6
                              }deg, #3f4146 0deg)`,
                          }}
                        />

                        <div className="absolute inset-[8px] flex items-center justify-center rounded-full bg-zinc-900">
                          <span className="text-sm font-bold text-lime-400">
                            {Math.round(leagueStatistics.possession.average)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ranking */}
                    <div className="mt-8 space-y-5">
                      {leagueStatistics.possession.teams.map((team) => (
                        <div key={team.team}>

                          {/* Nome + porcentagem */}
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">
                              {team.position}. {team.team}
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
                      ))}
                    </div>
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
                        <HandThumbUpIcon className="h-5 w-5" />

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
                        <ExclamationTriangleIcon className="h-5 w-5" />

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
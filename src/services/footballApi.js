import api from "./api";
import { ENDPOINTS } from "./endpoints";

const CACHE_TIME = 1000 * 60 * 60 * 6; // 6 horas

const pendingRequests = new Map();

async function cachedApiRequest(key, request) {

  const cached = sessionStorage.getItem(key);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);

      const isValid =
        Date.now() - parsed.timestamp < CACHE_TIME;

      const cachedResponse = parsed.data?.response;

      const hasData =
        Array.isArray(cachedResponse) &&
        cachedResponse.length > 0;

      if (isValid && hasData) {
        console.log(
          "🟡 CACHE DA SESSÃO:",
          key
        );

        return {
          status: 200,
          data: parsed.data,
        };
      }

      console.warn(
        "⚠️ CACHE VAZIO/EXPIRADO:",
        key
      );

      sessionStorage.removeItem(key);

    } catch (error) {
      console.warn(
        "⚠️ Cache inválido:",
        key
      );

      sessionStorage.removeItem(key);
    }
  }

  if (pendingRequests.has(key)) {
    console.log(
      "🟣 REQUISIÇÃO JÁ EM ANDAMENTO:",
      key
    );

    return pendingRequests.get(key);
  }

  console.log(
    "🔵 NOVA REQUISIÇÃO:",
    key
  );

  const requestPromise = (async () => {
    try {
      const response = await request();

      const responseData =
        response.data?.response;

      const hasData =
        Array.isArray(responseData) &&
        responseData.length > 0;

      if (hasData) {
        sessionStorage.setItem(
          key,
          JSON.stringify({
            timestamp: Date.now(),
            data: response.data,
          })
        );

        console.log(
          "🟢 DADOS SALVOS NO CACHE:",
          key
        );
      } else {
        console.warn(
          "⚠️ RESPOSTA VAZIA - NÃO SALVANDO:",
          key
        );

        sessionStorage.removeItem(key);
      }

      return response;

    } finally {
      // Remove a requisição da lista
      // quando ela terminar
      pendingRequests.delete(key);
    }
  })();

  // Guarda a requisição atual
  pendingRequests.set(
    key,
    requestPromise
  );

  return requestPromise;
}

export async function getMatchesByDate(date) {
  try {
    const response = await api.get(
      `${ENDPOINTS.FIXTURES}?date=${date}&timezone=America/Sao_Paulo`
    );

    console.log("Data buscada:", date);

    console.log(
      "Partidas encontradas:",
      response.data.response.map((match) => ({
        id: match.fixture.id,
        data: match.fixture.date,
        liga: match.league.name,
        casa: match.teams.home.name,
        fora: match.teams.away.name,
        status: match.fixture.status.short,
      }))
    );

    return response.data.response;
  } catch (error) {
    console.error(
      "Erro ao buscar partidas por data:",
      error.response?.data || error
    );

    return [];
  }
}

export async function getLiveMatches() {
  try {
    const response = await api.get(ENDPOINTS.LIVE);

    return response.data.response;
  } catch (error) {
    console.error(
      "Erro ao buscar partidas ao vivo:",
      error.response?.data || error
    );

    return [];
  }
}

export async function getFinishedMatches(date) {
  try {
    const response = await api.get(
      `${ENDPOINTS.FIXTURES}?date=${date}&timezone=America/Sao_Paulo`
    );

    return response.data.response.filter(
      (match) =>
        match.fixture.status.short === "FT" ||
        match.fixture.status.short === "AET" ||
        match.fixture.status.short === "PEN"
    );
  } catch (error) {
    console.error(
      "Erro ao buscar partidas finalizadas:",
      error.response?.data || error
    );

    return [];
  }
}

export async function getLeagues() {
  try {
    const response = await api.get(ENDPOINTS.LEAGUES);

    console.log("Ligas encontradas:", response.data.response);

    return response.data.response;
  } catch (error) {
    console.error(
      "Erro ao buscar ligas:",
      error.response?.data || error
    );

    return [];
  }
}

export async function getLeagueById(id) {
  try {
    const response = await api.get(`${ENDPOINTS.LEAGUES}?id=${id}`);

    console.log("Liga buscada:", id);
    console.log("Dados da liga:", response.data.response);

    return response.data.response;
  } catch (error) {
    console.error(
      "Erro ao buscar liga:",
      error.response?.data || error
    );

    return [];
  }
}

export async function getLeagueStandings(leagueId, season) {
  try {
    const cacheKey = `copalive-standings-${leagueId}-${season}`;

    const response = await cachedApiRequest(cacheKey, () =>
      api.get("/standings", {
        params: {
          league: leagueId,
          season: season,
        },
      })
    );

    console.log("🟢 STATUS STANDINGS:", response.status);
    console.log("🟢 RESULTADOS STANDINGS:", response.data.results);

    return response.data.response || [];
  } catch (error) {
    console.error(
      "🔴 ERRO AO BUSCAR CLASSIFICAÇÃO:",
      error.response?.data || error
    );

    return [];
  }
}

export async function getLeagueMatches(leagueId, season) {
  try {
    const cacheKey = `copalive-fixtures-${leagueId}-${season}`;

    const response = await cachedApiRequest(cacheKey, () =>
      api.get(ENDPOINTS.FIXTURES, {
        params: {
          league: leagueId,
          season: season,
        },
      })
    );

    console.log("🟢 STATUS FIXTURES:", response.status);
    console.log("🟢 TOTAL DE JOGOS:", response.data.results);

    return response.data.response || [];
  } catch (error) {
    console.error("🔴 ERRO AO BUSCAR JOGOS:", error);
    console.error("🔴 STATUS:", error.response?.status);
    console.error("🔴 DADOS DO ERRO:", error.response?.data);

    return [];
  }
}

export async function getLeagueTopScorers(leagueId, season) {
  try {
    const cacheKey = `copalive-topscorers-${leagueId}-${season}`;

    const response = await cachedApiRequest(cacheKey, () =>
      api.get("/players/topscorers", {
        params: {
          league: leagueId,
          season: season,
        },
      })
    );

    console.log("🟢 STATUS TOP SCORERS:", response.status);
    console.log("🟢 TOTAL ARTILHEIROS:", response.data.results);

    return response.data.response || [];
  } catch (error) {
    console.error("🔴 ERRO TOP SCORERS:", error);
    console.error("🔴 STATUS:", error.response?.status);
    console.error("🔴 DADOS DO ERRO:", error.response?.data);

    return [];
  }
}

export async function getLeagueTopAssists(leagueId, season) {
  try {
    const cacheKey = `copalive-topassists-${leagueId}-${season}`;

    const response = await cachedApiRequest(cacheKey, () =>
      api.get("/players/topassists", {
        params: {
          league: leagueId,
          season: season,
        },
      })
    );

    console.log("🟢 STATUS TOP ASSISTS:", response.status);
    console.log("🟢 TOTAL ASSISTÊNCIAS:", response.data.results);

    return response.data.response || [];
  } catch (error) {
    console.error("🔴 ERRO TOP ASSISTS:", error);
    console.error("🔴 STATUS:", error.response?.status);
    console.error("🔴 DADOS DO ERRO:", error.response?.data);

    return [];
  }
}

export async function getLeagueGoalKeepers(leagueId, season) {
  try {
    console.log("🔵 Buscando goleiros da liga");
    console.log("League ID:", leagueId);
    console.log("Season:", season);

    let page = 1;
    let allPlayers = [];

    while (true) {
      const cacheKey = `copalive-goalkeepers-${leagueId}-${season}-${page}`;

      const response = await cachedApiRequest(
        cacheKey,
        () =>
          api.get("/players", {
            params: {
              league: leagueId,
              season: season,
              page: page,
            },
          })
      );

      const players = response.data.response || [];

      allPlayers = [
        ...allPlayers,
        ...players
      ];

      const totalPages = response.data?.paging?.total || 1;

      console.log(
        `Página ${page}/${totalPages}:`,
        players.length, "jogadores"
      )

      if (page >= totalPages) {
        break;
      }

      page++;

    }
    const goalkeepers = allPlayers.filter((player) =>
      player.statistics?.some(
        (stat) =>
          stat.games?.position === "Goalkeeper"
      )
    );

    console.log(
      "🧤 ESTATÍSTICAS DOS GOLEIROS:",
      goalkeepers.map((player) => {
        const stats = player.statistics?.[0];

        return {
          id: player.player?.id,
          nome: player.player?.name,
          foto: player.player?.photo,
          time: stats?.team?.name,

          aparicoes: stats?.games?.appearences,
          titulares: stats?.games?.lineups,
          minutos: stats?.games?.minutes,

          golsSofridos: stats?.goals?.conceded,
          defesas: stats?.goals?.saves,
        };
      })
    );

    const formattedGoalkeepers = goalkeepers
      .map((player) => {
        const stats = player.statistics?.[0];

        const appearances =
          stats?.games?.appearences || 0;

        const goalsConceded =
          stats?.goals?.conceded || 0;

        const saves =
          stats?.goals?.saves || 0;

        const goalsConcededPerGame =
          appearances > 0
            ? (goalsConceded / appearances).toFixed(2)
            : "0.00";

        return {
          id: player.player?.id,
          name: player.player?.name,
          photo: player.player?.photo,
          team: stats?.team?.name,

          appearances,
          lineups: stats?.games?.lineups || 0,
          minutes: stats?.games?.minutes || 0,

          goalsConceded,
          saves,
          goalsConcededPerGame,
        };
      })
      .filter((player) => player.appearances > 0)
      .sort(
        (a, b) =>
          Number(a.goalsConcededPerGame) -
          Number(b.goalsConcededPerGame)
      );

    console.log(
      "🧤 GOLEIROS FORMATADOS:",
      formattedGoalkeepers
    );

    return formattedGoalkeepers;

  } catch (error) {
    console.error(
      "🔴 ERRO AO BUSCAR GOLEIROS:",
      error.response?.data || error
    );

    return [];
  }
}

function chunkArray(array, size) {
  const chunks = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

export async function getLeaguePossession(
  leagueId,
  season,
  matches
) {
  try {
    console.log(
      "🔵 BUSCANDO POSSE DE BOLA DA LIGA"
    );

    console.log("League ID:", leagueId);
    console.log("Season:", season);

    if (!matches || matches.length === 0) {
      console.warn(
        "⚠️ Nenhum jogo encontrado para calcular posse."
      );

      return [];
    }

    const MAX_NEW_REQUESTS = 5;

    const REQUEST_DELAY = 8000;

    const wait = (ms) =>
      new Promise((resolve) =>
        setTimeout(resolve, ms)
      );

    const finishedMatches =
      matches.filter((match) => {
        const status =
          match.fixture?.status?.short;

        return (
          status === "FT" ||
          status === "AET" ||
          status === "PEN"
        );
      });

    console.log(
      "⚽ Jogos finalizados:",
      finishedMatches.length
    );

    if (finishedMatches.length === 0) {
      console.warn(
        "⚠️ Nenhum jogo finalizado encontrado."
      );

      return [];
    }

    // =====================================================
    // CACHE
    // =====================================================

    const cacheKey =
      `copalive-possession-results-${leagueId}-${season}`;

    let cachedPossession = {};

    const cached =
      sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        cachedPossession =
          JSON.parse(cached);

        console.log(
          "🟡 CACHE DE POSSE CARREGADO:",
          Object.keys(
            cachedPossession
          ).length,
          "partidas"
        );

      } catch (error) {
        console.warn(
          "⚠️ Cache de posse inválido. Limpando."
        );

        sessionStorage.removeItem(
          cacheKey
        );

        cachedPossession = {};
      }
    }

    // =====================================================
    // IDENTIFICA PARTIDAS QUE AINDA NÃO FORAM BUSCADAS
    // =====================================================

    const matchesToFetch =
      finishedMatches.filter(
        (match) => {
          const fixtureId =
            match.fixture?.id;

          return (
            fixtureId &&
            !cachedPossession[
              fixtureId
            ]
          );
        }
      );

    console.log(
      "📊 Partidas já armazenadas:",
      Object.keys(
        cachedPossession
      ).length
    );

    console.log(
      "📊 Partidas ainda não processadas:",
      matchesToFetch.length
    );

    // =====================================================
    // LIMITA A EXECUÇÃO ATUAL
    // =====================================================

    const matchesForThisRequest =
      matchesToFetch.slice(
        0,
        MAX_NEW_REQUESTS
      );

    console.log(
      "🚀 Partidas nesta execução:",
      matchesForThisRequest.length
    );

    // =====================================================
    // BUSCA AS ESTATÍSTICAS
    // =====================================================

    for (
      let i = 0;
      i < matchesForThisRequest.length;
      i++
    ) {
      const match =
        matchesForThisRequest[i];

      const fixtureId =
        match.fixture?.id;

      console.log(
        `📊 POSSE ${i + 1}/${matchesForThisRequest.length} - Fixture ${fixtureId}`
      );

      // ---------------------------------------------------
      // ESPERA ENTRE REQUISIÇÕES
      // ---------------------------------------------------

      if (i > 0) {
        console.log(
          `⏳ Aguardando ${REQUEST_DELAY / 1000}s antes da próxima requisição...`
        );

        await wait(
          REQUEST_DELAY
        );
      }

      try {
        // -------------------------------------------------
        // CONSULTA ESTATÍSTICAS DA PARTIDA
        // -------------------------------------------------

        const response =
          await api.get(
            "/fixtures/statistics",
            {
              params: {
                fixture:
                  fixtureId,
              },
            }
          );

        console.log(
          `📡 Estatísticas fixture ${fixtureId}:`,
          response.data
        );

        // -------------------------------------------------
        // VERIFICA ERROS DA API
        // -------------------------------------------------

        if (
          response.data?.errors &&
          Object.keys(
            response.data.errors
          ).length > 0
        ) {
          console.error(
            `❌ ERRO API - Fixture ${fixtureId}:`,
            response.data.errors
          );

          const errorText =
            JSON.stringify(
              response.data.errors
            ).toLowerCase();

          // Se atingir limite, para imediatamente.
          if (
            errorText.includes(
              "ratelimit"
            ) ||
            errorText.includes(
              "rate limit"
            ) ||
            errorText.includes(
              "too many"
            ) ||
            errorText.includes(
              "quota"
            ) ||
            errorText.includes(
              "limit"
            )
          ) {
            console.warn(
              "🛑 LIMITE DA API DETECTADO."
            );

            console.warn(
              "🛑 Interrompendo esta execução."
            );

            break;
          }

          continue;
        }

        // -------------------------------------------------
        // PEGA AS ESTATÍSTICAS
        // -------------------------------------------------

        const statistics =
          response.data?.response ||
          [];

        if (
          !Array.isArray(
            statistics
          ) ||
          statistics.length === 0
        ) {
          console.warn(
            `⚠️ Fixture ${fixtureId} não possui estatísticas.`
          );

          // Marca como processado.
          cachedPossession[
            fixtureId
          ] = {
            fixtureId,
            hasPossession: false,
          };

          sessionStorage.setItem(
            cacheKey,
            JSON.stringify(
              cachedPossession
            )
          );

          continue;
        }

        // -------------------------------------------------
        // EXTRAI A POSSE DOS TIMES
        // -------------------------------------------------

        const fixturePossession =
          [];

        for (
          const teamStats of statistics
        ) {
          const teamId =
            teamStats.team?.id;

          const teamName =
            teamStats.team?.name;

          const possessionStat =
            teamStats.statistics?.find(
              (stat) =>
                stat.type ===
                "Ball Possession"
            );

          if (
            !teamId ||
            !teamName ||
            !possessionStat?.value
          ) {
            continue;
          }

          const possessionValue =
            parseFloat(
              String(
                possessionStat.value
              )
                .replace("%", "")
                .replace(",", ".")
            );

          if (
            !Number.isFinite(
              possessionValue
            )
          ) {
            continue;
          }

          fixturePossession.push({
            teamId,
            teamName,
            possession:
              possessionValue,
          });
        }

        // -------------------------------------------------
        // SALVA POSSE ENCONTRADA
        // -------------------------------------------------

        if (
          fixturePossession.length > 0
        ) {
          cachedPossession[
            fixtureId
          ] = {
            fixtureId,
            hasPossession: true,
            teams:
              fixturePossession,
          };

          console.log(
            `⚽ Posse encontrada - Fixture ${fixtureId}:`,
            fixturePossession
          );

        } else {
          cachedPossession[
            fixtureId
          ] = {
            fixtureId,
            hasPossession: false,
          };

          console.warn(
            `⚠️ Fixture ${fixtureId} não possui Ball Possession.`
          );
        }

        // -------------------------------------------------
        // SALVA CACHE
        // -------------------------------------------------

        sessionStorage.setItem(
          cacheKey,
          JSON.stringify(
            cachedPossession
          )
        );

        console.log(
          "💾 Resultado salvo no cache."
        );

      } catch (error) {
        console.error(
          `🔴 Erro ao buscar fixture ${fixtureId}:`,
          error.response?.data ||
            error
        );

        // -----------------------------------------------
        // DETECTA ERRO DE LIMITE
        // -----------------------------------------------

        const errorData =
          error.response?.data ||
          error;

        const errorText =
          JSON.stringify(
            errorData
          ).toLowerCase();

        if (
          errorText.includes(
            "ratelimit"
          ) ||
          errorText.includes(
            "rate limit"
          ) ||
          errorText.includes(
            "too many"
          ) ||
          errorText.includes(
            "quota"
          ) ||
          errorText.includes(
            "limit"
          ) ||
          errorText.includes(
            "network error"
          )
        ) {
          console.warn(
            "🛑 API bloqueou ou limitou a requisição."
          );

          console.warn(
            "🛑 Interrompendo o processamento."
          );

          break;
        }
      }
    }

    // =====================================================
    // CALCULA A MÉDIA DE POSSE POR TIME
    // =====================================================

    const teamPossession =
      new Map();

    for (
      const fixtureData of Object.values(
        cachedPossession
      )
    ) {
      if (
        !fixtureData.hasPossession ||
        !fixtureData.teams
      ) {
        continue;
      }

      for (
        const team of fixtureData.teams
      ) {
        const current =
          teamPossession.get(
            team.teamId
          ) || {
            teamId:
              team.teamId,

            teamName:
              team.teamName,

            totalPossession: 0,

            matches: 0,
          };

        current.totalPossession +=
          team.possession;

        current.matches += 1;

        teamPossession.set(
          team.teamId,
          current
        );
      }
    }

    // =====================================================
    // FORMATA RESULTADO
    // =====================================================

    const formattedPossession =
      [
        ...teamPossession.values(),
      ]
        .map((team) => ({
          teamId:
            team.teamId,

          teamName:
            team.teamName,

          matches:
            team.matches,

          averagePossession:
            Number(
              (
                team.totalPossession /
                team.matches
              ).toFixed(1)
            ),
        }))
        .sort(
          (a, b) =>
            b.averagePossession -
            a.averagePossession
        );

    // =====================================================
    // LOGS FINAIS
    // =====================================================

    console.log(
      "📦 Partidas armazenadas no cache:",
      Object.keys(
        cachedPossession
      ).length
    );

    console.log(
      "⚽ TIMES COM POSSE:",
      formattedPossession.length
    );

    console.log(
      "⚽ POSSE DE BOLA FORMATADA:",
      formattedPossession
    );

    const remaining =
      matchesToFetch.length -
      matchesForThisRequest.length;

    if (remaining > 0) {
      console.log(
        "ℹ️ Ainda existem",
        remaining,
        "partidas para processar."
      );

      console.log(
        "🔄 Elas serão processadas nas próximas execuções."
      );
    }

    return formattedPossession;

  } catch (error) {
    console.error(
      "🔴 ERRO AO BUSCAR POSSE DE BOLA:",
      error.response?.data ||
        error
    );

    return [];
  }
}
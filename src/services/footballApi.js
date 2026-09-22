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
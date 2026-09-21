import api from "./api";
import { ENDPOINTS } from "./endpoints";

const CACHE_TIME = 1000 * 60 * 60 * 6; // 6 horas

async function cachedApiRequest(key, request) {
  const cached = sessionStorage.getItem(key);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);

      const isValid = Date.now() - parsed.timestamp < CACHE_TIME;

      if (isValid) {
        console.log("🟡 CACHE DA SESSÃO:", key);

        return {
          status: 200,
          data: parsed.data,
        };
      }

      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn("⚠️ Cache inválido:", key);
      sessionStorage.removeItem(key);
    }
  }

  console.log("🔵 NOVA REQUISIÇÃO:", key);

  const response = await request();

  sessionStorage.setItem(
    key,
    JSON.stringify({
      timestamp: Date.now(),
      data: response.data,
    })
  );

  return response;
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
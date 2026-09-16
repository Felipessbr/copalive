import api from "./api";
import { ENDPOINTS } from "./endpoints";

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
    const response = await api.get("/standings", {
      params: {
        league: leagueId,
        season: season,
      },
    });

    console.log("Resposta BRUTA da API standings:", response.data);

    return response.data.response;
  } catch (error) {
    console.error(
      "Erro ao buscar classificação:",
      error.response?.data || error
    );

    return [];
  }
}

export async function getLeagueMatches(leagueId, season) {
  try {
    const response = await api.get(ENDPOINTS.FIXTURES, {
      params: {
        league: leagueId,
        season: season,
      },
    });

    console.log(
      "Resposta da API fixtures:",
      response.data.response
    );

    return response.data.response;
  } catch (error) {
    console.error(
      "Erro ao buscar jogos da liga:",
      error.response?.data || error
    );

    return [];
  }
}
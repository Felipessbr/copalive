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
    console.error(error.response?.data || error);
    return [];
  }
}
export async function getLiveMatches() {
  try{
    const response = await api.get(ENDPOINTS.LIVE);
    return response.data.response
  } catch (error) {
    console.error(error.response?.data || error);
    return [];
  }
}
 export async function getFinishedMatches(){
  try{

     const response = await api.get(
      `${ENDPOINTS.FIXTURES}?date=${today}`
    );

     return response.data.response.filter(
      (match) =>
        match.fixture.status.short === "FT" ||
        match.fixture.status.short === "AET" ||
        match.fixture.status.short === "PEN"
    );
    
  }catch (error) {
    console.error(error.response?.data || error);
    return [];
 }
}

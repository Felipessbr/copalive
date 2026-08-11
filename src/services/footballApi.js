import api from "./api";
import { ENDPOINTS } from "./endpoints";

export async function getTodayMatches() {
  try {
    const today = new Date().toISOString().split("T")[0];

    console.log("Data enviada:", today);

    const response = await api.get(
      `${ENDPOINTS.FIXTURES}?date=${today}`
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

    const today = new Date().toISOString().split("T")[0];

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

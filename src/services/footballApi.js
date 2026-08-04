import api from "./api";
import { ENDPOINTS } from "./endpoints";

export async function getTodayMatches() {
  try {
    const today = new Date().toISOString().split("T")[0];

    console.log("Data enviada:", today);

    const response = await api.get(
      `${ENDPOINTS.FIXTURES}?date=${today}`
    );

    console.log("Resposta completa:", response.data);

    return response.data.response;
  } catch (error) {
    console.error(error.response?.data || error);
    return [];
  }
}
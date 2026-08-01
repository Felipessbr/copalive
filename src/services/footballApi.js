import api from "./api";
import { ENDPOINTS } from "./endpoints";

export async function getLiveMatches() {
    try {
        const response = await api.get(ENDPOINTS.LIVE)

        return response.data.response
    } catch (error) {
        console.log("Erro ao buscar partida:", error)
        return [];
    }
}
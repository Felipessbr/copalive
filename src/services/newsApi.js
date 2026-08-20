import axios from "axios";

const newsApi = axios.create({
  baseURL: "https://api.currentsapi.services/v1",
  headers: {
    Authorization: import.meta.env.VITE_CURRENTS_API_KEY,
  },
});

export async function getFootballNews() {
  try {
    const response = await newsApi.get("/search", {
      params: {
        keywords: "futebol OR soccer",
        language: "pt",
        page_size: 5,
      },
    });


    return response.data.news || [];
  } catch (error) {
    console.error(
      "Erro ao buscar notícias:",
      error.response?.data || error
    );

    return [];
  }
}

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
        keywords: "soccer",
        language: "en",
        page_size: 10,
      },
    });

    console.log("Notícias:", response.data);

    return response.data.news || [];
  } catch (error) {
    console.error(
      "Erro ao buscar notícias:",
      error.response?.data || error
    );

    return [];
  }
}

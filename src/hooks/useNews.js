import { useEffect, useState } from "react";
import { getFootballNews } from "../services/newsApi";
import mapNews from "../utils/mapNews";

export default function useNews() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadNews() {
            try {
                const data = await getFootballNews();

                const formattedNews = mapNews(data);

                setNews(formattedNews);
                setError(null);
            } catch (error) {
                console.error(error);
                setError("Ocorreu um erro ao carregar as notícias.");
            } finally {
                setLoading(false);
            }
        }

        loadNews();
    }, []);

    return {
        news,
        loading,
        error,
    };
}
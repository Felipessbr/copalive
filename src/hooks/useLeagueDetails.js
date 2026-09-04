import { useEffect, useState } from "react";
import { getLeagueById } from "../services/footballApi";

export default function useLeagueDetails(id, fallbackLeague = null) {
    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadLeague() {
            setLoading(true);
            setError(null);

            try {
                const data = await getLeagueById(id);

                // ========================================
                // API ENCONTROU A LIGA
                // ========================================
                if (data && data.length > 0) {
                    const leagueData = data[0];

                    setLeague({
                        id: leagueData.league.id,
                        name: leagueData.league.name,
                        logo: leagueData.league.logo,
                        country: leagueData.country?.name || "Internacional",
                        seasons: leagueData.seasons || [],
                    });

                    return;
                }

                // ========================================
                // API NÃO ENCONTROU
                // USA LIGA FAVORITA COMO FALLBACK
                // ========================================
                if (fallbackLeague) {
                    console.log(
                        "API indisponível. Usando liga favorita:",
                        fallbackLeague
                    );

                    setLeague({
                        id: fallbackLeague.id,
                        name: fallbackLeague.name,
                        logo: fallbackLeague.logo,
                        country: fallbackLeague.country || "Brasil",
                        seasons: fallbackLeague.seasons || [],
                    });

                    return;
                }

                // ========================================
                // NENHUMA FONTE ENCONTROU A LIGA
                // ========================================
                setLeague(null);
                setError("Liga não encontrada.");

            } catch (error) {
                console.error("Erro ao carregar liga:", error);

                // ========================================
                // ERRO DA API
                // USA LIGA FAVORITA
                // ========================================
                if (fallbackLeague) {
                    console.log(
                        "API indisponível. Usando liga favorita como fallback."
                    );

                    setLeague({
                        id: fallbackLeague.id,
                        name: fallbackLeague.name,
                        logo: fallbackLeague.logo,
                        country: fallbackLeague.country || "Brasil",
                        seasons: fallbackLeague.seasons || [],
                    });

                    setError(null);
                } else {
                    setLeague(null);
                    setError(
                        "Ocorreu um erro ao carregar a liga."
                    );
                }

            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadLeague();
        } else {
            setLoading(false);
            setError("Liga não encontrada.");
        }

    }, [id, fallbackLeague]);

    return {
        league,
        loading,
        error,
    };
}
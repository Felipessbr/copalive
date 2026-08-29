import { useEffect, useState } from "react";
import { getLeagueStandings } from "../services/footballApi";

export default function useLeagueStandings(leagueId, season) {
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        async function loadStandings() {

            try {
                setLoading(true);

                console.log("========== CLASSIFICAÇÃO ==========");
                console.log("League ID:", leagueId);
                console.log("Season:", season);

                const data = await getLeagueStandings(
                    leagueId,
                    season
                );

                console.log(
                    "Resposta completa da classificação:",
                    data
                );

                const leagueStandings =
                    data?.[0]?.league?.standings?.[0] || [];

                console.log(
                    "Classificação extraída:",
                    leagueStandings
                );

                setStandings(leagueStandings);
                setError(null);

            } catch (error) {

                console.error(
                    "Erro ao carregar classificação:",
                    error
                );

                setError(
                    "Não foi possível carregar a classificação."
                );

            } finally {
                setLoading(false);
            }
        }

        if (leagueId && season) {
            loadStandings();
        }

    }, [leagueId, season]);

    return {
        standings,
        loading,
        error,
    };
}
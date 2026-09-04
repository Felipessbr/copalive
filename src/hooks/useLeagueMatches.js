import { useEffect, useState } from "react";
import { getLeagueMatches } from "../services/footballApi";

export default function useLeagueMatches(leagueId, season) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadMatches() {

            try {
                setLoading(true);

                console.log("========== JOGOS DA LIGA ==========");
                console.log("League ID:", leagueId);
                console.log("Season:", season);


                const data = await getLeagueMatches(
                    leagueId,
                    season
                );

                console.log(
                    "Resposta completa dos jogos da liga:",
                    data
                );

                setMatches(data || [])
                setError(null)


            } catch (error) {
                console.error(
                    "Erro ao carregar os jogos da liga:", error
                )
                setError(
                    "Não foi possível carregar os jogos."
                )
            } finally {
                setLoading(false)
            }

        }

        if (leagueId && season) {
            loadMatches()
        }
    }, [leagueId, season]);

    return { matches, loading, error };
}
import { useEffect, useState } from "react";
import { getLeagueStandings } from "../services/footballApi";

export default function useLeagueStandings(leagueId, season) {
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadStandings() {
            try {
                setLoading(true);
                setError(null);

                console.log(
                    "========== CLASSIFICAÇÃO =========="
                );

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

                if (cancelled) {
                    return;
                }

                const leagueStandings =
                    data?.[0]?.league?.standings?.[0] || [];

                console.log(
                    "Classificação extraída:",
                    leagueStandings
                );

                if (leagueStandings.length > 0) {
                    setStandings(leagueStandings);
                } else {
                    console.warn(
                        "⚠️ API retornou classificação vazia. Mantendo os dados atuais."
                    );
                }

            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Erro ao carregar classificação:",
                    error
                );

                setError(
                    "Não foi possível carregar a classificação."
                );

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        if (leagueId && season) {
            loadStandings();
        } else {
            setStandings([]);
            setLoading(false);
        }

        return () => {
            cancelled = true;
        };

    }, [leagueId, season]);

    return {
        standings,
        loading,
        error,
    };
}
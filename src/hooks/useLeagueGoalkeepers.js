import { useEffect, useState } from "react";
import { getLeagueGoalKeepers } from "../services/footballApi";

export default function useLeagueGoalkeepers(leagueId, season) {
    const [goalkeepers, setGoalkeepers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadGoalKeepers() {
            try {
                setLoading(true);

                console.log(
                    "========== CARREGANDO GOLEIROS =========="
                );

                console.log("League ID:", leagueId);
                console.log("Season:", season);

                const data = await getLeagueGoalKeepers(
                    leagueId,
                    season
                )

                console.log("Goleiros recebidos:", data);

                if (cancelled) {
                    return;
                }

                if (data && data.length > 0) {
                    setGoalkeepers(data);
                    setError(null);
                } else {
                    console.warn(
                        "⚠️ API retornou 0 goleiros."
                    );
                }
            } catch (error) {
                if (cancelled) {
                    return;
                }
                console.error(
                    "Erro ao carregar goleiros:",
                    error
                );
                setError(
                    "Não foi possível carregar os goleiros."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        if (leagueId && season) {
            loadGoalKeepers();
        }

        return () => {
            cancelled = true;
        };

    }, [leagueId, season]);

    return {
        goalkeepers,
        loading,

    }
}
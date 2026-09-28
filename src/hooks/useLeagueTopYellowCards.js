import { useEffect, useState } from "react";

import {
    getLeagueTopYellowCards,
} from "../services/footballApi";

export default function useLeagueTopYellowCards(
    leagueId,
    season
) {
    const [topYellowCards, setTopYellowCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadTopYellowCards() {
            try {
                setLoading(true);
                setError(null);

                console.log(
                    "========== CARREGANDO CARTÕES AMARELOS =========="
                );

                console.log(
                    "League ID:",
                    leagueId
                );

                console.log(
                    "Season:",
                    season
                );

                const data =
                    await getLeagueTopYellowCards(
                        leagueId,
                        season
                    );

                console.log(
                    "Cartões amarelos recebidos:",
                    data
                );

                if (cancelled) {
                    return;
                }

                if (data && data.length > 0) {
                    setTopYellowCards(data);
                } else {
                    console.warn(
                        "⚠️ API retornou 0 cartões amarelos."
                    );
                }

            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Erro ao carregar cartões amarelos:",
                    error
                );

                setError(
                    "Não foi possível carregar os cartões amarelos."
                );

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        if (leagueId && season) {
            loadTopYellowCards();
        }

        return () => {
            cancelled = true;
        };

    }, [leagueId, season]);

    return {
        topYellowCards,
        loading,
        error,
    };
}
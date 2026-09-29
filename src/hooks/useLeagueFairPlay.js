import { useEffect, useState } from "react";

import { getLeagueFairPlay } from "../services/footballApi";

export default function useLeagueFairPlay(
    leagueId,
    season,
    standings
) {
    const [fairPlay, setFairPlay] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadFairPlay() {
            try {
                setLoading(true);
                setError(null);

                console.log(
                    "========== CARREGANDO FAIR PLAY =========="
                );

                console.log(
                    "League ID:",
                    leagueId
                );

                console.log(
                    "Season:",
                    season
                );

                console.log(
                    "Times disponíveis:",
                    standings?.length
                );

                const data =
                    await getLeagueFairPlay(
                        leagueId,
                        season,
                        standings
                    );

                console.log(
                    "Fair Play recebido:",
                    data
                );

                if (cancelled) {
                    return;
                }

                if (
                    data &&
                    data.length > 0
                ) {
                    setFairPlay(data);
                    setError(null);
                } else {
                    console.warn(
                        "⚠️ API retornou 0 dados de Fair Play."
                    );
                }

            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Erro ao carregar Fair Play:",
                    error
                );

                setError(
                    "Não foi possível carregar o Fair Play."
                );

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        if (
            leagueId &&
            season &&
            standings &&
            standings.length > 0
        ) {
            loadFairPlay();
        }

        return () => {
            cancelled = true;
        };

    }, [leagueId, season, standings]);

    return {
        fairPlay,
        loading,
        error,
    };
}
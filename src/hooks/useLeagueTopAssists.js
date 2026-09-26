import { useEffect, useState } from "react";
import { getLeagueTopAssists } from "../services/footballApi";

export default function useLeagueTopAssists(leagueId, season) {
    const [topAssists, setTopAssists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadTopAssists() {
            try {
                setLoading(true);

                console.log(
                    "========== CARREGANDO ASSISTÊNCIAS =========="
                );

                console.log("League ID:", leagueId);
                console.log("Season:", season);

                const data = await getLeagueTopAssists(
                    leagueId,
                    season
                );

                console.log(
                    "Assistências recebidas:",
                    data
                );

                if (cancelled) {
                    return;
                }

                if (data && data.length > 0) {
                    setTopAssists(data);
                    setError(null);
                } else {
                    console.warn(
                        "⚠️ API retornou 0 assistências. Mantendo os dados atuais."
                    );
                }

            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Erro ao carregar assistências:",
                    error
                );

                setError(
                    "Não foi possível carregar as assistências."
                );

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        if (leagueId && season) {
            loadTopAssists();
        }

        return () => {
            cancelled = true;
        };

    }, [leagueId, season]);

    return {
        topAssists,
        loading,
        error,
    };
}
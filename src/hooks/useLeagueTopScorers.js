import { useEffect, useState } from "react";
import { getLeagueTopScorers } from "../services/footballApi";

export default function useLeagueTopScorers(leagueId, season) {
    const [topScorers, setTopScorers] = useState([]);
    const [iLoading, setILoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadTopScorers() {
            try {
                setILoading(true);

                console.log(
                    "========== CARREGANDO ARTILHARIA =========="
                );

                console.log("League ID:", leagueId);
                console.log("Season:", season);

                const data = await getLeagueTopScorers(
                    leagueId,
                    season
                );

                console.log("Artilheiros:", data);

                if (cancelled) {
                    return;
                }

                if (data && data.length > 0) {
                    setTopScorers(data);
                    setError(null);
                } else {
                    console.warn(
                        "⚠️ API retornou 0 artilheiros. Mantendo os dados atuais."
                    );
                }

            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Erro ao buscar artilharia:",
                    error
                );

                setError(
                    "Não foi possível buscar artilharia."
                );

            } finally {
                if (!cancelled) {
                    setILoading(false);
                }
            }
        }

        if (leagueId && season) {
            loadTopScorers();
        }

        return () => {
            cancelled = true;
        };

    }, [leagueId, season]);

    return {
        topScorers,
        iLoading,
        error,
    };
}
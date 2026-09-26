import { useEffect, useState } from "react";

import { getLeaguePossession } from "../services/footballApi";

export default function useLeaguePossession(
    leagueId,
    season,
    matches
) {
    const [possession, setPossession] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadPossession() {
            try {
                setLoading(true);
                setError(null);

                console.log(
                    "========== CARREGANDO POSSE DE BOLA =========="
                );

                console.log("League ID:", leagueId);
                console.log("Season:", season);
                console.log(
                    "Jogos disponíveis:",
                    matches?.length
                );

                const data = await getLeaguePossession(
                    leagueId,
                    season,
                    matches
                );

                console.log(
                    "Posse recebida:",
                    data
                );

                if (cancelled) {
                    return;
                }

                if (data && data.length > 0) {
                    setPossession(data);
                } else {
                    console.warn(
                        "⚠️ API retornou 0 dados de posse."
                    );
                }

            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Erro ao carregar posse de bola:",
                    error
                );

                setError(
                    "Não foi possível carregar a posse de bola."
                );

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        // Só busca quando os jogos já estiverem disponíveis
        if (
            leagueId &&
            season &&
            matches &&
            matches.length > 0
        ) {
            loadPossession();
        }

        return () => {
            cancelled = true;
        };

    }, [leagueId, season, matches]);

    return {
        possession,
        loading,
        error,
    };
}
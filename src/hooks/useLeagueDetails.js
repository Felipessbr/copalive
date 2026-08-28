import { useEffect, useState } from "react";
import { getLeagueById } from "../services/footballApi";

export default function useLeagueDetails(id) {
    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadLeague() {
            setLoading(true);

            try {
                const data = await getLeagueById(id);

                if (data.length === 0) {
                    setError("Liga não encontrada.");
                    return;
                }

                const leagueData = data[0];

                setLeague({
                    id: leagueData.league.id,
                    name: leagueData.league.name,
                    logo: leagueData.league.logo,
                    country: leagueData.country.name,
                });

                setError(null);

            } catch (error) {
                console.error(error);

                setError(
                    "Ocorreu um erro ao carregar a liga."
                );

            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadLeague();
        }

    }, [id]);

    return {
        league,
        loading,
        error,
    };
}
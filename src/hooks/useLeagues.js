import { useEffect, useState } from "react";
import { getLeagues } from "../services/footballApi";

export default function useLeagues() {

    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        async function loadLeagues() {

            try {

                const data = await getLeagues();

                const formattedLeagues = data.map((item) => ({
                    id: item.league.id,
                    name: item.league.name,
                    country: item.country.name,
                    logo: item.league.logo,
                }));

                console.log("Dados formatados:", formattedLeagues);

                setLeagues(formattedLeagues);
                setError(null);

            } catch (error) {

                console.error(error);

                setError("Ocorreu um erro ao carregar as ligas.");

            } finally {

                setLoading(false);

            }
        }

        loadLeagues();

    }, []);

    return {
        leagues,
        loading,
        error,
    };
}
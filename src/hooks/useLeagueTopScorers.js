import {  useEffect, useState } from "react";
import { getLeagueTopScorers } from "../services/footballApi";

export default function useLeagueTopScorers(leagueId, season) {
    const [topScorers, setTopScorers] = useState([]);
    const [iLoading, setILoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadTopScorers() {
            try {
                setILoading(true);
                console.log("========== CARREGANDO ARTILHARIA ==========");
                console.log("League ID:", leagueId);
                console.log("Season:", season);

                const data = await getLeagueTopScorers(leagueId, season);

                console.log("Artilheiros:", data);

                setTopScorers(data || [])
                setError(null);
            } catch (error) {
                console.error("Erro ao buscar artilharia", error);

                setError("Não foi possível buscar artilharia");

                setTopScorers([]);
            } finally {
                setILoading(false);
            }
        }

        if (leagueId && season) {
            loadTopScorers();
        }
    }, [leagueId, season]);

    return { topScorers, iLoading, error };
}
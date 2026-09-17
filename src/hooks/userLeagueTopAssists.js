import { useEffect, useState } from "react";
import { getLeagueTopAssists } from "../services/footballApi";

export default function useLeagueTopAssists(leagueId, season) {
  const [topAssists, setTopAssists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTopAssists() {
      try {
        setLoading(true);

        console.log("========== CARREGANDO ASSISTÊNCIAS ==========");
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

        setTopAssists(data || []);
        setError(null);
      } catch (error) {
        console.error(
          "Erro ao carregar assistências:",
          error
        );

        setError(
          "Não foi possível carregar as assistências."
        );

        setTopAssists([]);
      } finally {
        setLoading(false);
      }
    }

    if (leagueId && season) {
      loadTopAssists();
    }
  }, [leagueId, season]);

  return {
    topAssists,
    loading,
    error,
  };
}
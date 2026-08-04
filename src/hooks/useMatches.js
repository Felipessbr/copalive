import { useEffect, useState } from "react";
import { getMockMatches } from "../services/mockApi";
import { getTodayMatches } from "../services/footballApi";
import mapMatches from "../utils/mapMatches";
import groupMatches from "../utils/groupMatches";

const USE_MOCK = true;

export default function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    async function loadMatches() {
      try {
        const DEV_DELAY = 1500;
        if (DEV_DELAY > 0) {
          await new Promise((resolve) => setTimeout(resolve, DEV_DELAY));
        }

        const data = USE_MOCK
          ? await getMockMatches()
          : await getTodayMatches();

        const formattedMatches = USE_MOCK
          ? data
          : mapMatches(data);

        setMatches(formattedMatches);
      } catch (error) {
        console.error(error);
        setError("Ocorreu um erro ao carregar as partidas.");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  // Estatísticas
  const totalMatches = matches.length;

  const liveMatches = matches.filter(
    (match) => match.status === "AO VIVO"
  ).length;

  const allGroupedMatches = groupMatches(matches);

  const totalCompetitions = Object.keys(allGroupedMatches).length;

  const stats = {
    totalMatches,
    liveMatches,
    totalCompetitions,
  };

  // Filtro
  const filteredMatches = matches.filter((match) => {
    switch (filter) {
      case "LIVE":
        return match.status === "AO VIVO";

      case "FINISHED":
        return match.status === "ENCERRADO";

      default:
        return true;
    }
  });

  // Agrupamento
  const groupedMatches = groupMatches(filteredMatches);
  console.log(matches);

  return {
    matches,
    groupedMatches,
    loading,
    error,
    stats,
    filter,
    setFilter,
  };
}
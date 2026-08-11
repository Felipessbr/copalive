import { useEffect, useState } from "react";
import { getMockMatches } from "../services/mockApi";
import {
  getTodayMatches,
  getLiveMatches,
  getFinishedMatches,
} from "../services/footballApi";

import mapMatches from "../utils/mapMatches";
import groupMatches from "../utils/groupMatches";

const USE_MOCK = true;

export default function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
  let firstLoad = true;

  async function loadMatches() {
    try {
      if (firstLoad) {
        setLoading(true);
      }

      let data = [];

      if (USE_MOCK) {
        data = await getMockMatches();
      } else {
        switch (filter) {
          case "LIVE":
            data = await getLiveMatches();
            break;

          case "FINISHED":
            data = await getFinishedMatches();
            break;

          default:
            data = await getTodayMatches();
        }
      }

      const formattedMatches = USE_MOCK
        ? data
        : mapMatches(data);

      setMatches(formattedMatches);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Ocorreu um erro ao carregar as partidas.");
    } finally {
      if (firstLoad) {
        setLoading(false);
        firstLoad = false;
      }
    }
  }

  loadMatches();

  const interval = setInterval(() => {
    loadMatches();
  }, 60000);

  return () => {
    clearInterval(interval);
  };
}, [filter]);
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

  // Agrupamento
  const sortedMatches = [...matches].sort((a, b) => {
    const priority = { "AO VIVO": 1, "AGENDADO": 2, "ENCERRADO": 3 };
    return priority[a.status] - priority[b.status];
  });
  const groupedMatches = groupMatches(sortedMatches);

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
import { useEffect, useState } from "react";

import { getMatchesByDate } from "../services/footballApi";

import mapMatches from "../utils/mapMatches";
import groupMatches from "../utils/groupMatches";

export default function useMatches(selectedDate, selectedLeague) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    let cancelled = false;

    async function loadMatches() {
      setLoading(true);

      try {
        const data = await getMatchesByDate(selectedDate);

        if (cancelled) return;

        const formattedMatches = mapMatches(data);

        setMatches(formattedMatches);
        setError(null);
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError(
            "Ocorreu um erro ao carregar as partidas."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMatches();

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  // FILTRO DE STATUS

  const filteredMatches = matches.filter((match) => {

    if (selectedLeague !== null && match.leagueId !== selectedLeague) {
      return false
    }

    switch (filter) {
      case "LIVE":
        return match.status === "AO VIVO";

      case "FINISHED":
        return match.status === "ENCERRADO";

      case "ALL":
      default:
        return true;
    }
  });

  // ORDEM

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    const priority = {
      "AO VIVO": 1,
      "ENCERRADO": 2,
      "AGENDADO": 3,
    };

    return (
      (priority[a.status] ?? 99) -
      (priority[b.status] ?? 99)
    );
  });

  // AGRUPAMENTO

  const groupedMatches = groupMatches(sortedMatches);

  // ESTATÍSTICAS

  const totalMatches = matches.length;

  const liveMatches = matches.filter(
    (match) => match.status === "AO VIVO"
  ).length;

  const totalCompetitions = Object.keys(
    groupMatches(matches)
  ).length;
  const stats = {
    totalMatches,
    liveMatches,
    totalCompetitions,
  };

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
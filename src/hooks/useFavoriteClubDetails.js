
import { useEffect, useState } from "react";
import {
  getTeamRecentMatches,
  getTeamNextMatch,
} from "../services/footballApi";

function getMatchResult(match, teamId) {
  const isHome = match.teams.home.id === Number(teamId);

  const teamGoals = isHome
    ? match.goals.home
    : match.goals.away;

  const opponentGoals = isHome
    ? match.goals.away
    : match.goals.home;

  if (teamGoals == null || opponentGoals == null) {
    return null;
  }

  if (teamGoals > opponentGoals) return "V";
  if (teamGoals < opponentGoals) return "D";
  return "E";
}

export default function useFavoriteClubDetails(team) {
  const [recentMatches, setRecentMatches] = useState([]);
  const [nextMatch, setNextMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!team?.id) {
      setRecentMatches([]);
      setNextMatch(null);
      return;
    }

    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      setError(null);

      try {
        const [recent, upcoming] = await Promise.all([
          getTeamRecentMatches(team.id),
          getTeamNextMatch(team.id),
        ]);

        if (cancelled) return;

        const finished = recent
          .filter((match) =>
            ["FT", "AET", "PEN"].includes(
              match.fixture?.status?.short
            )
          )
          .sort(
            (a, b) =>
              new Date(b.fixture.date) -
              new Date(a.fixture.date)
          );

        setRecentMatches(
          finished.slice(0, 5).map((match) => ({
            id: match.fixture.id,
            result: getMatchResult(match, team.id),
            date: match.fixture.date,
          }))
        );

        setNextMatch(upcoming[0] || null);
      } catch (err) {
        if (!cancelled) {
          console.error("Erro ao carregar dados do favorito:", err);
          setError("Não foi possível carregar os dados do clube.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [team?.id]);

  return {
    recentMatches,
    nextMatch,
    loading,
    error,
  };
}

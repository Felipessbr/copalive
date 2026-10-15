import { useEffect, useState } from "react";
import {
  getTeamRecentMatches,
  getTeamNextMatch,
  getLeagueStandings,
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

export default function useFavoriteClubDetails(
  team,
  favoriteLeagues = []
) {
  const [recentMatches, setRecentMatches] = useState([]);
  const [nextMatch, setNextMatch] = useState(null);
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!team?.id) {
      setRecentMatches([]);
      setNextMatch(null);
      setStandings(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      setError(null);
      setStandings(null);

      try {
        const [recent, upcoming] = await Promise.all([
          getTeamRecentMatches(team.id),
          getTeamNextMatch(team.id),
        ]);

        const favoriteLeagueIds = favoriteLeagues.map(
          (league) => Number(league.id)
        );

        const leagueFixture = [...upcoming, ...recent].find(
          (match) =>
            favoriteLeagueIds.includes(
              Number(match.league?.id)
            )
        );

        let standingsResult = null;

        if (leagueFixture) {
          const standingsData = await getLeagueStandings(
            leagueFixture.league.id,
            leagueFixture.league.season
          );

          const table =
            standingsData[0]?.league?.standings?.flat() || [];

          const teamStanding = table.find(
            (row) =>
              Number(row.team.id) === Number(team.id)
          );

          if (teamStanding) {
            standingsResult = {
              rank: teamStanding.rank,
              points: teamStanding.points,
              leagueName: leagueFixture.league.name,
            };
          }
        }

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
        setStandings(standingsResult);
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Erro ao carregar dados do favorito:",
            err
          );
          setError(
            "Não foi possível carregar os dados do clube."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [team?.id, favoriteLeagues]);

  return {
    recentMatches,
    nextMatch,
    standings,
    loading,
    error,
  };
}
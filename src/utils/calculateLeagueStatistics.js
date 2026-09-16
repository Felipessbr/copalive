export default function calculateLeagueStatistics(matches = []) {
  if (!matches.length) {
    return {
      totalMatches: 0,
      totalGoals: 0,
      averageGoals: 0,
      bestAttack: null,
      bestDefense: null,
    };
  }

  let totalGoals = 0;

  const teams = {};

  matches.forEach((match) => {
    const homeTeam = match.teams?.home;
    const awayTeam = match.teams?.away;

    const homeGoals = match.goals?.home ?? 0;
    const awayGoals = match.goals?.away ?? 0;

    // Total de gols da competição
    totalGoals += homeGoals + awayGoals;

    // Time da casa
    if (homeTeam?.id) {
      if (!teams[homeTeam.id]) {
        teams[homeTeam.id] = {
          id: homeTeam.id,
          name: homeTeam.name,
          logo: homeTeam.logo,
          goalsFor: 0,
          goalsAgainst: 0,
        };
      }

      teams[homeTeam.id].goalsFor += homeGoals;
      teams[homeTeam.id].goalsAgainst += awayGoals;
    }

    // Time visitante
    if (awayTeam?.id) {
      if (!teams[awayTeam.id]) {
        teams[awayTeam.id] = {
          id: awayTeam.id,
          name: awayTeam.name,
          logo: awayTeam.logo,
          goalsFor: 0,
          goalsAgainst: 0,
        };
      }

      teams[awayTeam.id].goalsFor += awayGoals;
      teams[awayTeam.id].goalsAgainst += homeGoals;
    }
  });

  const teamsList = Object.values(teams);

  // Melhor ataque
  const bestAttack = teamsList.reduce((best, team) => {
    if (!best || team.goalsFor > best.goalsFor) {
      return team;
    }

    return best;
  }, null);

  // Melhor defesa
  const bestDefense = teamsList.reduce((best, team) => {
    if (!best || team.goalsAgainst < best.goalsAgainst) {
      return team;
    }

    return best;
  }, null);

  // Média de gols por partida
  const averageGoals =
    matches.length > 0
      ? totalGoals / matches.length
      : 0;

  return {
    totalMatches: matches.length,

    totalGoals,

    averageGoals: Number(averageGoals.toFixed(2)),

    bestAttack: bestAttack
      ? {
          id: bestAttack.id,
          name: bestAttack.name,
          logo: bestAttack.logo,
          goals: bestAttack.goalsFor,
        }
      : null,

    bestDefense: bestDefense
      ? {
          id: bestDefense.id,
          name: bestDefense.name,
          logo: bestDefense.logo,
          goalsAgainst: bestDefense.goalsAgainst,
        }
      : null,
  };
}
export default function mapMatches(apiMatches) {
  return apiMatches.map((match) => ({
    id: match.fixture.id,

    competition: match.league.name,

    home: match.teams.home.name,
    away: match.teams.away.name,

    homeLogo: match.teams.home.logo,
    awayLogo: match.teams.away.logo,

    homeScore: match.goals.home ?? 0,
    awayScore: match.goals.away ?? 0,

    minute: match.fixture.status.elapsed
      ? `${match.fixture.status.elapsed}'`
      : "-",

    status:
      match.fixture.status.short === "LIVE" ||
      match.fixture.status.short === "1H" ||
      match.fixture.status.short === "2H"
        ? "AO VIVO"
        : "ENCERRADO",

    channel: "Em breve",
  }));
}
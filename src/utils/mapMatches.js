export default function mapMatches(apiMatches) {
  const liveStatus = [
    "LIVE",
    "1H",
    "HT",
    "2H",
    "ET",
    "BT",
    "P",
  ];

  const finishedStatus = [
    "FT",
    "AET",
    "PEN",
  ];

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

    status: liveStatus.includes(match.fixture.status.short)
      ? "AO VIVO"
      : finishedStatus.includes(match.fixture.status.short)
      ? "ENCERRADO"
      : "AGENDADO",

    channel: "Em breve",
  }));
}
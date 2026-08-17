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

export default function mapMatches(apiMatches) {
  return apiMatches.map((match) => {
    const shortStatus = match.fixture.status.short;

    let status = "AGENDADO";

    if (liveStatus.includes(shortStatus)) {
      status = "AO VIVO";
    } else if (finishedStatus.includes(shortStatus)) {
      status = "ENCERRADO";
    }

    const matchTime = new Date(
      match.fixture.date
    ).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let minute = matchTime;

    if (status === "AO VIVO") {
      minute = match.fixture.status.elapsed
        ? `${match.fixture.status.elapsed}'`
        : "-";
    }

    if (status === "ENCERRADO") {
      minute = "-";
    }

    return {
      id: match.fixture.id,

      competition: match.league.name,

      home: match.teams.home.name,
      away: match.teams.away.name,

      homeId: match.teams.home.id,
      awayId: match.teams.away.id,

      homeLogo: match.teams.home.logo,
      awayLogo: match.teams.away.logo,

      homeScore: match.goals.home ?? 0,
      awayScore: match.goals.away ?? 0,

      minute,

      status,

      channel: "Em breve",
    };
  });
}
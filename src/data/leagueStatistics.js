const leagueStatistics = {
    season: 2024,

    summary: {
        averageGoals: 2.68,

        totalGoals: 750,

        totalMatches: 280,

        bestAttack: {
            team: "Flamengo",
            value: 48,
            label: "gols",
        },

        bestDefense: {
            team: "Palmeiras",
            value: 18,
            media: 0.64,
            label: "sofridos/jogo",
        },

        discipline: {
            averageCards: 4.8,
            label: "cartões/j",
            yellowCards: 1344,
            redCards: 56,
        },
    },
topScorers: [
    {
        position: 1,
        name: "G. Barbosa",
        pos: "atacante",
        team: "Flamengo",
        teamLogo: "https://media.api-sports.io/football/teams/127.png",
        playerPhoto: "https://media.api-sports.io/football/players/10174.png",
        goals: 16,
    },
    {
        position: 2,
        name: "Yuri Alberto",
        pos: "atacante",
        team: "Corinthians",
        teamLogo: "https://media.api-sports.io/football/teams/131.png",
        playerPhoto: "https://media.api-sports.io/football/players/10007.png",
        goals: 14,
    },
    {
        position: 3,
        name: "Hulk",
        pos: "atacante",
        team: "Atlético-MG",
        teamLogo: "https://media.api-sports.io/football/teams/1062.png",
        playerPhoto: "https://media.api-sports.io/football/players/12705.png",
        goals: 13,
    },
    {
        position: 4,
        name: "Flaco López",
        pos: "atacante",
        team: "Palmeiras",
        teamLogo: "https://media.api-sports.io/football/teams/121.png",
        playerPhoto: "https://media.api-sports.io/football/players/295513.png",
        goals: 11,
    },
],

    assists: [
        {
            position: 1,
            name: "G. de Arrascaeta",
            team: "Flamengo",
            assists: 10,
        },

        {
            position: 2,
            name: "Raphael Veiga",
            team: "Palmeiras",
            assists: 9,
        },

        {
            position: 3,
            name: "P. H. Ganso",
            team: "Fluminense",
            assists: 8,
        },
    ],

    goalkeepers: [
        {
            position: 1,
            name: "Weverton",
            team: "Palmeiras",
            cleanSheets: 14,
            goalsConcededPerGame: 0.8,
        },

        {
            position: 2,
            name: "Rossi",
            team: "Flamengo",
            cleanSheets: 12,
            goalsConcededPerGame: 0.75,
        },

        {
            position: 3,
            name: "João Paulo",
            team: "Santos",
            cleanSheets: 10,
            goalsConcededPerGame: 0.88,
        },
    ],

   possession: {
    average: 58.4,

    leader: {
        team: "Fluminense",
        value: 58.4,
    },

    teams: [
        {
            position: 1,
            team: "Fluminense",
            value: 58.4,
        },
        {
            position: 2,
            team: "São Paulo",
            value: 56.1,
        },
        {
            position: 3,
            team: "Atlético-MG",
            value: 54.8,
        },
    ],
},

    fairPlay: {
        mostDisciplined: {
            team: "Bragantino",
            yellowCards: 42,
            redCards: 1,
            averageFouls: 10.4,
        },

        mostFouls: {
            team: "Coritiba",
            yellowCards: 88,
            redCards: 7,
            averageFouls: 16.8,
        },
    },
};

export default leagueStatistics;
import { LiveEvent } from '../services/sportsService';

// Rich mock data based on actual mockDataSamples from luckiaServer
const richMockData = {
  soccer: {
    group: "Fútbol",
    title: "Liga Primera División",
    emoji: "⚽",
    homeTeam: "Deportivo Recoleta",
    awayTeam: "Club Olimpia",
    liveData: {
      YellowCardsHome: 1,
      RedCardsHome: 0,
      YellowCardsAway: 1,
      RedCardsAway: 0,
      Period: 2,
      PeriodName: "1º Tiempo",
      Actions: [
        { Period: 2, PeriodName: "1º Tiempo", Time: 24, ActionType: 1, ActionTypeName: "Corner", IsHomeTeam: false },
        { Period: 2, PeriodName: "1º Tiempo", Time: 18, ActionType: 6, ActionTypeName: "Tarjeta Amarilla", IsHomeTeam: true }
      ],
      ResultHome: 0,
      ResultAway: 0,
      Time: "21:34",
      MatchTime: 34,
      RemainingPeriodTime: ""
    }
  },
  tennis: {
    group: "Tenis",
    title: "ITF W100 Edmond, OK Femenino (US)",
    emoji: "🎾",
    homeTeam: "Marina Stakusic",
    awayTeam: "Madison Brengle",
    liveData: {
      Sets: [[6, 2], [3, 0]],
      HomeService: false,
      SetsHome: 1,
      SetsAway: 0,
      Period: 16,
      PeriodName: "2º Set",
      ResultHome: 0,
      ResultAway: 0,
      Time: "22:03",
      MatchTime: -1,
      RemainingPeriodTime: ""
    }
  },
  basketball: {
    group: "Baloncesto",
    title: "NBA Finals",
    emoji: "🏀",
    homeTeam: "Lakers",
    awayTeam: "Celtics",
    liveData: {
      Quarters: [[37, 31], [21, 33], [37, 27], [20, 21]],
      Period: 4,
      PeriodName: "4º Cuarto",
      ResultHome: 115,
      ResultAway: 112,
      Time: "22:30",
      MatchTime: -1,
      RemainingPeriodTime: "5:32"
    }
  },
  ice_hockey: {
    group: "Hockey Hielo",
    title: "Extraliga Bielorrusia",
    emoji: "🏒",
    homeTeam: "Hk Lida",
    awayTeam: "Slavutych Smolensk",
    liveData: {
      Periods: [[0, 0], [0, 1], [1, 0]],
      Period: 3,
      PeriodName: "3º Período",
      ResultHome: 1,
      ResultAway: 1,
      Time: "19:45",
      MatchTime: -1,
      RemainingPeriodTime: "12:30"
    }
  },
  american_football: {
    group: "Fútbol Americano",
    title: "NFL Super Bowl",
    emoji: "🏈",
    homeTeam: "Kansas City Chiefs",
    awayTeam: "Buffalo Bills",
    liveData: {
      Quarters: [[7, 3], [14, 7], [7, 7], [0, 4]],
      HomeAttacking: true,
      Try: 2,
      Yards: 7,
      Position: "BUF 25",
      Period: 4,
      PeriodName: "4º Cuarto",
      ResultHome: 28,
      ResultAway: 21,
      Time: "20:30",
      MatchTime: -1,
      RemainingPeriodTime: "8:45"
    }
  },
  handball: {
    group: "Balonmano",
    title: "Campeonato Andebol 1",
    emoji: "🤾",
    homeTeam: "FC Porto Sofarma",
    awayTeam: "Aristica de Avanca / Bioria",
    liveData: {
      Period: 2,
      PeriodName: "1º Tiempo",
      ResultHome: 16,
      ResultAway: 9,
      Time: "21:00",
      MatchTime: 22,
      RemainingPeriodTime: ""
    }
  },
  volleyball: {
    group: "Voleibol",
    title: "FIVB World Championship",
    emoji: "🏐",
    homeTeam: "Brazil",
    awayTeam: "Italy",
    liveData: {
      Sets: [[25, 23], [22, 25], [25, 20], [18, 15]],
      Period: 4,
      PeriodName: "Set 4",
      ResultHome: 2,
      ResultAway: 1,
      Time: "18:45",
      MatchTime: -1
    }
  },
  table_tennis: {
    group: "Tenis de Mesa",
    title: "ITTF World Championships",
    emoji: "🏓",
    homeTeam: "Ma Long",
    awayTeam: "Fan Zhendong",
    liveData: {
      Sets: [[11, 8], [9, 11], [11, 7], [8, 11], [11, 6], [8, 5]],
      Period: 6,
      PeriodName: "Set 6",
      ResultHome: 3,
      ResultAway: 2,
      Time: "16:45",
      MatchTime: -1
    }
  },
  darts: {
    group: "Dardos",
    title: "World Grand Prix",
    emoji: "🎯",
    homeTeam: "Dirk van Duijvenbode",
    awayTeam: "Jonny Clayton",
    liveData: {
      Legs: [[1, 2], [401, 389]],
      Period: 116,
      PeriodName: "1º Leg",
      ResultHome: 1,
      ResultAway: 2,
      Time: "21:20",
      MatchTime: -1,
      RemainingPeriodTime: ""
    }
  },
  futsal: {
    group: "Futsal",
    title: "FIFA Futsal World Cup",
    emoji: "⚽",
    homeTeam: "Brazil",
    awayTeam: "Argentina",
    liveData: {
      Period: 2,
      PeriodName: "2nd Half",
      ResultHome: 3,
      ResultAway: 2,
      Time: "21:35",
      MatchTime: 35
    }
  },
  ebasket: {
    group: "e-Basket",
    title: "H2H GG League - 4x5 Min de juego",
    emoji: "🏀",
    homeTeam: "Denver Nuggets (REND)",
    awayTeam: "Orlando Magic (BLADE)",
    liveData: {
      Period: 12,
      PeriodName: "2º cuarto",
      ResultHome: 20,
      ResultAway: 16,
      Time: "22:47",
      MatchTime: -1,
      RemainingPeriodTime: "9:57"
    }
  },
  efootball: {
    group: "e-Fútbol",
    title: "Batalla de Fútbol - 12 min de Juego",
    emoji: "⚽",
    homeTeam: "Boca Juniors (Solya)",
    awayTeam: "River Plate (Andrey88)",
    liveData: {
      Period: 2,
      PeriodName: "1º Tiempo",
      ResultHome: 1,
      ResultAway: 0,
      Time: "23:00",
      MatchTime: 5,
      RemainingPeriodTime: ""
    }
  },
  esports: {
    group: "eSports",
    title: "[CSGO] CCT South America",
    emoji: "🎮",
    homeTeam: "Bounty Hunters",
    awayTeam: "MAGICOS",
    liveData: {
      Period: 1,
      PeriodName: "Comenzado",
      ResultHome: 0,
      ResultAway: 0,
      Time: "00:08",
      MatchTime: 7,
      RemainingPeriodTime: ""
    }
  },
  rugby: {
    group: "Rugby",
    title: "Six Nations Championship",
    emoji: "🏉",
    homeTeam: "England",
    awayTeam: "France",
    liveData: {
      Period: 3,
      PeriodName: "2nd Half",
      ResultHome: 21,
      ResultAway: 18,
      Time: "17:30",
      MatchTime: 65
    }
  },
  baseball: {
    group: "Béisbol",
    title: "MLB World Series",
    emoji: "⚾",
    homeTeam: "Yankees",
    awayTeam: "Dodgers",
    liveData: {
      Period: 8,
      PeriodName: "8th Inning",
      ResultHome: 7,
      ResultAway: 4,
      Time: "21:45",
      MatchTime: -1
    }
  }
};

// Function to map mock data to LiveEvent format
function mapMockDataToLiveEvent(sportKey: keyof typeof richMockData, eventId: number): LiveEvent {
  const sportConfig = richMockData[sportKey];
  const liveData = sportConfig.liveData;

  const homeScore = liveData.ResultHome?.toString() || "0";
  const awayScore = liveData.ResultAway?.toString() || "0";

  return {
    id: eventId,
    api_name: `${sportKey}-api`,
    sport_group: sportConfig.group,
    sport_title: sportConfig.title,
    league_logo: `/cache/league-logos/${sportKey}.png`,
    home_team: sportConfig.homeTeam,
    away_team: sportConfig.awayTeam,
    active: true,
    status: "live",
    scores: { home: homeScore, away: awayScore },
    markets: [],
    commence_time: new Date().toISOString(),
    bookmakers: [],
    match_time: liveData.PeriodName,
    startTime: liveData.Time,
    bettingActive: true,
    marketsCount: Math.floor(Math.random() * 50) + 10,
    liveData: liveData
  };
}

// Export function to get all sports data
export function getAllSportsWithMockData(): Record<string, LiveEvent> {
  const sportsData: Record<string, LiveEvent> = {};
  
  let eventId = 1;
  Object.keys(richMockData).forEach((sportKey) => {
    sportsData[sportKey] = mapMockDataToLiveEvent(sportKey as keyof typeof richMockData, eventId++);
  });

  return sportsData;
}

// Export function to get specific sport data
export function getSportMockData(sportKey: keyof typeof richMockData): LiveEvent | null {
  if (richMockData[sportKey]) {
    return mapMockDataToLiveEvent(sportKey, 1);
  }
  return null;
}

// Export sport configuration for reference
export { richMockData };
import React from 'react';
import LiveMatchHeader from '../components/LiveMatchHeader';
import { initialSportCategories } from '../lib/data/sportCategories';

// Mock data for all sports
const sportsTestData = {
  // Hockey Hielo (Ice Hockey) - Based on attached image
  hockey: {
    id: "hockey-1",
    sport_group: "Hockey Hielo",
    sport_title: "Extraliga Bielorrusia",
    league_logo: "/cache/league-logos/belarus-extraliga.png",
    home_team: "Hk Lida",
    away_team: "Slavutych Smolensk", 
    active: true,
    status: "interrupted",
    scores: { home: "0", away: "0" },
    liveData: {
      PeriodName: "Interrumpido",
      GameTime: "6:52",
      Period: 1,
      ResultHome: 0,
      ResultAway: 0,
      Time: "20:15",
      MatchTime: 412, // 6:52 in seconds
      Periods: [
        [0, 0], // 1st period scores
        [0, 0], // 2nd period scores  
        [0, 0]  // 3rd period scores
      ],
      Penalties: {
        Home: 2,
        Away: 1
      },
      Shots: {
        Home: 8,
        Away: 12
      }
    }
  },

  // Badminton
  badminton: {
    id: "badminton-1", 
    sport_group: "Badminton",
    sport_title: "BWF World Championships",
    league_logo: "/cache/league-logos/BWF.png",
    home_team: "Chen Long",
    away_team: "Viktor Axelsen",
    active: true,
    status: "live", 
    scores: { home: "1", away: "0" },
    liveData: {
      CurrentSet: 2,
      PeriodName: "2º Set",
      Sets: [
        [21, 19, 1], // Home: Won 1st set 21-19, current 2nd set 1 point
        [15, 10, 0]  // Away: Lost 1st set 19-21, current 2nd set 0 points
      ],
      ResultHome: 1,
      ResultAway: 15,
      Time: "14:25"
    }
  },

  // Tennis
  tennis: {
    id: "tennis-1",
    sport_group: "Tenis", 
    sport_title: "ATP Masters 1000 Madrid",
    league_logo: "/cache/league-logos/ATP.png",
    home_team: "Carlos Alcaraz",
    away_team: "Novak Djokovic",
    active: true,
    status: "live",
    scores: { home: "1", away: "1" },
    liveData: {
      Sets: [[6, 4], [3, 6], [5, 4]],
      HomeService: true,
      SetsHome: 1,
      SetsAway: 1, 
      Period: 17,
      PeriodName: "3º Set",
      ResultHome: 40,
      ResultAway: 30,
      Time: "16:42"
    }
  },

  // Football/Soccer
  football: {
    id: "football-1",
    sport_group: "Fútbol",
    sport_title: "La Liga Santander", 
    league_logo: "/cache/league-logos/LaLiga.png",
    home_team: "Real Madrid",
    away_team: "FC Barcelona",
    active: true,
    status: "live",
    scores: { home: "2", away: "1" },
    liveData: {
      PeriodName: "2º Tiempo",
      MatchTime: 67,
      Period: 3,
      ResultHome: 2,
      ResultAway: 1,
      Time: "21:00",
      Actions: [
        { ActionTypeName: "Gol", Time: 65, IsHomeTeam: true },
        { ActionTypeName: "Tarjeta Amarilla", Time: 63, IsHomeTeam: false }
      ]
    }
  },

  // Basketball
  basketball: {
    id: "basketball-1",
    sport_group: "Baloncesto",
    sport_title: "NBA Regular Season",
    league_logo: "/cache/league-logos/NBA.png", 
    home_team: "Los Angeles Lakers",
    away_team: "Boston Celtics",
    active: true,
    status: "live",
    scores: { home: "98", away: "102" },
    liveData: {
      PeriodName: "4º Cuarto", 
      MatchTime: 8.5,
      Period: 14,
      ResultHome: 98,
      ResultAway: 102,
      Time: "22:30",
      Quarters: [
        [25, 28], // 1st quarter
        [24, 26], // 2nd quarter  
        [26, 24], // 3rd quarter
        [23, 24]  // 4th quarter
      ]
    }
  },

  // Baseball
  baseball: {
    id: "baseball-1",
    sport_group: "Béisbol",
    sport_title: "MLB World Series",
    league_logo: "/cache/league-logos/MLB.png",
    home_team: "New York Yankees", 
    away_team: "Los Angeles Dodgers",
    active: true,
    status: "live",
    scores: { home: "4", away: "6" },
    liveData: {
      PeriodName: "7º Inning",
      Period: 7,
      ResultHome: 4,
      ResultAway: 6,
      Time: "20:45",
      Innings: [
        [1, 0, 2, 0, 1, 0, 0], // Home team innings 1-7
        [2, 1, 0, 2, 0, 1, 0]  // Away team innings 1-7
      ],
      Balls: 2,
      Strikes: 1, 
      Outs: 1
    }
  },

  // Volleyball 
  volleyball: {
    id: "volleyball-1",
    sport_group: "Voleibol",
    sport_title: "FIVB Volleyball Nations League",
    league_logo: "/cache/league-logos/FIVB.png",
    home_team: "Brazil",
    away_team: "Italy",
    active: true,
    status: "live", 
    scores: { home: "2", away: "1" },
    liveData: {
      PeriodName: "4º Set",
      Period: 18,
      ResultHome: 2,
      ResultAway: 1,
      Time: "19:30",
      Sets: [
        [25, 22], // 1st set
        [23, 25], // 2nd set
        [25, 20], // 3rd set
        [18, 15]  // 4th set (current)
      ]
    }
  },

  // Table Tennis
  tableTennis: {
    id: "table-tennis-1",
    sport_group: "Tenis de Mesa", 
    sport_title: "ITTF World Championships",
    league_logo: "/cache/league-logos/ITTF.png",
    home_team: "Ma Long",
    away_team: "Fan Zhendong", 
    active: true,
    status: "live",
    scores: { home: "2", away: "3" },
    liveData: {
      PeriodName: "6º Set",
      Period: 20,
      ResultHome: 2,
      ResultAway: 3,
      Time: "18:15",
      Sets: [
        [11, 8], // 1st set
        [9, 11], // 2nd set
        [11, 6], // 3rd set  
        [8, 11], // 4th set
        [7, 11], // 5th set
        [8, 6]   // 6th set (current)
      ]
    }
  }
};

const SportsSamplesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-8 text-center">
          🏆 Live Sports Mock Data Samples
        </h1>
        
        <div className="mb-8 bg-blue-900/30 border border-blue-500 rounded-lg p-4">
          <h2 className="text-blue-200 text-xl font-semibold mb-2">📋 Sample Data URL</h2>
          <p className="text-blue-100 mb-2">
            View all sports layouts and mock data at:
          </p>
          <code className="bg-blue-800 text-blue-100 px-3 py-1 rounded text-sm">
            http://localhost:3000/sports-samples
          </code>
        </div>

        <div className="grid gap-8">
          {Object.entries(sportsTestData).map(([sportKey, event]) => (
            <div key={sportKey} className="bg-gray-800 rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-white text-2xl font-semibold mb-2">
                  🏅 {event.sport_group} - {event.sport_title}
                </h2>
                <div className="text-gray-400 text-sm mb-4">
                  {event.home_team} vs {event.away_team}
                </div>
              </div>
              
              <LiveMatchHeader 
                event={event}
                sportCategories={initialSportCategories}
                className="mb-4"
                onBack={() => console.log(`Back from ${sportKey}`)}
              />
              
              <details className="mt-4">
                <summary className="text-gray-300 cursor-pointer hover:text-white">
                  📊 View Mock Data Structure
                </summary>
                <pre className="bg-gray-900 text-green-400 p-4 rounded mt-2 text-xs overflow-auto">
                  {JSON.stringify(event, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h2 className="text-white text-xl font-semibold mb-4">
            🔧 Development Notes
          </h2>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li>• Each sport has unique liveData structure based on game requirements</li>
            <li>• Hockey includes periods, penalties, shots on goal</li>
            <li>• Tennis/Badminton have sets and service indicators</li> 
            <li>• Football has match time, actions, and period info</li>
            <li>• Basketball includes quarters and running time</li>
            <li>• Baseball tracks innings, balls, strikes, outs</li>
            <li>• All layouts are responsive and sport-specific</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SportsSamplesPage;
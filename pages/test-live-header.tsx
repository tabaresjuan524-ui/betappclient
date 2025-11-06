import React from 'react';
import LiveMatchHeader from '../components/LiveMatchHeader';
import { initialSportCategories, SportCategory } from '../lib/data/sportCategories';

// Test data with different sports to verify background mapping
const testEvents = [
  {
    api_name: "codere",
    id: 1,
    sport_group: "soccer",
    sport_title: "Fútbol", // Should map to soccer.svg
    league_logo: "/cache/league-logos/DE.png",
    home_team: "Real Madrid",
    away_team: "Barcelona",
    markets: [],
    commence_time: "2025-01-10T19:00:00Z",
    scores: { home: "2", away: "1" },
    bookmakers: [],
    status: "live",
    match_time: "75",
    startTime: "2025-01-10T19:00:00Z",
    active: true,
    bettingActive: true,
    marketsCount: 15
  },
  {
    api_name: "codere", 
    id: 2,
    sport_group: "basketball",
    sport_title: "Baloncesto", // Should map to basketball.svg
    league_logo: "/cache/league-logos/NBA2.png",
    home_team: "Lakers",
    away_team: "Warriors",
    markets: [],
    commence_time: "2025-01-10T20:00:00Z",
    scores: { home: "98", away: "102" },
    bookmakers: [],
    status: "live",
    match_time: "8",
    startTime: "2025-01-10T20:00:00Z",
    active: true,
    bettingActive: true,
    marketsCount: 20
  },
  {
    api_name: "codere",
    id: 3,
    sport_group: "tennis",
    sport_title: "Tenis", // Should map to tennis.svg
    league_logo: "/cache/league-logos/ITFM.png",
    home_team: "Novak Djokovic",
    away_team: "Rafael Nadal",
    markets: [],
    commence_time: "2025-01-10T21:00:00Z",
    scores: { home: "2", away: "1" },
    bookmakers: [],
    status: "live",
    match_time: "",
    startTime: "2025-01-10T21:00:00Z",
    active: true,
    bettingActive: true,
    marketsCount: 25
  },
  {
    api_name: "codere",
    id: 4,
    sport_group: "esports",
    sport_title: "eSports", // Should map to esports.svg
    league_logo: "/cache/league-logos/DOTA.png",
    home_team: "Team Liquid",
    away_team: "Fnatic",
    markets: [],
    commence_time: "2025-01-10T22:00:00Z",
    scores: { home: "1", away: "0" },
    bookmakers: [],
    status: "live",
    match_time: "",
    startTime: "2025-01-10T22:00:00Z",
    active: true,
    bettingActive: true,
    marketsCount: 12
  }
];

const LiveMatchHeaderTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Live Match Header Test
      </h1>
      
      <div className="space-y-8 max-w-4xl mx-auto">
        {testEvents.map((event) => (
          <div key={event.id} className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              {event.sport_title} - Match {event.id}
            </h2>
            
            <LiveMatchHeader 
              event={event}
              sportCategories={initialSportCategories}
              className=""
              onBack={() => alert(`Back clicked for match ${event.id}`)}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-slate-800 rounded-lg max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-white mb-4">
          Sport Background Mapping Test
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {initialSportCategories
            .filter((cat: SportCategory) => cat.sportBackground)
            .map((cat: SportCategory) => (
              <div key={cat.id} className="bg-slate-700 p-3 rounded">
                <div className="text-yellow-400 font-medium">{cat.name}</div>
                <div className="text-gray-300 text-xs">{cat.sportBackground}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default LiveMatchHeaderTest;
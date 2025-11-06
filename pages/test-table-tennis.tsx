import React from 'react';
import LiveMatchHeader from '../components/LiveMatchHeader';
import { initialSportCategories } from '../lib/data/sportCategories';

const TestTableTennis: React.FC = () => {
  // Test various table tennis variations
  const testEvents = [
    {
      api_name: "codere",
      id: 1,
      sport_group: "table_tennis",
      sport_title: "Liga Pro", // From the screenshot
      league_logo: "/cache/league-logos/CZ.png",
      home_team: "Jiri Svec",
      away_team: "Jaromir Cernik",
      markets: [],
      commence_time: "2025-01-10T19:00:00Z",
      scores: { home: "0", away: "2" },
      bookmakers: [],
      status: "live",
      match_time: "",
      startTime: "2025-01-10T19:00:00Z",
      active: true,
      bettingActive: true,
      marketsCount: 15
    },
    {
      api_name: "codere",
      id: 2,
      sport_group: "table_tennis",
      sport_title: "Tenis de Mesa", // Exact Spanish name
      league_logo: "/cache/league-logos/CZ.png",
      home_team: "Player A",
      away_team: "Player B",
      markets: [],
      commence_time: "2025-01-10T19:00:00Z",
      scores: { home: "1", away: "1" },
      bookmakers: [],
      status: "live",
      match_time: "",
      startTime: "2025-01-10T19:00:00Z",
      active: true,
      bettingActive: true,
      marketsCount: 15
    },
    {
      api_name: "codere",
      id: 3,
      sport_group: "table_tennis",
      sport_title: "Table Tennis", // English name
      league_logo: "/cache/league-logos/CZ.png",
      home_team: "Player C",
      away_team: "Player D",
      markets: [],
      commence_time: "2025-01-10T19:00:00Z",
      scores: { home: "2", away: "0" },
      bookmakers: [],
      status: "live",
      match_time: "",
      startTime: "2025-01-10T19:00:00Z",
      active: true,
      bettingActive: true,
      marketsCount: 15
    }
  ];

  React.useEffect(() => {
    // Test runs on component mount
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Table Tennis / Liga Pro Background Test
      </h1>
      
      <div className="max-w-6xl mx-auto space-y-8">
        {testEvents.map((event) => (
          <div key={event.id} className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-white">
                Testing: "{event.sport_title}"
              </h2>
              <div className="text-sm text-gray-400">
                Should detect: table_tennis.svg background
              </div>
            </div>
            
            <LiveMatchHeader 
              event={event}
              sportCategories={initialSportCategories}
              className="h-32"
              onBack={() => {
                console.log(`Back clicked for ${event.sport_title}`);
                alert(`Back button working for: ${event.sport_title}`);
              }}
            />
          </div>
        ))}
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Table Tennis Category Info
          </h3>
          <div className="text-sm text-gray-300">
            {(() => {
              const tableTennisCategory = initialSportCategories.find(cat => 
                cat.name.toLowerCase().includes('tenis de mesa') || 
                cat.name.toLowerCase().includes('table tennis')
              );
              return (
                <div>
                  <div>Category: {tableTennisCategory?.name || 'Not found'}</div>
                  <div>Background: {tableTennisCategory?.sportBackground || 'None'}</div>
                  <div>Aliases: {tableTennisCategory?.aliases?.join(', ') || 'None'}</div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTableTennis;
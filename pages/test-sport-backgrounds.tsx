import React from 'react';
import LiveMatchHeader from '../components/LiveMatchHeader';
import { initialSportCategories } from '../lib/data/sportCategories';

// Create test events for ALL sports in sportCategories
const createTestEvents = () => {
  return initialSportCategories
    .filter(cat => cat.name !== "Live" && cat.name !== "My Live") // Skip non-sport categories
    .map((cat, index) => ({
      api_name: "codere",
      id: index + 1,
      sport_group: cat.name.toLowerCase(),
      sport_title: cat.name, // Use the exact name from sportCategories
      league_logo: "/cache/league-logos/ITFM.png",
      home_team: `Team A`,
      away_team: `Team B`,
      markets: [],
      commence_time: "2025-01-10T19:00:00Z",
      scores: { home: "2", away: "1" },
      bookmakers: [],
      status: "live",
      match_time: "45",
      startTime: "2025-01-10T19:00:00Z",
      active: true,
      bettingActive: true,
      marketsCount: 15
    }));
};

const TestSportBackgrounds: React.FC = () => {
  const testEvents = createTestEvents();

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        All Sports Background Test ({testEvents.length} Sports)
      </h1>
      
      <div className="space-y-8 max-w-6xl mx-auto">
        {testEvents.map((event) => {
          const category = initialSportCategories.find(cat => cat.name === event.sport_title);
          const hasBackground = category?.sportBackground;
          const aliases = category?.aliases?.join(', ') || 'None';
          
          return (
            <div key={event.id} className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800 p-4 rounded-lg">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {event.sport_title}
                  </h2>
                  <div className="text-sm text-gray-400">
                    Background: {hasBackground ? `✅ ${hasBackground}` : '❌ No background'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Aliases: {aliases}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-medium ${
                  hasBackground ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                }`}>
                  {hasBackground ? 'HAS SVG' : 'NEEDS SVG'}
                </div>
              </div>
              
              <LiveMatchHeader 
                event={event}
                sportCategories={initialSportCategories}
                className="h-32"
                onBack={() => console.log(`Back clicked for ${event.sport_title}`)}
              />
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 p-6 bg-slate-800 rounded-lg max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold text-white mb-4">
          Summary
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-400 mb-2">Sports WITH Backgrounds:</h4>
            <div className="space-y-1 text-sm">
              {initialSportCategories
                .filter(cat => cat.sportBackground)
                .map(cat => (
                  <div key={cat.id} className="text-green-300">
                    ✅ {cat.name} → {cat.sportBackground}
                  </div>
                ))
              }
            </div>
          </div>
          <div>
            <h4 className="font-medium text-red-400 mb-2">Sports WITHOUT Backgrounds:</h4>
            <div className="space-y-1 text-sm">
              {initialSportCategories
                .filter(cat => !cat.sportBackground && cat.name !== "Live" && cat.name !== "My Live")
                .map(cat => (
                  <div key={cat.id} className="text-red-300">
                    ❌ {cat.name}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSportBackgrounds;
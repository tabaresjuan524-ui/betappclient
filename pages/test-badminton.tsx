import React from 'react';
import LiveMatchHeader from '../components/LiveMatchHeader';
import { initialSportCategories } from '../lib/data/sportCategories';

const TestBadmintonSpecific: React.FC = () => {
  // Test specifically for Badminton
  const badmintonEvent = {
    api_name: "codere",
    id: 1,
    sport_group: "badminton",
    sport_title: "BWF World Championships", // Updated title
    league_logo: "/cache/league-logos/BWF.png",
    home_team: "Chen Long",
    away_team: "Viktor Axelsen",
    markets: [],
    commence_time: "2025-01-10T19:00:00Z",
    scores: { home: "21", away: "15" },
    bookmakers: [],
    status: "live",
    match_time: "Live",
    startTime: "2025-01-10T19:00:00Z",
    active: true,
    bettingActive: true,
    marketsCount: 15,
    liveData: {
      CurrentSet: 2,
      PeriodName: "2º Set",
      Sets: [
        [21, 19, 0], // Home team: Won first set 21-19, current set 0
        [15, 10, 0]  // Away team: Lost first set 19-21, current set 0  
      ],
      ResultHome: 21,
      ResultAway: 15,
      Time: "13:30",
      MatchTime: -1,
      ParticipantHome: "Chen Long",
      ParticipantAway: "Viktor Axelsen"
    }
  };

  // Test if badminton category exists
  const badmintonCategory = initialSportCategories.find(cat => 
    cat.name.toLowerCase() === "badminton"
  );

  React.useEffect(() => {
    // Test runs on component mount
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Badminton Background Test
      </h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-slate-800 p-4 rounded-lg">
          <h2 className="text-white font-semibold mb-2">Debug Info:</h2>
          <div className="text-sm text-gray-300 space-y-1">
            <div>Sport Title: "{badmintonEvent.sport_title}"</div>
            <div>Category Found: {badmintonCategory ? '✅ Yes' : '❌ No'}</div>
            <div>Background File: {badmintonCategory?.sportBackground || 'None'}</div>
            <div>Category Name: {badmintonCategory?.name || 'N/A'}</div>
            <div>Aliases: {badmintonCategory?.aliases?.join(', ') || 'None'}</div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Testing: {badmintonEvent.sport_title}
          </h2>
          
          <LiveMatchHeader 
            event={badmintonEvent}
            sportCategories={initialSportCategories}
            className="h-auto"
            onBack={() => console.log('Back clicked')}
          />
        </div>

        {/* Additional test variant matching sample images */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Sample Image Match Test
          </h2>
          
          <LiveMatchHeader 
            event={{
              ...badmintonEvent,
              sport_title: "Olympic Games - Badminton",
              home_team: "Carolina Marin",
              away_team: "Tai Tzu-ying",
              scores: { home: "1", away: "0" },
              liveData: {
                CurrentSet: 2,
                PeriodName: "2º Set",
                Sets: [
                  [21, 9, 1], // Home: Won 1st set 21-9, current 2nd set has 1 point
                  [15, 10, 0]  // Away: Lost 1st set 9-21, current 2nd set has 0 points
                ],
                ResultHome: 1,
                ResultAway: 0,
                Time: "14:25",
                MatchTime: -1,
                ParticipantHome: "Carolina Marin",
                ParticipantAway: "Tai Tzu-ying"
              }
            }}
            sportCategories={initialSportCategories}
            className="h-auto"
            onBack={() => console.log('Back clicked')}
          />
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Direct SVG Test:</h3>
          <div className="bg-white p-4 rounded" style={{height: '200px'}}>
            <img 
              src="/cache/sport-backgrounds/badminton.svg"
              alt="Badminton SVG"
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('❌ Direct SVG failed to load');
                (e.target as HTMLElement).style.display = 'none';
                const parent = (e.target as HTMLElement).parentElement;
                if (parent) {
                  parent.innerHTML += '<div class="text-red-500 text-center">❌ badminton.svg not found</div>';
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestBadmintonSpecific;
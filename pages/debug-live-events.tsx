import React, { useState, useEffect } from 'react';
import { initialSportCategories } from '../lib/data/sportCategories';

interface LiveEvent {
  id: number;
  sport_group: string;
  sport_title: string;
  home_team: string;
  away_team: string;
  league_logo: string;
  status: string;
}

const DebugLiveEvents: React.FC = () => {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/sportsService');
        const data = await response.json();
        
        // Extract all unique sport types
        const allEvents = data.liveEvents || [];
        setEvents(allEvents);
        
        // Extract unique sports and sport groups
        const sportTitles = allEvents.map((e: LiveEvent) => e.sport_title);
        const uniqueSports = Array.from(new Set(sportTitles));
        
        const sportGroups = allEvents.map((e: LiveEvent) => e.sport_group);
        const uniqueSportGroups = Array.from(new Set(sportGroups));
        
      } catch (error) {
        console.error('❌ Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Helper function to get sport background (same as LiveMatchHeader)
  const getSportBackground = (sportName: string): string | null => {
    if (!sportName) return null;
    
    // First check if we have a direct match in sport categories
    const category = initialSportCategories.find(cat => 
      cat.name.toLowerCase() === sportName.toLowerCase()
    );
    
    if (category?.sportBackground) {
      return category.sportBackground;
    }
    
    // Fallback name-based detection
    const sportLower = sportName.toLowerCase();
    
    if (sportLower.includes('basketball') || sportLower.includes('baloncesto') || sportLower.includes('fiba')) {
      return 'basketball.svg';
    } else if (sportLower.includes('tennis') || sportLower.includes('tenis') || sportLower.includes('itf')) {
      return 'tennis.svg';
    } else if (sportLower.includes('fútbol') || sportLower.includes('football') || sportLower.includes('soccer')) {
      return 'soccer.svg';
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading live events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Live Events Sport Background Debug
      </h1>
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Summary */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Summary: {events.length} Live Events Found
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from(new Set(events.map(e => e.sport_title))).map(sport => {
              const count = events.filter(e => e.sport_title === sport).length;
              const background = getSportBackground(sport);
              return (
                <div key={sport} className="bg-slate-700 p-3 rounded">
                  <div className="text-yellow-400 font-medium">{sport}</div>
                  <div className="text-sm text-gray-300">{count} matches</div>
                  <div className="text-xs text-gray-400">
                    BG: {background || 'none'}
                  </div>
                  {background && (
                    <img 
                      src={`/cache/sport-backgrounds/${background}`}
                      alt={background}
                      className="w-6 h-6 mt-1 opacity-60"
                      onError={() => console.error(`❌ Failed: ${background}`)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual Events */}
        <div className="grid gap-4">
          {events.slice(0, 20).map((event) => {
            const background = getSportBackground(event.sport_title);
            return (
              <div key={event.id} className="bg-slate-800 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {background ? (
                      <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                        <img 
                          src={`/cache/sport-backgrounds/${background}`}
                          alt={background}
                          className="w-8 h-8 opacity-80"
                          onError={() => console.error(`❌ Event ${event.id}: Failed ${background}`)}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-red-900 rounded-lg flex items-center justify-center">
                        <span className="text-red-400 text-xs">NO BG</span>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-white font-medium">
                        {event.home_team} vs {event.away_team}
                      </div>
                      <div className="text-sm text-gray-400">
                        Sport: "{event.sport_title}" | Group: "{event.sport_group}"
                      </div>
                      <div className="text-xs text-gray-500">
                        Background: {background || 'NONE FOUND'} | Status: {event.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-400">ID: {event.id}</div>
                    {event.league_logo && (
                      <img 
                        src={event.league_logo} 
                        alt="League" 
                        className="w-8 h-8 mt-1 ml-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {events.length > 20 && (
          <div className="text-center text-gray-400">
            Showing first 20 of {events.length} events
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugLiveEvents;
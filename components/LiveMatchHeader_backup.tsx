import React from 'react';
import { SportCategory } from '../lib/data/sportCategories';
import { LiveEvent } from '../lib/services/sportsService';
import { ArrowLeft, Clock, Trophy, Target } from 'lucide-react';
import { SimpleLiveStats } from './SimpleLiveStats';

// LiveStatsDisplay Component
interface LiveStatsDisplayProps {
  event: LiveEvent;
}

const LiveStatsDisplay: React.FC<LiveStatsDisplayProps> = ({ event }) => {
  console.log('🔍 LiveStatsDisplay - Received event:', {
    id: event.id,
    sport_group: event.sport_group,
    status: event.status,
    hasLiveData: !!event.liveData,
    liveData: event.liveData
  });

  if (!event.liveData) {
    console.log('⚠️ LiveStatsDisplay - No live data available for event:', event.id);
    return null; // No live data available
  }

  const sportType = event.sport_group?.toLowerCase() || '';
  const config = LIVE_STATS_CONFIG[sportType] || LIVE_STATS_CONFIG['default'];
  
  console.log('🎯 LiveStatsDisplay - Processing live data:', {
    sportType,
    hasConfig: !!config,
    liveDataKeys: Object.keys(event.liveData)
  });
  
  // Update live data dictionary
  updateLiveDataDictionary(event.sport_group || 'unknown', event.liveData);

  // Tennis-specific rendering
  if (isTennisLiveData(event.liveData) || sportType.includes('tennis') || sportType.includes('tenis')) {
    const liveData = event.liveData as TennisLiveData;
    
    return (
      <div className="space-y-2 text-xs">
        {/* Set Scores */}
        {(liveData.ResultHome_Set1 !== undefined || liveData.SetsHome !== undefined) && (
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-gray-300">Sets</div>
              <div className="font-semibold">
                {liveData.SetsHome || '0'} - {liveData.SetsAway || '0'}
              </div>
            </div>
            {/* Individual Set Scores */}
            {liveData.ResultHome_Set1 !== undefined && (
              <div className="text-center">
                <div className="text-gray-300">Set 1</div>
                <div className="font-semibold">
                  {liveData.ResultHome_Set1} - {liveData.ResultAway_Set1}
                </div>
              </div>
            )}
            {liveData.ResultHome_Set2 !== undefined && (
              <div className="text-center">
                <div className="text-gray-300">Set 2</div>
                <div className="font-semibold">
                  {liveData.ResultHome_Set2} - {liveData.ResultAway_Set2}
                </div>
              </div>
            )}
            {liveData.ResultHome_Set3 !== undefined && (
              <div className="text-center">
                <div className="text-gray-300">Set 3</div>
                <div className="font-semibold">
                  {liveData.ResultHome_Set3} - {liveData.ResultAway_Set3}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Service Information */}
        {(liveData.ServingPlayerHome !== undefined || liveData.ServingPlayerAway !== undefined) && (
          <div className="text-center">
            <div className="text-gray-300">Serving</div>
            <div className="font-semibold">
              {liveData.ServingPlayerHome ? 'Home' : liveData.ServingPlayerAway ? 'Away' : 'Unknown'}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Football-specific rendering
  if (isFootballLiveData(event.liveData) || sportType.includes('fútbol') || sportType.includes('football')) {
    const liveData = event.liveData as FootballLiveData;
    
    return (
      <div className="space-y-2 text-xs">
        {/* Match Time */}
        {liveData.MatchTime !== undefined && (
          <div className="text-center">
            <div className="text-gray-300">Time</div>
            <div className="font-semibold">{liveData.MatchTime}'</div>
          </div>
        )}
        
        {/* Period Information */}
        {liveData.PeriodName && (
          <div className="text-center">
            <div className="text-gray-300">Period</div>
            <div className="font-semibold">{liveData.PeriodName}</div>
          </div>
        )}
        
        {/* Cards */}
        {(liveData.RedCardsHome !== undefined || liveData.YellowCardsHome !== undefined) && (
          <div className="flex justify-center space-x-4">
            {liveData.YellowCardsHome !== undefined && (
              <div className="text-center">
                <div className="text-yellow-400">Yellow Cards</div>
                <div className="font-semibold">
                  {liveData.YellowCardsHome} - {liveData.YellowCardsAway}
                </div>
              </div>
            )}
            {liveData.RedCardsHome !== undefined && (
              <div className="text-center">
                <div className="text-red-400">Red Cards</div>
                <div className="font-semibold">
                  {liveData.RedCardsHome} - {liveData.RedCardsAway}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Basketball-specific rendering
  if (isBasketballLiveData(event.liveData) || sportType.includes('baloncesto') || sportType.includes('basketball')) {
    const liveData = event.liveData as BasketballLiveData;
    
    return (
      <div className="space-y-2 text-xs">
        {/* Quarter Scores */}
        {liveData.Quarters && (
          <div className="flex justify-center space-x-2">
            {liveData.Quarters.map((quarter, index) => (
              <div key={index} className="text-center">
                <div className="text-gray-300">Q{index + 1}</div>
                <div className="font-semibold">
                  {quarter.home} - {quarter.away}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Timeouts and Fouls */}
        {(liveData.TimeoutsHome !== undefined || liveData.FoulsHome !== undefined) && (
          <div className="flex justify-center space-x-4">
            {liveData.TimeoutsHome !== undefined && (
              <div className="text-center">
                <div className="text-gray-300">Timeouts</div>
                <div className="font-semibold">
                  {liveData.TimeoutsHome} - {liveData.TimeoutsAway}
                </div>
              </div>
            )}
            {liveData.FoulsHome !== undefined && (
              <div className="text-center">
                <div className="text-gray-300">Fouls</div>
                <div className="font-semibold">
                  {liveData.FoulsHome} - {liveData.FoulsAway}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Generic fallback - show any available live statistics
  return (
    <div className="space-y-1 text-xs">
      {/* Period/Time */}
      {event.liveData.PeriodName && (
        <div className="text-center">
          <div className="text-gray-300">Status</div>
          <div className="font-semibold">{event.liveData.PeriodName}</div>
        </div>
      )}
      
      {/* Match Time */}
      {event.liveData.MatchTime !== undefined && event.liveData.MatchTime >= 0 && (
        <div className="text-center">
          <div className="text-gray-300">Time</div>
          <div className="font-semibold">{event.liveData.MatchTime}'</div>
        </div>
      )}
      
      {/* Additional Live Data - show first few meaningful properties */}
      {Object.entries(event.liveData)
        .filter(([key, value]) => 
          value !== undefined && 
          value !== null && 
          value !== '' &&
          !['ParticipantHome', 'ParticipantAway', 'ResultHome', 'ResultAway', 'Time'].includes(key)
        )
        .slice(0, 3)
        .map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
            <div className="font-semibold">{String(value)}</div>
          </div>
        ))
      }
    </div>
  );
};

interface LiveMatchHeaderProps {
  event: LiveEvent;
  sportCategories: SportCategory[];
  className?: string;
  onBack?: () => void; // Add onBack prop
}

/**
 * Get sport background SVG filename from sport categories mapping
 */
const getSportBackground = (sportName: string, sportCategories: SportCategory[]): string | null => {
  console.log(`🔍 Searching sport background for sport: "${sportName}"`);
  
  if (!sportName) {
    console.warn('No sport name provided for background mapping');
    return null;
  }

  // First try exact match
  const exactMatch = sportCategories.find(cat => {
    console.log(`Checking category: ${cat.name} with aliases: ${cat.aliases?.join(', ') || 'none'}`);
    
    // Check main name
    if (cat.name.toLowerCase() === sportName.toLowerCase()) {
      return true;
    }
    
    // Check aliases for exact match and partial matches
    if (cat.aliases) {
      return cat.aliases.some(alias => {
        const aliasLower = alias.toLowerCase();
        const sportLower = sportName.toLowerCase();
        
        // Exact match
        if (aliasLower === sportLower) {
          console.log(`✅ Exact alias match: "${alias}" for sport "${sportName}"`);
          return true;
        }
        
        // Partial matches for compound names
        if (sportLower.includes(aliasLower) || aliasLower.includes(sportLower)) {
          console.log(`✅ Partial alias match: "${alias}" contains or is contained in "${sportName}"`);
          return true;
        }
        
        return false;
      });
    }
    
    return false;
  });
  
  if (exactMatch?.sportBackground) {
    console.log(`✅ Found exact match for "${sportName}": ${exactMatch.sportBackground}`);
    return exactMatch.sportBackground;
  }

  // Fallback mapping for common variations
  const sportLower = sportName.toLowerCase();
  console.log(`Checking fallback mappings for: "${sportLower}"`);
  
  if (sportLower.includes('basketball') || sportLower.includes('baloncesto') || sportLower.includes('fiba')) {
    console.log(`🏀 Basketball detected for: "${sportName}"`);
    return 'basketball.svg';
  } else if (sportLower.includes('tennis') || sportLower.includes('tenis') || sportLower.includes('itf')) {
    console.log(`🎾 Tennis detected for: "${sportName}"`);
    return 'tennis.svg';
  } else if (sportLower.includes('fútbol') || sportLower.includes('football') || sportLower.includes('soccer')) {
    console.log(`⚽ Soccer detected for: "${sportName}"`);
    return 'soccer.svg';
  } else if (sportLower.includes('e-football') || sportLower.includes('e-fútbol')) {
    return 'efootball.svg';
  } else if (sportLower.includes('e-basket')) {
    return 'ebasket.svg';
  } else if (sportLower.includes('esports') || sportLower.includes('e-sports')) {
    return 'esports.svg';
  } else if (sportLower.includes('table tennis') || sportLower.includes('tenis de mesa') || sportLower.includes('ping pong')) {
    console.log(`🏓 Table Tennis detected for: "${sportName}"`);
    return 'table_tennis.svg';
  } else if (sportLower.includes('hockey') || sportLower.includes('hielo')) {
    return 'ice_hockey.svg';
  } else if (sportLower.includes('handball') || sportLower.includes('balonmano')) {
    return 'handball.svg';
  } else if (sportLower.includes('volleyball') || sportLower.includes('voleibol')) {
    return 'volleyball.svg';
  } else if (sportLower.includes('voley') && sportLower.includes('playa')) {
    return 'beach_volleyball.svg';
  } else if (sportLower.includes('futsal') || sportLower.includes('fútbol sala')) {
    return 'futsal.svg';
  } else if (sportLower.includes('baseball') || sportLower.includes('béisbol') || sportLower.includes('beisbol')) {
    return 'baseball.svg';
  } else if (sportLower.includes('boxing') || sportLower.includes('boxeo')) {
    return 'boxing.svg';
  } else if (sportLower.includes('snooker')) {
    return 'snooker.svg';
  } else if (sportLower.includes('badminton') || sportLower.includes('bádminton')) {
    console.log(`🏸 Badminton detected for: "${sportName}"`);
    return 'badminton.svg';
  }

  // No fallback - return null if no match found
  console.warn(`❌ No sport background found for: "${sportName}"`);
  return null;
};

/**
 * Format time display based on sport and available data
 */
const formatMatchTime = (event: LiveEvent): string => {
  // Use match_time if available and valid
  if (event.match_time && event.match_time !== '-1' && event.match_time !== '0') {
    return `${event.match_time}'`;
  }

  // Show status if live
  if (event.status === 'live') {
    return 'LIVE';
  }

  // Show start time if available
  if (event.startTime) {
    try {
      const startDate = new Date(event.startTime);
      if (!isNaN(startDate.getTime())) {
        return startDate.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
    } catch (error) {
      console.warn('Invalid startTime:', event.startTime);
    }
  }

  // Fallback to commence_time
  if (event.commence_time) {
    try {
      // Handle both date strings and timestamps
      let dateToFormat: string | number = event.commence_time;
      
      // If it looks like a timestamp (all numbers), parse it as such
      if (/^\d+$/.test(event.commence_time)) {
        dateToFormat = parseInt(event.commence_time);
      }
      
      const startDate = new Date(dateToFormat);
      if (!isNaN(startDate.getTime())) {
        return startDate.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
    } catch (error) {
      console.warn('Invalid commence_time:', event.commence_time);
    }
  }

  return '';
};

/**
 * Format period display based on sport and available data
 */
const formatPeriod = (event: LiveEvent): string => {
  const sportName = event.sport_title || '';
  const sportLower = sportName.toLowerCase();
  const matchTime = event.match_time ? parseInt(event.match_time) : 0;

  if (sportLower.includes('fútbol') || sportLower.includes('football') || sportLower.includes('soccer')) {
    if (matchTime <= 45) return '1º TIEMPO';
    if (matchTime <= 90) return '2º TIEMPO';
    return 'PRÓRROGA';
  } else if (sportLower.includes('basketball') || sportLower.includes('baloncesto')) {
    if (matchTime <= 12) return '1º CUARTO';
    if (matchTime <= 24) return '2º CUARTO';
    if (matchTime <= 36) return '3º CUARTO';
    return '4º CUARTO';
  } else if (sportLower.includes('tennis') || sportLower.includes('tenis')) {
    return '1º Set'; // Simplified for now since we don't have set data
  }

  return '';
};

const LiveMatchHeader: React.FC<LiveMatchHeaderProps> = ({
  event,
  sportCategories,
  className = "",
  onBack
}) => {
  const sportBackground = getSportBackground(event.sport_group || event.sport_title || '', sportCategories);
  const matchTime = formatMatchTime(event);
  const period = formatPeriod(event);
  
  // Debug logging
  console.log('LiveMatchHeader Debug:', {
    sportTitle: event.sport_title,
    sportGroup: event.sport_group,
    usingForBackground: event.sport_group || event.sport_title,
    sportBackground,
    backgroundUrl: sportBackground ? `/cache/sport-backgrounds/${sportBackground}` : 'none'
  });

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* SVG Background */}
      <div className="absolute inset-0">
        {sportBackground ? (
          <>
            {/* White background to make SVG more visible */}
            <div className="absolute inset-0 bg-white opacity-30"></div>
            
            {/* Use background-image for better visibility */}
            <div 
              className="w-full h-full relative z-10"
              style={{
                backgroundImage: `url(/cache/sport-backgrounds/${sportBackground})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 1,
                filter: 'brightness(1) contrast(3) saturate(2)',
              }}
            />
            
            {/* Additional img element overlay for maximum visibility */}
            <img
              src={`/cache/sport-backgrounds/${sportBackground}`}
              alt="Sport background"
              className="w-full h-full object-contain absolute inset-0 z-20"
              style={{
                opacity: 0.6,
                filter: 'brightness(0.5) contrast(10) saturate(3)',
                mixBlendMode: 'darken',
              }}
              onLoad={() => {
                console.log(`✅ Successfully loaded sport background: ${sportBackground}`);
              }}
              onError={(e) => {
                console.error(`❌ Failed to load sport background: /cache/sport-backgrounds/${sportBackground}`);
                e.currentTarget.style.display = 'none';
                // Show 'no image found' message
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'absolute inset-0 flex items-center justify-center z-30';
                  errorDiv.innerHTML = `
                    <div class="text-center text-slate-400">
                      <div class="text-6xl mb-2">🖼️</div>
                      <div class="text-sm font-medium">No Image Found</div>
                      <div class="text-xs opacity-70">${sportBackground}</div>
                    </div>
                  `;
                  parent.appendChild(errorDiv);
                }
              }}
            />
          </>
        ) : (
          // No background found - show 'no image found' message
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-400 opacity-50">
                <div className="text-6xl mb-2">🖼️</div>
                <div className="text-sm font-medium">No Background Image</div>
                <div className="text-xs opacity-70">Sport: {event.sport_title}</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Match Information Overlay */}
      <div className="relative z-50 p-6 text-white">
        {/* League and Sport Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Back Button */}
            {onBack && (
              <button 
                onClick={onBack} 
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all shadow-lg border border-white/20"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            
            {event.league_logo && (
              <img 
                src={event.league_logo} 
                alt="League logo"
                className="w-8 h-8 object-cover rounded-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div>
              <h3 className="text-sm font-semibold text-yellow-400">
                {event.sport_title}
              </h3>
              <p className="text-xs text-gray-300">{event.sport_group}</p>
            </div>
          </div>
          
          {/* Status and Time */}
          <div className="text-right">
            {event.status === 'live' && (
              <div className="flex items-center justify-end space-x-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold text-green-500 uppercase">Live</span>
              </div>
            )}
            {matchTime && (
              <div className="text-lg font-bold text-green-400">
                {matchTime}
              </div>
            )}
            {period && (
              <div className="text-xs text-gray-300">
                {period}
              </div>
            )}
          </div>
        </div>

        {/* Teams and Score */}
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">
                {event.home_team.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-sm lg:text-base">
                {event.home_team}
              </h4>
            </div>
          </div>

          {/* Score */}
          <div className="px-6">
            <div className="text-3xl font-bold text-center">
              <span className="text-white">{event.scores?.home || '0'}</span>
              <span className="text-gray-400 mx-2">:</span>
              <span className="text-white">{event.scores?.away || '0'}</span>
            </div>
            
            {/* Live Statistics */}
            <div className="mt-2 text-center">
              <SimpleLiveStats event={event} />
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center space-x-3 flex-1 justify-end">
            <div className="text-right">
              <h4 className="font-semibold text-sm lg:text-base">
                {event.away_team}
              </h4>
            </div>
            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">
                {event.away_team.substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveMatchHeader;
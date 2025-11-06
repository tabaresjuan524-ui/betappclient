import React from 'react';
import { LiveEvent } from '../lib/services/sportsService';

interface SimpleLiveStatsProps {
  event: LiveEvent;
}

export const SimpleLiveStats: React.FC<SimpleLiveStatsProps> = ({ event }) => {

  if (!event.liveData) {
    return null;
  }

  const liveData = event.liveData;
  const sportTitle = event.sport_title?.toLowerCase() || '';
  const isAmericanFootball = sportTitle.includes('futbol americano') || sportTitle.includes('american football') || sportTitle.includes('ncaaf') || sportTitle.includes('nfl');
  const isSoccer = sportTitle.includes('fútbol') || sportTitle.includes('futbol') || sportTitle.includes('soccer');
  const isTennis = sportTitle.includes('tenis') || sportTitle.includes('tennis');
  const isBasketball = sportTitle.includes('basketball') || sportTitle.includes('baloncesto');
  const isIceHockey = sportTitle.includes('hockey') || sportTitle.includes('ice hockey');

  return (
    <div className="w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-blue-400/30">
      <div className="text-center text-blue-300 font-bold text-sm flex items-center justify-center gap-2 mb-3">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        LIVE STATISTICS
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Soccer Cards Display */}
        {isSoccer && (liveData.YellowCardsHome !== undefined || liveData.RedCardsHome !== undefined) && (
          <div className="col-span-2">
            <div className="text-gray-300 text-xs font-medium text-center mb-2">Cards</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-800/50 p-2 rounded text-center">
                <div className="text-gray-400 text-[10px] font-medium">Home</div>
                <div className="flex items-center justify-center gap-1">
                  {liveData.YellowCardsHome > 0 && (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>
                      <span className="text-yellow-400 font-bold">{liveData.YellowCardsHome}</span>
                    </span>
                  )}
                  {liveData.RedCardsHome > 0 && (
                    <span className="flex items-center gap-1 ml-2">
                      <div className="w-3 h-4 bg-red-500 rounded-sm"></div>
                      <span className="text-red-500 font-bold">{liveData.RedCardsHome}</span>
                    </span>
                  )}
                  {liveData.YellowCardsHome === 0 && liveData.RedCardsHome === 0 && (
                    <span className="text-gray-500">0</span>
                  )}
                </div>
              </div>
              <div className="bg-gray-800/50 p-2 rounded text-center">
                <div className="text-gray-400 text-[10px] font-medium">Away</div>
                <div className="flex items-center justify-center gap-1">
                  {liveData.YellowCardsAway > 0 && (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>
                      <span className="text-yellow-400 font-bold">{liveData.YellowCardsAway}</span>
                    </span>
                  )}
                  {liveData.RedCardsAway > 0 && (
                    <span className="flex items-center gap-1 ml-2">
                      <div className="w-3 h-4 bg-red-500 rounded-sm"></div>
                      <span className="text-red-500 font-bold">{liveData.RedCardsAway}</span>
                    </span>
                  )}
                  {liveData.YellowCardsAway === 0 && liveData.RedCardsAway === 0 && (
                    <span className="text-gray-500">0</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tennis Sets Display */}
        {isTennis && liveData.Sets && Array.isArray(liveData.Sets) && (
          <div className="col-span-2">
            <div className="text-gray-300 text-xs font-medium text-center mb-2">Set Scores</div>
            <div className="grid gap-1 text-xs" style={{gridTemplateColumns: `repeat(${liveData.Sets.length}, 1fr)`}}>
              {liveData.Sets.map((set: [number, number], index: number) => (
                <div key={index} className="bg-gray-800/50 p-2 rounded text-center">
                  <div className="text-gray-400 text-[10px] font-medium">Set {index + 1}</div>
                  <div className="font-bold text-white">
                    {set[0]} - {set[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tennis Service Indicator */}
        {isTennis && liveData.HomeService !== undefined && (
          <div className="text-center">
            <div className="text-gray-300 text-xs font-medium">Service</div>
            <div className="text-green-400 text-xs font-bold flex items-center justify-center gap-1">
              🎾 <span>{liveData.HomeService ? event.home_team.split(' ')[0] : event.away_team.split(' ')[0]}</span>
            </div>
          </div>
        )}

        {/* Tennis Sets Won Count */}
        {isTennis && (liveData.SetsHome !== undefined || liveData.SetsAway !== undefined) && (
          <div className="text-center">
            <div className="text-gray-300 text-xs font-medium">Sets Won</div>
            <div className="font-bold text-yellow-400 text-sm">
              {liveData.SetsHome || 0} - {liveData.SetsAway || 0}
            </div>
          </div>
        )}

        {/* American Football Quarters Display */}
        {isAmericanFootball && liveData.Quarters && Array.isArray(liveData.Quarters) && (
          <div className="col-span-2">
            <div className="text-gray-300 text-xs font-medium text-center mb-2">Quarter Scores</div>
            <div className="grid grid-cols-4 gap-1 text-xs">
              {liveData.Quarters.map((quarter: [number, number], index: number) => (
                <div key={index} className="bg-gray-800/50 p-2 rounded text-center">
                  <div className="text-gray-400 text-[10px] font-medium">Q{index + 1}</div>
                  <div className="font-bold text-white">
                    {quarter[0]} - {quarter[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* American Football Ball Possession */}
        {isAmericanFootball && liveData.HomeAttacking !== undefined && (
          <div className="text-center">
            <div className="text-gray-300 text-xs font-medium">Ball Possession</div>
            <div className="flex items-center justify-center gap-1 text-xs">
              <span className="text-orange-400">�</span>
              <span className="font-bold text-yellow-400">
                {liveData.HomeAttacking ? event.home_team.split(' ')[0] : event.away_team.split(' ')[0]}
              </span>
            </div>
          </div>
        )}

        {/* American Football Game Situation */}
        {isAmericanFootball && (liveData.Try || liveData.Yards || liveData.Position) && (
          <div className="text-center">
            <div className="text-gray-300 text-xs font-medium">Situation</div>
            <div className="font-bold text-green-400 text-xs">
              {liveData.Try && `${liveData.Try} Down`}
              {liveData.Yards && ` & ${liveData.Yards}`}
              {liveData.Position && ` at ${liveData.Position}`}
            </div>
          </div>
        )}

        {/* Basketball Quarters */}
        {isBasketball && liveData.Quarters && Array.isArray(liveData.Quarters) && (
          <div className="col-span-2">
            <div className="text-gray-300 text-xs font-medium text-center mb-2">Quarter Scores</div>
            <div className="grid grid-cols-4 gap-1 text-xs">
              {liveData.Quarters.map((quarter: [number, number], index: number) => (
                <div key={index} className="bg-gray-800/50 p-2 rounded text-center">
                  <div className="text-gray-400 text-[10px] font-medium">Q{index + 1}</div>
                  <div className="font-bold text-white">
                    {quarter[0]} - {quarter[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ice Hockey Periods */}
        {isIceHockey && liveData.Periods && Array.isArray(liveData.Periods) && (
          <div className="col-span-2">
            <div className="text-gray-300 text-xs font-medium text-center mb-2">Period Scores</div>
            <div className="grid grid-cols-3 gap-1 text-xs">
              {liveData.Periods.map((period: [number, number], index: number) => (
                <div key={index} className="bg-gray-800/50 p-2 rounded text-center">
                  <div className="text-gray-400 text-[10px] font-medium">P{index + 1}</div>
                  <div className="font-bold text-white">
                    {period[0]} - {period[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Sports Quarters/Periods - Generic Handler */}
        {!isAmericanFootball && !isBasketball && !isIceHockey && liveData.Quarters && Array.isArray(liveData.Quarters) && (
          <div className="col-span-2">
            <div className="text-gray-300 text-xs font-medium text-center mb-2">Period Scores</div>
            <div className="grid grid-cols-4 gap-1 text-xs">
              {liveData.Quarters.map((period: [number, number], index: number) => (
                <div key={index} className="bg-gray-800/50 p-2 rounded text-center">
                  <div className="text-gray-400 text-[10px] font-medium">P{index + 1}</div>
                  <div className="font-bold text-white">
                    {period[0]} - {period[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Period/Time Information */}
        {liveData.PeriodName && (
          <div className="text-center">
            <div className="text-gray-300 text-xs font-medium">Period</div>
            <div className="font-bold text-white text-sm">{liveData.PeriodName}</div>
          </div>
        )}

        {/* Match Time */}
        {liveData.MatchTime !== undefined && liveData.MatchTime !== -1 && (
          <div className="text-center">
            <div className="text-gray-300 text-xs font-medium">Time</div>
            <div className="font-bold text-green-400 text-sm">{liveData.MatchTime}'</div>
          </div>
        )}

        {/* Remaining Time */}
        {liveData.RemainingPeriodTime && (
          <div className="text-center">
            <div className="text-gray-300 text-xs font-medium">Remaining</div>
            <div className="font-bold text-orange-400 text-sm">{liveData.RemainingPeriodTime}</div>
          </div>
        )}

        {/* Current Game Score */}
        {liveData.ResultHome !== undefined && liveData.ResultAway !== undefined && (
          <div className="text-center">
            <div className="text-gray-300 text-xs font-medium">Current</div>
            <div className="font-bold text-blue-400 text-sm">{liveData.ResultHome} - {liveData.ResultAway}</div>
          </div>
        )}

        {/* Game Time (for non-timed sports) */}
        {liveData.Time && liveData.MatchTime === undefined && (
          <div className="text-center">
            <div className="text-gray-300 text-xs font-medium">Game Time</div>
            <div className="font-bold text-purple-400 text-sm">{liveData.Time}</div>
          </div>
        )}

        {/* Show other meaningful properties */}
        {Object.entries(liveData)
          .filter(([key, value]) => 
            value !== undefined && 
            value !== null && 
            value !== '' &&
            !['ParticipantHome', 'ParticipantAway', 'ResultHome', 'ResultAway', 'Time', 'MatchTime', 'PeriodName', 'SetsHome', 'SetsAway', 'HomeService', 'RemainingPeriodTime', 'Quarters', 'Periods', 'Sets', 'HomeAttacking', 'Try', 'Yards', 'Position', 'YellowCardsHome', 'YellowCardsAway', 'RedCardsHome', 'RedCardsAway'].includes(key)
          )
          .slice(0, 2)
          .map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-gray-400 text-xs font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              <div className="font-medium text-white text-xs">{String(value)}</div>
            </div>
          ))
        }
      </div>

      {/* Debug: Show all available properties in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-[10px] text-gray-500 bg-gray-900/50 p-2 rounded mt-3">
          <div className="font-bold mb-1">Debug Properties:</div>
          <div className="break-all">{Object.keys(liveData).join(', ')}</div>
        </div>
      )}
    </div>
  );
};
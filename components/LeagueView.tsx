import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearSelectedLeague } from '../store/slices/oddsSlice';
import { ArrowLeft, Star, Lock, Loader2 } from 'lucide-react';
import { SelectedBet } from '../lib/data/betSlipTypes';
import { initSocket, closeSocket, LiveEvent, getEventsForLeague, subscribeToLeagueEvents, unsubscribeFromLeagueEvents, subscribeToLeagueCategories, unsubscribeFromLeagueCategories } from '../lib/services/sportsService';
import NoLiveMatchDetailView from './NoLiveMatchDetailView';
import MatchDetailView from './MatchDetailView';
import { MatchGroupSkeleton } from './SkeletonComponents';
import { initialSportCategories } from '../lib/data/sportCategories';

interface LeagueViewProps {
  selectedBets: SelectedBet[];
  favoritedEvents: string[];
  handleFavoriteToggle: (eventId: string, eventName: string) => void;
  onAddBet: (
    matchData: any,
    marketKey: string,
    oddValue: number,
    oddName: string
  ) => void;
  showCoupon?: boolean;
}

interface LeagueMatchItemProps {
  matchData: LiveEvent;
  selectedBets: SelectedBet[];
  favoritedEvents: string[];
  onAddBet: (matchData: any, oddKey: string, oddValue: number, oddName: string) => void;
  handleFavoriteToggle: (eventId: string, eventName: string) => void;
  onMarketsClick: (matchData: LiveEvent) => void;
}

// Helper function for rendering set scores (copied from Sportsbook)
const renderSetScores = (scores: any) => {
  if (!scores?.additionalScores?.home || !scores.additionalScores.away) {
    return null;
  }

  const combinedSetScores = scores.additionalScores.home.map((score1: string, index: number) => {
    const score2 = scores.additionalScores.away[index];
    return `${score1}-${score2}`;
  });

  if (combinedSetScores.length > 0) {
    return (
      <div className="flex flex-wrap text-xs text-slate-500 dark:text-slate-400 mt-1 space-x-2">
        {combinedSetScores.map((setScore: string, index: number) => (
          <span key={index}>{setScore}</span>
        ))}
      </div>
    );
  }

  return null;
};

// LeagueMatchItem component (identical to Sportsbook's MatchItem)
const LeagueMatchItem = React.memo<LeagueMatchItemProps>(({ matchData, selectedBets, favoritedEvents, onAddBet, handleFavoriteToggle, onMarketsClick }) => {
  const { id, home_team, away_team, scores, markets, commence_time, match_time, active, bettingActive, startTime, status } = matchData;
  const areOddsLocked = !active || !bettingActive;
  const [oddChanges, setOddChanges] = useState<Record<string, 'increased' | 'decreased'>>({});
  const [currentOddPrices, setCurrentOddPrices] = useState<Record<string, number>>({});
  const isInitialMount = useRef(true);
  const [liveTime, setLiveTime] = useState(match_time);

  const marketPriority = ['h2h', 'spreads', 'totals', 'h2h_dd'];

  const availableMarkets = useMemo(() => {
    if (!markets || markets.length === 0) return [];
    const priorityMarkets = marketPriority.map(key => markets.find(m => m.key === key)).filter(Boolean);
    const otherMarkets = markets.filter(m => !marketPriority.includes(String(m.key)));
    return [...priorityMarkets, ...otherMarkets] as any[];
  }, [markets]);

  const [activeMarketKey, setActiveMarketKey] = useState(availableMarkets[0]?.key);

  useEffect(() => {
    const activeMarket = markets ? markets.find(m => m.key === activeMarketKey) : null;
    if (!activeMarket || !activeMarket.outcomes) return;

    const changes: Record<string, 'increased' | 'decreased'> = {};
    const newPrices: Record<string, number> = {};

    activeMarket.outcomes.forEach((outcome: any) => {
      const oddName = outcome.name;
      const newPrice = outcome.price;
      newPrices[oddName] = newPrice;

      if (!isInitialMount.current) {
        const oldPrice = currentOddPrices[oddName];
        if (oldPrice !== undefined && newPrice !== oldPrice) {
          const key = `${id}-${activeMarket.key}-${oddName}`;
          changes[key] = newPrice > oldPrice ? 'increased' : 'decreased';
        }
      }
    });

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    setCurrentOddPrices(newPrices);

    if (Object.keys(changes).length > 0) {
      setOddChanges(changes);
      const timer = setTimeout(() => {
        setOddChanges({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [markets, activeMarketKey, id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (scores && match_time && match_time !== "" && match_time !== "-1" && match_time !== "0") {
      // Parse the match time more safely
      const timeStr = match_time.toString().trim();
      if (timeStr && timeStr !== "0" && timeStr !== "-1") {
        const timeParts = timeStr.split(':').map(Number);
        let totalSeconds = 0;
        
        if (timeParts.length >= 2) {
          // Format MM:SS
          totalSeconds = (timeParts[0] || 0) * 60 + (timeParts[1] || 0);
        } else if (timeParts.length === 1 && !isNaN(timeParts[0])) {
          // Just minutes
          totalSeconds = (timeParts[0] || 0) * 60;
        }

        // Only start timer if we have valid time
        if (totalSeconds >= 0) {
          timer = setInterval(() => {
            totalSeconds++;
            const minutes = Math.floor(totalSeconds / 60);
            setLiveTime(`${String(minutes).padStart(2, '0')}'`);
          }, 1000);
        } else {
          setLiveTime("");
        }
      } else {
        setLiveTime("");
      }
    } else {
      setLiveTime("");
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [scores, match_time]);

  const [visibleTabCount, setVisibleTabCount] = useState(availableMarkets.length);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const currentActiveMarketExists = availableMarkets.some(m => m.key === activeMarketKey);
    if (!currentActiveMarketExists && availableMarkets.length > 0) {
      setActiveMarketKey(availableMarkets[0].key);
    } else if (availableMarkets.length > 0 && !activeMarketKey) {
      setActiveMarketKey(availableMarkets[0].key);
    }
  }, [availableMarkets, activeMarketKey]);

  useLayoutEffect(() => {
    const calculateVisibleTabs = () => {
      if (!tabsContainerRef.current) return;
      const containerWidth = tabsContainerRef.current.clientWidth;
      let totalWidth = 0;
      let count = 0;
      for (const tab of tabRefs.current) {
        if (tab) {
          totalWidth += tab.offsetWidth;
          if (totalWidth > containerWidth) break;
          count++;
        }
      }
      setVisibleTabCount(count);
    };
    calculateVisibleTabs();
    window.addEventListener('resize', calculateVisibleTabs);
    return () => window.removeEventListener('resize', calculateVisibleTabs);
  }, [availableMarkets]);

  const activeMarket = useMemo(() => markets.find(m => m.key === activeMarketKey), [markets, activeMarketKey]);

  const getOddButtonClass = (isSelected: boolean) => isSelected
    ? 'bg-yellow-500 text-black dark:bg-yellow-400 dark:text-slate-900 font-semibold'
    : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed';

  const isSelected = (marketKey: string, outcomeName: string): boolean => {
    if (!marketKey || !outcomeName) return false;
    const betIdForCheck = `${id}-${marketKey}-${outcomeName}`;
    return selectedBets.some(bet => bet.id === betIdForCheck);
  };

  // Try multiple time fields in priority order - start_time first as it's more stable
  const timeFields = [
    { field: 'start_time', value: matchData.start_time },
    { field: 'startTime', value: startTime },
    { field: 'commence_time', value: commence_time }
  ];
  
  let eventDateTime = null;
  for (const { field, value } of timeFields) {
    if (value && value !== 'invalid-date') {
      eventDateTime = value;
      //console.log(`🔍 LEAGUE_TIME_DEBUG - Match ${id} using ${field} for time: ${value}`);
      break;
    }
  }
  
  let formattedTime;
  if (!eventDateTime) {
    formattedTime = "Invalid date";
  } else {
    try {
      const date = new Date(eventDateTime);
      if (isNaN(date.getTime())) {
        formattedTime = "Invalid date";
      } else {
        formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      }
    } catch (error) {
      formattedTime = "Invalid date";
    }
  }
  const formattedDate = eventDateTime ? new Date(eventDateTime).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '';
  const displayChanges = oddChanges;

  // Check if event is live using multiple indicators
  const isLive = (
    // Status must indicate live state (not "not_started", "finished", "postponed", etc.)
    status && 
    (status === 'live' || status === 'in_progress' || status.toLowerCase().includes('live')) &&
    status !== 'not_started' &&
    status !== 'finished' &&
    status !== 'postponed' &&
    // Must have match_time to indicate active timing
    match_time &&
    match_time !== '' &&
    // Has scores structure
    scores && 
    typeof scores.home !== 'undefined' && 
    typeof scores.away !== 'undefined'
  );

  return (
    <li className="bg-slate-50 dark:bg-slate-900/50 p-3 flex flex-col md:flex-row md:flex-wrap gap-y-3 w-full rounded-lg shadow-sm">
      <div className="flex w-full justify-between items-center md:items-start md:w-[30%] md:flex-shrink-0 md:pr-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              {isLive ? (
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-bold text-green-500 whitespace-nowrap bg-green-100 dark:bg-green-900 px-1 py-0.5 rounded">LIVE</span>
                  {liveTime && liveTime !== "" && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">{liveTime}</span>
                  )}
                  <span className="text-xs font-bold uppercase text-yellow-500 text-center leading-tight">
                    {matchData.status ? matchData.status.replace(/_/g, ' ') : 'LIVE'}
                  </span>
                </div>
              ) : null}
              
              <div className="flex flex-col space-y-1">
                {/* Team names and scores/date row */}
                <div className="flex justify-between items-center">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-sm text-slate-900 dark:text-slate-100 font-medium truncate">{home_team}</p>
                    <p className="text-sm text-slate-900 dark:text-slate-100 font-medium truncate">{away_team}</p>
                  </div>
                  
                  {/* Show scores only for live events, date/time for non-live */}
                  {isLive ? (
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold">{scores?.home ?? '-'}</p>
                      <p className="text-sm font-semibold">{scores?.away ?? '-'}</p>
                    </div>
                  ) : (
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formattedDate}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formattedTime}</p>
                    </div>
                  )}
                </div>

                {/* Set scores row - appears below when present and live */}
                {isLive && renderSetScores(scores) && (
                  <div className="flex justify-center">
                    {renderSetScores(scores)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 md:hidden ml-4">
          <button 
            onClick={() => handleFavoriteToggle(String(id), `${home_team} vs ${away_team}`)} 
            className="text-slate-500 hover:text-yellow-500 dark:text-slate-400"
          >
            <Star size={18} className={favoritedEvents.includes(String(id)) ? 'fill-current text-yellow-500' : ''} />
          </button>
          <button 
            className="text-xs bg-slate-200 h-8 w-8 flex items-center justify-center rounded hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600" 
            disabled={!markets || markets.length === 0}
            onClick={() => onMarketsClick(matchData)}
          >
            <span className="font-bold text-slate-700 dark:text-slate-300">+{matchData.marketsCount ? matchData.marketsCount : (markets.length || 0)}</span>
          </button>
        </div>
      </div>

      <div className="w-full md:w-[60%] md:flex-shrink-0 md:px-2">
        {availableMarkets.length > 0 ? (
          <>
            <div ref={tabsContainerRef} className="hidden md:flex border-b border-slate-200 dark:border-slate-700 mb-2 overflow-hidden">
              {availableMarkets.slice(0, visibleTabCount).map((market, index) => (
                <button
                  key={market.key}
                  ref={el => { tabRefs.current[index] = el; }}
                  onClick={() => setActiveMarketKey(market.key)}
                  className={`py-2 px-3 text-[9px] font-semibold whitespace-nowrap transition-colors ${
                    activeMarketKey === market.key 
                      ? 'border-b-2 border-yellow-500 text-yellow-500' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {market.name}
                </button>
              ))}
            </div>
            <div className="flex md:hidden border-b border-slate-200 dark:border-slate-700 mb-2 overflow-x-auto scrollbar-hide">
              {availableMarkets.map(market => (
                <button
                  key={market.key}
                  onClick={() => setActiveMarketKey(market.key)}
                  className={`py-2 px-3 text-[9px] font-semibold transition-colors flex-shrink-0 whitespace-nowrap ${
                    activeMarketKey === market.key 
                      ? 'border-b-2 border-yellow-500 text-yellow-500' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {market.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {activeMarket && activeMarket.outcomes ? activeMarket.outcomes.map((outcome: any) => {
                const isOddSelected = isSelected(activeMarketKey, outcome.name);
                const isDisabled = outcome.suspended;
                return (
                  <button
                    key={outcome.name}
                    disabled={isDisabled || areOddsLocked}
                    onClick={() => onAddBet(matchData, activeMarketKey, outcome.price, outcome.name)}
                    className={`relative overflow-hidden flex flex-col items-center justify-center p-2 rounded min-w-[70px] h-10 ${getOddButtonClass(isOddSelected)}`}
                  >
                    <span
                      className={`absolute top-0 left-0 h-0 w-0 border-t-[30px] border-t-green-500 border-r-[30px] border-r-transparent transition-opacity duration-300 ease-in-out ${
                        displayChanges[`${id}-${activeMarketKey}-${outcome.name}`] === 'increased' ? 'opacity-70' : 'opacity-0'
                      }`}
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-0 w-0 border-b-[30px] border-b-red-500 border-l-[30px] border-l-transparent transition-opacity duration-300 ease-in-out ${
                        displayChanges[`${id}-${activeMarketKey}-${outcome.name}`] === 'decreased' ? 'opacity-70' : 'opacity-0'
                      }`}
                    />
                    <span className={`text-[9px] ${isOddSelected ? 'text-black' : 'text-slate-600 dark:text-slate-300'}`}>
                      {outcome.name}
                    </span>
                    <strong className={`text-xs font-semibold ${isOddSelected ? 'text-black' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {isDisabled || areOddsLocked ? <Lock size={12} /> : outcome.price.toFixed(2)}
                    </strong>
                  </button>
                );
              }) : null}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 py-4">
            Markets not available
          </div>
        )}
      </div>

      <div className="hidden md:flex md:w-[10%] md:flex-shrink-0 flex-col items-end gap-2 md:pl-2">
        <button 
          onClick={() => handleFavoriteToggle(String(id), `${home_team} vs ${away_team}`)} 
          className="text-slate-500 hover:text-yellow-500 dark:text-slate-400"
        >
          <Star size={18} className={favoritedEvents.includes(String(id)) ? 'fill-current text-yellow-500' : ''} />
        </button>
        {markets.length > 0 ? (
          <button 
            className="text-xs bg-slate-200 flex items-center justify-center rounded hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600 p-2 px-3" 
            disabled={!markets || markets.length === 0}
            onClick={() => onMarketsClick(matchData)}
          >
            <span className="inline-block font-bold text-slate-700 dark:text-slate-300">
              {matchData.marketsCount ? `+${matchData.marketsCount}` : `+${markets.length}`}
            </span>
          </button>
        ) : null}
      </div>
    </li>
  );
});

LeagueMatchItem.displayName = 'LeagueMatchItem';

const LeagueView: React.FC<LeagueViewProps> = ({ selectedBets, favoritedEvents, handleFavoriteToggle, onAddBet, showCoupon }) => {
  const dispatch = useDispatch();
  const { selectedLeague, liveEvents, codere } = useSelector((state: RootState) => state.odds);
  
  // Use events directly from selectedLeague in Redux store
  const [stableEvents, setStableEvents] = useState<LiveEvent[]>([]);
  const previousEventsRef = useRef<LiveEvent[]>([]);
  
  // State for detail view
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<LiveEvent | null>(null);

  // Helper function to merge live data from liveEvents into selectedLeague events
  const mergeWithLiveData = (leagueEvents: LiveEvent[], liveEvents: LiveEvent[]): LiveEvent[] => {
    return leagueEvents.map(leagueEvent => {
      // Find matching live event by ID
      const matchingLiveEvent = liveEvents.find(liveEvent => liveEvent.id === leagueEvent.id);
      
      if (matchingLiveEvent && matchingLiveEvent.liveData) {
        // Merge the live event data, giving priority to live data
        const mergedEvent = {
          ...leagueEvent,
          // Merge live data
          liveData: matchingLiveEvent.liveData,
          // Update other live-related fields
          active: matchingLiveEvent.active || leagueEvent.active,
          status: matchingLiveEvent.status || leagueEvent.status,
          scores: matchingLiveEvent.scores || leagueEvent.scores,
          // Preserve league information if missing in live event
          league_logo: leagueEvent.league_logo || matchingLiveEvent.league_logo,
          sport_title: leagueEvent.sport_title || matchingLiveEvent.sport_title,
        };
        
        return mergedEvent;
      }
      
      return leagueEvent;
    });
  };
  
  // Subscribe to league events when the selected league changes
  useEffect(() => {
    if (selectedLeague && selectedLeague.nodeId) {
      subscribeToLeagueEvents(selectedLeague.nodeId);
      
      // Also subscribe to categories for the league
      subscribeToLeagueCategories(selectedLeague.nodeId);
      
      // Cleanup: unsubscribe when league changes or component unmounts
      return () => {
        if (selectedLeague?.nodeId) {
          unsubscribeFromLeagueEvents(selectedLeague.nodeId);
          unsubscribeFromLeagueCategories(selectedLeague.nodeId);
        }
      };
    }
  }, [selectedLeague?.nodeId]);
  
  // Clear match detail view when the actual league (nodeId or name) changes, not just when data updates
  useEffect(() => {
    setSelectedMatchForDetail(null);
  }, [selectedLeague?.nodeId, selectedLeague?.name]);

  // Update stable events when selectedLeague.events changes
  useEffect(() => {
    
    // For LIVE leagues (no nodeId), filter from liveEvents
    if (selectedLeague && selectedLeague.name && !selectedLeague.nodeId) {
      const leagueName = selectedLeague.name;
      const filteredEvents = liveEvents.filter(event => 
        event.sport_title === leagueName ||
        event.sport_title?.toLowerCase().includes(leagueName.toLowerCase()) ||
        leagueName.toLowerCase().includes(event.sport_title?.toLowerCase() || '')
      );
      
      
      // Sort the events by commence_time
      const sortedEvents = filteredEvents.sort((a, b) => {
        const timeA = a.commence_time ? new Date(a.commence_time).getTime() : 0;
        const timeB = b.commence_time ? new Date(b.commence_time).getTime() : 0;
        return timeA - timeB;
      });
      
      setStableEvents(sortedEvents);
      previousEventsRef.current = sortedEvents;
      return;
    }
    
    // For Sports tab leagues (with nodeId), use selectedLeague.events
    if (selectedLeague && selectedLeague.events && selectedLeague.events.length > 0) {
      // Merge with live data to ensure Sports tab has same data richness as Live tab
      const mergedEvents = mergeWithLiveData(selectedLeague.events, liveEvents);
      
      // Create a more stable sort that preserves existing order when possible
      const sortedEvents = [...mergedEvents].sort((a, b) => {
        // Create a stable identifier for each event
        const idA = `${a.home_team}_vs_${a.away_team}`.replace(/\s+/g, '_');
        const idB = `${b.home_team}_vs_${b.away_team}`.replace(/\s+/g, '_');
        
        // First, try to maintain the order from previous events
        const existingIndexA = previousEventsRef.current.findIndex(event => 
          `${event.home_team}_vs_${event.away_team}`.replace(/\s+/g, '_') === idA
        );
        const existingIndexB = previousEventsRef.current.findIndex(event => 
          `${event.home_team}_vs_${event.away_team}`.replace(/\s+/g, '_') === idB
        );
        
        // If both events existed before, maintain their relative order
        if (existingIndexA !== -1 && existingIndexB !== -1) {
          return existingIndexA - existingIndexB;
        }
        
        // If only one existed before, put the existing one first
        if (existingIndexA !== -1) return -1;
        if (existingIndexB !== -1) return 1;
        
        // For new events, fall back to chronological sorting by commence_time
        const timeA = a.commence_time ? new Date(a.commence_time).getTime() : 0;
        const timeB = b.commence_time ? new Date(b.commence_time).getTime() : 0;
        return timeA - timeB;
      });
      
      setStableEvents(sortedEvents);
      previousEventsRef.current = sortedEvents;
    } else if (selectedLeague && selectedLeague.nodeId) {
      // If no events in selectedLeague, try fallback to liveEvents filtering as backup
      const filteredEvents = liveEvents.filter(event => 
        selectedLeague.name && (
          event.sport_title === selectedLeague.name ||
          event.sport_title?.toLowerCase().includes(selectedLeague.name.toLowerCase()) ||
          selectedLeague.name.toLowerCase().includes(event.sport_title?.toLowerCase() || '')
        )
      );
      
      // Sort the fallback events by name for consistency
      const sortedFallbackEvents = filteredEvents.sort((a, b) => {
        const nameA = `${a.home_team || ''} vs ${a.away_team || ''}`;
        const nameB = `${b.home_team || ''} vs ${b.away_team || ''}`;
        return nameA.localeCompare(nameB);
      });
      
      previousEventsRef.current = sortedFallbackEvents;
      setStableEvents(sortedFallbackEvents);
    } else {
      setStableEvents([]);
      previousEventsRef.current = [];
    }
  }, [selectedLeague?.events, selectedLeague?.name, selectedLeague?.nodeId, liveEvents]);
  
  const handleBackClick = () => {
    // Unsubscribe before clearing the selected league
    if (selectedLeague && selectedLeague.nodeId) {
      unsubscribeFromLeagueEvents(selectedLeague.nodeId);
      unsubscribeFromLeagueCategories(selectedLeague.nodeId);
    }
    dispatch(clearSelectedLeague());
    // Clear stable events when leaving
    setStableEvents([]);
  };

  const handleMarketsClick = (matchData: LiveEvent) => {
    setSelectedMatchForDetail(matchData);
  };

  // Helper function to detect if an event is live
  const isEventLive = (event: LiveEvent): boolean => {
    // Check multiple indicators of live status
    const hasActiveStatus = Boolean(event?.active);
    const hasLiveStatus = event?.status === 'live' || event?.status === 'in_play';
    const hasNotStartedStatus = event?.status === 'not_started' || event?.status === 'upcoming';
    const hasScoreData = event?.scores && Object.keys(event.scores).length > 0;
    const hasLiveData = event?.liveData && Object.keys(event.liveData).length > 0;
    
    // If explicitly marked as not started, it's not live regardless of active status
    if (hasNotStartedStatus) {
      return false;
    }
    
    // For events to be considered live, they should have active status AND either live status or actual live data
    const isLive = hasActiveStatus && (hasLiveStatus || hasScoreData || hasLiveData);
    return isLive;
  };

  if (!selectedLeague || !selectedLeague.name) {
    return null;
  }

  const isLoading = stableEvents.length === 0 && selectedLeague.name !== null;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Conditional rendering: Show MatchDetailView for live events, NoLiveMatchDetailView for non-live events */}
      {selectedMatchForDetail ? (
        isEventLive(selectedMatchForDetail) ? (
          <MatchDetailView 
            matchData={selectedMatchForDetail} 
            onBack={() => setSelectedMatchForDetail(null)}
            onAddBet={onAddBet}
            selectedBets={selectedBets}
          />
        ) : (
          <NoLiveMatchDetailView 
            matchData={selectedMatchForDetail} 
            onBack={() => setSelectedMatchForDetail(null)}
            onAddBet={onAddBet}
            selectedBets={selectedBets}
            favoritedEvents={favoritedEvents}
            onFavoriteToggle={handleFavoriteToggle}
            showCoupon={showCoupon}
          />
        )
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center p-4 border-b dark:border-zinc-700 min-h-[64px]">
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="ml-4 min-w-0 flex-1">
              <h1 className="text-xl font-bold truncate">{selectedLeague.name}</h1>
            </div>
            <div className="ml-2 text-sm text-gray-500 flex-shrink-0 flex items-center">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>({stableEvents.length} events)</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-y-auto scrollbar-thin p-4 min-h-0 ${showCoupon ? 'max-h-[calc(100vh-260px)]' : 'max-h-[calc(100vh-200px)]'}`}>
            {isLoading ? (
              <div className="space-y-6">
                <MatchGroupSkeleton />
                <MatchGroupSkeleton />
              </div>
            ) : (
              <div className="space-y-3">
                {stableEvents.length > 0 ? (
                  stableEvents.map((event) => (
                    <LeagueMatchItem
                      key={event.id}
                      matchData={event}
                      selectedBets={selectedBets}
                      favoritedEvents={favoritedEvents}
                      onAddBet={onAddBet}
                      handleFavoriteToggle={handleFavoriteToggle}
                      onMarketsClick={handleMarketsClick}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No events found for this league.
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LeagueView;
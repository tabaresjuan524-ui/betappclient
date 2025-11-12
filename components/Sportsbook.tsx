import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { SportCategory, initialSportCategories } from '../lib/data/sportCategories';
import { SelectedBet } from "../lib/data/betSlipTypes";
import MatchDetailView from './MatchDetailView';
import { Star, HelpCircle, ChevronDown, Lock, RefreshCw } from "lucide-react";
import { Swiper as SwiperCore } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { LiveEvent, watchMatch, unwatchMatch, initSocket, clearConnectionError } from '../lib/services/sportsService';
import { MatchItemSkeleton, MatchGroupSkeleton } from './SkeletonComponents';

// --- INTERFACES (UNCHANGED) ---
interface SportsbookProps {
    handleCategorySelect: (id: number) => void;
    favoritedEvents: string[];
    handleFavoriteToggle: (eventId: string, eventName: string) => void;
    sportCategories: SportCategory[];
    liveEvents: LiveEvent[];
    loading: boolean;
    apiError: string | null;
    selectedLeague: string | null;
    selectedBets: SelectedBet[];
    onAddBet: (matchData: any, oddKey: string, oddValue: number, oddName: string) => void;
}

interface MatchItemProps {
    matchData: LiveEvent;
    selectedBets: SelectedBet[];
    favoritedEvents: string[];
    onAddBet: (matchData: any, oddKey: string, oddValue: number, oddName: string) => void;
    handleFavoriteToggle: (eventId: string, eventName: string) => void;
    setSelectedMatch: (match: LiveEvent) => void;

}
const renderSetScores = (scores: any) => {
    // Check if the additionalScores and the arrays for home/away exist
    if (!scores?.additionalScores?.home || !scores.additionalScores.away) {
        return null;
    }

    // Combine the home and away scores for each set (e.g., "11-7")
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
const MatchItem = React.memo<MatchItemProps>(({ matchData, selectedBets, favoritedEvents, onAddBet, handleFavoriteToggle, setSelectedMatch }) => {
    const { id, home_team, away_team, scores, markets, commence_time, start_time, startTime, match_time, active, bettingActive } = matchData;
    
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

    // Enhanced date formatting with validation - handles multiple time fields
    const formatMatchTime = (matchData: LiveEvent) => {
        const { commence_time, start_time, startTime, id, home_team, away_team } = matchData;
        
        // Try time fields in priority order - start_time first as it's more stable
        const timeFields = [
            { field: 'start_time', value: start_time },
            { field: 'startTime', value: startTime },
            { field: 'commence_time', value: commence_time }
        ];
        
        // DEBUG: Log all available time fields
        
        for (const { field, value } of timeFields) {
            if (!value || value === 'invalid-date') continue;
            
            try {
                const date = new Date(value);

                // Check if the date is valid
                if (isNaN(date.getTime())) {
                    continue;
                }

                // Additional check: if date is before 2020 or after 2030, it's likely invalid
                const year = date.getFullYear();
                if (year < 2020 || year > 2030) {
                    continue;
                }

                // For future matches, show both date and time
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const matchDate = new Date(date);
                matchDate.setHours(0, 0, 0, 0);

                const formattedResult = matchDate.getTime() === today.getTime() 
                    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                    : date.toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                
                return formattedResult;
                
            } catch (error) {
                continue;
            }
        }
        
        return "Invalid date";
    };

    const formattedTime = formatMatchTime(matchData);
    const displayChanges = oddChanges;

    return (
        <li className="bg-slate-50 dark:bg-slate-900/50 p-3 flex flex-col md:flex-row md:flex-wrap gap-y-3 w-full rounded-lg shadow-sm">            <div className="flex w-full justify-between items-center md:items-start md:w-[30%] md:flex-shrink-0 md:pr-2">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                            {scores ? (
                                <>
                                    <span className="text-xs font-bold text-green-500 whitespace-nowrap">LIVE</span>
                                    {liveTime && liveTime !== "" && (
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{liveTime}</span>
                                    )}
                                    <span className="text-xs font-bold uppercase text-yellow-500 text-center leading-tight">
                                        {matchData.status ? matchData.status.replace(/_/g, ' ') : 'LIVE'}
                                    </span>
                                </>
                            ) : (
                                <span className="text-xs text-slate-500 dark:text-slate-400">{formattedTime}</span>
                            )}
                            {/* SofaScore badge indicator */}
                            {matchData.api_name === 'sofascore' && (
                                <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded font-semibold">
                                    SofaScore
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col space-y-1">
                            {/* Team names and main scores row */}
                            <div className="flex justify-between items-center">
                                <div className="min-w-0 flex-1 pr-2">
                                    <p className="text-sm text-slate-900 dark:text-slate-100 font-medium truncate">{home_team}</p>
                                    <p className="text-sm text-slate-900 dark:text-slate-100 font-medium truncate">{away_team}</p>
                                </div>

                                {/* Main scores only */}
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-semibold">{scores?.home ?? '-'}</p>
                                    <p className="text-sm font-semibold">{scores?.away ?? '-'}</p>
                                </div>
                            </div>

                            {/* Set scores row - appears below when present */}
                            {renderSetScores(scores) && (
                                <div className="flex justify-center">
                                    {renderSetScores(scores)}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            <div className="flex flex-col items-center gap-2 md:hidden ml-4">
                <button onClick={() => handleFavoriteToggle(String(id), `${home_team} vs ${away_team}`)} className="text-slate-500 hover:text-yellow-500 dark:text-slate-400"><Star size={18} className={favoritedEvents.includes(String(id)) ? 'fill-current text-yellow-500' : ''} /></button>
                {/* Show SofaScore button if no markets but SofaScore event */}
                {(!markets || markets.length === 0) && matchData.api_name === 'sofascore' && process.env.NEXT_PUBLIC_SOFASCORE_LIVE_WIDGETS === 'true' ? (
                    <button 
                        onClick={() => setSelectedMatch(matchData)} 
                        className="text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-8 w-8 flex items-center justify-center rounded font-bold transition-all"
                        title="View SofaScore Data"
                    >
                        <span className="text-[10px]">SS</span>
                    </button>
                ) : (
                    <button onClick={() => setSelectedMatch(matchData)} className="text-xs bg-slate-200 h-8 w-8 flex items-center justify-center rounded hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600" disabled={!markets || markets.length === 0}><span className="font-bold text-slate-700 dark:text-slate-300">+{matchData.marketsCount ? matchData.marketsCount : (markets.length || 0)}</span></button>
                )}
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
                                    className={`py-2 px-3 text-[9px] font-semibold whitespace-nowrap transition-colors ${activeMarketKey === market.key ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
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
                                    className={`py-2 px-3 text-[9px] font-semibold transition-colors flex-shrink-0 whitespace-nowrap ${activeMarketKey === market.key ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
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
                                        // UPDATE THE DISABLED LOGIC
                                        disabled={isDisabled || areOddsLocked}
                                        onClick={() => onAddBet(matchData, activeMarketKey, outcome.price, outcome.name)}
                                        className={`relative overflow-hidden flex flex-col items-center justify-center p-2 rounded min-w-[70px] h-10 ${getOddButtonClass(isOddSelected)}`}
                                    >
                                        <span
                                            className={`absolute top-0 left-0 h-0 w-0 border-t-[30px] border-t-green-500 border-r-[30px] border-r-transparent transition-opacity duration-300 ease-in-out ${displayChanges[`${id}-${activeMarketKey}-${outcome.name}`] === 'increased' ? 'opacity-70' : 'opacity-0'}`}
                                        />
                                        <span
                                            className={`absolute bottom-0 right-0 h-0 w-0 border-b-[30px] border-b-red-500 border-l-[30px] border-l-transparent transition-opacity duration-300 ease-in-out ${displayChanges[`${id}-${activeMarketKey}-${outcome.name}`] === 'decreased' ? 'opacity-70' : 'opacity-0'}`}
                                        />
                                        <span className={`text-[9px] ${isOddSelected ? 'text-black' : 'text-slate-600 dark:text-slate-300'}`}>{outcome.name}</span>
                                        <strong className={`text-xs font-semibold ${isOddSelected ? 'text-black' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                            {isDisabled || areOddsLocked ? <Lock size={12} /> : outcome.price.toFixed(2)}
                                        </strong>
                                    </button>
                                );
                            }) : null}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 py-4">Markets not available</div>
                )}
            </div>

            <div className="hidden md:flex md:w-[10%] md:flex-shrink-0 flex-col items-end gap-2 md:pl-2">
                <button onClick={() => handleFavoriteToggle(String(id), `${home_team} vs ${away_team}`)} className="text-slate-500 hover:text-yellow-500 dark:text-slate-400"><Star size={18} className={favoritedEvents.includes(String(id)) ? 'fill-current text-yellow-500' : ''} /></button>

                {markets.length > 0 ?
                    <button onClick={() => setSelectedMatch(matchData)} className="text-xs bg-slate-200 flex items-center justify-center rounded hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600 p-2 px-3" disabled={!markets || markets.length === 0}>
                        <span className="inline-block font-bold text-slate-700 dark:text-slate-300">{matchData.marketsCount ? `+${matchData.marketsCount}` : `+${markets.length}`}</span>
                    </button>
                    : matchData.api_name === 'sofascore' && process.env.NEXT_PUBLIC_SOFASCORE_LIVE_WIDGETS === 'true' ? (
                        <button 
                            onClick={() => setSelectedMatch(matchData)} 
                            className="text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center justify-center rounded font-semibold transition-all p-2 px-3"
                        >
                            <span className="inline-block">View Data</span>
                        </button>
                    )
                    : null
                }

            </div>
        </li>
    );
});
MatchItem.displayName = 'MatchItem';

const Sportsbook: React.FC<SportsbookProps> = React.memo(({
    handleCategorySelect,
    favoritedEvents,
    handleFavoriteToggle,
    sportCategories,
    liveEvents,
    loading,
    apiError,
    selectedLeague,
    selectedBets,
    onAddBet,
}) => {
    // Get league events from Redux
    const { selectedLeague: selectedLeagueData } = useSelector((state: RootState) => state.odds);

    const [selectedMatch, setSelectedMatch] = useState<LiveEvent | null>(null);
    const [openLeagues, setOpenLeagues] = useState<string[]>([]);
    const swiperRef = useRef<SwiperCore | null>(null);
    const activeSportCategory = sportCategories.find((cat) => cat.active);
    const hasInitializedLeagues = useRef(false);
    const [hasInitialData, setHasInitialData] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [stableFilteredMatches, setStableFilteredMatches] = useState<LiveEvent[]>([]);

    // Track if we have received initial data to prevent unnecessary loading states
    useEffect(() => {
        if (liveEvents.length > 0) {
            if (!hasInitialData) {
                setHasInitialData(true);
            }
            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
        }
    }, [liveEvents.length, hasInitialData, isInitialLoad]);

    const sportsbookSportCategories = useMemo(() => {
        return sportCategories.map(category => {
            if (category.id === 1) { // This is the "Live" category.
                return {
                    ...category,
                    liveEventsCount: liveEvents.length // Set the count to the total number of live events.
                };
            }
            return category;
        });
    }, [sportCategories, liveEvents.length]); // Only depend on length, not entire array
    useEffect(() => {
        if (selectedMatch) {
            watchMatch(selectedMatch.id, selectedMatch.api_name);
        }

        return () => {
            if (selectedMatch) {
                unwatchMatch(selectedMatch.id, selectedMatch.api_name);
            }
        };
    }, [selectedMatch]);
    useEffect(() => {
        if (swiperRef.current && activeSportCategory) {
            const activeIndex = sportCategories.findIndex(cat => cat.id === activeSportCategory.id);
            if (activeIndex !== -1) swiperRef.current.slideTo(activeIndex);
        }
    }, [activeSportCategory, sportCategories]);

    useEffect(() => {
        if (selectedMatch && liveEvents.length > 0) {
            const updatedMatch = liveEvents.find(event => event.id === selectedMatch.id);
            if (updatedMatch) {
                setSelectedMatch(updatedMatch);
            }
        }
    }, [liveEvents]);

    // Clear selected match when league selection changes
    useEffect(() => {
        setSelectedMatch(null);
    }, [selectedLeague, selectedLeagueData.name]);

    const getSportIcon = (sportName: string) => {
        const category = initialSportCategories.find(cat =>
            cat.name.toLowerCase() === sportName.toLowerCase() ||
            cat.aliases?.includes(sportName)
        );
        return category ? category.icon : <HelpCircle size={16} />;
    };

    const toggleLeague = (leagueKey: string) => {
        setOpenLeagues(prev => prev.includes(leagueKey) ? prev.filter(key => key !== leagueKey) : [...prev, leagueKey]);
    };

    const filteredMatches = useMemo(() => {
        // Add defensive check to prevent empty results during category transitions
        if (!activeSportCategory || !liveEvents || liveEvents.length === 0) {
            return stableFilteredMatches; // Return previous results instead of empty array
        }

        const matches = liveEvents;
        let result: LiveEvent[] = [];



        if (selectedLeague) {
            result = matches.filter(match => match.sport_title === selectedLeague);
        } else if (activeSportCategory.id === 99) {
            // Combine main live events with league events for favorites filtering
            const allEvents = [...matches];
            if (selectedLeagueData.events && selectedLeagueData.events.length > 0) {
                // Add league events that aren't already in main live events
                const mainEventIds = new Set(matches.map(m => String(m.id)));
                const uniqueLeagueEvents = selectedLeagueData.events.filter(event =>
                    !mainEventIds.has(String(event.id))
                );
                allEvents.push(...uniqueLeagueEvents);
            }

            const filteredFavorites = allEvents.filter(match => favoritedEvents.includes(String(match.id)));
            result = filteredFavorites;
        } else if (activeSportCategory.id === 1 || activeSportCategory.id === 0) {
            result = matches;
        } else {
            result = matches.filter(match =>
                match.sport_group === activeSportCategory.name ||
                activeSportCategory.aliases?.includes(match.sport_group)
            );
        }



        return result;
    }, [activeSportCategory?.id, activeSportCategory?.name, activeSportCategory?.aliases, liveEvents, favoritedEvents, selectedLeague, selectedLeagueData.events, stableFilteredMatches]);

    // Update stable filtered matches when we have valid results (throttled)
    useEffect(() => {
        if (filteredMatches.length > 0) {
            const timeoutId = setTimeout(() => {
                setStableFilteredMatches(filteredMatches);
            }, 50); // Small delay to prevent rapid updates

            return () => clearTimeout(timeoutId);
        } else if (activeSportCategory?.id === 99) {
            // For "My Live" (favorites) category, immediately clear stable matches when empty
            setStableFilteredMatches([]);
        }
    }, [filteredMatches, activeSportCategory?.id]);

    const groupedMatchesBySport = useMemo(() => {
        // Use stableFilteredMatches when filteredMatches is empty to prevent flickering
        const matchesToUse = filteredMatches.length > 0 ? filteredMatches : stableFilteredMatches;

        if (matchesToUse.length === 0) {
            return {};
        }

        return matchesToUse.reduce((acc, match) => {
            const sportGroup = match.sport_group;
            const league = match.sport_title;

            if (!acc[sportGroup]) {
                acc[sportGroup] = {};
            }
            if (!acc[sportGroup][league]) {
                acc[sportGroup][league] = { matches: [] };
            }
            acc[sportGroup][league].matches.push(match);
            return acc;
        }, {} as Record<string, Record<string, { matches: LiveEvent[] }>>);
    }, [filteredMatches, stableFilteredMatches]);

    useEffect(() => {
        const allLeagues = Object.values(groupedMatchesBySport).flatMap(sport => Object.keys(sport));
        if (allLeagues.length > 0 && !hasInitializedLeagues.current) {
            setOpenLeagues(allLeagues);
            hasInitializedLeagues.current = true;
        }
    }, [groupedMatchesBySport]);

    const renderLiveMatches = () => {
        if (apiError) {
            return (
                <div className="px-4 mt-4 text-center">
                    <p className="text-red-500 dark:text-red-400 mb-3">Error: {apiError}</p>
                    <button
                        onClick={() => {
                            clearConnectionError();
                            initSocket();
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reconectar
                    </button>
                </div>
            );
        }

        // Show skeleton during initial load
        if (isInitialLoad && liveEvents.length === 0) {
            return (
                <div className="space-y-4 pb-24">
                    <MatchGroupSkeleton />
                    <MatchGroupSkeleton />
                    <MatchGroupSkeleton />
                </div>
            );
        }

        if (liveEvents.length === 0) {
            return <p className="px-4 text-slate-600 dark:text-zinc-400 mt-4">No live events available at the moment.</p>;
        }

        const sports = Object.keys(groupedMatchesBySport).sort();
        if (sports.length === 0) {
            // If we have live events but no sports after filtering, show empty state
            // However, if we're still in initial load phase and have live events, don't show skeleton
            if (isInitialLoad && liveEvents.length > 0) {
                return <p className="px-4 text-slate-600 dark:text-zinc-400 mt-4">Processing matches...</p>;
            }
            return <p className="px-4 text-slate-600 dark:text-zinc-400 mt-4">No matches available for this selection.</p>;
        } return (
            <div className="space-y-4 pb-24">
                {sports.map((sport) => (
                    <div key={sport} className="space-y-1">
                        {Object.keys(groupedMatchesBySport[sport]).sort().map((league) => {
                            const leagueData = groupedMatchesBySport[sport][league];
                            const isLeagueOpen = openLeagues.includes(league);

                            // Debug league logo data
                            if (leagueData.matches[0]) {
                                                                
                            }

                            return (
                                <div key={league} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                    <button onClick={() => toggleLeague(league)} className="w-full flex items-center justify-between gap-2 px-4 py-3 min-h-[60px]">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <span className="text-yellow-500 flex-shrink-0">{getSportIcon(sport)}</span>
                                            {leagueData.matches[0]?.league_logo && (
                                                <img
                                                    src={leagueData.matches[0].league_logo}
                                                    alt={`${league} logo`}
                                                    className="w-4 h-4 object-cover rounded-sm flex-shrink-0 opacity-80"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                    onLoad={(e) => {
                                                    }}
                                                />
                                            )}
                                            {!leagueData.matches[0]?.league_logo && (
                                                <div style={{ width: '16px', height: '16px', background: 'red', fontSize: '8px', color: 'white', textAlign: 'center' }}>X</div>
                                            )}
                                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{league}</h4>
                                        </div>
                                        <ChevronDown size={20} className={`text-slate-500 dark:text-slate-400 transform transition-transform duration-200 flex-shrink-0 ${isLeagueOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {isLeagueOpen && (
                                        <ul className="space-y-1 p-2">
                                            {leagueData.matches.map((matchData) => (
                                                <MatchItem
                                                    key={matchData.id}
                                                    matchData={matchData}
                                                    selectedBets={selectedBets}
                                                    favoritedEvents={favoritedEvents}
                                                    onAddBet={onAddBet}
                                                    handleFavoriteToggle={handleFavoriteToggle}
                                                    setSelectedMatch={setSelectedMatch}
                                                />
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };


    return (
        <>
            {selectedMatch ? (
                <MatchDetailView
                    matchData={selectedMatch}
                    onBack={() => setSelectedMatch(null)}
                    onAddBet={onAddBet}
                    selectedBets={selectedBets}
                />
            ) : (
                <div className="h-screen flex flex-col">
                    <div className="shrink-0 pb-4">
                        <div className="flex justify-between items-center mb-4 px-4 pt-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sportsbook</h2>
                        </div>

                        {isInitialLoad ? (
                            <div className="px-4" style={{ paddingBottom: 8, paddingTop: 10 }}>
                                <div className="flex animate-pulse space-x-4">
                                    {Array.from({ length: 8 }).map((_, index) => (
                                        <div key={index} className="flex flex-col items-center justify-center gap-1.5 flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-zinc-700 mb-2" />
                                            <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-700 rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            liveEvents.length > 0 && (
                                <Swiper
                                    modules={[Scrollbar]} onSwiper={(swiper) => { swiperRef.current = swiper; }} slidesPerView="auto"
                                    spaceBetween={16} scrollbar={{ draggable: true, hide: false }} className="!px-4 sport-category-swiper"
                                    style={{ paddingBottom: 8, paddingTop: 10 }} observer={true} observeParents={true}
                                >
                                    {sportsbookSportCategories.map((category) => (
                                        <SwiperSlide key={category.id} style={{ width: 'auto' }} className="flex-shrink-0">
                                            <div className="flex flex-col items-center justify-center gap-1.5 cursor-pointer group">
                                                <div className="relative">
                                                    <button onClick={() => handleCategorySelect(category.id)} title={category.name} className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 transition-all duration-200 ${category.active ? "bg-yellow-500 text-black shadow-lg scale-110" : "bg-slate-200 dark:bg-zinc-800 group-hover:bg-slate-300 dark:group-hover:bg-zinc-700"}`}>{category.icon}</button>
                                                    {((category.id === 99 && (category.favoritesCount ?? 0) > 0) || (category.id >= 1 && category.id !== 99 && (category.liveEventsCount ?? 0) > 0)) && (
                                                        <div className="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4 bg-yellow-500 text-black font-semibold text-xs rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                                                            {category.id === 99 ? category.favoritesCount : category.liveEventsCount}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={`text-xs text-center transition-colors ${category.active ? 'text-slate-800 dark:text-white font-semibold' : 'text-slate-600 dark:text-zinc-400'}`}>{category.name}</span>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
                        <div className="px-4">
                            <div className="pb-12">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 mt-4">Live Matches</h3>

                                {/* START MODIFICATION: Conditional rendering for matches section */}
                                {isInitialLoad ? (
                                    <div className="space-y-6">
                                        <MatchGroupSkeleton />
                                        <MatchGroupSkeleton />
                                    </div>
                                ) : (
                                    renderLiveMatches()
                                )}
                                {/* END MODIFICATION */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

export default Sportsbook;
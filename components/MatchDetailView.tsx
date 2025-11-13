import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, HelpCircle, Lock, BarChart3 } from 'lucide-react';
import { SelectedBet } from '../lib/data/betSlipTypes';
import { LiveEvent, getCategoryMarkets, watchMatch, unwatchMatch } from '../lib/services/sportsService';
import { initialSportCategories } from '../lib/data/sportCategories';
import { Skeleton } from '@/components/ui/skeleton';
import { store } from "../store"; // Importa tu store de Redux
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import LiveMatchHeader from './LiveMatchHeader';
import SofascoreWidgetView from './SofascoreWidgetView';

interface MatchDetailViewProps {
    matchData: LiveEvent;
    onBack: () => void;
    onAddBet: (matchData: any, oddKey: string, oddValue: number, oddName: string) => void;
    selectedBets: SelectedBet[];
}

interface MarketDisplayProps {
    market: any;
    matchData: LiveEvent;
    selectedBets: SelectedBet[];
    onAddBet: Function;
    areOddsLocked: boolean;
}

// Helper function to get the sport icon
const getSportIcon = (sportGroup: string) => {
    const category = initialSportCategories.find(cat => cat.name.toLowerCase() === sportGroup.toLowerCase());
    return category ? category.icon : <HelpCircle size={16} />;
};

const MatchStatus = ({ matchData }: { matchData: LiveEvent }) => {
    const [elapsedTime, setElapsedTime] = useState(matchData.match_time || "");

    // Safe date parsing function
    const parseMatchDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            return date;
        } catch (error) {
            
            return new Date(); // Fallback to current date
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (matchData.scores && matchData.match_time && matchData.match_time !== "") {
            // Parse the match time more safely
            const timeStr = matchData.match_time.toString().trim();
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
                        setElapsedTime(`${String(minutes).padStart(2, '0')}'`);
                    }, 1000);
                } else {
                    setElapsedTime("");
                }
            } else {
                setElapsedTime("");
            }
        } else {
            setElapsedTime("");
        }
        
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [matchData.scores, matchData.match_time]);


    if (matchData.scores) {
        if (matchData.match_time && matchData.match_time !== "" && matchData.match_time !== "0" && matchData.match_time !== "-1") {
            return (
                <div className="flex items-center space-x-1.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{matchData.commence_time.replace(/\./g, '/')}</p>

                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                    <span className="text-xs font-bold text-green-500 uppercase">Live {elapsedTime || ""}</span>
                    <span className="text-xs font-bold uppercase text-yellow-500 text-center leading-tight">
                        {matchData.status.replace(/_/g, ' ')}
                    </span>
                </div>
            );
        }
        if (matchData.status) {
            return (
                <div className="flex items-center space-x-1.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{matchData.commence_time.replace(/\./g, '/')}</p>

                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                    <span className="text-xs font-bold text-green-500 uppercase">Live</span>
                    <span className="text-xs font-bold uppercase text-yellow-500 text-center leading-tight">
                        {matchData.status.replace(/_/g, ' ')}
                    </span>
                </div>
            );
        }
    }

    const matchDate = parseMatchDate(matchData.commence_time);
    return (
        <div className="flex flex-col items-center">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{matchDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
        </div>
    );
};

const TeamLogoPlaceholder = () => (
    <div className="w-12 h-12 bg-slate-200 dark:bg-zinc-700 rounded-full flex items-center justify-center mb-2"></div>
);
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
            <div className="flex  flex-wrap justify-center text-xs text-slate-500 dark:text-slate-400 space-x-2 mt-1">
                {combinedSetScores.map((setScore: string, index: number) => (
                    <span key={index}>{setScore}</span>
                ))}
            </div>
        );
    }
    return null;
};
const MarketSkeleton = () => (
    <div className="bg-slate-50 dark:bg-zinc-950/50 rounded-lg">
        <div className="w-full flex justify-between items-center p-2">
            <Skeleton className="h-4 w-32" />
        </div>
        <div className="p-3 border-t border-slate-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-3 rounded-lg">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
            </div>
        </div>
    </div>
);

const MarketDisplay = ({ market, matchData, selectedBets, onAddBet, areOddsLocked }: MarketDisplayProps) => {
    const [oddPrices, setOddPrices] = useState<Record<string, number>>({});
    const [oddChanges, setOddChanges] = useState<Record<string, 'increased' | 'decreased'>>({});
    const isInitialMount = useRef(true);

    useEffect(() => {
        const changes: Record<string, "increased" | "decreased"> = {};
        const newPrices: Record<string, number> = {};

        if (market.outcomes) {
            market.outcomes.forEach((outcome: any) => {
                const oddName = outcome.tpn || outcome.name;
                const newPrice = outcome.price;
                newPrices[oddName] = newPrice;

                if (!isInitialMount.current) {
                    const oldPrice = oddPrices[oddName];
                    if (oldPrice !== undefined && newPrice !== oldPrice) {
                        const key = `${matchData.id}-${market.key}-${oddName}`;
                        changes[key] = newPrice > oldPrice ? "increased" : "decreased";
                    }
                }
            });
        }

        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        setOddPrices(newPrices);

        if (Object.keys(changes).length > 0) {
            setOddChanges(changes);
            const timer = setTimeout(() => {
                setOddChanges({});
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [market.outcomes]);

    const getOddButtonClass = (isSelected: boolean) => isSelected
        ? 'bg-yellow-500 text-black dark:bg-yellow-400 dark:text-slate-900 font-semibold'
        : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700';

    const getOddTextColorClass = (isSelected: boolean) => isSelected ? 'text-black dark:text-slate-900' : 'text-slate-600 dark:text-slate-300';
    const isFetchingMoreMarkets = true;

    return (
        <div className="bg-slate-50 dark:bg-zinc-950/50 rounded-lg">
            <div className="w-full flex justify-between items-center p-2 font-semibold text-xs">
                <span>{market.name}</span>
            </div>
            <div className="p-3 border-t border-slate-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-2">
                {market.outcomes && market.outcomes.map((odd: any, index: number) => {
                    const oddName = odd.tpn || odd.name;
                    const betIdForComparison = `${matchData.id}-${market.key}-${oddName}`;
                    const isSelected = selectedBets.some(b => b.id === betIdForComparison);
                    const oddChangeStatus = oddChanges[betIdForComparison];
                    const isDisabled = odd.suspended;

                    return (
                        <button
                            key={index}
                            disabled={isDisabled || areOddsLocked}
                            onClick={() => onAddBet(matchData, market.key, odd.price, oddName)}
                            className={`relative overflow-hidden p-2 rounded-md text-center transition-colors ${getOddButtonClass(isSelected)}`}
                        >
                            <span
                                className={`absolute top-0 left-0 h-0 w-0 border-t-[30px] border-t-green-500 border-r-[30px] border-r-transparent transition-opacity duration-300 ease-in-out ${oddChangeStatus === 'increased' ? 'opacity-70' : 'opacity-0'}`}
                            />
                            <span
                                className={`absolute bottom-0 right-0 h-0 w-0 border-b-[30px] border-b-red-500 border-l-[30px] border-l-transparent transition-opacity duration-300 ease-in-out ${oddChangeStatus === 'decreased' ? 'opacity-70' : 'opacity-0'}`}
                            />
                            <p className={`text-xs ${getOddTextColorClass(isSelected)}`}>{oddName}</p>
                            <p className="font-bold text-base">
                                {(isDisabled || areOddsLocked) ? <Lock size={14} className="mx-auto" /> : odd.price}
                            </p>
                        </button>
                    );
                })}
            </div>

        </div>
    );
};
const MatchDetailView = React.memo(({ matchData, onBack, onAddBet, selectedBets }: MatchDetailViewProps) => {
    const [markets, setMarkets] = useState<any[]>([]);
    const [initialMarketsCount, setInitialMarketsCount] = useState<number | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const hasUserSelectedTabRef = useRef<boolean>(false); // Use ref for reliable tracking
    const hasInitializedCategoryRef = useRef<boolean>(false); // Use ref for reliable tracking
    const [categoryMarkets, setCategoryMarkets] = useState<Record<string, any[]>>({});
    const categoryMarketsRef = useRef<Record<string, any[]>>({});
    const [isDataStable, setIsDataStable] = useState(false); // Track if category data is loaded
    const [loadingCategories, setLoadingCategories] = useState<Set<string>>(new Set()); // Track which categories are currently loading
    const tabsContainerRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling tabs
    const [categoryLoadAttempts, setCategoryLoadAttempts] = useState<Record<string, number>>({}); // Track load attempts per category
    const { liveEvents } = store.getState().odds;
    
    // SofaScore widget view state
    const [showSofascoreWidget, setShowSofascoreWidget] = useState(false);
    const sofascoreData = useSelector((state: RootState) => state.odds.sofascore.data);
    const sofascoreWidgetsEnabled = process.env.NEXT_PUBLIC_SOFASCORE_LIVE_WIDGETS === 'true';
    
    // Check if SofaScore data is available for this match
    const hasSofascoreData = useMemo(() => {
        console.log('🔍 Checking SofaScore data availability:', {
            matchId: matchData.id,
            apiName: matchData.api_name,
            widgetsEnabled: sofascoreWidgetsEnabled,
            hasSofascoreData: !!sofascoreData,
            hasSports: !!sofascoreData?.sports
        });
        
        if (!sofascoreData || !sofascoreData.sports || matchData.api_name !== 'sofascore') {
            console.log('❌ No SofaScore data or not a SofaScore match');
            return false;
        }
        
        // Find the sport this event belongs to
        for (const [sportName, sportData] of Object.entries(sofascoreData.sports)) {
            const sportDataTyped = sportData as any;
            const hasEvent = sportDataTyped?.liveEvents?.events?.some((e: any) => e.id === matchData.id);
            
            if (hasEvent) {
                // CRITICAL: Also check if event has detailedData (not just liveEvent entry)
                const eventId = matchData.id.toString();
                const hasDetailedData = sportDataTyped?.events?.[eventId];
                
                if (!hasDetailedData) {
                    console.log('⚠️  Event found in liveEvents but no detailedData yet (still fetching)');
                    return false;
                }
                
                console.log('✅ Found SofaScore data for match in sport:', sportName);
                return true;
            }
        }
        console.log('❌ Match not found in SofaScore data');
        return false;
    }, [sofascoreData, matchData.id, matchData.api_name, sofascoreWidgetsEnabled]);

    useEffect(() => {
        // Only update markets if we don't have stable category data yet
        if (matchData?.markets && !isDataStable) {
            
            setMarkets(matchData.markets);
        } else if (isDataStable) {
            
        }
    }, [matchData, isDataStable]);

    // Reset user selection state when match changes
    useEffect(() => {
        hasUserSelectedTabRef.current = false;
        hasInitializedCategoryRef.current = false;
        setSelectedCategory('');
        setCategories([]);
        setCategoryMarkets({});
        categoryMarketsRef.current = {};
        setLoadingCategories(new Set());
        setCategoryLoadAttempts({});
        setIsDataStable(false);
        
    }, [matchData.id]);

    // Debug: Monitor selectedCategory changes and auto-scroll active tab
    useEffect(() => {
        
        
        // Auto-scroll the active tab into view with a small delay to ensure DOM update
        if (selectedCategory && tabsContainerRef.current) {
            setTimeout(() => {
                const activeButton = tabsContainerRef.current?.querySelector(`[data-category-id="${selectedCategory}"]`) as HTMLElement;
                if (activeButton) {
                    activeButton.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            }, 100);
        }
    }, [selectedCategory]);

    useEffect(() => {
        const event = liveEvents.find((e: LiveEvent) => e.id === matchData.id);
        const marketsCount = event ? event.markets.length : 0;
        if (initialMarketsCount && marketsCount > initialMarketsCount) {
            setIsFetching(false);
        }
    }, [liveEvents])
    
    // Listen for category data when match is watched
    useEffect(() => {
        const handleMatchCategoryData = (event: CustomEvent) => {
            
            const { matchId, categories, markets } = event.detail;
            
            
            
            if (matchId == matchData.id) { // Use == for type coercion
                
                
                
                
                // Temporarily show all categories (remove IsRelevant filter for debugging)
                // const relevantCategories = categories.filter((cat: any) => cat.IsRelevant);
                const relevantCategories = categories; // Show all categories
                
                // Check if categories actually changed to avoid unnecessary updates
                const categoriesChanged = JSON.stringify(relevantCategories) !== JSON.stringify(categories);
                
                
                
                setCategories(relevantCategories);
                
                // Set first category as selected by default ONLY if we haven't initialized yet AND no category is selected AND user hasn't selected
                if (relevantCategories.length > 0 && 
                    !hasInitializedCategoryRef.current && 
                    !hasUserSelectedTabRef.current && 
                    !selectedCategory) {
                    
                    const firstCategoryId = relevantCategories[0].CategoryId;
                    
                    
                    // Ensure we set both the category and load its content immediately
                    setSelectedCategory(firstCategoryId);
                    hasInitializedCategoryRef.current = true;
                    
                    // Automatically load markets for the default selected category
                    if (matchData.api_name === 'codere') {
                        
                        setLoadingCategories(prev => new Set(Array.from(prev).concat(firstCategoryId)));
                        // Track load attempts for auto-load
                        setCategoryLoadAttempts(prev => ({
                            ...prev,
                            [firstCategoryId]: 1
                        }));
                        getCategoryMarkets(matchData.id.toString(), firstCategoryId);
                    }
                } else {
                    
                }
                
                setIsDataStable(true); // Mark data as stable to prevent overwrites
                
                if (markets && markets.length > 0) {
                    
                    // Store all markets for backup/fallback
                    setMarkets(markets);
                    
                    // CRITICAL FIX: Only initialize categories that don't already have markets loaded
                    const currentCategoryMarkets = categoryMarketsRef.current;
                    const marketsByCategory: Record<string, any[]> = { ...currentCategoryMarkets };
                    let hasExistingMarkets = false;
                    
                    // Check if any category already has markets loaded
                    categories.forEach((category: any) => {
                        if (marketsByCategory[category.CategoryId] && marketsByCategory[category.CategoryId].length > 0) {
                            hasExistingMarkets = true;
                            
                        }
                    });
                    
                    // Only initialize empty arrays if no markets exist yet
                    if (!hasExistingMarkets) {
                        
                        categories.forEach((category: any) => {
                            if (!marketsByCategory[category.CategoryId]) {
                                marketsByCategory[category.CategoryId] = []; // Empty - will trigger load on tab click
                            }
                            
                        });
                        setCategoryMarkets(marketsByCategory);
                        categoryMarketsRef.current = marketsByCategory;
                    } else {
                        
                        // Just ensure new categories are added if they don't exist
                        let needsUpdate = false;
                        categories.forEach((category: any) => {
                            if (!marketsByCategory[category.CategoryId]) {
                                marketsByCategory[category.CategoryId] = [];
                                needsUpdate = true;
                                
                            }
                        });
                        if (needsUpdate) {
                            setCategoryMarkets(marketsByCategory);
                            categoryMarketsRef.current = marketsByCategory;
                        }
                    }
                } else {
                    
                    // If no markets in category data, keep existing markets
                    const marketsByCategory: Record<string, any[]> = { ...categoryMarkets };
                    categories.forEach((category: any) => {
                        if (!marketsByCategory[category.CategoryId]) {
                            marketsByCategory[category.CategoryId] = []; // Will trigger fetch on tab click
                        }
                    });
                    setCategoryMarkets(marketsByCategory);
                    categoryMarketsRef.current = marketsByCategory;
                }
            } else {
                
            }
        };

        const handleCategoryMarkets = (event: CustomEvent) => {
            
            
            
            
            
            const { matchId, categoryId, markets } = event.detail;
            if (String(matchId) === String(matchData.id)) {
                
                
                setCategoryMarkets(prev => {
                    const updated = {
                        ...prev,
                        [categoryId]: markets || []
                    };
                    // Update ref immediately
                    categoryMarketsRef.current = updated;
                    
                    return updated;
                });
                
                // Remove from loading state
                setLoadingCategories(prev => {
                    const newState = new Set(prev);
                    newState.delete(categoryId);
                    
                    return newState;
                });
            } else {
                
                
                
            }
        };

        const handleMatchGames = (event: CustomEvent) => {
            
            
            
            
            const { matchId, categoryId, data } = event.detail;
            if (String(matchId) === String(matchData.id)) {
                
                
                // Transform the data to markets format (similar to categoryMarkets)
                const markets = data || [];
                
                setCategoryMarkets(prev => {
                    const updated = {
                        ...prev,
                        [categoryId]: markets
                    };
                    // Update ref immediately
                    categoryMarketsRef.current = updated;
                    
                    return updated;
                });
                
                // Remove from loading state
                setLoadingCategories(prev => {
                    const newState = new Set(prev);
                    newState.delete(categoryId);
                    
                    return newState;
                });
            } else {
                
                
                
            }
        };

        
        document.addEventListener('matchCategoryData', handleMatchCategoryData as EventListener);
        document.addEventListener('categoryMarkets', handleCategoryMarkets as EventListener);
        document.addEventListener('matchGames', handleMatchGames as EventListener);
        
        return () => {
            
            document.removeEventListener('matchCategoryData', handleMatchCategoryData as EventListener);
            document.removeEventListener('categoryMarkets', handleCategoryMarkets as EventListener);
            document.removeEventListener('matchGames', handleMatchGames as EventListener);
        };
    }, [matchData.id]);
    
    // Helper function to get markets for the selected category - memoized to prevent re-renders
    const getMarketsForCategory = useCallback((categoryId: string) => {
        if (categoryId === 'view_all') {
            
            return markets;
        }
        const categorySpecificMarkets = categoryMarkets[categoryId] || [];
        
        
        
        if (categorySpecificMarkets.length > 0) {
            
        }
        return categorySpecificMarkets;
    }, [markets, categoryMarkets]);
    
    // Handle tab change - request category data if not already loaded
    // Direct category change handler - memoized to prevent re-renders
    const changeCategory = useCallback((categoryId: string) => {
        
        
        // Defensive check - don't proceed if categoryId is invalid
        if (!categoryId || categoryId === 'default') {
            
            return;
        }
        
        // Don't change if it's the same category
        if (categoryId === selectedCategory) {
            
            return;
        }
        
        // IMMEDIATELY set loading state BEFORE changing category to prevent race conditions
        if (matchData.api_name === 'codere') {
            const existingMarkets = categoryMarkets[categoryId];
            if (!existingMarkets || existingMarkets.length === 0) {
                
                setLoadingCategories(prev => new Set(Array.from(prev).concat(categoryId)));
                setCategoryLoadAttempts(prev => ({
                    ...prev,
                    [categoryId]: (prev[categoryId] || 0) + 1
                }));
            }
        }
        
        setSelectedCategory(categoryId);
        hasUserSelectedTabRef.current = true; // Mark that user has manually selected a tab
        hasInitializedCategoryRef.current = true; // Also mark as initialized to prevent future auto-selection
        
        
        
        // Request markets if we don't have them for this category
        if (matchData.api_name === 'codere') {
            const existingMarkets = categoryMarkets[categoryId];
            // Only request if we have no markets at all for this category
            if (!existingMarkets || existingMarkets.length === 0) {
                
                // Loading state already set above
                getCategoryMarkets(matchData.id.toString(), categoryId);
            } else {
                
            }
        }
    }, [selectedCategory, matchData.api_name, matchData.id, categoryMarkets]);
    
    // Auto-trigger loading for selected categories that haven't been loaded yet
    useEffect(() => {
        if (selectedCategory && 
            selectedCategory !== '' && 
            selectedCategory !== 'default' && 
            matchData.api_name === 'codere') {
            
            const existingMarkets = categoryMarkets[selectedCategory];
            const loadAttempts = categoryLoadAttempts[selectedCategory] || 0;
            const isLoading = loadingCategories.has(selectedCategory);
            
            // Only auto-trigger if we haven't tried loading and aren't currently loading
            if ((!existingMarkets || existingMarkets.length === 0) && 
                loadAttempts === 0 && 
                !isLoading) {
                
                
                
                setLoadingCategories(prev => new Set(Array.from(prev).concat(selectedCategory)));
                setCategoryLoadAttempts(prev => ({
                    ...prev,
                    [selectedCategory]: 1
                }));
                
                // Small delay to ensure state is updated
                setTimeout(() => {
                    getCategoryMarkets(matchData.id.toString(), selectedCategory);
                }, 100);
            }
        }
    }, [selectedCategory, matchData.api_name, matchData.id]); // Remove categoryMarkets dependency to prevent loops
    
    // Prevent category markets from being lost when new data arrives
    useEffect(() => {
        
        Object.keys(categoryMarkets).forEach(catId => {
            
        });
    }, [categoryMarkets]);
    
    // Track selectedCategory changes
    useEffect(() => {
        
    }, [selectedCategory]);
    
    // Watch match for category data when component mounts
    useEffect(() => {
        
        watchMatch(matchData.id, matchData.api_name);
        
        // Cleanup: unwatch when component unmounts or match changes
        return () => {
            
            unwatchMatch(matchData.id, matchData.api_name);
        };
    }, [matchData.id, matchData.api_name]);
    
    useEffect(() => {
        const event = liveEvents.find((e: LiveEvent) => e.id === matchData.id);
        const marketsCount = event ? event.markets.length : 0;
        setInitialMarketsCount(marketsCount);
    }, [])
    
    // If showing SofaScore widget view, render that instead
    if (showSofascoreWidget && hasSofascoreData) {
        // Find the sport name for this event
        let sportName = '';
        for (const [sport, sportData] of Object.entries(sofascoreData.sports)) {
            const sportDataTyped = sportData as any;
            if (sportDataTyped?.liveEvents?.events?.some((e: any) => e.id === matchData.id)) {
                sportName = sport;
                break;
            }
        }
        
        return (
            <SofascoreWidgetView 
                matchId={matchData.id || 0}
                sportName={sportName}
                onBack={() => setShowSofascoreWidget(false)}
            />
        );
    }
    
    return (
        <div className="flex flex-col h-screen bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100">
            <header className="shrink-0 border-b border-slate-200 dark:border-zinc-800">
                {/* Live Match Header with Sport Background */}
                <LiveMatchHeader 
                    event={matchData}
                    sportCategories={initialSportCategories}
                    className=""
                    onBack={onBack}
                />
                
                {/* SofaScore Widget Button */}
                {(() => {
                    console.log('🔍 Button render check:', {
                        sofascoreWidgetsEnabled,
                        hasSofascoreData,
                        shouldShow: sofascoreWidgetsEnabled && hasSofascoreData
                    });
                    return sofascoreWidgetsEnabled && hasSofascoreData ? (
                        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-900/30">
                            <button
                                onClick={() => {
                                    console.log('✅ Opening SofaScore widget view');
                                    setShowSofascoreWidget(true);
                                }}
                                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md"
                            >
                                <BarChart3 size={18} />
                                <span>View SofaScore Live Data & Stats</span>
                            </button>
                        </div>
                    ) : null;
                })()}
            </header>

            {/* Manual Tab Implementation */}
            <div className="flex-1 flex flex-col p-4 min-h-0">
                {(() => {
                    //
                    return null;
                })()}
                
                {/* Show tabs if we have categories, otherwise show a fallback */}
                {categories.length > 0 ? (
                    <>
                        {(() => {
                            //
                            return null;
                        })()}
                        {/* Tab Headers */}
                        <div className="border-b dark:border-zinc-700 bg-white dark:bg-zinc-900">
                            <div ref={tabsContainerRef} className="flex overflow-x-auto scrollbar-hide relative">
                                {categories.map((category) => (
                                    <button 
                                        key={category.CategoryId}
                                        data-category-id={category.CategoryId}
                                        onClick={() => {
                                           // 
                                            changeCategory(category.CategoryId);
                                        }}
                                        className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap relative ${
                                            selectedCategory === category.CategoryId
                                                ? 'text-yellow-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-yellow-500 after:rounded-t-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-yellow-500/50 hover:after:rounded-t-sm'
                                        }`}
                                    >
                                        {category.CategoryName}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 mt-4 overflow-y-scroll scrollbar-thin min-h-0">
                            <div className="space-y-2 md:grid md:grid-cols-2 md:gap-2 md:space-y-0 p-2.5 pb-32">
                                {(() => {
                                    const marketsForCategory = getMarketsForCategory(selectedCategory);
                                    
                                    
                                    const isLoading = loadingCategories.has(selectedCategory);
                                    const loadAttempts = categoryLoadAttempts[selectedCategory] || 0;
                                    const hasTriedLoading = loadAttempts > 0;
                                    
                                    
                                    
                                    
                                    
                                    
                                    if (marketsForCategory.length > 0) {
                                        
                                        return marketsForCategory.map((market: any, index: number) => {
                                            const areOddsLocked = !matchData.active || !matchData.bettingActive;
                                            return (
                                                <MarketDisplay 
                                                    key={`${selectedCategory}-${market.key}-${index}`} 
                                                    market={market} 
                                                    matchData={matchData} 
                                                    selectedBets={selectedBets} 
                                                    onAddBet={onAddBet} 
                                                    areOddsLocked={areOddsLocked} 
                                                />
                                            );
                                        });
                                    } else if (isLoading) {
                                        
                                        return (
                                            <div className="space-y-4">
                                                <MarketSkeleton />
                                                <MarketSkeleton />
                                                <MarketSkeleton />
                                            </div>
                                        );
                                    } else if (hasTriedLoading) {
                                        
                                        
                                        return (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <div className="text-slate-400 dark:text-slate-500 mb-2">
                                                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm">No markets available for this category</p>
                                                <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Try selecting another category</p>
                                                <button 
                                                    onClick={() => {
                                                        
                                                        changeCategory(selectedCategory);
                                                    }}
                                                    className="mt-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-md text-sm font-medium transition-colors"
                                                >
                                                    Retry
                                                </button>
                                            </div>
                                        );
                                    } else {
                                        
                                        return (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <p className="text-slate-500 dark:text-slate-400 text-sm">Select a category to view markets</p>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        </div>
                    </>
                ) : (
                    /* Fallback: Show original markets when no categories available */
                    <div className="flex-1 mt-4 overflow-y-scroll scrollbar-thin min-h-0">
                        {(() => {
                            
                            
                            return null;
                        })()}
                        
                        {markets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="text-6xl mb-4">ðŸ€</div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    Loading Match Details
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                    Fetching betting markets for {matchData.home_team} vs {matchData.away_team}
                                </p>
                                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 w-48 rounded mb-2"></div>
                                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 w-32 rounded"></div>
                            </div>
                        ) : (
                            <div className="space-y-2 md:grid md:grid-cols-2 md:gap-2 md:space-y-0 p-2.5 pb-32">
                                {markets.map((market: any, index: number) => {
                                    const areOddsLocked = !matchData.active || !matchData.bettingActive;
                                    return (
                                        <MarketDisplay
                                            key={`fallback-${market.key}-${index}`}
                                            market={market}
                                            matchData={matchData}
                                            selectedBets={selectedBets}
                                            onAddBet={onAddBet}
                                            areOddsLocked={areOddsLocked}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
});

MatchDetailView.displayName = 'MatchDetailView';

export default MatchDetailView;

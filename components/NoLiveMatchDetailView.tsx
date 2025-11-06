import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { LiveEvent, subscribeToMatchCategories, unsubscribeFromMatchCategories, subscribeToMatchGames, unsubscribeFromMatchGames } from '../lib/services/sportsService';

interface Market {
  name: string;
  key: string;
  outcomes: Array<{
    name: string;
    price: number;
    point?: string;
    suspended: boolean;
    oddChange: number;
  }>;
}

interface Category {
  CategoryId: number;
  CategoryName: string;
  CategoryInfo: string;
}

interface NoLiveMatchDetailViewProps {
  matchData: LiveEvent;
  onBack: () => void;
  onAddBet: (match: any, marketKey: string, price: number, outcomeName: string) => void;
  selectedBets: any[];
  favoritedEvents: string[];
  onFavoriteToggle: (eventId: string, eventName: string) => void;
  showCoupon?: boolean;
}

const NoLiveMatchDetailView: React.FC<NoLiveMatchDetailViewProps> = ({
  matchData,
  onBack,
  onAddBet,
  selectedBets,
  favoritedEvents,
  onFavoriteToggle,
  showCoupon
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketsLoading, setMarketsLoading] = useState(false);

  const { id, home_team, away_team, commence_time, startTime } = matchData;

  // Format the start time and create header
  const formatMatchHeader = () => {
    // Try multiple time fields in priority order - start_time first as it's more stable
    const timeFields = [
      { field: 'start_time', value: matchData.start_time },
      { field: 'startTime', value: matchData.startTime || startTime },
      { field: 'commence_time', value: matchData.commence_time || commence_time }
    ];
    
    let dateString = null;
    for (const { field, value } of timeFields) {
      if (value && value !== 'invalid-date') {
        dateString = value;
        break;
      }
    }

    let date: Date | null = null;
    let formattedDate: string;
    let formattedTime: string;

    // If no date string is available, show invalid date
    if (!dateString) {
      formattedDate = "Invalid date";
      formattedTime = "Invalid date";
    } else {
      try {
        // Try to parse the date string
        date = new Date(dateString);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        
        formattedDate = date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        formattedTime = date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
      } catch (error) {
        // Show invalid date instead of current date
        formattedDate = "Invalid date";
        formattedTime = "Invalid date";
      }
    }

    return {
      date: formattedDate,
      participants: `${home_team} vs ${away_team}`
    };
  };

  const headerInfo = formatMatchHeader();

  const isSelected = (marketKey: string, outcomeName: string): boolean => {
    if (!marketKey || !outcomeName) return false;
    const betIdForCheck = `${id}-${marketKey}-${outcomeName}`;
    return selectedBets.some(bet => bet.id === betIdForCheck);
  };

  const getOddButtonClass = (isSelected: boolean) => isSelected
    ? 'bg-yellow-500 text-black dark:bg-yellow-400 dark:text-slate-900 font-semibold'
    : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700';

  // Listen for categories data from WebSocket
  useEffect(() => {
    const handleCategoriesData = (event: CustomEvent) => {
      const { matchId, data } = event.detail;
      if (String(matchId) === String(id)) {
        setCategories(data || []);
        if (data && data.length > 0) {
          setSelectedCategory(data[0]);
        }
        setLoading(false);
      }
    };

    document.addEventListener('matchCategories', handleCategoriesData as EventListener);

    return () => {
      document.removeEventListener('matchCategories', handleCategoriesData as EventListener);
    };
  }, [id]);

  // Listen for games data from WebSocket
  useEffect(() => {
    const handleGamesData = (event: CustomEvent) => {
      const { matchId, categoryId, data } = event.detail;

      if (String(matchId) === String(id) && selectedCategory && String(categoryId) === String(selectedCategory.CategoryId)) {

        // Transform games data to markets format
        const transformedMarkets: Market[] = data?.map((game: any) => ({
          name: game.Name || selectedCategory.CategoryName,
          key: game.NodeId || `${selectedCategory.CategoryId}_market`,
          outcomes: game.Results?.map((result: any) => ({
            name: result.Name,
            price: result.Odd || 0,
            point: result.GameSpecialOddsValue?.replace(/<Spov>|<\/Spov>/g, '') || '',
            suspended: result.Locked || false,
            oddChange: 0,
          })) || [],
        })) || [];

        setMarkets(transformedMarkets);
        setMarketsLoading(false);
      } else {
        // Ignoring non-matching event
      }
    };

    const handleCategoryMarkets = (event: CustomEvent) => {
      const { matchId, categoryId, markets: marketData } = event.detail;

      if (String(matchId) === String(id) && selectedCategory && String(categoryId) === String(selectedCategory.CategoryId)) {
        // Markets are already in the correct format
        setMarkets(marketData || []);
        setMarketsLoading(false);
      } else {
        // Ignoring non-matching event
      }
    };

    document.addEventListener('matchGames', handleGamesData as EventListener);
    document.addEventListener('categoryMarkets', handleCategoryMarkets as EventListener);

    return () => {
      document.removeEventListener('matchGames', handleGamesData as EventListener);
      document.removeEventListener('categoryMarkets', handleCategoryMarkets as EventListener);
    };
  }, [id, selectedCategory]);

  // Fetch categories when component mounts
  useEffect(() => {
    subscribeToMatchCategories(String(id));

    // Cleanup on unmount
    return () => {
      unsubscribeFromMatchCategories(String(id));
    };
  }, [id]);

  // Fetch markets when selected category changes
  useEffect(() => {
    if (!selectedCategory) return;

    setMarketsLoading(true);

    // Subscribe to get games for this match and category
    subscribeToMatchGames(String(id), String(selectedCategory.CategoryId));

    // Cleanup previous category subscription
    return () => {
      if (selectedCategory) {
        unsubscribeFromMatchGames(String(id), String(selectedCategory.CategoryId));
      }
    };
  }, [selectedCategory, id]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800">
        <button
          onClick={onBack}
          className="flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft size={20} />
          <span className="ml-2">Back</span>
        </button>

        <button
          onClick={() => onFavoriteToggle(String(id), `${home_team} vs ${away_team}`)}
          className="text-slate-500 hover:text-yellow-500 dark:text-slate-400"
        >
          <Star size={20} className={favoritedEvents.includes(String(id)) ? 'fill-current text-yellow-500' : ''} />
        </button>
      </div>

      {/* Match Info Header */}
      <div className="text-center py-4 bg-slate-50 dark:bg-zinc-800 border-b dark:border-zinc-700">
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
          {headerInfo.date}
        </div>
        <div className="text-lg font-bold text-slate-900 dark:text-white">
          {headerInfo.participants}
        </div>
      </div>

      {/* Categories Tabs */}
      {!loading && categories.length > 0 && (
        <div className="border-b dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="flex overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.CategoryId}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory?.CategoryId === category.CategoryId
                  ? 'border-b-2 border-yellow-500 text-yellow-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent hover:border-yellow-500'
                  }`}
              >
                {category.CategoryName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 overflow-y-auto scrollbar-thin p-4 min-h-0 ${showCoupon ? 'max-h-[calc(100vh-260px)]' : 'max-h-[calc(100vh-200px)]'}`}>
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-50 dark:bg-zinc-800 rounded-lg p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded w-1/3 mb-3"></div>
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-10 bg-slate-200 dark:bg-zinc-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : marketsLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-50 dark:bg-zinc-800 rounded-lg p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded w-1/4 mb-3"></div>
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-10 bg-slate-200 dark:bg-zinc-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 md:grid md:grid-cols-2 md:gap-2 md:space-y-0 p-2.5 pb-32">
            {markets.map((market) => (
              <div key={market.key} className="bg-slate-50 dark:bg-zinc-950/50 rounded-lg">
                <div className="w-full flex justify-between items-center p-2 font-semibold text-xs">
                  <span>{market.name}</span>
                </div>
                <div className="p-3 border-t border-slate-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {market.outcomes.map((outcome) => {
                    const isOddSelected = isSelected(market.key, outcome.name);
                    return (
                      <button
                        key={outcome.name}
                        disabled={outcome.suspended}
                        onClick={() => onAddBet(matchData, market.key, outcome.price, outcome.name)}
                        className={`relative overflow-hidden p-2 rounded-md text-center transition-colors ${getOddButtonClass(isOddSelected)}`}
                      >
                        <p className={`text-xs ${isOddSelected ? 'text-black dark:text-slate-900' : 'text-slate-600 dark:text-slate-300'}`}>
                          {outcome.name}
                        </p>
                        <p className="font-bold text-base">
                          {outcome.suspended ? 'Suspended' : outcome.price.toFixed(2)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoLiveMatchDetailView;

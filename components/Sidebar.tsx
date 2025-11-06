import React from 'react';
import { Shield, Swords, Star, Settings, MessageSquare, Users, TrendingUp, HelpCircle } from 'lucide-react';
import { FaTrophy, FaChess, FaGamepad } from 'react-icons/fa';
import { GiAmericanFootballBall, GiSoccerBall, GiBasketballBall, GiTennisBall } from 'react-icons/gi';
import Image from 'next/image';
import { CodereLeftMenuSport } from '../lib/services/sportsService';
import { ChevronDown } from 'lucide-react';
import { getLeaguesForSport, getEventsForLeague, subscribeToLeagues, unsubscribeFromLeagues, subscribeToLeagueEvents, unsubscribeFromLeagueEvents } from '../lib/services/sportsService';
import { useDispatch } from 'react-redux';
import { setSelectedLeague as setSelectedLeagueRedux, clearSelectedLeague } from '../store/slices/oddsSlice';
import { SidebarSkeleton } from './SkeletonComponents';
import { getLeagueLogoUrl, getCountryLogoUrl } from '../lib/utils/leagueLogos';

interface SidebarProps {
  activeView: string | null;
  setActiveView: (view: string | null) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  isDesktopSidebarOpen: boolean;
  sidebarData: { sport: string, leagues: string[] }[];
  setSelectedLeague: (league: string | null) => void;
  selectedLeague: string | null;
  codereSports: CodereLeftMenuSport[];
  onLeagueSelect: (leagueName: string, leagueNodeId: string) => void;
  onCategorySelect: (categoryId: number) => void;
  sportCategories: any[];
}

const navLinks = [
  { name: 'Sportsbook', icon: <Swords size={20} />, view: 'sport' },
  { name: 'Casino', icon: <FaGamepad size={20} />, view: 'casino' },
  { name: 'Leaderboard', icon: <FaTrophy size={20} />, view: 'leaderboard' },
  { name: 'Promotions', icon: <TrendingUp size={20} />, view: 'promotions' },
  { name: 'Affiliates', icon: <Users size={20} />, view: 'affiliates' },
];

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  isDesktopSidebarOpen,
  sidebarData,
  setSelectedLeague,
  selectedLeague,
  codereSports,
  onLeagueSelect,
  onCategorySelect,
  sportCategories
}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState('topLeagues');
  const [expandedSports, setExpandedSports] = React.useState<string[]>([]);
  const [loadingSports, setLoadingSports] = React.useState<string[]>([]);
  const [expandedCountries, setExpandedCountries] = React.useState<string[]>([]);
  const [activeLeague, setActiveLeague] = React.useState<string | null>(null);

  // Function to map sport group names to sport handles
  const getSportHandleFromName = (sportName: string): string => {
    const lowerName = sportName.toLowerCase();
    
    // Direct mappings based on sport group names from API data
    if (lowerName.includes('e-football') || lowerName.includes('e-fútbol')) {
      return 'efootball';
    } else if (lowerName.includes('football') || lowerName.includes('fútbol') || lowerName.includes('soccer')) {
      return 'soccer';
    } else if (lowerName.includes('basketball') || lowerName.includes('baloncesto')) {
      return 'basketball';
    } else if (lowerName.includes('table tennis') || lowerName.includes('tenis de mesa')) {
      return 'table_tennis';
    } else if (lowerName.includes('tennis') || lowerName.includes('tenis')) {
      return 'tennis';
    } else if (lowerName.includes('american football') || lowerName.includes('fútbol americano')) {
      return 'american_football';
    } else if (lowerName.includes('baseball') || lowerName.includes('béisbol')) {
      return 'baseball';
    } else if (lowerName.includes('hockey') || lowerName.includes('hielo')) {
      return 'ice_hockey';
    } else if (lowerName.includes('golf')) {
      return 'golf';
    } else if (lowerName.includes('volleyball') || lowerName.includes('voleibol')) {
      return 'volleyball';
    } else if (lowerName.includes('cricket')) {
      return 'cricket';
    } else if (lowerName.includes('rugby union')) {
      return 'rugby_union';
    } else if (lowerName.includes('rugby')) {
      return 'rugby_league';
    } else if (lowerName.includes('boxing') || lowerName.includes('boxeo')) {
      return 'boxeo';
    } else if (lowerName.includes('martial arts') || lowerName.includes('artes marciales') || lowerName.includes('mma') || lowerName.includes('ufc')) {
      return 'artes_marciales';
    } else if (lowerName.includes('cycling') || lowerName.includes('ciclismo')) {
      return 'cycling';
    } else if (lowerName.includes('darts') || lowerName.includes('dardos')) {
      return 'darts';
    } else if (lowerName.includes('badminton')) {
      return 'badminton';
    } else if (lowerName.includes('handball') || lowerName.includes('balonmano')) {
      return 'handball';
    } else if (lowerName.includes('motor')) {
      return 'motor';
    } else if (lowerName.includes('esports')) {
      return 'esports';
    } else if (lowerName.includes('politics') || lowerName.includes('politica') || lowerName.includes('cine')) {
      return 'politics';
    } else if (lowerName.includes('e-basket')) {
      return 'ebasket';
    } else if (lowerName.includes('futsal')) {
      return 'futsal';
    } else if (lowerName.includes('snooker')) {
      return 'snooker';
    } else if (lowerName.includes('pádel') || lowerName.includes('padel')) {
      return 'padel';
    }
    
    return 'soccer'; // default fallback
  };

  const getSportIcon = (sportName: string) => {
    switch (sportName.toLowerCase()) {
      case 'soccer': return React.createElement("span", { className: "text-lg" }, "⚽");
      case 'baloncesto': 
      case 'basketball': return React.createElement("span", { className: "text-lg" }, "🏀");
      case 'american_football': 
      case 'american-football': return <GiAmericanFootballBall size={18} />;
      case 'tennis': return <GiTennisBall size={18} />;
      case 'artes_marciales':
      case 'mma': return React.createElement("span", { className: "text-lg" }, "🥋");
      case 'badminton': return React.createElement("span", { className: "text-lg" }, "🏸");
      case 'handball':
      case 'balonmano': return React.createElement("span", { className: "text-lg" }, "🤾");
      case 'baseball':
      case 'béisbol': return React.createElement("span", { className: "text-lg" }, "⚾");
      case 'boxeo': return React.createElement("span", { className: "text-lg" }, "🥊");
      case 'cycling':
      case 'ciclismo': return React.createElement("span", { className: "text-lg" }, "🚴");
      case 'cine': return React.createElement("span", { className: "text-lg" }, "🎬");
      case 'darts': return React.createElement("span", { className: "text-lg" }, "🎯");
      case 'ebasket': return React.createElement("span", { className: "text-lg" }, "🏀");
      case 'efootball': return React.createElement("span", { className: "text-lg" }, "⚽");
      case 'esports': return React.createElement("span", { className: "text-lg" }, "🎮");
      case 'futsal': return React.createElement("span", { className: "text-lg" }, "🥅");
      case 'golf': return React.createElement("span", { className: "text-lg" }, "🏌️‍♂️");
      case 'ice_hockey': return React.createElement("span", { className: "text-lg" }, "🏒");
      case 'motorsport':
      case 'motor': return React.createElement("span", { className: "text-lg" }, "🏎️");
      case 'politica':
      case 'politics': return React.createElement("span", { className: "text-lg" }, "👔");
      case 'rugby_union': return React.createElement("span", { className: "text-lg" }, "🏉");
      case 'rugby_league': return React.createElement("span", { className: "text-lg" }, "🏉");
      case 'rugby': return React.createElement("span", { className: "text-lg" }, "🏉");
      case 'snooker': return React.createElement("span", { className: "text-lg" }, "🎱");
      case 'table_tennis': return React.createElement("span", { className: "text-lg" }, "🏓");
      case 'volleyball': return React.createElement("span", { className: "text-lg" }, "🏐");
      case 'padel':
      case 'pádel': return React.createElement("span", { className: "text-lg" }, "🥍");
      default: return <FaGamepad size={18} />;
    }
  };

  // Memoize codereSports to prevent unnecessary re-renders
  const stableCodereSports = React.useMemo(() => codereSports || [], [codereSports]);

  // Memoize the sports list rendering to prevent flickering
  const sportsListContent = React.useMemo(() => {
    if (stableCodereSports.length > 0) {
      return (
        <ul className="px-2 space-y-1">
          {stableCodereSports.map((sport) => (
            <li key={sport.NodeId}>
              <div className="flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-300">
                <div 
                  className="flex items-center flex-1 cursor-pointer hover:text-yellow-500"
                  onClick={() => {
                    // Clear selected league when clicking on sport name to return to sports overview
                    dispatch(clearSelectedLeague());
                    setActiveLeague(null);
                    // Also ensure we're in sports view
                    setActiveView('sport');
                    // Close mobile sidebar
                    setIsMobileSidebarOpen(false);
                  }}
                >
                  {getSportIcon(sport.SportHandle)}
                  <span className="ml-3 font-semibold whitespace-nowrap">{sport.Name}</span>
                </div>
                <button onClick={() => handleToggleSport(sport.NodeId)} className="p-1">
                  <ChevronDown size={16} className={`transition-transform ${expandedSports.includes(sport.NodeId) ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {expandedSports.includes(sport.NodeId) && (
                <div className="pl-4 pt-2">
                  {loadingSports.includes(sport.NodeId) ? (
                    <div className="flex justify-center items-center p-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                    </div>
                  ) : (
                    sport.Submenu && (
                      <ul className="space-y-1">
                        {sport.Submenu.countries.map(country => {
                          const countryIdentifier = `${sport.NodeId}-${country.Name}`;
                          const isCountryExpanded = expandedCountries.includes(countryIdentifier);
                          const countryLogoUrl = getCountryLogoUrl(country.Name);
                          return (
                            <li key={countryIdentifier}>
                              <button
                                onClick={() => handleToggleCountry(countryIdentifier)}
                                className="w-full flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 hover:text-yellow-500 px-2 py-1.5 rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  {countryLogoUrl && (
                                    <img 
                                      src={countryLogoUrl} 
                                      alt={`${country.Name} flag`}
                                      className="w-4 h-4 object-cover rounded-sm opacity-80 flex-shrink-0"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <span>{country.Name}</span>
                                </div>
                                <ChevronDown size={16} className={`transition-transform ${isCountryExpanded ? 'rotate-180' : ''}`} />
                              </button>
                              {isCountryExpanded && (
                                <ul className="pl-4 pt-1 space-y-1">
                                  {country.Leagues.map(league => {
                                    const leagueLogoUrl = getLeagueLogoUrl(league.Name, country.Name);
                                    return (
                                      <li key={league.NodeId}>
                                        <a
                                          href="#"
                                          onClick={(e) => { 
                                            e.preventDefault(); 
                                            setActiveLeague(league.NodeId);
                                            onLeagueSelect(league.Name, league.NodeId);
                                            setIsMobileSidebarOpen(false);
                                          }}
                                          className={`flex items-center gap-2 text-xs py-1 rounded-md ${activeLeague === league.NodeId ? 'text-yellow-500 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-yellow-500'}`}
                                        >
                                          {leagueLogoUrl && (
                                            <img 
                                              src={leagueLogoUrl} 
                                              alt={`${league.Name} logo`}
                                              className="w-4 h-4 object-cover rounded-sm opacity-80 flex-shrink-0"
                                              onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                              }}
                                            />
                                          )}
                                          <span className="truncate">{league.Name}</span>
                                        </a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      );
    } else {
      return <SidebarSkeleton />;
    }
  }, [stableCodereSports, isDesktopSidebarOpen, expandedSports, loadingSports, expandedCountries, activeLeague, onLeagueSelect, setIsMobileSidebarOpen]);

  // Sync local activeLeague state with global selectedLeague
  React.useEffect(() => {
    // If selectedLeague is cleared/empty, clear the local activeLeague
    if (!selectedLeague || selectedLeague.trim() === '') {
      setActiveLeague(null);
    }
  }, [selectedLeague]);

  React.useEffect(() => {
    // When codereSports data changes, check if any of the loading sports have received their data.
    if (stableCodereSports) {
      loadingSports.forEach(nodeId => {
        const sport = stableCodereSports.find(s => s.NodeId === nodeId);
        if (sport && sport.Submenu) {
          setLoadingSports(prev => prev.filter(id => id !== nodeId));
        }
      });
    }
  }, [stableCodereSports, loadingSports]);

  // Cleanup effect: unsubscribe from all active subscriptions when component unmounts
  // or when switching away from Codere menu
  React.useEffect(() => {
    return () => {
      // Unsubscribe from all expanded sports when component unmounts
      expandedSports.forEach(nodeId => {
        unsubscribeFromLeagues(nodeId);
      });
    };
  }, [expandedSports]);

  // Also cleanup when switching away from Codere menu
  React.useEffect(() => {
    if (activeView !== 'sport') {
      // If we're not on the sport view, unsubscribe from all active subscriptions
      expandedSports.forEach(nodeId => {
        unsubscribeFromLeagues(nodeId);
      });
      setExpandedSports([]);
      setExpandedCountries([]);
      setLoadingSports([]);
    }
  }, [activeView, expandedSports]);

  const handleToggleSport = (nodeId: string) => {
    const isExpanded = expandedSports.includes(nodeId);
    if (isExpanded) {
      // When collapsing, unsubscribe
      setExpandedSports(expandedSports.filter(id => id !== nodeId));
      unsubscribeFromLeagues(nodeId);
    } else {
      // When expanding, subscribe to get league data
      setExpandedSports([...expandedSports, nodeId]);
      const sport = stableCodereSports?.find(s => s.NodeId === nodeId);
      // If Submenu is not present, fetch the data using subscription
      if (!sport?.Submenu) {
        setLoadingSports(prev => [...prev, nodeId]);
        subscribeToLeagues(nodeId);
      }
    }
  };

  const handleToggleCountry = (countryIdentifier: string) => {
    setExpandedCountries(prev =>
      prev.includes(countryIdentifier)
        ? prev.filter(id => id !== countryIdentifier)
        : [...prev, countryIdentifier]
    );
  };

  const handleTopLeagueSelect = (league: string, sportGroup: string) => {
    
    // Find the sport category that matches the sport group
    const matchedCategory = sportCategories.find(category => {
      // Check if the category name matches the sport group directly
      if (category.name.toLowerCase() === sportGroup.toLowerCase()) {
        return true;
      }
      
      // Check aliases if they exist
      if (category.aliases) {
        return category.aliases.some((alias: string) => 
          alias.toLowerCase() === sportGroup.toLowerCase()
        );
      }
      
      // Try some basic mappings for common sport groups
      const lowerSportGroup = sportGroup.toLowerCase();
      const lowerCategoryName = category.name.toLowerCase();
      
      if (lowerSportGroup.includes('fútbol') || lowerSportGroup.includes('football') || lowerSportGroup.includes('soccer')) {
        return lowerCategoryName.includes('fútbol') || lowerCategoryName.includes('football') || lowerCategoryName.includes('soccer');
      }
      if (lowerSportGroup.includes('basketball') || lowerSportGroup.includes('baloncesto')) {
        return lowerCategoryName.includes('basketball') || lowerCategoryName.includes('baloncesto');
      }
      if (lowerSportGroup.includes('tennis') || lowerSportGroup.includes('tenis')) {
        return lowerCategoryName.includes('tennis') || lowerCategoryName.includes('tenis');
      }
      if (lowerSportGroup.includes('e-fútbol') || lowerSportGroup.includes('e-football')) {
        return lowerCategoryName.includes('e-fútbol') || lowerCategoryName.includes('e-football');
      }
      if (lowerSportGroup.includes('tenis de mesa') || lowerSportGroup.includes('table tennis')) {
        return lowerCategoryName.includes('tenis de mesa') || lowerCategoryName.includes('table tennis');
      }
      
      return false;
    });
    
    if (matchedCategory) {
      // Activate the sport category first
      onCategorySelect(matchedCategory.id);
    }

    dispatch(setSelectedLeagueRedux({ name: league, nodeId: null }));
    
    // Close mobile sidebar
    setIsMobileSidebarOpen(false);
    
    // Scroll to the league section if it exists (with a delay to ensure filtering is complete)
    setTimeout(() => {
      const leagueElement = document.querySelector(`[data-league="${league}"]`);
      if (leagueElement) {
        leagueElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 300); // Longer delay to ensure category selection and filtering is complete
  };

  // Navigation handler that resets selected league when navigating away from sports
  const handleNavigation = (view: string) => {
    // Clear selected league when navigating away from sports section
    if (view !== 'sport') {
      dispatch(clearSelectedLeague());
      // Also reset expanded sports and countries when navigating away from sports
      setExpandedSports([]);
      setExpandedCountries([]);
      setActiveLeague(null);
      // Unsubscribe from any active subscriptions
      expandedSports.forEach(nodeId => {
        unsubscribeFromLeagues(nodeId);
      });
      setLoadingSports([]);
    }
    
    setActiveView(view);
    setIsMobileSidebarOpen(false);
  };

  return (
    // **UPDATED: Complete hide/show behavior with better responsive classes**
    <aside className={`bg-slate-100 dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col h-full z-30 transition-transform duration-300 ease-in-out
      w-72 md:w-80 
      ${isMobileSidebarOpen ? 'fixed inset-y-0 left-0 translate-x-0' : 'fixed inset-y-0 left-0 -translate-x-full'} 
      ${isDesktopSidebarOpen ? 'lg:relative lg:translate-x-0 lg:flex' : 'lg:hidden'}`}>
      <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <Image src="https://juandata.github.io/publicAssets/images/casino_and_sports_app/logo_with_text.png" alt="Logo" width={150} height={40} />
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4">
        <ul className="px-2 space-y-1">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleNavigation(link.view); }}
                className={`flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeView === link.view
                    ? 'bg-yellow-500 text-slate-900'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <div className="w-5 h-5">{link.icon}</div>
                <span className="ml-3 whitespace-nowrap">{link.name}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <div className="flex px-2 mb-2">
            <button
              onClick={() => {
                setActiveTab('topLeagues');
                // Clear selected league when switching to Live tab
                dispatch(clearSelectedLeague());
                // Also clear local active league state and reset expanded sports
                setActiveLeague(null);
                // Contract all expanded sports when switching to Live tab
                setExpandedSports([]);
                setExpandedCountries([]);
                // Unsubscribe from any active subscriptions
                expandedSports.forEach(nodeId => {
                  unsubscribeFromLeagues(nodeId);
                });
                setLoadingSports([]);
              }}
              className={`flex-1 text-center text-xs font-semibold uppercase py-2 rounded-l-md ${activeTab === 'topLeagues' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-slate-400'}`}
            >
              Live
            </button>
            <button
              onClick={() => {
                setActiveTab('codereMenu');
                // Clear selected league when switching to Sports tab  
                dispatch(clearSelectedLeague());
                // Also clear local active league state
                setActiveLeague(null);
              }}
              className={`flex-1 text-center text-xs font-semibold uppercase py-2 rounded-r-md ${activeTab === 'codereMenu' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-slate-400'}`}
            >
              Sports
            </button>
          </div>

          {activeTab === 'topLeagues' && (
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {sidebarData.length > 0 ? (
                <ul className="px-2 space-y-1">
                    {sidebarData.map((group) => (
                    <li key={group.sport}>
                        <div className="flex items-center px-3 py-2 text-sm text-slate-600 dark:text-slate-300">
                            {getSportIcon(getSportHandleFromName(group.sport))}
                            <span className="ml-3 font-semibold whitespace-nowrap">{group.sport}</span>
                        </div>
                        <ul className="pl-6">
                            {group.leagues.map((league) => {
                              const leagueLogoUrl = getLeagueLogoUrl(league);
                              return (
                                <li key={league}>
                                    <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleTopLeagueSelect(league, group.sport); }}
                                    className={`flex items-center gap-2 text-xs py-1.5 rounded-md truncate ${
                                        selectedLeague === league ? 'text-yellow-500 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-yellow-500'
                                    }`}
                                    >
                                      {leagueLogoUrl && (
                                        <img 
                                          src={leagueLogoUrl} 
                                          alt={`${league} logo`}
                                          className="w-4 h-4 object-cover rounded-sm opacity-80 flex-shrink-0"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                          }}
                                        />
                                      )}
                                      <span className="truncate">{league}</span>
                                    </a>
                                </li>
                              );
                            })}
                        </ul>
                    </li>
                    ))}
                </ul>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No live events available
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Check back later for live matches
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'codereMenu' && (
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {sportsListContent}
            </div>
          )}
        </div>
      </nav>

      <div className="p-2 border-t border-slate-200 dark:border-zinc-800">
        <div className="px-2 space-y-1">
            <a href="#" className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800">
                <HelpCircle size={20} />
                <span className="ml-3 whitespace-nowrap">Support</span>
            </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

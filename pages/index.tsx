import React, { useState, useEffect, useMemo, useRef } from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import HeroBanner from "../components/HeroBanner";
import CasinoSection from "../components/CasinoSection";
import SportSection from "../components/SportSection";
import Sportsbook from "../components/Sportsbook";
import LeagueView from "../components/LeagueView";
import GameCarousel from "../components/GameCarousel";
import PartnersCarousel from "../components/PartnersCarousel";
import ChatPanel from "../components/ChatPanel";
import BetCoupon from "../components/BetCoupon";
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

import { slotGames } from "../lib/data/games";
import { partners } from "../lib/data/partners";
import { initialChatMessages, ChatMessage } from "../lib/data/chatMessages";
import { HelpCircle } from "lucide-react";
import { Toaster, toast } from 'sonner';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setSelectedLeague, clearSelectedLeague } from '../store/slices/oddsSlice';

import { initSocket, closeSocket, LiveEvent, getEventsForLeague } from '../lib/services/sportsService';
import { initialSportCategories, SportCategory } from '../lib/data/sportCategories';
import { SelectedBet } from "../lib/data/betSlipTypes";
const sportsToMuteForNotifications = new Set(['Tenis de Mesa', 'Tenis De Mesa', 'Baloncesto', 'Voleibol', 'Balonmano', 'Tenis', 'e-Fútbol', 'e-Basket']);


const IndexPage: React.FC = () => {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<string | null>("sport");
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [showCoupon, setShowCoupon] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [newMessage, setNewMessage] = useState<string>("");
  const [sportCategories, setSportCategories] = useState<SportCategory[]>(initialSportCategories);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [favoritedEvents, setFavoritedEvents] = useState<string[]>([]);
  const [selectedBets, setSelectedBets] = useState<SelectedBet[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number>(1);
  const { liveEvents, loading, error, codere, selectedLeague } = useSelector((state: RootState) => state.odds);
  

  const prevLiveEventsRef = useRef<LiveEvent[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const celebrationAudioRef = useRef<HTMLAudioElement | null>(null);
  const [partnerStartIndex, setPartnerStartIndex] = useState<number>(0);
  const [partnersPerPage, setPartnersPerPage] = useState<number>(6);
  const [slotGameStartIndex, setSlotGameStartIndex] = useState<number>(0);
  const [slotGamesPerPage, setSlotGamesPerPage] = useState<number>(7);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);

  // League selection handler for the Sidebar
  const handleLeagueSelect = (leagueName: string, nodeId: string) => {
    dispatch(setSelectedLeague({ name: leagueName, nodeId }));
    // Fetch events for the selected league after updating Redux state
    getEventsForLeague(nodeId);
  };

  const sidebarData = useMemo(() => {
    const leagueMap = new Map<string, Set<string>>();
    liveEvents.forEach(match => {
      const sportGroup = match.sport_group || 'Other Sports';
      const leagueName = match.sport_title;
      if (!leagueMap.has(sportGroup)) {
        leagueMap.set(sportGroup, new Set());
      }
      leagueMap.get(sportGroup)!.add(leagueName);
    });
    const result: { sport: string, leagues: string[] }[] = [];
    leagueMap.forEach((leaguesSet, sport) => {
      result.push({ sport, leagues: Array.from(leaguesSet).sort() });
    });
    return result.sort((a, b) => a.sport.localeCompare(b.sport));
  }, [liveEvents]);

  useEffect(() => {
    initSocket();
    // Don't cleanup in development to avoid connection cycling
    if (process.env.NODE_ENV === 'production') {
      return () => {
        setTimeout(() => {
          closeSocket();
        }, 100);
      };
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      celebrationAudioRef.current = new Audio('/sounds/celebration.mp3');
      celebrationAudioRef.current.load();
    }
  }, []);
  useEffect(() => {
    setShowCoupon(selectedBets.length > 0);
  }, [selectedBets]);
  useEffect(() => {
    if (liveEvents.length > 0) {
      const counts: { [key: string]: number } = {};
      liveEvents.forEach(event => {
        if (event.sport_group) {
          counts[event.sport_group] = (counts[event.sport_group] || 0) + 1;
        }
      });

      const updatedCategories = sportCategories.map(category => {
        // Return a new object to ensure React detects the change
        return {
          ...category,
          liveEventsCount: counts[category.name] || 0
        };
      });

      const liveCategoryIndex = updatedCategories.findIndex(c => c.id === 1);
      if (liveCategoryIndex !== -1) {
        updatedCategories[liveCategoryIndex].liveEventsCount = liveEvents.length;
      }

      setSportCategories(updatedCategories);
    }
  }, [liveEvents]);
  useEffect(() => {
    const prevEventsMap = new Map(prevLiveEventsRef.current.map(event => [event.id, event]));

    liveEvents.forEach(currentEvent => {
      const prevEvent = prevEventsMap.get(currentEvent.id);
      if (prevEvent && prevEvent.scores && currentEvent.scores) {
        const prevScore = `${prevEvent.scores.home}:${prevEvent.scores.away}`;
        const currentScore = `${currentEvent.scores.home}:${currentEvent.scores.away}`;

        if (prevScore !== currentScore) {
          if (currentEvent.sport_group && !sportsToMuteForNotifications.has(currentEvent.sport_group)) {
            if (hasInteracted && celebrationAudioRef.current) {
              celebrationAudioRef.current.play().catch(() => {});
            }

            toast.success(
              "Score Update!",
              {
                description: `${currentEvent.home_team} ${currentEvent.scores.home} - ${currentEvent.scores.away} ${currentEvent.away_team}`,
              }
            );
          }
        }
      }
    });

    prevLiveEventsRef.current = liveEvents;
  }, [liveEvents, hasInteracted])

  useEffect(() => {
    if (liveEvents.length > 0) {
      // Create a map to link all aliases and names to one official category name
      const sportNameToCategoryNameMap = new Map<string, string>();
      initialSportCategories.forEach(cat => {
        sportNameToCategoryNameMap.set(cat.name.toLowerCase(), cat.name);
        if (cat.aliases) {
          cat.aliases.forEach(alias => {
            sportNameToCategoryNameMap.set(alias.toLowerCase(), cat.name);
          });
        }
      });

      // Use the map to count events under their official category name
      const counts: { [key: string]: number } = {};
      liveEvents.forEach(event => {
        if (event.sport_group) {
          // Find the official name (e.g., "Beisbol" -> "Béisbol")
          const mainCategoryName = sportNameToCategoryNameMap.get(event.sport_group.toLowerCase());
          if (mainCategoryName) {
            counts[mainCategoryName] = (counts[mainCategoryName] || 0) + 1;
          }
        }
      });

      // Now, determine which categories to show
      const baseCategories = initialSportCategories.filter(
        cat => cat.name === "View All" || cat.name === "My Live" || cat.name === "Live"
      );

      // Get the set of official sport names that have live events
      const liveSportNames = new Set(Object.keys(counts));

      // Filter the initial list to get the dynamic categories
      const dynamicCategories = initialSportCategories.filter(
        cat => liveSportNames.has(cat.name) && !baseCategories.some(baseCat => baseCat.id === cat.id)
      );

      // Combine and update the final list for the UI
      let allCategories = [...baseCategories, ...dynamicCategories];

      const updatedCategories = allCategories.map(category => ({
        ...category,
        liveEventsCount: counts[category.name] || 0, // Use the accurate counts
        favoritesCount: category.id === 99 ? favoritedEvents.length : category.favoritesCount,
      }));

      // Also update the total count for the main "Live" category
      const liveCategoryIndex = updatedCategories.findIndex(c => c.id === 1);
      if (liveCategoryIndex !== -1) {
        updatedCategories[liveCategoryIndex].liveEventsCount = liveEvents.length;
      }

      if (!updatedCategories.some(cat => cat.id === activeCategoryId)) {
        setActiveCategoryId(1);
      }
      setSportCategories(updatedCategories);
    }
  }, [liveEvents, favoritedEvents, activeCategoryId]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (typeof window !== "undefined") {
      if (savedTheme !== null) setDarkMode(savedTheme === "dark");
      else setDarkMode(window.matchMedia?.("(prefers-color-scheme: dark)").matches);
    }
  }, []);
  useEffect(() => {
    if (selectedBets.length === 0 || liveEvents.length === 0) return;

    const updatedBets = selectedBets.map(bet => {
      const liveMatch = liveEvents.find(event => String(event.id) === bet.matchId);
      if (!liveMatch) return bet;

      const liveMarket = liveMatch.markets.find((market: any) => String(market.key) === bet.selectedOddKey);
      if (!liveMarket) return bet;

      const liveOutcome = liveMarket.outcomes.find((outcome: { name: string; }) => outcome.name === bet.selectedOddName);
      if (!liveOutcome) return bet;

      if (liveOutcome.price !== bet.selectedOddValue) {
        return { ...bet, selectedOddValue: liveOutcome.price };
      }

      return bet;
    });

    setSelectedBets(updatedBets);

  }, [liveEvents]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleCategorySelect = (id: number) => {
    setActiveCategoryId(id);
    dispatch(clearSelectedLeague());
  };

  useEffect(() => {
    if (selectedLeague.name) {
      const foundSportGroup = sidebarData.find(group => group.leagues.includes(selectedLeague.name!))?.sport;
      if (foundSportGroup) {
        const targetCategory = sportCategories.find(cat => cat.name === foundSportGroup);
        if (targetCategory && targetCategory.id !== activeCategoryId) {
          setActiveCategoryId(targetCategory.id);
        }
      }
    }
  }, [selectedLeague.name, sidebarData, sportCategories, activeCategoryId]);

  const sportCategoriesForUI = useMemo(() => {
    return sportCategories.filter(Boolean).map(cat => ({
      ...cat,
      active: cat.id === activeCategoryId,
    }));
  }, [sportCategories, activeCategoryId]);

  const handleFavoriteToggle = (eventId: string, eventName: string) => {
    setFavoritedEvents(prev => {
      const isAlreadyFavorited = prev.includes(eventId);
      let newFavorites: string[];
      if (isAlreadyFavorited) {
        newFavorites = prev.filter(id => id !== eventId);
      } else {
        newFavorites = [...prev, eventId];
        toast.success(`${eventName} added to favorites.`);
      }
      setSportCategories(prevCats => prevCats.map(cat =>
        cat.id === 99 ? { ...cat, favoritesCount: newFavorites.length } : cat
      ));
      return newFavorites;
    });
  };

  const handleAddBet = (
    matchData: LiveEvent,
    marketKey: string,
    oddValue: number,
    oddName: string
  ) => {
    // Create a unique ID for the specific odd that was clicked.
    const newBetId = `${matchData.id}-${marketKey}-${oddName}`;

    // Find if this exact bet is already in the slip.
    const isAlreadySelected = selectedBets.some(bet => bet.id === newBetId);

    // Filter out any existing bet from the same market for this match.
    // This is how we ensure only one selection per market (e.g., you can't bet on Home AND Away).
    const updatedBets = selectedBets.filter(bet =>
      !(bet.matchId === String(matchData.id) && bet.selectedOddKey === marketKey)
    );

    // If the clicked bet wasn't already selected, add it to our updated list.
    if (!isAlreadySelected) {
      const newBet: SelectedBet = {
        id: newBetId,
        matchId: String(matchData.id),
        sportCategoryName: matchData.sport_title,
        teamA: matchData.home_team,
        teamB: matchData.away_team,
        selectedOddName: oddName,
        selectedOddKey: marketKey,
        selectedOddValue: oddValue,
        betAmount: "0",
      };
      updatedBets.push(newBet);
      toast.success(`${oddName} added to bet slip!`);
    } else {
      // If the bet was already selected, filtering removed it. We just show a confirmation.
      toast.info(`${oddName} removed from bet slip.`);
    }

    setSelectedBets(updatedBets);

    // Automatically show the coupon if bets are added
    setShowCoupon(updatedBets.length > 0);
  };

  const handleRemoveBet = (betId: string) => {
    setSelectedBets(prevBets => prevBets.filter(bet => bet.id !== betId));
  };

  const handleClearAllBets = () => {
    setSelectedBets([]);
  };

  const handleUpdateBetAmount = (betId: string, amount: string) => {
    setSelectedBets(prevBets =>
      prevBets.map(bet => (bet.id === betId ? { ...bet, betAmount: amount } : bet))
    );
  };

  // **FIX: Restored the close coupon handler.**
  const handleCloseCoupon = () => {
    setSelectedBets([]);
  };

  const handleBetOddAccepted = (betId: string, newOddValue: number) => {
    setSelectedBets(prevBets => prevBets.map(bet => bet.id === betId ? { ...bet, selectedOddValue: newOddValue } : bet));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage: ChatMessage = {
        id: chatMessages.length + 1, username: "You", message: newMessage,
        timestamp: new Date(),
      };
      setChatMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");
    }
  };

  return (
    <>
      <Head>
        <title>6666Block - Casino & Sports</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen bg-slate-100 flex flex-col text-slate-900 dark:text-white overflow-hidden"
        onClick={() => { if (!hasInteracted) setHasInteracted(true); }}
      >
        <Toaster position="top-right" richColors theme={darkMode ? 'dark' : 'light'} />


        <div className="h-full flex transition-all duration-300">
          {isMobileSidebarOpen && (
            <div
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-20 lg:hidden"
              aria-hidden="true"
            />
          )}
          <Sidebar
            activeView={activeView} setActiveView={setActiveView}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            isDesktopSidebarOpen={isDesktopSidebarOpen}
            sidebarData={sidebarData}
            setSelectedLeague={() => {}} // Legacy prop - no longer used
            selectedLeague={selectedLeague.name || ""}
            codereSports={codere?.leftMenu?.sports || []}
            onLeagueSelect={handleLeagueSelect}
            onCategorySelect={handleCategorySelect}
            sportCategories={sportCategories}
          />
          <div className="h-full flex flex-col bg-white dark:bg-zinc-900 min-w-0 overflow-hidden flex-1">
            <TopNav
              darkMode={darkMode} setDarkMode={setDarkMode} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
              setChatOpen={setChatOpen} isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen}
              isDesktopSidebarOpen={isDesktopSidebarOpen} setIsDesktopSidebarOpen={setIsDesktopSidebarOpen}
            />
            <main className="flex-1 scrollbar-thin">
              {(activeView !== "sport" && activeView !== "sportsbook") && (
                <div>
                  <HeroBanner />
                  {/* ... other content ... */}
                </div>
              )}
              {(activeView === "sport" || activeView === "sportsbook") && (
                selectedLeague.nodeId ? (
                  // Sports tab league selection (has nodeId) - show LeagueView
                  <LeagueView
                    selectedBets={selectedBets}
                    favoritedEvents={favoritedEvents}
                    handleFavoriteToggle={handleFavoriteToggle}
                    onAddBet={handleAddBet}
                    showCoupon={showCoupon}
                  />
                ) : (
                  // No league selected OR LIVE tab league selection (no nodeId) - show Sportsbook
                  <Sportsbook
                    handleCategorySelect={handleCategorySelect}
                    favoritedEvents={favoritedEvents}
                    handleFavoriteToggle={handleFavoriteToggle}
                    liveEvents={liveEvents}
                    loading={loading}
                    apiError={error}
                    selectedLeague={selectedLeague.name || ""}
                    sportCategories={sportCategoriesForUI}
                    selectedBets={selectedBets}
                    onAddBet={handleAddBet}
                  />
                )
              )}
            </main>
          </div>

          <AnimatePresence>
            {chatOpen && (
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 right-0 z-50 w-full h-full md:w-1/4 bg-white dark:bg-zinc-900"
                style={{ height: showCoupon ? 'calc(100% - 68px)' : '100%' }}
              >
                <ChatPanel
                  chatMessages={chatMessages} newMessage={newMessage} setNewMessage={setNewMessage}
                  handleSendMessage={handleSendMessage} chatOpen={chatOpen} setChatOpen={setChatOpen}
                  selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage}
                  isLanguageDropdownOpen={isLanguageDropdownOpen} setIsLanguageDropdownOpen={setIsLanguageDropdownOpen}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showCoupon && (
          <BetCoupon
            selectedBets={selectedBets}
            onRemoveBet={handleRemoveBet}
            onClearAllBets={handleClearAllBets}
            onUpdateBetAmount={handleUpdateBetAmount}
            onCloseCoupon={handleCloseCoupon}
            onBetOddAccepted={handleBetOddAccepted}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default IndexPage;
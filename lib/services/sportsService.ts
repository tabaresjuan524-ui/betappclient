import { store } from "../../store"; // Importa tu store de Redux
// --- MODIFICADO: Importa las acciones correctas del slice combinado ---
import {
  updateLiveEvents,
  updateSports,
  setLoading,
  setError,
  updateCodereData,
  updateSportLeagues,
  updateLeagueEvents,
  updateLeagueCategories
} from "../../store/slices/oddsSlice";

// --- Definiciones de Tipos (se mantienen igual) ---
export interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}
export interface Outcome {
  name: string;
  price: number;
  point: string;
  suspended: boolean;
  oddChange: number;
}

export interface Market {
  name: string;
  key: string | number;
  outcomes: Outcome[];
}

export interface LiveEvent {
  api_name: string;
  id: number;
  sport_group: string;
  sport_title: string; // Nombre de la Liga
  league_logo?: string | null; // URL of the league logo
  home_team: string;
  away_team: string;
  markets: Market[];
  commence_time: string;
  start_time?: string; // Backend provides this field for parsed start date
  scores?: { home: string; away: string };
  bookmakers: any[];
  status: string; // ej., 'live', 'not_started'
  match_time: string; // e.g., "2nd Half", "Set 3"
  startTime: string;
  active: boolean;
  bettingActive: boolean;
  marketsCount?: number; // Number of available markets for this event
  liveData?: any; // Raw live data for sport-specific statistics
}
export interface CodereLeftMenuData {
  sports: CodereLeftMenuSport[];
  highlights: CodereLeftMenuHighlight[];
  highlightsConfig: CodereLeftMenuHighlightsConfig[];
}

export interface CodereLeftMenuHighlightsConfig {
  LeagueName: string;
  IconUrl: string;
  IdLeagues: string;
  SportName: string;
  SportHandle: string;
  CountryCode: string;
}

export interface CodereLeftMenuHighlight {
  CountryCode: null;
  SportsHandle: string;
  Name: string;
  NodeId: string;
  ParentNodeId: string;
  Priority: number;
  SportHandle: string;
  Locked: boolean;
}

export interface CodereLeague {
  Name: string;
  NodeId: string;
  ParentNodeId: string;
  Priority: number;
  SportHandle: string;
  Locked: boolean;
}

export interface CodereCountry {
  Name: string;
  Leagues: CodereLeague[];
}

export interface CodereSubmenu {
  countries: Country[];
  highlights: SubmenuHighlight[];
}
export interface SubmenuHighlight {
  CountryCode: string;
  SportsHandle: string;
  Name: string;
  NodeId: string;
  ParentNodeId: string;
  Priority: number;
  SportHandle: string;
  Locked: boolean;
}
export interface Country {
  Leagues: League[];
  CountryCode: string;
  Name: string;
  NodeId: string;
  ParentNodeId: string;
  Priority: number;
  SportHandle: string;
  Locked: boolean;
}
export interface League {
  Events: LiveEvent[];
  KlothoPriority: number;
  Name: string;
  NodeId: string;
  ParentNodeId: string;
  Priority: number;
  SportHandle: string;
  Locked: boolean;
}
export interface CodereLeftMenuSport {
  Name: string;
  NodeId: string;
  ParentNodeId: string;
  Priority: number;
  SportHandle: string;
  Locked: boolean;
  Submenu?: CodereSubmenu;
}
export interface Event {
  ResultInfo: string;
  DefaultGame: null;
  liveData: LiveData;
  StartDate: string;
  StarDate: string;
  isLive: boolean;
  LeagueName: string;
  ChildrenCount: number;
  SportName: string;
  CountryCode: string;
  CountryName: string;
  Participants: Participant[];
  LiveHistory: null;
  SmartMarketReferenceGameTypeIds: string;
  StatisticsId: string;
  SportId: string;
  Games: Game[];
  StreamingId: null;
  StreamingEnabled: null;
  LTMEnabled: boolean;
  LeagueKlothoPriority: number;
  HighlightPriority: number;
  ParticipantHome: string;
  ParticipantAway: string;
  ParticipantHomeId: number;
  ParticipantAwayId: number;
  Name: string;
  NodeId: string;
  ParentNodeId: string;
  Priority: number;
  SportHandle: string;
  Locked: boolean;
}
export interface LiveData {
  Innings?: Array<number[]>; // For Baseball
  Sets?: Array<number[]>; // For Table Tennis, Tennis, etc.
  HomeService?: boolean;
  Strikes?: string;
  Balls?: string;
  Outs?: string;
  Bases?: Bases;
  Period: number;
  PeriodName: string;
  Actions: Action[];
  ResultHome: number;
  ResultAway: number;
  Time: string;
  MatchTime: number;
  RemainingPeriodTime: string;
  ParticipantHome: string;
  ParticipantAway: string;
}
export interface Action {
  Period: number;
  PeriodName: string;
  Time: number;
  ActionType: number;
  ActionTypeName: string;
  Participant: string;
  AffectedParticipant: string;
  IsHomeTeam: boolean;
}
export interface Bases {
  Baseone: boolean;
  Basetwo: boolean;
  Basethree: boolean;
}

export interface Participant {
  AdditionalValues: AdditionalValues;
  Id: number;
  IsHome: boolean;
  LocalizedNames: Localized;
  LocalizedShortNames: Localized;
}
export interface AdditionalValues {
  KeyValues: any[];
  LocalizedValues: LocalizedValue[];
  ReferenceId: number;
}
export interface Localized {
  LocalizedValues: LocalizedValueDetail[];
  ReferenceId: number;
}
export interface LocalizedValueDetail {
  CountryCode: string;
  LanguageCode: string;
  Value: string;
}
export interface LocalizedValue {
  Key: string;
  Value: string;
}
export interface Game {
  Results: Result[];
  DisplayTypeName: string;
  CategoryInfo: CategoryInfo;
  CategoryInfos: CategoryInfo[];
  GameType: number;
  SmartMarketAvailable: boolean;
  Spov: string;
  ShortName: string;
  IsLive: null;
  Name: string;
  NodeId: string;
  ParentNodeId: string;
  Priority: number;
  SportHandle: string;
  Locked: boolean;
}
export interface CategoryInfo {
  CategoryId: string;
  CategoryName: string;
  IsRelevant: boolean;
}
export interface Result {
  Odd: number;
  SortOrder: number;
  IsLive: boolean;
  upOdd: boolean;
  downOdd: boolean;
  IsNonRunner: boolean;
  SportId: string;
  LocationId: string;
  LeagueId: string;
  EventId: string;
  EventHasHandicap: boolean;
  GameId: string;
  GameTypeId: number;
  GameSpecialOddsValue: string;
  GameBetTypeAvailability: number;
  GameNumberOfStarters: number;
  Name: string;
  NodeId: string;
  ParentNodeId: string;
  Priority: number;
  SportHandle: string;
  Locked: boolean;
}
interface CombinedData {
  sports: Sport[];
  liveEvents: LiveEvent[];
  leagueEvents?: Event[];
  codere?: {
    leftMenu?: CodereLeftMenuData;
  };
  sofascore?: {
    sportsWithLiveEvents: number;
    totalEvents: number;
    sports: { [sportName: string]: { events: { [eventId: string]: any } } };
    lastUpdate: string;
  };
  // For immediate responses
  type?: string;
  data?: any;
  leagueNodeId?: string;
  // For match-specific responses
  matchId?: string;
  categoryId?: string;
  // For direct league updates (already transformed to LiveEvent format)
  directLeagueEvents?: LiveEvent[];
  // For batched updates
  messageType?: string;
  updates?: Array<{
    subscriptionKey: string;
    data: {
      type: string;
      leagueNodeId?: string;
      matchId?: string;
      categoryId?: string;
      nodeId?: string; // For leagues/sports updates
      data: any;
    };
  }>;
  timestamp?: number;
}
let socket: WebSocket | null = null;
let isConnecting = false;
let intentionallyClosing = false;

/**
 * Convert SofaScore data to LiveEvent format for frontend compatibility
 */
const convertSofascoreToLiveEvents = (sofascoreData: any): LiveEvent[] => {
  const liveEvents: LiveEvent[] = [];
  
  if (!sofascoreData?.sports) {
    return liveEvents;
  }

  Object.entries(sofascoreData.sports).forEach(([sportName, sportData]: [string, any]) => {
    if (sportData?.events) {
      Object.entries(sportData.events).forEach(([eventId, eventData]: [string, any]) => {
        try {
          const liveEvent: LiveEvent = {
            api_name: 'sofascore',
            id: parseInt(eventId, 10),
            sport_group: sportName,
            sport_title: eventData.tournament?.name || sportName,
            league_logo: eventData.tournament?.logo || null,
            home_team: eventData.homeTeam?.name || 'Home',
            away_team: eventData.awayTeam?.name || 'Away',
            commence_time: eventData.startTimestamp ? new Date(eventData.startTimestamp * 1000).toISOString() : new Date().toISOString(),
            start_time: eventData.startTimestamp ? new Date(eventData.startTimestamp * 1000).toISOString() : new Date().toISOString(),
            startTime: eventData.startTimestamp ? new Date(eventData.startTimestamp * 1000).toISOString() : new Date().toISOString(),
            status: eventData.status?.description || (eventData.status?.code === 1 ? 'live' : 'not_started'),
            match_time: eventData.status?.description || '',
            scores: {
              home: eventData.homeScore?.current?.toString() || '0',
              away: eventData.awayScore?.current?.toString() || '0'
            },
            markets: [], // SofaScore doesn't provide betting markets in this data
            bookmakers: [],
            active: true,
            bettingActive: false, // SofaScore is for live data, not betting
            marketsCount: 0
          };
          
          liveEvents.push(liveEvent);
        } catch (error) {
          console.warn('Failed to convert SofaScore event:', eventId, error);
        }
      });
    }
  });

  return liveEvents;
};

/**
 * Inicializa la conexión WebSocket al servidor.
 */
export const initSocket = () => {
  if (isConnecting || (socket && socket.readyState === WebSocket.OPEN)) {
    return; // Already connecting or connected
  }

  isConnecting = true;
  intentionallyClosing = false;
  createWebSocketConnection();
};

/**
 * Crea la conexión WebSocket
 */
const createWebSocketConnection = () => {
  try {
    // Determine the appropriate WebSocket URL
    let wsUrl: string;

    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // Use localhost for local development, IP for external connections
      wsUrl = hostname === 'localhost' || hostname === '127.0.0.1'
        ? 'ws://localhost:8081'
        : `ws://${hostname}:8081`;
    } else {
      wsUrl = 'ws://localhost:8081';
    }

    socket = new WebSocket(wsUrl);
    socket.binaryType = 'arraybuffer';

  } catch (error) {
    console.error("❌ Error creating WebSocket:", error);
    isConnecting = false;
    store.dispatch(setError("Error al crear la conexión WebSocket"));
    return;
  }

  socket.onopen = () => {
    // Add visual confirmation for mobile debugging
    if (typeof window !== 'undefined') {
      const wsUrl = `ws://${window.location.hostname}:8081`;
      // Store connection status for debugging
      (window as any).wsDebug = { connected: true, url: wsUrl, timestamp: new Date().toISOString() };
    }
    isConnecting = false;
    store.dispatch(setLoading(true));
    store.dispatch(setError(null));

    // Immediately request initial data to avoid waiting for batching cycle
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const data: CombinedData = JSON.parse(event.data);
      
      // Log received data for debugging
      console.log('📡 WebSocket received data:', {
        messageType: data.messageType,
        hasSofascore: !!data.sofascore,
        hasCodere: !!data.codere,
        hasLiveEvents: !!data.liveEvents,
        updatesCount: data.updates?.length || 0
      });
      
      // 🆕 Handle immediate data for new connections
      if (data.messageType === 'immediate') {
        // Process immediate sports data
        if (data.sports && Array.isArray(data.sports) && data.sports.length > 0) {
          store.dispatch(updateSports(data.sports));
        }

        // Process immediate live events data
        if (data.liveEvents && Array.isArray(data.liveEvents) && data.liveEvents.length > 0) {
          store.dispatch(updateLiveEvents(data.liveEvents));
        }

        // Process immediate Codere data
        if (data.codere?.leftMenu) {
          store.dispatch(updateCodereData(data.codere.leftMenu));
        }

        // 🆕 Process SofaScore data (for future widget implementation)
        if (data.sofascore) {
          console.log('✅ [SOFASCORE] Received data (not displayed yet - for widgets only):', {
            totalEvents: data.sofascore.totalEvents,
            sportsCount: Object.keys(data.sofascore.sports || {}).length,
            lastUpdate: data.sofascore.lastUpdate
          });
          
          // TODO: Store SofaScore data separately for widget implementation
          // For now, DO NOT dispatch to liveEvents as it's not ready for display
          // SofaScore will be used for live stats widgets in the future
        }

        // Clear loading state
        store.dispatch(setError(null));
        store.dispatch(setLoading(false));

        return; // Exit early for immediate data
      }

      // 🆕 Handle batched updates from the new 5-second batching system
      if (data.messageType === 'batchedUpdate' && data.updates && Array.isArray(data.updates)) {

        // Process each update in the batch
        data.updates.forEach((update: any, index) => {
          // The update object has properties at root level: type, nodeId, leagueNodeId, matchId, categoryId, data
          const updateType = update.type;
          
          // Handle different types of batched updates
          switch (updateType) {
            case 'mainData':
              if (update.data) {
                // Handle main data (sports, liveEvents, codere)
                if (update.data.sports && Array.isArray(update.data.sports)) {
                  store.dispatch(updateSports(update.data.sports));
                }

                if (update.data.liveEvents && Array.isArray(update.data.liveEvents)) {
                  store.dispatch(updateLiveEvents(update.data.liveEvents));
                }

                if (update.data.codere?.leftMenu) {
                  store.dispatch(updateCodereData(update.data.codere.leftMenu));
                }

                // 🆕 Handle SofaScore data in batched updates (for future widget implementation)
                if (update.data.sofascore) {
                  console.log('✅ [SOFASCORE BATCH] Received data (not displayed yet - for widgets only):', {
                    totalEvents: update.data.sofascore.totalEvents,
                    sportsCount: Object.keys(update.data.sofascore.sports || {}).length,
                    lastUpdate: update.data.sofascore.lastUpdate
                  });
                  
                  // TODO: Store SofaScore data separately for widget implementation
                  // For now, DO NOT dispatch to liveEvents as it's not ready for display
                  // SofaScore will be used for live stats widgets in the future
                }
              }
              break;

            case 'leagues':
              if (update.nodeId && update.data) {
                // Calculate total leagues across all countries
                let totalLeagues = 0;
                if (update.data.countries && Array.isArray(update.data.countries)) {
                  totalLeagues = update.data.countries.reduce((total: number, country: any) =>
                    total + (country.Leagues ? country.Leagues.length : 0), 0);
                }
                console.log(`✅ Received ${totalLeagues} leagues for sport ${update.nodeId} from ${update.data.countries.length} countries`);
                // Use the specific action for updating sport leagues
                store.dispatch(updateSportLeagues({
                  sportNodeId: update.nodeId,
                  leagues: update.data
                }));
              }
              break;

            case 'leagueEvents':
              if (update.leagueNodeId && update.data && Array.isArray(update.data)) {
                store.dispatch(updateLeagueEvents(update.data));
              }
              break;

            case 'leagueEventsWithGames':
              if (update.leagueNodeId && update.data && Array.isArray(update.data)) {
                // Transform enhanced events to LiveEvent format
                const enhancedEvents = update.data.map((event: any) => ({
                  api_name: 'codere',
                  id: parseInt(event.NodeId, 10),
                  sport_group: event.SportName,
                  sport_category: event.CountryName,
                  sport_title: event.LeagueName,
                  home_team: event.ParticipantHome,
                  away_team: event.ParticipantAway,
                  commence_time: event.StartDate ? (() => {
                    const timestamp = parseInt(event.StartDate.match(/\d+/)?.[0] || '0', 10);
                    if (timestamp && timestamp > 0) {
                      const date = new Date(timestamp);
                      return !isNaN(date.getTime()) ? date.toISOString() : 'invalid-date';
                    }
                    return 'invalid-date';
                  })() : 'invalid-date',
                  start_time: event.StartDate ? (() => {
                    const timestamp = parseInt(event.StartDate.match(/\d+/)?.[0] || '0', 10);
                    if (timestamp && timestamp > 0) {
                      const date = new Date(timestamp);
                      return !isNaN(date.getTime()) ? date.toISOString() : 'invalid-date';
                    }
                    return 'invalid-date';
                  })() : 'invalid-date',
                  startTime: event.StartDate ? (() => {
                    const timestamp = parseInt(event.StartDate.match(/\d+/)?.[0] || '0', 10);
                    if (timestamp && timestamp > 0) {
                      const date = new Date(timestamp);
                      return !isNaN(date.getTime()) ? date.toISOString() : 'invalid-date';
                    }
                    return 'invalid-date';
                  })() : 'invalid-date',
                  status: event.isLive ? 'live' : 'not_started',
                  match_time: '',
                  team1_score: 0,
                  team2_score: 0,
                  active: !event.Locked,
                  bettingActive: !event.Locked,
                  scores: {
                    home: '0',
                    away: '0',
                    additionalScores: {
                      home: [],
                      away: []
                    }
                  },
                  markets: event.Games?.map((game: any) => ({
                    name: game.Name,
                    key: game.NodeId,
                    outcomes: game.Results?.map((result: any) => ({
                      name: result.Name,
                      price: result.Odd,
                      point: result.GameSpecialOddsValue?.replace(/<Spov>|<\/Spov>/g, '') || '',
                      suspended: result.Locked,
                      oddChange: 0,
                    })) || [],
                  })) || [],
                  bookmakers: [],
                  marketsCount: event.ChildrenCount || 0,
                  isEnhanced: true,
                })) as LiveEvent[];

                store.dispatch(updateLeagueEvents(enhancedEvents));

                // Store enhanced events flag
                sessionStorage.setItem(`enhancedEvents_${update.leagueNodeId}`, 'true');
              }
              break;

            case 'leagueCategories':
              if (update.leagueNodeId && update.data) {
                store.dispatch(updateLeagueCategories(update.data));
              }
              break;

            case 'matchCategories':
              if (update.matchId && update.data) {
                // Dispatch custom event for NoLiveMatchDetailView
                const event = new CustomEvent('matchCategories', {
                  detail: { matchId: update.matchId, data: update.data }
                });
                document.dispatchEvent(event);
              }
              break;

            case 'matchGames':
              if (update.matchId && update.categoryId && update.data) {
                // Dispatch custom event for NoLiveMatchDetailView
                const event = new CustomEvent('matchGames', {
                  detail: {
                    matchId: update.matchId,
                    categoryId: update.categoryId,
                    data: update.data
                  }
                });
                document.dispatchEvent(event);
              }
              break;

            default:
              console.warn(`📦 Unknown batched update type: ${updateType}`);
          }
        });

        // Clear any connection errors when receiving batched data successfully
        store.dispatch(setError(null));
        store.dispatch(setLoading(false));

        return; // Exit early for batched updates
      }

      // Handle the direct league update (legacy support)
      if (data.directLeagueEvents) {
        console.log('📡 Processing direct league update with events:', data.directLeagueEvents);
        store.dispatch(updateLeagueEvents(data.directLeagueEvents));
        return;
      }

      // Legacy message handling for immediate responses and regular data
      // Ajusta la lógica según la estructura de datos real de tu servidor.
      if (data.sports && data.sports.length > 0) {
        console.log("Updating sports:", data.sports.length);
        store.dispatch(updateSports(data.sports));
      }

      if (data.liveEvents && Array.isArray(data.liveEvents) && data.liveEvents.length > 0) {
        console.log("Updating live events:", data.liveEvents.length);
        store.dispatch(updateLiveEvents(data.liveEvents));
      }

      // Handle immediate league events response from subscription
      if (data.type === 'leagueEvents' && data.data && Array.isArray(data.data)) {
        // Check if enhanced events have already been received for this league
        const hasEnhancedEvents = sessionStorage.getItem(`enhancedEvents_${data.leagueNodeId}`);
        if (hasEnhancedEvents === 'true') {
          console.log("🎯 Skipping regular league events - enhanced events already received for league", data.leagueNodeId);
          return; // Don't process regular events if enhanced events are already available
        }

        console.log("⚡ Received immediate league events response:", data.data.length, "events for league", data.leagueNodeId);
        store.dispatch(updateLeagueEvents(data.data));
      }

      // Handle immediate league categories response from subscription
      if (data.type === 'leagueCategories' && data.data && Array.isArray(data.data)) {
        console.log("⚡ Received immediate league categories response:", data.data.length, "categories for league", data.leagueNodeId);
        store.dispatch(updateLeagueCategories(data.data));
      }

      // Handle enhanced league events with games response (immediate)
      if (data.type === 'leagueEventsWithGames' && data.data && Array.isArray(data.data)) {
        console.log("⚡ Received immediate enhanced league events with games:", data.data.length, "events for league", data.leagueNodeId);
        // For now, we'll merge the enhanced games data with existing events
        // You might want to create a separate Redux action for this later
        const enhancedEvents = data.data.map((event: any) => ({
          api_name: 'codere',
          id: parseInt(event.NodeId, 10),
          sport_group: event.SportName,
          sport_category: event.CountryName,
          sport_title: event.LeagueName,
          home_team: event.ParticipantHome,
          away_team: event.ParticipantAway,
          commence_time: event.StartDate ? (() => {
            const timestamp = parseInt(event.StartDate.match(/\d+/)?.[0] || '0', 10);
            if (timestamp && timestamp > 0) {
              const date = new Date(timestamp);
              return !isNaN(date.getTime()) ? date.toISOString() : 'invalid-date';
            }
            return 'invalid-date';
          })() : 'invalid-date',
          start_time: event.StartDate ? (() => {
            const timestamp = parseInt(event.StartDate.match(/\d+/)?.[0] || '0', 10);
            if (timestamp && timestamp > 0) {
              const date = new Date(timestamp);
              return !isNaN(date.getTime()) ? date.toISOString() : 'invalid-date';
            }
            return 'invalid-date';
          })() : 'invalid-date',
          startTime: event.StartDate ? (() => {
            const timestamp = parseInt(event.StartDate.match(/\d+/)?.[0] || '0', 10);
            if (timestamp && timestamp > 0) {
              const date = new Date(timestamp);
              return !isNaN(date.getTime()) ? date.toISOString() : 'invalid-date';
            }
            return 'invalid-date';
          })() : 'invalid-date',
          status: event.isLive ? 'live' : 'not_started',
          match_time: '',
          team1_score: 0,
          team2_score: 0,
          active: !event.Locked,
          bettingActive: !event.Locked,
          scores: {
            home: '0',
            away: '0',
            additionalScores: {
              home: [],
              away: []
            }
          },
          markets: event.Games?.map((game: any) => ({
            name: game.Name,
            key: game.NodeId,
            outcomes: game.Results?.map((result: any) => ({
              name: result.Name,
              price: result.Odd,
              point: result.GameSpecialOddsValue?.replace(/<Spov>|<\/Spov>/g, '') || '',
              suspended: result.Locked,
              oddChange: 0,
            })) || [],
          })) || [],
          bookmakers: [],
          marketsCount: event.ChildrenCount || 0, // Use ChildrenCount from API response
          isEnhanced: true, // Mark this as enhanced events
        })) as LiveEvent[];
        console.log("⚡ Transformed immediate enhanced events:", enhancedEvents.length, "events with enhanced markets");
        store.dispatch(updateLeagueEvents(enhancedEvents));

        // Store enhanced events flag to prevent regular events from overwriting
        sessionStorage.setItem(`enhancedEvents_${data.leagueNodeId}`, 'true');
        return;
      }

      // Handle match categories response (immediate)
      if (data.type === 'matchCategories' && data.matchId && data.data) {
        console.log("⚡ Received immediate match categories response:", data.data.length, "categories for match", data.matchId);
        // Dispatch custom event for NoLiveMatchDetailView to listen
        const event = new CustomEvent('matchCategories', {
          detail: { matchId: data.matchId, data: data.data }
        });
        document.dispatchEvent(event);
      }

      // Handle match games response (immediate)
      if (data.type === 'matchGames' && data.matchId && data.categoryId && data.data) {
        console.log("⚡ Received immediate match games response:", data.data.length, "games for match", data.matchId, "category", data.categoryId);
        // Dispatch custom event for NoLiveMatchDetailView to listen
        const event = new CustomEvent('matchGames', {
          detail: { matchId: data.matchId, categoryId: data.categoryId, data: data.data }
        });
        document.dispatchEvent(event);
      }

      // Handle match category data response (immediate) - sent when a match is watched
      if (data.type === 'matchCategoryData' && data.matchId && (data as any).categories) {
        console.log("⚡ Received match category data for watched match:", data.matchId, "categories:", (data as any).categories.length, "markets:", (data as any).markets?.length || 0);
        console.log("⚡ Category data details:", (data as any).categories);
        console.log("⚡ Markets data details:", (data as any).markets);
        // Dispatch custom event for MatchDetailView to listen
        const event = new CustomEvent('matchCategoryData', {
          detail: {
            matchId: data.matchId,
            categories: (data as any).categories,
            markets: (data as any).markets || [],
            timestamp: (data as any).timestamp
          }
        });
        console.log("⚡ Dispatching matchCategoryData event:", event.detail);
        document.dispatchEvent(event);
      }

      // Handle category-specific market data response
      if (data.type === 'categoryMarkets' && data.matchId && data.categoryId && (data as any).markets) {
        console.log("⚡ Received category markets for match:", data.matchId, "category:", data.categoryId, "markets:", (data as any).markets.length);
        // Dispatch custom event for MatchDetailView to listen
        const event = new CustomEvent('categoryMarkets', {
          detail: {
            matchId: data.matchId,
            categoryId: data.categoryId,
            markets: (data as any).markets,
            timestamp: (data as any).timestamp
          }
        });
        document.dispatchEvent(event);
      }

      if (data.codere?.leftMenu) {
        console.log("Updating Codere data");
        store.dispatch(updateCodereData(data.codere.leftMenu));
      }

      // Clear any connection errors when receiving data successfully
      store.dispatch(setError(null));
      store.dispatch(setLoading(false));

      // Aquí puedes añadir lógica para manejar actualizaciones de cuotas en vivo
      // if (data.type === 'odd_updates') {
      //   store.dispatch(simulateOddsUpdate(data.payload));
      // }
    } catch (e) {
      console.error("Error procesando el mensaje del WebSocket:", e);
      console.error("Raw message:", event.data);
      store.dispatch(setError("Error procesando los datos recibidos."));
    }
  };

  socket.onclose = (event: CloseEvent) => {
    console.log(`🔌 WebSocket desconectado (código: ${event.code}, razón: "${event.reason}")`);
    isConnecting = false;

    // Only show error if it wasn't an intentional close
    if (!intentionallyClosing) {
      // Check if it was a normal closure or an error
      if (event.code !== 1000 && event.code !== 1001) {
        console.warn(`⚠️ WebSocket cerrado inesperadamente. Código: ${event.code}`);
        store.dispatch(setError("Conexión perdida con el servidor."));
      }

      // Attempt to reconnect after a delay if it wasn't intentional
      setTimeout(() => {
        if (!intentionallyClosing) {
          console.log(`🔄 Intentando reconectar en 3000ms...`);
          initSocket();
        }
      }, 3000);
    }
  };

  socket.onerror = (error) => {
    console.error("❌ Error de WebSocket:", error);
    const wsUrl = typeof window !== 'undefined' ? `ws://${window.location.hostname}:8081` : 'unknown';
    console.error(`❌ WebSocket connection failed to: ${wsUrl}`);

    // Store error details for debugging
    if (typeof window !== 'undefined') {
      (window as any).wsDebug = {
        connected: false,
        error: error,
        url: wsUrl,
        timestamp: new Date().toISOString(),
        message: 'WebSocket connection failed'
      };
    }

    isConnecting = false;
    store.dispatch(setError(`No se pudo conectar al servidor de datos en vivo (${wsUrl}).`));
    store.dispatch(setLoading(false));
  };
};

/**
 * Cierra la conexión WebSocket.
 */
export const closeSocket = () => {
  if (socket) {
    intentionallyClosing = true;
    socket.close(1000, "Closing intentionally"); // 1000 = normal closure
    socket = null;
  }
};
export const watchMatch = (matchId: number, apiName: string) => {
  console.log('🚨 [FRONTEND CRITICAL] ⭐ WATCH MATCH CALLED:', { matchId, apiName, socketReady: socket && socket.readyState === WebSocket.OPEN });

  if (socket && socket.readyState === WebSocket.OPEN && apiName === "codere") {
    console.log('🚨 [FRONTEND CRITICAL] ✅ Sending watchMatch message to backend');
    socket.send(JSON.stringify({ action: 'watchMatch', matchId }));
    console.log('🚨 [FRONTEND CRITICAL] ✅ watchMatch message sent successfully');
  } else {
    console.log('🚨 [FRONTEND CRITICAL] ❌ Cannot send watchMatch - Socket not ready or wrong API');
    console.log('🚨 [FRONTEND CRITICAL] Socket state:', socket ? socket.readyState : 'null');
    console.log('🚨 [FRONTEND CRITICAL] API name:', apiName);
  }
};

export const unwatchMatch = (matchId: number, apiName: string) => {
  if (socket && socket.readyState === WebSocket.OPEN && apiName === "codere") {
    socket.send(JSON.stringify({ action: 'unwatchMatch', matchId }));
  }
};

export const getLeaguesForSport = (nodeId: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: 'getLeagues', nodeId }));
  }
};

export const getEventsForLeague = (leagueNodeId: string) => {
  console.log('getEventsForLeague called with nodeId:', leagueNodeId);

  // For now, we don't need to send WebSocket requests since the league events
  // are filtered from existing liveEvents in the LeagueView component
  // This function is kept for future WebSocket integration if needed

  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log('Sending getLeagueEvents request via WebSocket');
    socket.send(JSON.stringify({ action: 'getLeagueEvents', leagueNodeId }));
  } else {
    console.log('WebSocket not available for league events request');
  }
};

/**
 * New cache-based subscription functions
 */

// Subscribe to leagues for a specific sport (submenu)
export const subscribeToLeagues = (nodeId: string) => {
  console.log('Subscribing to leagues for sport:', nodeId);
  if (socket && socket.readyState === WebSocket.OPEN) {
    // Backend expects 'getLeagues' action, not 'subscribeLeagues'
    socket.send(JSON.stringify({ action: 'getLeagues', nodeId }));
    return true;
  } else {
    console.log('WebSocket not available for leagues subscription - connection state:', getConnectionStatus());
    return false;
  }
};

// Unsubscribe from leagues for a specific sport
export const unsubscribeFromLeagues = (nodeId: string) => {
  console.log('Unsubscribing from leagues for sport:', nodeId);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: 'unsubscribeLeagues', nodeId }));
    return true;
  } else {
    console.log('WebSocket not available for leagues unsubscription - connection state:', getConnectionStatus());
    return false;
  }
};

// Subscribe to events for a specific league
export const subscribeToLeagueEvents = (leagueNodeId: string) => {
  console.log('Subscribing to events for league:', leagueNodeId);
  if (socket && socket.readyState === WebSocket.OPEN) {
    // Backend expects 'getLeagueEvents' action, not 'subscribeLeagueEvents'
    socket.send(JSON.stringify({ action: 'getLeagueEvents', leagueNodeId }));
    return true;
  } else {
    console.log('WebSocket not available for league events subscription - connection state:', getConnectionStatus());
    return false;
  }
};

// Unsubscribe from events for a specific league
export const unsubscribeFromLeagueEvents = (leagueNodeId: string) => {
  console.log('Unsubscribing from events for league:', leagueNodeId);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: 'unsubscribeLeagueEvents', leagueNodeId }));
    return true;
  } else {
    console.log('WebSocket not available for league events unsubscription - connection state:', getConnectionStatus());
    return false;
  }
};

// Subscribe to categories for a specific league
export const subscribeToLeagueCategories = (leagueNodeId: string) => {
  console.log('Subscribing to categories for league:', leagueNodeId);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: 'getLeagueCategories', leagueNodeId }));
    return true;
  } else {
    console.log('WebSocket not available for league categories subscription - connection state:', getConnectionStatus());
    return false;
  }
};

// Unsubscribe from categories for a specific league
export const unsubscribeFromLeagueCategories = (leagueNodeId: string) => {
  console.log('Unsubscribing from categories for league:', leagueNodeId);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: 'unsubscribeLeagueCategories', leagueNodeId }));
    return true;
  } else {
    console.log('WebSocket not available for league categories unsubscription - connection state:', getConnectionStatus());
    return false;
  }
};

// Subscribe to match categories
export const subscribeToMatchCategories = (matchId: string) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('WebSocket not connected, cannot subscribe to match categories');
    return;
  }

  console.log(`🎯 FRONTEND DEBUG - Subscribing to match categories for match: ${matchId}`);
  socket.send(JSON.stringify({
    action: 'getMatchCategories',
    matchId: matchId
  }));
};

// Unsubscribe from match categories
export const unsubscribeFromMatchCategories = (matchId: string) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('WebSocket not connected, cannot unsubscribe from match categories');
    return;
  }

  console.log(`🎯 FRONTEND DEBUG - Unsubscribing from match categories for match: ${matchId}`);
  socket.send(JSON.stringify({
    action: 'unsubscribeMatchCategories',
    matchId: matchId
  }));
};

// Subscribe to match games for a specific category
export const subscribeToMatchGames = (matchId: string, categoryId: string) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('WebSocket not connected, cannot subscribe to match games');
    return;
  }

  console.log(`🎯 FRONTEND DEBUG - Subscribing to match games for match: ${matchId}, category: ${categoryId}`);
  socket.send(JSON.stringify({
    action: 'getMatchGames',
    matchId: matchId,
    categoryId: categoryId
  }));
};

// Unsubscribe from match games
export const unsubscribeFromMatchGames = (matchId: string, categoryId: string) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('WebSocket not connected, cannot unsubscribe from match games');
    return;
  }

  console.log(`🎯 FRONTEND DEBUG - Unsubscribing from match games for match: ${matchId}, category: ${categoryId}`);
  socket.send(JSON.stringify({
    action: 'unsubscribeMatchGames',
    matchId: matchId,
    categoryId: categoryId
  }));
};

// Request category-specific market data
export const getCategoryMarkets = (matchId: string, categoryId: string) => {
  console.log('Requesting category markets for match:', matchId, 'category:', categoryId);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      action: 'getCategoryMarkets',
      matchId: matchId,
      categoryId: categoryId
    }));
    return true;
  } else {
    console.log('WebSocket not available for category markets - connection state:', getConnectionStatus());
    return false;
  }
};

// Get cache statistics for debugging
export const getCacheStats = () => {
  console.log('Requesting cache statistics');
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: 'getCacheStats' }));
    return true;
  } else {
    console.log('WebSocket not available for cache stats - connection state:', getConnectionStatus());
    return false;
  }
};

/**
 * Debug function to be available in browser console
 */
declare global {
  interface Window {
    sportsServiceDebug: {
      getCacheStats: () => void;
      getConnectionStatus: () => string;
      subscribeToLeagues: (nodeId: string) => void;
      unsubscribeFromLeagues: (nodeId: string) => void;
      subscribeToLeagueEvents: (leagueNodeId: string) => void;
      unsubscribeFromLeagueEvents: (leagueNodeId: string) => void;
      subscribeToLeagueCategories: (leagueNodeId: string) => void;
      unsubscribeFromLeagueCategories: (leagueNodeId: string) => void;
      getCategoryMarkets: (matchId: string, categoryId: string) => boolean;
    };
  }
}

/**
 * Manually clear connection errors
 */
export const clearConnectionError = () => {
  store.dispatch(setError(null));
};

/**
 * Check WebSocket connection status
 */
export const getConnectionStatus = () => {
  if (!socket) return 'disconnected';

  switch (socket.readyState) {
    case WebSocket.CONNECTING: return 'connecting';
    case WebSocket.OPEN: return 'connected';
    case WebSocket.CLOSING: return 'closing';
    case WebSocket.CLOSED: return 'closed';
    default: return 'unknown';
  }
};

// Make debug functions available in browser console
if (typeof window !== 'undefined') {
  window.sportsServiceDebug = {
    getCacheStats,
    getConnectionStatus,
    subscribeToLeagues,
    unsubscribeFromLeagues,
    subscribeToLeagueEvents,
    unsubscribeFromLeagueEvents,
    subscribeToLeagueCategories,
    unsubscribeFromLeagueCategories,
    getCategoryMarkets, // Add the new function to debug interface
  };
}
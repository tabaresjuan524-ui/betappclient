import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// --- NUEVO: Importa los tipos para los datos en vivo ---
import { Sport, LiveEvent, Event } from "../../lib/services/sportsService"; // Asegúrate que la ruta sea correcta
import { CodereLeftMenuData } from "../../lib/services/sportsService";
// La interfaz para la información de cuotas se mantiene
export interface OddInfo {
  newOdd: number;
  oldOdd: number;
}

// --- MODIFICADO: Se añaden las propiedades para los datos en vivo al estado ---
export interface OddsState {
  sports: Sport[];
  liveEvents: LiveEvent[];
  loading: boolean;
  error: string | null;
  codere: {
    leftMenu: CodereLeftMenuData
  };
  sofascore: {
    liveEvents: LiveEvent[];
    sports: Sport[];
    liveSports: any[];
    tournaments: { [key: string]: any };
    players: { [key: string]: any };
  };
  selectedLeague: {
    name: string | null;
    nodeId: string | null;
    events: LiveEvent[];
    categories: Array<{ CategoryId: string; CategoryName: string; CategoryShortName?: string; IsRelevant: boolean; }> | null;
  };
}

// --- MODIFICADO: El estado inicial ahora incluye las nuevas propiedades ---
// Se elimina la carga de datos de prueba (allSportMatches)
const initialState: OddsState = {
  sports: [],
  liveEvents: [],
  loading: true,
  error: null,
  codere: { leftMenu: { sports: [], highlights: [], highlightsConfig: [] } },
  sofascore: {
    liveEvents: [],
    sports: [],
    liveSports: [],
    tournaments: {},
    players: {}
  },
  selectedLeague: {
    name: null,
    nodeId: null,
    events: [],
    categories: null
  }
};

const oddsSlice = createSlice({
  name: "odds",
  initialState,
  // --- MODIFICADO: Se añaden los nuevos reducers ---
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    updateSports(state, action: PayloadAction<Sport[]>) {
      state.sports = action.payload;
    },
    updateLiveEvents(state, action: PayloadAction<LiveEvent[]>) {
      // FIX: Replace the entire array with the payload from the server.
      // This ensures the state is an exact mirror of the latest live data,
      // automatically removing any matches that are no longer present.
      state.liveEvents = action.payload;

      state.loading = false;
    },
    updateCodereData(state, action: PayloadAction<CodereLeftMenuData>) {
      state.codere.leftMenu = action.payload;
    },
    updateSportLeagues(state, action: PayloadAction<{ sportNodeId: string; leagues: any }>) {
      if (state.codere.leftMenu?.sports) {
        const sportIndex = state.codere.leftMenu.sports.findIndex(s => s.NodeId === action.payload.sportNodeId);
        if (sportIndex > -1) {
          state.codere.leftMenu.sports[sportIndex].Submenu = action.payload.leagues;
        }
      }
    },
    setSelectedLeague(state, action: PayloadAction<{ name: string; nodeId: string | null }>) {
      state.selectedLeague.name = action.payload.name;
      state.selectedLeague.nodeId = action.payload.nodeId;
      state.selectedLeague.events = []; // Reset events when selecting new league
      state.selectedLeague.categories = null; // Reset categories when selecting new league
    },
    updateLeagueEvents(state, action: PayloadAction<LiveEvent[]>) {
      state.selectedLeague.events = action.payload;
    },
    updateLeagueCategories(state, action: PayloadAction<Array<{ CategoryId: string; CategoryName: string; CategoryShortName?: string; IsRelevant: boolean; }>>) {
      state.selectedLeague.categories = action.payload;
    },
    clearSelectedLeague(state) {
      state.selectedLeague.name = null;
      state.selectedLeague.nodeId = null;
      state.selectedLeague.events = [];
      state.selectedLeague.categories = null;
    },
    updateSofascoreData(state, action: PayloadAction<{
      liveEvents?: LiveEvent[];
      sports?: Sport[];
      liveSports?: any[];
      tournaments?: { [key: string]: any };
      players?: { [key: string]: any };
    }>) {
      console.log(`🔍 [REDUX DEBUG] updateSofascoreData called with:`, {
        liveEventsCount: action.payload.liveEvents?.length || 0,
        sportsCount: action.payload.sports?.length || 0,
        liveSportsCount: action.payload.liveSports?.length || 0,
        tournamentsKeys: Object.keys(action.payload.tournaments || {}),
        playersKeys: Object.keys(action.payload.players || {}),
        firstLiveEvent: action.payload.liveEvents?.[0]
      });
      
      if (action.payload.liveEvents) {
        state.sofascore.liveEvents = action.payload.liveEvents;
        console.log(`🔍 [REDUX DEBUG] Updated liveEvents, new count: ${state.sofascore.liveEvents.length}`);
      }
      if (action.payload.sports) {
        state.sofascore.sports = action.payload.sports;
        console.log(`🔍 [REDUX DEBUG] Updated sports, new count: ${state.sofascore.sports.length}`);
      }
      if (action.payload.liveSports) {
        state.sofascore.liveSports = action.payload.liveSports;
        console.log(`🔍 [REDUX DEBUG] Updated liveSports, new count: ${state.sofascore.liveSports.length}`);
      }
      if (action.payload.tournaments) {
        state.sofascore.tournaments = action.payload.tournaments;
        console.log(`🔍 [REDUX DEBUG] Updated tournaments, keys: ${Object.keys(state.sofascore.tournaments)}`);
      }
      if (action.payload.players) {
        state.sofascore.players = action.payload.players;
        console.log(`🔍 [REDUX DEBUG] Updated players, keys: ${Object.keys(state.sofascore.players)}`);
      }
    }

  },
});

// --- MODIFICADO: Exporta todas las acciones, nuevas y existentes ---
export const {
  setLoading,
  setError,
  updateSports,
  updateLiveEvents,
  updateCodereData,
  updateSportLeagues,
  setSelectedLeague,
  updateLeagueEvents,
  updateLeagueCategories,
  clearSelectedLeague,
  updateSofascoreData,
} = oddsSlice.actions;

export default oddsSlice.reducer;

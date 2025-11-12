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
    data: any | null;
    lastUpdate: string | null;
    totalEvents: number;
    sports: Record<string, any>;
    tournaments: Record<string, any>;
    teams: Record<string, any>;
    events: Record<string, any>;
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
    data: null,
    lastUpdate: null,
    totalEvents: 0,
    sports: {},
    tournaments: {},
    teams: {},
    events: {}
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
    updateSofascoreData(state, action: PayloadAction<any>) {
      // Store the complete SofaScore data structure
      state.sofascore.data = action.payload;
      state.sofascore.lastUpdate = action.payload.lastUpdate || new Date().toISOString();
      state.sofascore.totalEvents = action.payload.totalEvents || 0;
      state.sofascore.sports = action.payload.sports || {};
      
      // Extract tournaments, teams, and events from nested sport data
      const tournaments: Record<string, any> = {};
      const teams: Record<string, any> = {};
      const events: Record<string, any> = {};
      
      if (action.payload.sports) {
        Object.entries(action.payload.sports).forEach(([sportName, sportData]: [string, any]) => {
          // Collect events from each sport
          if (sportData.events && typeof sportData.events === 'object') {
            Object.entries(sportData.events).forEach(([eventId, eventData]: [string, any]) => {
              events[eventId] = { ...eventData, sport: sportName };
            });
          }
          
          // Extract tournaments if they exist
          if (sportData.tournaments && typeof sportData.tournaments === 'object') {
            Object.assign(tournaments, sportData.tournaments);
          }
          
          // Extract teams if they exist
          if (sportData.teams && typeof sportData.teams === 'object') {
            Object.assign(teams, sportData.teams);
          }
        });
      }
      
      state.sofascore.tournaments = tournaments;
      state.sofascore.teams = teams;
      state.sofascore.events = events;
    },
    clearSofascoreData(state) {
      state.sofascore = {
        data: null,
        lastUpdate: null,
        totalEvents: 0,
        sports: {},
        tournaments: {},
        teams: {},
        events: {}
      };
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
  updateSofascoreData,
  clearSofascoreData,
  updateSportLeagues,
  setSelectedLeague,
  updateLeagueEvents,
  updateLeagueCategories,
  clearSelectedLeague,
} = oddsSlice.actions;

export default oddsSlice.reducer;

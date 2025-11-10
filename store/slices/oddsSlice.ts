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
} = oddsSlice.actions;

export default oddsSlice.reducer;

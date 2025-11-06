/**
 * Live Statistics Mapping for Different Sports
 * This file contains the structure and mapping of live data properties
 * for each sport type from Codere API
 */

export interface BaseLiveData {
  Period?: number;
  PeriodName?: string;
  ResultHome?: number;
  ResultAway?: number;
  Time?: string;
  MatchTime?: number;
  RemainingPeriodTime?: string;
  ParticipantHome?: string;
  ParticipantAway?: string;
  Actions?: LiveAction[];
}

export interface LiveAction {
  Period: number;
  PeriodName: string;
  Time: number;
  ActionType: number;
  ActionTypeName: string;
  Participant: string;
  AffectedParticipant: string;
  IsHomeTeam: boolean;
}

// Tennis specific live data
export interface TennisLiveData extends BaseLiveData {
  Sets?: number[][];
  HomeService?: boolean;
  SetsHome?: number;
  SetsAway?: number;
}

// Table Tennis specific live data
export interface TableTennisLiveData extends BaseLiveData {
  Sets?: number[][];
}

// Football specific live data
export interface FootballLiveData extends BaseLiveData {
  Innings?: number[][];
  YellowCards?: {
    home: number;
    away: number;
  };
  RedCards?: {
    home: number;
    away: number;
  };
  Corners?: {
    home: number;
    away: number;
  };
}

// Basketball specific live data
export interface BasketballLiveData extends BaseLiveData {
  Quarters?: number[][];
  Fouls?: {
    home: number;
    away: number;
  };
  Timeouts?: {
    home: number;
    away: number;
  };
}

// Sport specific display configuration
export interface SportDisplayConfig {
  sportName: string;
  primaryScore: {
    showSets?: boolean;
    showQuarters?: boolean;
    showPeriods?: boolean;
  };
  secondaryStats: {
    showService?: boolean;
    showCards?: boolean;
    showCorners?: boolean;
    showFouls?: boolean;
    showTimeouts?: boolean;
  };
  timeDisplay: {
    showMatchTime?: boolean;
    showRemainingTime?: boolean;
    showGameTime?: boolean;
  };
  actions: {
    showLastAction?: boolean;
    showActionHistory?: boolean;
  };
}

// Sport mapping configuration
export const LIVE_STATS_CONFIG: Record<string, SportDisplayConfig> = {
  'Tenis': {
    sportName: 'Tenis',
    primaryScore: {
      showSets: true
    },
    secondaryStats: {
      showService: true
    },
    timeDisplay: {
      showGameTime: true
    },
    actions: {
      showLastAction: true
    }
  },
  'Tenis de Mesa': {
    sportName: 'Tenis de Mesa',
    primaryScore: {
      showSets: true
    },
    secondaryStats: {},
    timeDisplay: {
      showGameTime: true
    },
    actions: {
      showLastAction: true
    }
  },
  'Fútbol': {
    sportName: 'Fútbol',
    primaryScore: {},
    secondaryStats: {
      showCards: true,
      showCorners: true
    },
    timeDisplay: {
      showMatchTime: true
    },
    actions: {
      showLastAction: true,
      showActionHistory: true
    }
  },
  'e-Fútbol': {
    sportName: 'e-Fútbol',
    primaryScore: {},
    secondaryStats: {},
    timeDisplay: {
      showMatchTime: true,
      showRemainingTime: true
    },
    actions: {
      showLastAction: true
    }
  },
  'Baloncesto': {
    sportName: 'Baloncesto',
    primaryScore: {
      showQuarters: true
    },
    secondaryStats: {
      showFouls: true,
      showTimeouts: true
    },
    timeDisplay: {
      showMatchTime: true,
      showRemainingTime: true
    },
    actions: {
      showLastAction: true
    }
  },
  'Badminton': {
    sportName: 'Badminton',
    primaryScore: {
      showSets: true
    },
    secondaryStats: {},
    timeDisplay: {
      showGameTime: true
    },
    actions: {
      showLastAction: true
    }
  }
};

// Helper functions for live data processing
export class LiveStatsProcessor {
  static formatMatchTime(matchTime: number): string {
    if (matchTime === -1) return '';
    const minutes = Math.floor(matchTime);
    return `${minutes}'`;
  }

  static formatGameTime(time: string | undefined): string {
    if (!time) return '';
    return time;
  }

  static formatSets(sets: number[][] | undefined): string {
    if (!sets || sets.length === 0) return '';
    return sets.map(set => `${set[0]}-${set[1]}`).join(', ');
  }

  static getLastAction(actions: LiveAction[] | undefined): LiveAction | null {
    if (!actions || actions.length === 0) return null;
    return actions[actions.length - 1];
  }

  static formatPeriodName(periodName: string | undefined): string {
    if (!periodName) return '';
    return periodName;
  }

  static isServiceHome(liveData: TennisLiveData): boolean {
    return liveData.HomeService === true;
  }

  static formatScore(home: number | undefined, away: number | undefined): string {
    return `${home || 0} - ${away || 0}`;
  }
}

// Type guard functions
export function isTennisLiveData(liveData: any): liveData is TennisLiveData {
  return liveData && (liveData.Sets !== undefined || liveData.HomeService !== undefined);
}

export function isTableTennisLiveData(liveData: any): liveData is TableTennisLiveData {
  return liveData && liveData.Sets !== undefined;
}

export function isFootballLiveData(liveData: any): liveData is FootballLiveData {
  return liveData && (liveData.MatchTime !== undefined || liveData.Period !== undefined);
}

export function isBasketballLiveData(liveData: any): liveData is BasketballLiveData {
  return liveData && liveData.Quarters !== undefined;
}

// Live data dictionary for tracking unique properties found
export interface LiveDataDictionary {
  [sportName: string]: {
    discoveredProperties: string[];
    sampleData: any;
    lastUpdated: string;
  };
}

export const liveDataDictionary: LiveDataDictionary = {
  // Will be populated dynamically as new live data is encountered
};

// Function to update the dictionary with new properties
export function updateLiveDataDictionary(sportName: string, liveData: any): void {
  if (!liveData) return;

  const properties = Object.keys(liveData);
  
  if (!liveDataDictionary[sportName]) {
    liveDataDictionary[sportName] = {
      discoveredProperties: [],
      sampleData: {},
      lastUpdated: new Date().toISOString()
    };
  }

  // Add new properties
  properties.forEach(prop => {
    if (!liveDataDictionary[sportName].discoveredProperties.includes(prop)) {
      liveDataDictionary[sportName].discoveredProperties.push(prop);
      liveDataDictionary[sportName].sampleData[prop] = liveData[prop];
    }
  });

  liveDataDictionary[sportName].lastUpdated = new Date().toISOString();
  
  // Log new properties discovered
  console.log(`📊 Live Data Dictionary Updated for ${sportName}:`, {
    totalProperties: liveDataDictionary[sportName].discoveredProperties.length,
    newProperties: properties.filter(p => 
      !liveDataDictionary[sportName].discoveredProperties.includes(p)
    )
  });
}
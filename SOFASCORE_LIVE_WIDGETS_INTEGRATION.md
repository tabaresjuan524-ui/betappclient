# SofaScore Live Widgets & Sportsbook Integration

## Overview
This document explains how SofaScore data is integrated into the sportsbook for displaying live match widgets and betting odds when the feature flag is enabled.

## Architecture

### Backend Flow
1. **Data Fetching** (`SofaScoreAPIFetcher.ts`)
   - Fetches live sports data from SofaScore API
   - Intercepts detailed endpoints (odds, incidents, statistics, h2h)
   - Consolidates all data into a unified structure
   - Runs on 60-second intervals

2. **Data Transformation** (`sofascoreToLiveEventsTransformer.ts`)
   - Converts SofaScore data format to LiveEvent format
   - Transforms fractional odds (e.g., "5/7") to decimal odds (e.g., 1.71)
   - Extracts featured and all available markets
   - Maps event details (teams, scores, status, league info)

3. **Data Distribution** (`index.ts`)
   - Returns transformed data in two forms:
     - `liveEvents[]`: For sportsbook display
     - `sofascore{}`: Raw data for Redux and advanced widgets

### Frontend Flow
1. **WebSocket Reception** (`sportsService.ts`)
   - Receives batched updates every 5 seconds
   - Dispatches `updateLiveEvents()` for sportsbook
   - Dispatches `updateSofascoreData()` for Redux store

2. **Redux State** (`oddsSlice.ts`)
   - Stores raw SofaScore data with nested structure
   - Provides access to events, tournaments, teams, odds
   - Extracts and flattens event data for easy access

3. **UI Components**
   - **Sportsbook**: Displays SofaScore events alongside Codere/Luckia events
   - **SofascoreLiveWidget**: Shows live match cards with scores and odds

## Feature Flag

### Backend (.env)
```bash
# Enable SofaScore as a data source
APIS_TO_FETCH=sofascore,codere
```

### Frontend (.env.local)
```bash
# Enable SofaScore live widgets display
SOFASCORE_LIVE_WIDGETS=true
```

## Data Structure

### SofaScore Raw Data Format
```typescript
{
  eventCount: {
    tennis: { live: 19, total: 606 },
    basketball: { live: 1, total: 372 }
    // ... other sports
  },
  sports: {
    tennis: {
      liveEvents: {
        events: [
          {
            id: 15029486,
            homeTeam: { name: "Player A" },
            awayTeam: { name: "Player B" },
            homeScore: { display: 2 },
            awayScore: { display: 1 },
            status: { type: "inprogress", description: "2nd set" },
            tournament: { name: "ATP Masters 1000" }
          }
        ]
      },
      events: {
        "15029486": {
          "event/15029486": { /* event details */ },
          "event/15029486/odds/1/featured": {
            featured: {
              default: {
                marketName: "Match winner",
                choices: [
                  { name: "1", fractionalValue: "5/7" },
                  { name: "2", fractionalValue: "11/10" }
                ]
              }
            }
          },
          "event/15029486/odds/1/all": {
            markets: [ /* all markets */ ]
          },
          "event/15029486/incidents": { /* goals, cards, etc */ }
        }
      }
    }
  }
}
```

### Transformed LiveEvent Format
```typescript
{
  id: 15029486,
  api_name: "sofascore",
  sport_group: "Tennis",
  sport_category: "International",
  sport_title: "ATP Masters 1000",
  home_team: "Player A",
  away_team: "Player B",
  scores: {
    home: "2",
    away: "1"
  },
  markets: [
    {
      name: "Match winner",
      key: "market-123",
      outcomes: [
        { name: "1", price: 1.71, point: "", suspended: false },
        { name: "2", price: 2.10, point: "", suspended: false }
      ]
    }
  ],
  status: "2nd set",
  active: true,
  bettingActive: true,
  liveData: {
    incidents: [],
    statistics: {},
    h2h: {},
    rawEvent: { /* original event data */ }
  }
}
```

## Odds Transformation

### Fractional to Decimal Conversion
SofaScore provides odds in fractional format (e.g., "5/7", "20/23"), which are converted to decimal:

```typescript
function fractionalToDecimal(fractionalValue: string): number {
    const [numerator, denominator] = fractionalValue.split('/').map(parseFloat);
    return 1 + numerator / denominator;
}

// Examples:
"5/7"   → 1.71
"11/10" → 2.10
"20/23" → 1.87
"1/1"   → 2.00
```

## Markets Supported

### Featured Markets
- **Full time / Match winner**: Home/Draw/Away or Home/Away
- **Match goals / Totals**: Over/Under with point (e.g., Over 2.5)
- **Handicap / Spread**: Asian handicap with point

### Additional Markets (from odds/all endpoint)
- Both teams to score
- Correct score
- First goalscorer
- Half-time result
- Double chance
- And many more...

## UI Components

### 1. Sportsbook Integration
SofaScore events appear in the main sportsbook alongside Codere/Luckia events with:
- Blue "SofaScore" badge for identification
- Live score updates
- Match time tracking
- Available betting markets
- Odds with change indicators

**File**: `components/Sportsbook.tsx`
```tsx
{matchData.api_name === 'sofascore' && (
    <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded font-semibold">
        SofaScore
    </span>
)}
```

### 2. Live Match Widgets
Displays SofaScore live matches in card format with:
- Sport and league information
- Live score and match time
- Visual live indicator (pulsing red dot)
- Featured odds preview
- Team logos (when available)

**File**: `components/SofascoreLiveWidget.tsx`

**Usage**:
```tsx
import { SofascoreLiveWidget } from '../components/SofascoreLiveWidget';

// In your page component
<SofascoreLiveWidget />
```

## Redux Integration

### State Structure
```typescript
interface OddsState {
  sofascore: {
    data: any | null;
    lastUpdate: string | null;
    totalEvents: number;
    sports: Record<string, any>;
    tournaments: Record<string, any>;
    teams: Record<string, any>;
    events: Record<string, any>;
  };
}
```

### Actions
- `updateSofascoreData(payload)`: Updates SofaScore data in Redux
- `clearSofascoreData()`: Clears all SofaScore data

### Accessing Data
```tsx
import { useSelector } from 'react-redux';
import { RootState } from '../store';

function MyComponent() {
  const sofascoreData = useSelector((state: RootState) => state.odds.sofascore.data);
  const totalEvents = useSelector((state: RootState) => state.odds.sofascore.totalEvents);
  
  // Access specific sport
  const tennisEvents = sofascoreData?.sports?.tennis?.liveEvents?.events || [];
  
  // Access event details by ID
  const eventId = "15029486";
  const eventDetails = sofascoreData?.sports?.tennis?.events?.[eventId];
  const odds = eventDetails?.[`event/${eventId}/odds/1/featured`];
}
```

## Implementation Checklist

### Backend
- [x] Data fetching from SofaScore API
- [x] Odds endpoint interception
- [x] Data transformation to LiveEvent format
- [x] Fractional to decimal odds conversion
- [x] Market extraction and formatting
- [x] WebSocket distribution

### Frontend
- [x] Redux state configuration
- [x] WebSocket data reception
- [x] Redux actions and reducers
- [x] Sportsbook badge display
- [x] Live match widget component
- [x] Odds display and betting integration

### Testing
- [ ] Verify SofaScore events appear in sportsbook
- [ ] Confirm odds conversion accuracy
- [ ] Test live score updates
- [ ] Validate market data display
- [ ] Check betting slip integration
- [ ] Test Redux state updates

## Troubleshooting

### Events Not Appearing
1. Check backend logs for transformation:
   ```
   ✅ [SOFASCORE TRANSFORMER] Transformed X events to LiveEvents format
   ```

2. Verify Redux state in DevTools:
   - Check `state.odds.sofascore.data` is populated
   - Check `state.odds.liveEvents` contains SofaScore events

3. Confirm feature flag is enabled:
   - Backend: `APIS_TO_FETCH` includes "sofascore"
   - Frontend: `SOFASCORE_LIVE_WIDGETS=true`

### Odds Not Displaying
1. Check if event has odds data:
   ```typescript
   const eventId = "15029486";
   const oddsData = sportData.events[eventId]?.[`event/${eventId}/odds/1/featured`];
   console.log('Odds data:', oddsData);
   ```

2. Verify fractional conversion:
   ```typescript
   fractionalToDecimal("5/7") // Should return 1.71
   ```

### Widget Not Showing
1. Check component import and usage
2. Verify feature flag: `SOFASCORE_LIVE_WIDGETS=true`
3. Confirm Redux data exists: `sofascoreData?.sports`

## Performance Considerations

### Memory Management
- Raw SofaScore data stored in Redux (can be large)
- Transformed LiveEvents stored separately
- Consider implementing data cleanup for old events

### Update Frequency
- Backend: 60-second fetch cycle
- Frontend: 5-second WebSocket batched updates
- Live scores update in real-time via WebSocket

### Optimization Tips
1. Use `useMemo` for expensive computations
2. Implement virtual scrolling for large event lists
3. Lazy load event details on demand
4. Cache transformed data to avoid re-processing

## Future Enhancements

### Planned Features
- [ ] Team/player logos from SofaScore
- [ ] Match statistics widgets
- [ ] Head-to-head data display
- [ ] Incident timeline (goals, cards)
- [ ] Live match commentary
- [ ] Push notifications for score changes
- [ ] Favorite teams/players tracking

### API Enhancements
- [ ] Additional market types support
- [ ] Asian handicap odds
- [ ] In-play betting markets
- [ ] Cashout calculations
- [ ] Odds comparison across providers

## Related Files

### Backend
- `src/sources/sofascore/index.ts` - Main SofaScore integration
- `src/sources/sofascore/sofascoreToLiveEventsTransformer.ts` - Data transformation
- `src/sources/sofascore/SofaScoreAPIFetcher.ts` - API fetching logic

### Frontend
- `components/Sportsbook.tsx` - Main sportsbook display
- `components/SofascoreLiveWidget.tsx` - Live match widgets
- `store/slices/oddsSlice.ts` - Redux state management
- `lib/services/sportsService.ts` - WebSocket communication

### Configuration
- `luckiaServer/.env` - Backend configuration
- `webdev-arena-template/.env.local` - Frontend configuration

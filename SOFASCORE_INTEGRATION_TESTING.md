# SofaScore Widget Integration - Testing Guide

## ✅ Integration Complete!

All SofaScore widgets have been successfully integrated into `SofascoreWidgetView.tsx` with tabbed navigation.

## 📋 What Was Implemented

### 1. **Tab Navigation System**
- 7 tabs with icons and labels
- Smooth tab switching with visual feedback
- Responsive design with horizontal scrolling on mobile
- Active tab highlighting

### 2. **Tab Structure**
```
├── Overview      - Featured odds, markets, incidents, predictions
├── Statistics    - Match stats with comparison bars
├── Lineups       - Team formations and player details
├── Momentum      - Match flow graph
├── Standings     - Full league table
├── Form          - Team comparison with recent form
└── H2H           - Head-to-head history
```

### 3. **Data Mapping from Redux**

Each tab receives the appropriate data from Redux state:

```typescript
// Data extraction from Redux
const eventId = matchId.toString();
const sportData = sofascoreData?.sports?.[sportName];
const detailedData = sportData?.events?.[eventId];

// Endpoint mappings
├── eventDetails      → event/{eventId}
├── oddsData          → event/{eventId}/odds/1/featured
├── allOddsData       → event/{eventId}/odds/1/all
├── incidentsData     → event/{eventId}/incidents
├── h2hData           → event/{eventId}/h2h
├── statisticsData    → event/{eventId}/statistics
├── votesData         → event/{eventId}/votes
├── lineupsData       → event/{eventId}/lineups
├── graphData         → event/{eventId}/graph
├── standingsData     → tournament/{tournamentId}/season/{seasonId}/standings/total
└── pregameFormData   → event/{eventId}/pregame-form
```

### 4. **Component Props Mapping**

#### Statistics Widget
```typescript
<SofascoreStatistics
    statistics={statisticsData.statistics}
    homeTeamName={homeTeam}
    awayTeamName={awayTeam}
    homeTeamColor="#3b82f6"
    awayTeamColor="#ef4444"
/>
```

#### Lineups Widget
```typescript
<SofascoreLineups
    lineups={lineupsData}
    homeTeamName={homeTeam}
    awayTeamName={awayTeam}
    homeTeamColor="#3b82f6"
    awayTeamColor="#ef4444"
/>
```

#### Momentum Widget
```typescript
<SofascoreMomentum
    graphData={graphData}
    homeTeamName={homeTeam}
    awayTeamName={awayTeam}
    homeTeamColor="#3b82f6"
    awayTeamColor="#ef4444"
/>
```

#### Standings Widget
```typescript
<SofascoreStandings
    standingsData={standingsData}
    homeTeamId={eventDetails?.homeTeam?.id}
    awayTeamId={eventDetails?.awayTeam?.id}
/>
```

#### Prematch Form Widget
```typescript
<SofascorePrematchStandings
    standingsData={standingsData}
    pregameFormData={pregameFormData}
    homeTeamId={eventDetails?.homeTeam?.id}
    awayTeamId={eventDetails?.awayTeam?.id}
    homeTeamName={homeTeam}
    awayTeamName={awayTeam}
    homeTeamColor="#3b82f6"
    awayTeamColor="#ef4444"
/>
```

#### H2H Widget
```typescript
<SofascoreH2H
    h2hData={h2hData}
    homeTeamId={eventDetails?.homeTeam?.id}
    awayTeamId={eventDetails?.awayTeam?.id}
    homeTeamName={homeTeam}
    awayTeamName={awayTeam}
    homeTeamColor="#3b82f6"
    awayTeamColor="#ef4444"
/>
```

---

## 🧪 Testing Steps

### Step 1: Start the Backend Server
```bash
cd luckiaServer
npm run dev
```

**Expected Output:**
- ✅ WebSocket server running
- ✅ Browser pool initialized
- ✅ SofaScore scraper active
- ✅ Live events being fetched

### Step 2: Start the Frontend
```bash
cd webdev-arena-template
npm run dev
```

**Expected Output:**
- ✅ Next.js dev server running on http://localhost:3000
- ✅ No compilation errors

### Step 3: Navigate to a SofaScore Match

1. Open browser: http://localhost:3000
2. Look for matches with the "SofaScore" badge
3. Click on a SofaScore match to open details
4. Click "View SofaScore Data" button

### Step 4: Verify Each Tab

#### ✅ Overview Tab (Default)
**What to check:**
- [ ] Featured odds are displayed
- [ ] All markets list is visible
- [ ] Match incidents timeline shows
- [ ] User predictions are displayed
- [ ] Score header shows correct teams and scores

#### ✅ Statistics Tab
**What to check:**
- [ ] Period tabs work (Full Match, 1st Half, 2nd Half)
- [ ] Statistics are grouped by category
- [ ] Progress bars show comparison between teams
- [ ] Home/away team colors are applied
- [ ] Each stat has correct label and values
- [ ] If no data: "No statistics data available" message

**Data to verify:**
```javascript
// In Redux DevTools, check:
state.odds.sofascore.data.sports[sportName].events[eventId]["event/{eventId}/statistics"]

// Should contain:
{
    statistics: [
        {
            period: "ALL",
            groups: [
                {
                    groupName: "Match overview",
                    statisticsItems: [
                        { name: "Ball possession", home: "52%", away: "48%" }
                    ]
                }
            ]
        }
    ]
}
```

#### ✅ Lineups Tab
**What to check:**
- [ ] Formations are displayed (e.g., "4-2-3-1")
- [ ] Players are organized by position (F/M/D/G)
- [ ] Jersey numbers are visible
- [ ] Player ratings are color-coded
- [ ] Captain badges show correctly
- [ ] Substitutes section displays
- [ ] Confirmed/Unconfirmed status indicator
- [ ] If no data: "No lineup data available" message

**Data to verify:**
```javascript
// In Redux DevTools:
state.odds.sofascore.data.sports[sportName].events[eventId]["event/{eventId}/lineups"]

// Should contain:
{
    confirmed: true,
    home: {
        formation: "4-2-3-1",
        players: [...]
    },
    away: {
        formation: "4-3-3",
        players: [...]
    }
}
```

#### ✅ Momentum Tab
**What to check:**
- [ ] Line chart renders with Recharts
- [ ] Graph shows minute-by-minute momentum
- [ ] Positive values favor home team
- [ ] Negative values favor away team
- [ ] Peak momentum displays for both teams
- [ ] Tooltip shows on hover
- [ ] Team colors are applied
- [ ] If no data: "No momentum data available" message

**Data to verify:**
```javascript
// In Redux DevTools:
state.odds.sofascore.data.sports[sportName].events[eventId]["event/{eventId}/graph"]

// Should contain:
{
    graphPoints: [
        { minute: 0, value: 0 },
        { minute: 10, value: 15 },
        { minute: 20, value: -10 }
    ]
}
```

#### ✅ Standings Tab
**What to check:**
- [ ] Full league table displays
- [ ] All teams are listed
- [ ] Columns: #, Team, P, W, D, L, GF, GA, GD, Pts
- [ ] Teams in current match are highlighted (blue background)
- [ ] Position indicators (green bars for qualification)
- [ ] Goal difference is color-coded (green/red)
- [ ] Table is responsive with horizontal scroll
- [ ] Legend explains indicators
- [ ] If no data: "No standings data available" message

**Data to verify:**
```javascript
// In Redux DevTools:
state.odds.sofascore.data.sports[sportName].events[eventId]["tournament/{tournamentId}/season/{seasonId}/standings/total"]

// Should contain:
{
    standings: [
        {
            rows: [
                {
                    position: 1,
                    team: { name: "Team Name", id: 123 },
                    matches: 10,
                    wins: 7,
                    draws: 2,
                    losses: 1,
                    scoresFor: 20,
                    scoresAgainst: 8,
                    points: 23
                }
            ]
        }
    ]
}
```

#### ✅ Form Tab
**What to check:**
- [ ] Side-by-side team cards display
- [ ] Current position shows for both teams
- [ ] Points, W/D/L stats visible
- [ ] Last 5 form indicators (W/L/D badges)
- [ ] Goal statistics (for/against/difference)
- [ ] Quick comparison section
- [ ] Team colors are applied
- [ ] If no data: "No form data available" message

**Data to verify:**
```javascript
// In Redux DevTools - needs both:
// 1. Standings data (same as Standings tab)
// 2. Pregame form data:
state.odds.sofascore.data.sports[sportName].events[eventId]["event/{eventId}/pregame-form"]

// Should contain:
{
    homeTeam: { form: "WWDLW", position: 3 },
    awayTeam: { form: "LWLWD", position: 7 }
}
```

#### ✅ H2H Tab
**What to check:**
- [ ] Win/Draw/Loss summary circles display
- [ ] Total goals for each team
- [ ] Match history cards show
- [ ] Dates are formatted (dd MMM yyyy)
- [ ] Scores are visible
- [ ] Result badges (W/D/L) are correct
- [ ] Footer statistics (avg goals, win %)
- [ ] Team colors are applied
- [ ] If no data: "No head-to-head data available" message

**Data to verify:**
```javascript
// In Redux DevTools:
state.odds.sofascore.data.sports[sportName].events[eventId]["event/{eventId}/h2h"]

// Should contain:
{
    events: [
        {
            homeTeam: { id: 123, name: "Team A" },
            awayTeam: { id: 456, name: "Team B" },
            homeScore: { current: 2 },
            awayScore: { current: 1 },
            startTimestamp: 1699000000,
            tournament: { name: "Premier League" }
        }
    ]
}
```

---

## 🔍 Debugging Tips

### Check Redux State
Open Redux DevTools and navigate to:
```
state.odds.sofascore.data
```

**Expected Structure:**
```javascript
{
    sports: {
        "Football": {
            liveEvents: {
                events: [...]
            },
            events: {
                "12345": {
                    "event/12345": {...},
                    "event/12345/statistics": {...},
                    "event/12345/lineups": {...},
                    "event/12345/graph": {...},
                    "event/12345/h2h": {...},
                    "event/12345/incidents": {...},
                    "event/12345/pregame-form": {...},
                    "event/12345/votes": {...},
                    "tournament/123/season/456/standings/total": {...}
                }
            }
        }
    }
}
```

### Check Browser Console

**Look for:**
- ✅ WebSocket connection messages
- ✅ Redux action dispatches
- ❌ No error messages
- ❌ No 404s for component imports

### Check Network Tab

**Verify WebSocket:**
- Should see `ws://localhost:3001` connection
- Messages flowing with `liveEvents` updates
- No connection errors

### Common Issues

#### Issue: "No data available" on all tabs
**Cause:** Data not being captured by scraper

**Solution:**
1. Check backend is running
2. Verify `APIS_TO_FETCH=sofascore` in `.env`
3. Check logs: `luckiaServer/logs/`
4. Ensure live events are being scraped

#### Issue: Tab not rendering widget
**Cause:** Component import error or missing data

**Solution:**
1. Check console for import errors
2. Verify component files exist in `components/sofascore/`
3. Check Redux state has the endpoint data

#### Issue: Widget shows but with errors
**Cause:** Data structure mismatch

**Solution:**
1. Compare Redux data structure with expected props
2. Check console for specific error messages
3. Add null checks if needed

#### Issue: Tabs not switching
**Cause:** State management issue

**Solution:**
1. Check `activeTab` state in React DevTools
2. Verify `setActiveTab` is being called on click
3. Check for JavaScript errors blocking execution

---

## 📊 Performance Checklist

- [ ] Tabs switch instantly (< 100ms)
- [ ] No memory leaks when switching tabs
- [ ] Widgets render smoothly
- [ ] Charts animate properly
- [ ] No layout shifts
- [ ] Responsive on mobile

---

## 🎯 Success Criteria

### Minimum Requirements
- ✅ All 7 tabs are accessible
- ✅ At least 3 widgets display data
- ✅ No console errors
- ✅ Tab navigation works smoothly

### Ideal State
- ✅ All widgets display data
- ✅ All endpoints are being captured
- ✅ Real-time updates work
- ✅ Responsive design on all screens
- ✅ Dark mode works correctly

---

## 📝 Test Results Template

```markdown
## Test Date: [Date]
## Tester: [Name]
## Match Tested: [Team A vs Team B]

### Tab Testing Results

| Tab        | Data Available | Renders Correctly | Issues Found |
|------------|----------------|-------------------|--------------|
| Overview   | ✅/❌          | ✅/❌             |              |
| Statistics | ✅/❌          | ✅/❌             |              |
| Lineups    | ✅/❌          | ✅/❌             |              |
| Momentum   | ✅/❌          | ✅/❌             |              |
| Standings  | ✅/❌          | ✅/❌             |              |
| Form       | ✅/❌          | ✅/❌             |              |
| H2H        | ✅/❌          | ✅/❌             |              |

### Overall Assessment
- [ ] All critical functionality works
- [ ] Ready for production
- [ ] Needs fixes (list below)

### Issues Found
1. 
2. 
3. 

### Notes
```

---

## 🚀 Next Steps After Testing

1. **If all tests pass:**
   - Mark testing task as complete
   - Deploy to staging environment
   - Perform user acceptance testing

2. **If issues found:**
   - Document issues with screenshots
   - Create GitHub issues for tracking
   - Prioritize fixes (critical, high, medium, low)
   - Fix and re-test

3. **Future Enhancements:**
   - Add Timeline widget for detailed match events
   - Add Streaks widget for team performance patterns
   - Implement team color detection from API
   - Add loading skeletons for better UX
   - Add error boundaries for graceful failures

---

## 📞 Support

If you encounter issues during testing:
1. Check the Redux state structure
2. Review browser console for errors
3. Check backend logs for scraper issues
4. Verify environment variables are set correctly

Good luck with testing! 🎉

# Frontend Cache Implementation Usage

## Overview

The frontend has been updated to use the new subscription-based cache implementation for efficient API calls to the Codere backend. This implementation ensures that only one API call is made per data type regardless of how many clients are connected.

## Key Changes Made

### 1. Updated WebSocket Service (`lib/services/sportsService.ts`)

**New Functions Added:**
- `subscribeToLeagues(nodeId: string)` - Subscribe to league data for a sport
- `unsubscribeFromLeagues(nodeId: string)` - Unsubscribe from league data
- `subscribeToLeagueEvents(leagueNodeId: string)` - Subscribe to events for a league
- `unsubscribeFromLeagueEvents(leagueNodeId: string)` - Unsubscribe from league events
- `getCacheStats()` - Get cache statistics for debugging

**Debug Console Access:**
All functions are available via `window.sportsServiceDebug` in the browser console for debugging:
```javascript
// Check cache statistics
window.sportsServiceDebug.getCacheStats();

// Check connection status
window.sportsServiceDebug.getConnectionStatus();

// Manual subscription/unsubscription
window.sportsServiceDebug.subscribeToLeagues('sport-node-id');
window.sportsServiceDebug.unsubscribeFromLeagues('sport-node-id');
```

### 2. Sidebar Component (`components/Sidebar.tsx`)

**Updated Behavior:**
- When a sport is **expanded**: Automatically subscribes to league data
- When a sport is **collapsed**: Automatically unsubscribes from league data
- When **switching views**: Unsubscribes from all active sport subscriptions
- **Component unmount**: Cleans up all active subscriptions

**Implementation:**
```tsx
const handleToggleSport = (nodeId: string) => {
  if (isExpanded) {
    unsubscribeFromLeagues(nodeId);
  } else {
    subscribeToLeagues(nodeId);
  }
};
```

### 3. LeagueView Component (`components/LeagueView.tsx`)

**Updated Behavior:**
- When a league is **selected**: Automatically subscribes to league events
- When **navigating back**: Unsubscribes from league events
- **Component unmount**: Cleans up league event subscription

**Implementation:**
```tsx
useEffect(() => {
  if (selectedLeague?.nodeId) {
    subscribeToLeagueEvents(selectedLeague.nodeId);
    
    return () => {
      unsubscribeFromLeagueEvents(selectedLeague.nodeId);
    };
  }
}, [selectedLeague?.nodeId]);
```

## User Experience Benefits

### 1. Efficient Resource Usage
- **Before**: Each client made separate API calls every 5 seconds
- **After**: Single API call shared among all clients interested in the same data

### 2. Automatic Cleanup
- **Before**: API calls continued even when no users were viewing the data
- **After**: API calls stop automatically when no users are subscribed

### 3. Real-time Updates
- All subscribed clients receive updates simultaneously
- Consistent data across multiple browser tabs/windows

## Testing the Implementation

### 1. Browser Console Testing
```javascript
// Check current cache status
window.sportsServiceDebug.getCacheStats();

// Test subscription
window.sportsServiceDebug.subscribeToLeagues('football-node-id');
window.sportsServiceDebug.getCacheStats(); // Should show 1 subscription

// Test unsubscription
window.sportsServiceDebug.unsubscribeFromLeagues('football-node-id');
window.sportsServiceDebug.getCacheStats(); // Should show 0 subscriptions
```

### 2. UI Testing
1. **Navigate to Sportsbook** (triggers left menu subscription)
2. **Expand a sport** (triggers league subscription)
3. **Select a league** (triggers league events subscription)
4. **Navigate back or collapse** (triggers unsubscription)
5. **Switch to different view** (triggers cleanup of all subscriptions)

### 3. Network Monitoring
- Open browser DevTools → Network tab
- Monitor WebSocket messages for subscription/unsubscription events
- Verify that API calls reduce when multiple tabs are open with same data

## Migration Notes

### Backward Compatibility
- Old functions (`getLeaguesForSport`, `getEventsForLeague`) are still available
- New subscription functions work alongside existing logic
- No breaking changes to existing functionality

### Performance Improvements
- **Memory**: Automatic cleanup prevents memory leaks
- **Network**: Reduced API calls for shared data
- **Battery**: Less background activity on mobile devices

## Future Enhancements

1. **Subscription Priority**: Different update frequencies for different data types
2. **Smart Reconnection**: Restore subscriptions after connection loss
3. **Data Persistence**: Cache data locally for offline viewing
4. **Real-time Notifications**: Push notifications for subscribed events

## Debugging

### Console Logs
The implementation includes detailed console logging:
- Subscription/unsubscription events
- WebSocket message handling
- Cache statistics requests

### Cache Statistics
Use `getCacheStats()` to monitor:
- Number of active subscriptions
- Subscription details per endpoint
- Last update timestamps
- Active intervals and timers

### Common Issues
1. **No data updates**: Check if properly subscribed via console
2. **Memory leaks**: Verify unsubscription on component unmount
3. **Multiple API calls**: Ensure old polling logic is not running simultaneously

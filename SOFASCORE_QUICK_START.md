# SofaScore Widgets - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

This guide will help you quickly verify that the SofaScore widget integration is working correctly.

---

## ✅ Prerequisites

Before starting, ensure you have:
- [x] Node.js installed (v16 or higher)
- [x] Both `luckiaServer` and `webdev-arena-template` folders
- [x] Dependencies installed in both projects

---

## 📋 Step-by-Step Setup

### Step 1: Configure Environment Variables (1 minute)

#### Backend (.env in luckiaServer/)
```bash
# If the file doesn't exist, create it
APIS_TO_FETCH=sofascore
PORT=3001
```

#### Frontend (.env.local in webdev-arena-template/)
```bash
# If the file doesn't exist, create it
NEXT_PUBLIC_SOFASCORE_LIVE_WIDGETS=true
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### Step 2: Start the Backend Server (30 seconds)

```powershell
cd "d:\proyects\sport betting proyect\luckiaServer"
npm run dev
```

**Expected Output:**
```
✓ WebSocket server started on port 3001
✓ Browser pool initialized
✓ Starting SofaScore scraper...
✓ Live events fetched: 15 events
```

**Leave this terminal running!**

### Step 3: Start the Frontend (30 seconds)

Open a **new terminal**:

```powershell
cd "d:\proyects\sport betting proyect\webdev-arena-template"
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- info  Loaded env from .env.local
✓ Compiled successfully
```

**Leave this terminal running too!**

### Step 4: Open the Application (30 seconds)

1. Open your browser: http://localhost:3000
2. You should see the main page with live matches
3. Look for matches with a **blue "SofaScore" badge**

### Step 5: Test the Widgets (2 minutes)

#### View a Match
1. Click on any match with the "SofaScore" badge
2. Click the **"View SofaScore Data"** button
3. You should see the widget view with tabs

#### Test Each Tab
Click through each tab and verify it displays:

1. **Overview** ✅
   - Should show: Odds, incidents, predictions
   
2. **Statistics** 📊
   - Should show: Match stats with comparison bars
   - Try switching between "Full Match", "1st Half", "2nd Half"
   
3. **Lineups** ⚽
   - Should show: Team formations and player cards
   
4. **Momentum** 📈
   - Should show: Line chart with match flow
   
5. **Standings** 🏆
   - Should show: League table with all teams
   
6. **Form** 📊
   - Should show: Team comparison with last 5 matches
   
7. **H2H** 🔄
   - Should show: Previous encounters between teams

---

## ✅ Success Checklist

After following the steps above, verify:

- [ ] Backend server is running without errors
- [ ] Frontend server is running without errors
- [ ] Browser opens to http://localhost:3000
- [ ] You can see matches with "SofaScore" badge
- [ ] Clicking a match opens the detail view
- [ ] "View SofaScore Data" button is visible
- [ ] Widget view opens with all 7 tabs
- [ ] At least 3 tabs show data (not "No data available")
- [ ] Tab switching works smoothly
- [ ] No console errors in browser DevTools

---

## 🔍 Quick Troubleshooting

### Problem: No "SofaScore" badge on matches

**Solution:**
1. Check backend logs for scraping errors
2. Verify `APIS_TO_FETCH=sofascore` in backend `.env`
3. Wait 30-60 seconds for initial data load
4. Refresh the page

### Problem: "No data available" on all tabs

**Solution:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for Redux state: Type `window.__REDUX_DEVTOOLS_EXTENSION__`
4. Check if WebSocket is connected (Network tab → WS filter)
5. Verify backend is sending data (check backend logs)

### Problem: Some tabs work, others show "No data available"

**This is normal!** Not all endpoints may have data for every match:
- **Live matches**: Usually have statistics, lineups, momentum
- **Pre-match**: May have standings, form, h2h but no statistics yet
- **Finished matches**: May have all data

### Problem: Tabs not clickable

**Solution:**
1. Check browser console for JavaScript errors
2. Clear browser cache and hard reload (Ctrl+Shift+R)
3. Verify all component files exist in `components/sofascore/`

### Problem: Backend won't start

**Solution:**
```powershell
# Reinstall dependencies
cd luckiaServer
rm -r node_modules
rm package-lock.json
npm install
npm run dev
```

### Problem: Frontend won't start

**Solution:**
```powershell
# Reinstall dependencies
cd webdev-arena-template
rm -r node_modules
rm -r .next
rm package-lock.json
npm install
npm run dev
```

---

## 🧪 Quick Data Verification

### Check Redux State (30 seconds)

1. Open browser DevTools (F12)
2. Install Redux DevTools extension if not installed
3. Click Redux tab
4. Navigate to: `State → odds → sofascore → data → sports`
5. You should see structure like:

```json
{
  "Football": {
    "liveEvents": { ... },
    "events": {
      "12345": {
        "event/12345": { ... },
        "event/12345/statistics": { ... },
        "event/12345/lineups": { ... },
        ...
      }
    }
  }
}
```

### Check WebSocket Connection (30 seconds)

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. You should see connection to `ws://localhost:3001`
5. Click on it to see messages flowing
6. Messages should contain `liveEvents` data

---

## 📊 Test with Mock Data (Optional)

If you don't want to wait for live matches, you can test with mock data:

### Create Test Script

Create `test-widgets.html` in `webdev-arena-template/`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Widget Test</title>
</head>
<body>
    <h1>Testing Widgets with Mock Data</h1>
    <p>Check browser console for details</p>
    
    <script>
        // This will log if widgets are properly imported
        console.log('Widgets loaded:', {
            Statistics: typeof SofascoreStatistics,
            Lineups: typeof SofascoreLineups,
            Momentum: typeof SofascoreMomentum,
            Standings: typeof SofascoreStandings,
            H2H: typeof SofascoreH2H,
            Form: typeof SofascorePrematchStandings
        });
    </script>
</body>
</html>
```

---

## 🎯 Expected Timeline

| Step | Time | Total |
|------|------|-------|
| Environment setup | 1 min | 1 min |
| Start backend | 30 sec | 1.5 min |
| Start frontend | 30 sec | 2 min |
| Open browser | 30 sec | 2.5 min |
| Test all tabs | 2 min | 4.5 min |
| **Total** | **~5 minutes** | |

---

## 📱 Mobile Testing (Optional)

To test on mobile devices on your local network:

1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Update frontend `.env.local`:
   ```bash
   NEXT_PUBLIC_WS_URL=ws://192.168.1.100:3001
   ```

3. Restart frontend server

4. On mobile browser, visit: `http://192.168.1.100:3000`

---

## 🎉 Success!

If you've completed all steps and can see the widgets displaying data, you're all set! 

### What's Next?

1. **Explore Features**: Try different matches and see various data
2. **Test Responsiveness**: Resize browser window to see mobile view
3. **Test Dark Mode**: Toggle dark mode in your system settings
4. **Check Performance**: Open DevTools Performance tab while switching tabs
5. **Review Documentation**: Read the full guides for advanced features

---

## 📚 Additional Resources

- **Full Testing Guide**: `SOFASCORE_INTEGRATION_TESTING.md`
- **Implementation Details**: `SOFASCORE_INTEGRATION_SUMMARY.md`
- **Visual Reference**: `SOFASCORE_WIDGETS_VISUAL_REFERENCE.md`
- **Widget Overview**: `SOFASCORE_WIDGETS_COMPLETE.md`

---

## 🆘 Still Having Issues?

### Check Logs

**Backend logs:**
```powershell
cd luckiaServer
# View latest log file
cat logs/scraper-log-*.txt | tail -100
```

**Frontend logs:**
Check the terminal where `npm run dev` is running

### Console Errors

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Redux DevTools for state issues

### Common Error Messages

| Error | Solution |
|-------|----------|
| "Cannot connect to WebSocket" | Backend not running or wrong URL |
| "Module not found" | Run `npm install` |
| "Port already in use" | Close other instances or change port |
| "No data available" | Wait for scraper to fetch data |

---

## ✨ Tips for Best Experience

1. **Use Live Matches**: They have the most complete data
2. **Be Patient**: Initial data load takes 30-60 seconds
3. **Check Backend Logs**: They show what's being scraped
4. **Use Redux DevTools**: Essential for debugging data issues
5. **Test Different Matches**: Some may have more data than others

---

**Quick Start Complete!** 🚀

You should now have a fully functional SofaScore widget integration. Enjoy exploring the data!

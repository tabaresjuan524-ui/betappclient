const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8081,
  path: '/api/live-events',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('\n=== AVAILABLE SPORTS ===');
      const sportGroups = [...new Set(parsed.events.map(e => e.sport_group))];
      console.log('Sport groups:', sportGroups);
      
      console.log('\n=== SAMPLE EVENTS ===');
      parsed.events.slice(0, 5).forEach(event => {
        console.log(`Sport: ${event.sport_title} (${event.sport_group}) - ${event.home_team} vs ${event.away_team}`);
      });
      
      // Look for tennis and basketball specifically
      const tennis = parsed.events.filter(e => 
        e.sport_title.toLowerCase().includes('tenis') || 
        e.sport_group.toLowerCase().includes('tennis')
      );
      const basketball = parsed.events.filter(e => 
        e.sport_title.toLowerCase().includes('baloncesto') || 
        e.sport_group.toLowerCase().includes('basketball')
      );
      
      console.log(`\n=== TARGET SPORTS ===`);
      console.log(`Tennis matches: ${tennis.length}`);
      console.log(`Basketball matches: ${basketball.length}`);
      
      if (tennis.length > 0) {
        console.log('First tennis match:', tennis[0]);
      }
      if (basketball.length > 0) {
        console.log('First basketball match:', basketball[0]);
      }
      
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();
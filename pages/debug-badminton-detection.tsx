import React from 'react';
import { initialSportCategories } from '../lib/data/sportCategories';

// Copy the exact detection function to test it
const getSportBackground = (sportName: string, sportCategories: any[]): string | null => {
  console.log(`🔍 Searching sport background for sport: "${sportName}"`);
  
  if (!sportName) {
    console.warn('No sport name provided for background mapping');
    return null;
  }

  // First try exact match
  const exactMatch = sportCategories.find(cat => {
    console.log(`Checking category: ${cat.name} with aliases: ${cat.aliases?.join(', ') || 'none'}`);
    
    // Check main name
    if (cat.name.toLowerCase() === sportName.toLowerCase()) {
      return true;
    }
    
    // Check aliases for exact match and partial matches
    if (cat.aliases) {
      return cat.aliases.some((alias: string) => {
        const aliasLower = alias.toLowerCase();
        const sportLower = sportName.toLowerCase();
        
        // Exact match
        if (aliasLower === sportLower) {
          console.log(`✅ Exact alias match: "${alias}" for sport "${sportName}"`);
          return true;
        }
        
        // Partial matches for compound names
        if (sportLower.includes(aliasLower) || aliasLower.includes(sportLower)) {
          console.log(`✅ Partial alias match: "${alias}" contains or is contained in "${sportName}"`);
          return true;
        }
        
        return false;
      });
    }
    
    return false;
  });
  
  if (exactMatch?.sportBackground) {
    console.log(`✅ Found exact match for "${sportName}": ${exactMatch.sportBackground}`);
    return exactMatch.sportBackground;
  }

  // Fallback mapping for common variations
  const sportLower = sportName.toLowerCase();
  console.log(`Checking fallback mappings for: "${sportLower}"`);
  
  if (sportLower.includes('badminton') || sportLower.includes('bádminton')) {
    console.log(`🏸 Badminton detected for: "${sportName}"`);
    return 'badminton.svg';
  }
  
  console.log(`❌ No background found for: "${sportName}"`);
  return null;
};

const DebugBadmintonDetection: React.FC = () => {
  const testNames = [
    'Badminton',
    'badminton',
    'BADMINTON', 
    'Bádminton',
    'Badmington',
    'Master de AI Ain - Dobles Mixto',
    'Liga Pro',
    'Tenis de Mesa'
  ];

  React.useEffect(() => {
    console.clear();
    console.log('=== BADMINTON DETECTION DEBUG ===');
    
    testNames.forEach(name => {
      console.log(`\n--- Testing: "${name}" ---`);
      const result = getSportBackground(name, initialSportCategories);
      console.log(`Result: ${result || 'NO MATCH'}\n`);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Badminton Detection Debug
      </h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Detection Results (Check Console)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {testNames.map((name, index) => {
              const result = getSportBackground(name, initialSportCategories);
              return (
                <div key={index} className="bg-slate-700 p-3 rounded">
                  <div className="text-white font-medium">"{name}"</div>
                  <div className={`text-sm ${result ? 'text-green-300' : 'text-red-300'}`}>
                    {result || 'No match found'}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium inline-block mt-1 ${
                    result ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {result ? '✅ DETECTED' : '❌ NOT DETECTED'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Badminton Category Info
          </h3>
          <div className="text-sm text-gray-300">
            {(() => {
              const badmintonCat = initialSportCategories.find(cat => 
                cat.name.toLowerCase() === 'badminton'
              );
              return (
                <div className="space-y-1">
                  <div>Found: {badmintonCat ? '✅ Yes' : '❌ No'}</div>
                  <div>Name: {badmintonCat?.name || 'N/A'}</div>
                  <div>Background: {badmintonCat?.sportBackground || 'N/A'}</div>
                  <div>Aliases: {badmintonCat?.aliases?.join(', ') || 'None'}</div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Direct SVG Test
          </h3>
          <div className="bg-white p-4 rounded h-32">
            <img 
              src="/cache/sport-backgrounds/badminton.svg"
              alt="Badminton SVG"
              className="w-full h-full object-contain"
              onLoad={() => console.log('✅ badminton.svg loaded successfully')}
              onError={() => console.error('❌ badminton.svg failed to load')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugBadmintonDetection;
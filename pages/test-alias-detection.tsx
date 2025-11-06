import React from 'react';
import { initialSportCategories } from '../lib/data/sportCategories';

// Import the exact function from LiveMatchHeader (copy it here for testing)
const getSportBackground = (sportName: string, sportCategories: any[]): string | null => {
  if (!sportName) {
    return null;
  }

  // First try exact match
  const exactMatch = sportCategories.find(cat => {
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
          return true;
        }
        
        // Partial matches for compound names
        if (sportLower.includes(aliasLower) || aliasLower.includes(sportLower)) {
          return true;
        }
        
        return false;
      });
    }
    
    return false;
  });
  
  if (exactMatch?.sportBackground) {
    return exactMatch.sportBackground;
  }

  // Fallback mapping for common variations
  const sportLower = sportName.toLowerCase();
  
  if (sportLower.includes('table tennis') || sportLower.includes('tenis de mesa')) {
    return 'table_tennis.svg';
  }
  
  return null;
};

const TestAliasDetection: React.FC = () => {
  const testCases = [
    'TT Elite Series',
    'Tenis de Mesa',
    'Table Tennis',
    'tenis de mesa',
    'TABLE TENNIS',
    'Baloncesto',
    'Basketball',
    'Tenis',
    'Tennis',
    'ITF M25 Salvador - Dobles (BR)'
  ];

  React.useEffect(() => {
    testCases.forEach(testCase => {
      const result = getSportBackground(testCase, initialSportCategories);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Alias Detection Test
      </h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Sport Categories with Aliases
          </h2>
          <div className="space-y-3">
            {initialSportCategories
              .filter(cat => cat.aliases && cat.aliases.length > 0)
              .map(cat => (
                <div key={cat.id} className="bg-slate-700 p-3 rounded">
                  <div className="text-yellow-400 font-medium">{cat.name}</div>
                  <div className="text-sm text-gray-300">
                    Aliases: {cat.aliases?.join(', ')}
                  </div>
                  <div className="text-xs text-gray-400">
                    Background: {cat.sportBackground || 'none'}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Test Results (Check Console)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {testCases.map((testCase, index) => {
              const result = getSportBackground(testCase, initialSportCategories);
              return (
                <div key={index} className="bg-slate-700 p-3 rounded flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium">"{testCase}"</div>
                    <div className="text-sm text-gray-300">
                      {result || 'No match found'}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    result ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {result ? '✅' : '❌'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAliasDetection;
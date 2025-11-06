import React from 'react';
import { initialSportCategories } from '../lib/data/sportCategories';

// Test function (same as in LiveMatchHeader)
const getSportBackground = (sportName: string): string | null => {
  if (!sportName) return null;
  
  // First check if we have a direct match in sport categories
  const category = initialSportCategories.find(cat => 
    cat.name.toLowerCase() === sportName.toLowerCase()
  );
  
  if (category?.sportBackground) {
    return category.sportBackground;
  }
  
  // Fallback name-based detection
  const sportLower = sportName.toLowerCase();
  
  if (sportLower.includes('basketball') || sportLower.includes('baloncesto') || sportLower.includes('fiba')) {
    return 'basketball.svg';
  } else if (sportLower.includes('tennis') || sportLower.includes('tenis') || sportLower.includes('itf')) {
    return 'tennis.svg';
  } else if (sportLower.includes('fútbol') || sportLower.includes('football') || sportLower.includes('soccer')) {
    return 'soccer.svg';
  } else if (sportLower.includes('e-football') || sportLower.includes('e-fútbol')) {
    return 'efootball.svg';
  } else if (sportLower.includes('e-basket')) {
    return 'ebasket.svg';
  } else if (sportLower.includes('esports') || sportLower.includes('e-sports')) {
    return 'esports.svg';
  } else if (sportLower.includes('table tennis') || sportLower.includes('tenis de mesa')) {
    return 'table_tennis.svg';
  } else if (sportLower.includes('hockey') || sportLower.includes('hielo')) {
    return 'ice_hockey.svg';
  } else if (sportLower.includes('handball') || sportLower.includes('balonmano')) {
    return 'handball.svg';
  } else if (sportLower.includes('volleyball') || sportLower.includes('voleibol')) {
    return 'volleyball.svg';
  } else if (sportLower.includes('beach volleyball') || sportLower.includes('voley playa')) {
    return 'beach_volleyball.svg';
  } else if (sportLower.includes('futsal') || sportLower.includes('sala')) {
    return 'futsal.svg';
  } else if (sportLower.includes('baseball') || sportLower.includes('béisbol')) {
    return 'baseball.svg';
  } else if (sportLower.includes('boxing') || sportLower.includes('boxeo')) {
    return 'boxing.svg';
  } else if (sportLower.includes('snooker')) {
    return 'snooker.svg';
  }
  
  return null;
};

const TestSportMapping: React.FC = () => {
  // Test various sport name variations
  const testSports = [
    'Fútbol',
    'Football', 
    'Soccer',
    'Tenis',
    'Tennis',
    'ITF',
    'Baloncesto',
    'Basketball',
    'FIBA',
    'E-Football',
    'E-Fútbol',
    'E-Basket',
    'eSports',
    'E-Sports',
    'Table Tennis',
    'Tenis de Mesa',
    'Hockey',
    'Ice Hockey',
    'Hockey Hielo',
    'Handball',
    'Balonmano',
    'Volleyball',
    'Voleibol',
    'Beach Volleyball',
    'Voley Playa',
    'Futsal',
    'Fútbol Sala',
    'Baseball',
    'Béisbol',
    'Boxing',
    'Boxeo',
    'Snooker',
    'Unknown Sport',
    'Random Name'
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Sport Background Mapping Test
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Available SVG Backgrounds
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {[
              'soccer.svg',
              'basketball.svg', 
              'tennis.svg',
              'volleyball.svg',
              'handball.svg',
              'futsal.svg',
              'esports.svg',
              'table_tennis.svg',
              'ice_hockey.svg',
              'beach_volleyball.svg',
              'ebasket.svg',
              'efootball.svg',
              'baseball.svg',
              'boxing.svg',
              'snooker.svg'
            ].map(file => (
              <div key={file} className="bg-slate-700 p-2 rounded text-center">
                <img 
                  src={`/cache/sport-backgrounds/${file}`}
                  alt={file}
                  className="w-8 h-8 mx-auto mb-1 opacity-60"
                />
                <div className="text-xs text-gray-300">{file}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white mb-4">
            Sport Name Mapping Results
          </h2>
          {testSports.map((sport, index) => {
            const background = getSportBackground(sport);
            return (
              <div key={index} className="bg-slate-800 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {background ? (
                    <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center">
                      <img 
                        src={`/cache/sport-backgrounds/${background}`}
                        alt={background}
                        className="w-6 h-6 opacity-80"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-red-900 rounded flex items-center justify-center">
                      <span className="text-red-400 text-xs">X</span>
                    </div>
                  )}
                  <div>
                    <div className="text-white font-medium">"{sport}"</div>
                    <div className="text-sm text-gray-400">
                      {background ? `Maps to: ${background}` : 'No background found'}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-medium ${
                  background ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                }`}>
                  {background ? 'MAPPED' : 'UNMAPPED'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestSportMapping;
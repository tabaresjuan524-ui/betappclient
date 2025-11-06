import React from 'react';

const SvgTestPage: React.FC = () => {
  const svgFiles = [
    'american_football.svg',
    'badminton.svg', 
    'baseball.svg',
    'basketball.svg',
    'beach_volleyball.svg',
    'boxing.svg',
    'cricket.svg',
    'darts.svg',
    'ebasket.svg',
    'efootball.svg',
    'esports.svg',
    'futsal.svg',
    'golf.svg',
    'handball.svg',
    'horse_racing.svg',
    'ice_hockey.svg',
    'mma.svg',
    'rugby.svg',
    'snooker.svg',
    'soccer.svg',
    'table_tennis.svg',
    'tennis.svg',
    'volleyball.svg'
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-8 text-center">
          🎨 Sport Background SVG Test
        </h1>
        
        <div className="mb-6 bg-blue-900/30 border border-blue-500 rounded-lg p-4">
          <p className="text-blue-200">
            Testing all sport background SVG files to ensure they load correctly.
            Each SVG should display with a light background for visibility.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {svgFiles.map((svgFile) => (
            <div key={svgFile} className="bg-white rounded-lg p-4 text-center">
              <div className="h-16 w-16 mx-auto mb-2 flex items-center justify-center">
                <img 
                  src={`/cache/sport-backgrounds/${svgFile}`}
                  alt={svgFile.replace('.svg', '').replace('_', ' ')}
                  className="max-h-full max-w-full object-contain"
                  onLoad={() => console.log(`✅ ${svgFile} loaded successfully`)}
                  onError={(e) => {
                    console.error(`❌ ${svgFile} failed to load`);
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRkY2B6OCIvPgo8dGV4dCB4PSIzMiIgeT0iMzQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5PIFNWRzwvdGV4dD4KPHN2Zz4=';
                  }}
                />
              </div>
              <div className="text-xs font-medium text-gray-800 break-all">
                {svgFile.replace('.svg', '').replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-white text-xl font-semibold mb-4">📋 SVG Status</h2>
          <div className="text-gray-300 text-sm">
            <p>Total SVG files: <span className="text-yellow-400 font-bold">{svgFiles.length}</span></p>
            <p>Check browser console for load status of each file.</p>
            <p>✅ = Successfully loaded | ❌ = Failed to load</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgTestPage;
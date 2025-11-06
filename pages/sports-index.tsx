import React from 'react';
import Link from 'next/link';

const SportsIndexPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-5xl font-bold mb-8 text-center">
          🏆 Sports Live Widget Samples
        </h1>
        
        <div className="mb-8 text-center">
          <p className="text-gray-300 text-lg mb-6">
            Comprehensive collection of live sports widgets with mock data for all major sports.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* All Sports Samples */}
          <Link href="/all-sports-samples" className="group">
            <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-6 rounded-lg hover:from-blue-800 hover:to-purple-800 transition-all duration-300 border border-blue-500/30">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">🌟</span>
                <div>
                  <h2 className="text-white text-2xl font-bold group-hover:text-blue-200">
                    All Sports Samples
                  </h2>
                  <p className="text-blue-200">Complete collection with 25+ sports</p>
                </div>
              </div>
              <div className="text-blue-100 text-sm">
                <p>• Individual layouts for each sport</p>
                <p>• Realistic mock data structures</p>
                <p>• Sport-specific statistics and displays</p>
                <p>• Background SVGs for all sports</p>
              </div>
            </div>
          </Link>

          {/* Featured Sports */}
          <Link href="/sports-samples" className="group">
            <div className="bg-gradient-to-br from-green-900 to-teal-900 p-6 rounded-lg hover:from-green-800 hover:to-teal-800 transition-all duration-300 border border-green-500/30">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">⭐</span>
                <div>
                  <h2 className="text-white text-2xl font-bold group-hover:text-green-200">
                    Featured Sports
                  </h2>
                  <p className="text-green-200">Main sports with detailed layouts</p>
                </div>
              </div>
              <div className="text-green-100 text-sm">
                <p>• Football, Basketball, Tennis</p>
                <p>• Baseball, Ice Hockey, Badminton</p>
                <p>• Volleyball, Table Tennis</p>
                <p>• Rich live data examples</p>
              </div>
            </div>
          </Link>

          {/* Badminton Test */}
          <Link href="/test-badminton" className="group">
            <div className="bg-gradient-to-br from-yellow-900 to-orange-900 p-6 rounded-lg hover:from-yellow-800 hover:to-orange-800 transition-all duration-300 border border-yellow-500/30">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">🏸</span>
                <div>
                  <h2 className="text-white text-2xl font-bold group-hover:text-yellow-200">
                    Badminton Test
                  </h2>
                  <p className="text-yellow-200">Specialized badminton layout</p>
                </div>
              </div>
              <div className="text-yellow-100 text-sm">
                <p>• Set-by-set scoring</p>
                <p>• Match progression tracking</p>
                <p>• Tournament information</p>
                <p>• Background testing</p>
              </div>
            </div>
          </Link>

          {/* Development Info */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-500/30">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">🛠️</span>
              <div>
                <h2 className="text-white text-2xl font-bold">
                  Development Info
                </h2>
                <p className="text-gray-300">Technical details</p>
              </div>
            </div>
            <div className="text-gray-200 text-sm space-y-1">
              <p><strong>Framework:</strong> Next.js + TypeScript</p>
              <p><strong>Styling:</strong> Tailwind CSS</p>
              <p><strong>Components:</strong> LiveMatchHeader</p>
              <p><strong>Sports:</strong> 25+ supported formats</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-white text-xl font-semibold mb-4">🏅 Supported Sports</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-blue-400 font-medium">Ball Sports</div>
              <div className="text-gray-300">⚽ Football/Soccer</div>
              <div className="text-gray-300">🏀 Basketball</div>
              <div className="text-gray-300">🏐 Volleyball</div>
              <div className="text-gray-300">🏈 American Football</div>
              <div className="text-gray-300">🏉 Rugby</div>
              <div className="text-gray-300">⚾ Baseball</div>
            </div>
            <div className="space-y-1">
              <div className="text-green-400 font-medium">Racket Sports</div>
              <div className="text-gray-300">🎾 Tennis</div>
              <div className="text-gray-300">🏸 Badminton</div>
              <div className="text-gray-300">🏓 Table Tennis</div>
              <div className="text-gray-300">🥎 Squash</div>
            </div>
            <div className="space-y-1">
              <div className="text-red-400 font-medium">Combat Sports</div>
              <div className="text-gray-300">🥊 Boxing</div>
              <div className="text-gray-300">🥋 MMA</div>
              <div className="text-gray-300">🤼 Wrestling</div>
            </div>
            <div className="space-y-1">
              <div className="text-purple-400 font-medium">Other Sports</div>
              <div className="text-gray-300">🏒 Ice Hockey</div>
              <div className="text-gray-300">🏏 Cricket</div>
              <div className="text-gray-300">🎯 Darts</div>
              <div className="text-gray-300">🎱 Snooker</div>
              <div className="text-gray-300">⛳ Golf</div>
              <div className="text-gray-300">🐴 Horse Racing</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-6">
          <h2 className="text-blue-200 text-xl font-semibold mb-3">📊 Features</h2>
          <div className="grid md:grid-cols-2 gap-4 text-blue-100 text-sm">
            <div>
              <p>✅ <strong>Responsive Design:</strong> Works on all screen sizes</p>
              <p>✅ <strong>Sport-Specific Layouts:</strong> Tailored for each sport</p>
              <p>✅ <strong>Live Data Support:</strong> Real-time score updates</p>
              <p>✅ <strong>Background Graphics:</strong> SVG sport backgrounds</p>
            </div>
            <div>
              <p>✅ <strong>TypeScript:</strong> Fully typed for reliability</p>
              <p>✅ <strong>Mock Data:</strong> Realistic test scenarios</p>
              <p>✅ <strong>Error Handling:</strong> Graceful fallbacks</p>
              <p>✅ <strong>Modular Code:</strong> Easy to extend</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsIndexPage;
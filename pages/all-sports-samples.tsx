import React from 'react';
import Link from 'next/link';
import LiveMatchHeader from '../components/LiveMatchHeader';
import { initialSportCategories } from '../lib/data/sportCategories';
import { LiveEvent } from '../lib/services/sportsService';
import { getAllSportsWithMockData, richMockData } from '../lib/utils/mockDataMapper';

// Get rich mock data for enhanced sports display
const allSportsTestData = getAllSportsWithMockData();

// 📊 Implementation Status Tracker - Enhanced with Rich Mock Data
const implementationStatus = {
  // Sports with Enhanced SimpleLiveStats Features
  "⚽ Fútbol": { implemented: true, layout: "Soccer Cards Display", background: "✅", features: "🟡🔴 Cards" },
  "🎾 Tenis": { implemented: true, layout: "Tennis Sets & Service", background: "✅", features: "🎾 Service, Sets" },
  "🏀 Baloncesto": { implemented: true, layout: "Basketball Quarters", background: "✅", features: "Q1-Q4 Display" },
  "� Hockey Hielo": { implemented: true, layout: "Ice Hockey Periods", background: "✅", features: "P1-P3 Display" },
  "🏈 Fútbol Americano": { implemented: true, layout: "American Football Complete", background: "✅", features: "� Possession, Quarters" },
  
  // Sports with Rich Data but Generic Display
  "🤾 Balonmano": { implemented: false, layout: "Rich Data Available", background: "✅", features: "Match Time, Actions" },
  "🏐 Voleibol": { implemented: false, layout: "Rich Data Available", background: "✅", features: "Sets Display" },
  "🏓 Tenis de Mesa": { implemented: false, layout: "Rich Data Available", background: "✅", features: "Sets Display" },
  "� Dardos": { implemented: false, layout: "Rich Data Available", background: "✅", features: "Legs Display" },
  "⚽ Futsal": { implemented: false, layout: "Rich Data Available", background: "✅", features: "Match Time" },
  "� e-Basket": { implemented: false, layout: "Rich Data Available", background: "✅", features: "Quarters" },
  "⚽ e-Fútbol": { implemented: false, layout: "Rich Data Available", background: "✅", features: "Match Time" },
  "� eSports": { implemented: false, layout: "Rich Data Available", background: "✅", features: "Game Time" },
  "🏉 Rugby": { implemented: false, layout: "Rich Data Available", background: "✅", features: "Match Time" },
  "⚾ Béisbol": { implemented: false, layout: "Rich Data Available", background: "✅", features: "Inning Data" }
};

export default function AllSportsWithSamples() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏆 Rich Mock Data Sports Display
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Live sports with enhanced features using real mockDataSamples from luckiaServer
          </p>
          <div className="bg-green-100 border border-green-400 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">✨ Enhanced Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-green-700">
              <div>⚽ Soccer: Yellow/Red Cards</div>
              <div>🎾 Tennis: Sets & Service Indicator</div>
              <div>🏀 Basketball: Quarter Scores</div>
              <div>🏒 Ice Hockey: Period Scores</div>
              <div>🏈 American Football: Possession & Quarters</div>
              <div>📊 Real luckiaServer mock data</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">📊 Rich Mock Data Implementation Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {Object.entries(implementationStatus).map(([sport, status]) => (
                <div key={sport} className="border rounded-lg p-3">
                  <div className="font-semibold text-sm">{sport}</div>
                  <div className={`text-xs ${status.implemented ? 'text-green-600' : 'text-orange-600'}`}>
                    {status.layout}
                  </div>
                  <div className="text-xs text-blue-600">
                    {status.features}
                  </div>
                  <div className="text-xs text-gray-500">
                    Background: {status.background}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <div className="flex justify-center space-x-8">
                <span className="text-green-600">✅ Enhanced Features: 5 sports</span>
                <span className="text-orange-600">🔄 Rich Data Available: 10 sports</span>
                <span className="text-blue-600">🎨 All using real mockDataSamples</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(allSportsTestData).map(([sportKey, event]) => {
            const sportConfig = richMockData[sportKey as keyof typeof richMockData];
            const statusKey = `${sportConfig?.emoji} ${event.sport_group}` as keyof typeof implementationStatus;
            const status = implementationStatus[statusKey];
            
            return (
              <div key={sportKey} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                    <span>{sportConfig?.emoji} {event.sport_group}</span>
                    <span className={`text-xs px-2 py-1 rounded ${status?.implemented ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                      {status?.implemented ? '✨ Enhanced' : '� Rich Data'}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600">{event.sport_title}</p>
                  {status?.features && (
                    <p className="text-xs text-blue-600 mt-1">{status.features}</p>
                  )}
                </div>
                <div className="p-4">
                  <LiveMatchHeader
                    event={event}
                    sportCategories={initialSportCategories}
                    onBack={() => console.log(`Back from ${sportKey}`)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <div className="space-x-4">
            <Link href="/sports-samples" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
              Basic Sports Samples
            </Link>
            <Link href="/test-badminton" className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
              Test Badminton
            </Link>
            <Link href="/" className="inline-block bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
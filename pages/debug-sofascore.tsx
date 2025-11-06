import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { createWebSocketConnection } from '../lib/services/sportsService';

const SofascoreDebug: React.FC = () => {
  const { sofascore, loading, error } = useSelector((state: RootState) => state.odds);

  useEffect(() => {
    console.log("🔍 [DEBUG PAGE] Initializing WebSocket connection...");
    createWebSocketConnection();
    
    // Debug current Redux state
    console.log("🔍 [DEBUG PAGE] Current SofaScore state:", {
      liveEventsCount: sofascore.liveEvents.length,
      sportsCount: sofascore.sports.length,
      liveSportsCount: sofascore.liveSports.length,
      tournamentsCount: Object.keys(sofascore.tournaments).length,
      playersCount: Object.keys(sofascore.players).length
    });
  }, []);

  useEffect(() => {
    console.log("🔍 [DEBUG PAGE] SofaScore state updated:", {
      liveEventsCount: sofascore.liveEvents.length,
      sportsCount: sofascore.sports.length,
      liveSportsCount: sofascore.liveSports.length
    });
  }, [sofascore]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">SofaScore Data Debug</h1>
        
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            Loading data...
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Events */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              SofaScore Live Events ({sofascore.liveEvents.length})
            </h2>
            <div className="max-h-96 overflow-y-auto">
              {sofascore.liveEvents.length > 0 ? (
                <div className="space-y-2">
                  {sofascore.liveEvents.slice(0, 10).map((event: any, index: number) => (
                    <div key={event.id || index} className="border-l-4 border-blue-500 pl-3 py-2 bg-gray-50">
                      <div className="font-medium text-sm">
                        {event.home_team} vs {event.away_team}
                      </div>
                      <div className="text-xs text-gray-600">
                        {event.sport_group} • {event.status} • Markets: {event.marketsCount || 0}
                      </div>
                    </div>
                  ))}
                  {sofascore.liveEvents.length > 10 && (
                    <div className="text-sm text-gray-500 text-center">
                      ... and {sofascore.liveEvents.length - 10} more events
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No live events found
                </div>
              )}
            </div>
          </div>

          {/* Sports */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              SofaScore Sports ({sofascore.sports.length})
            </h2>
            <div className="max-h-96 overflow-y-auto">
              {sofascore.sports.length > 0 ? (
                <div className="space-y-2">
                  {sofascore.sports.map((sport: any, index: number) => (
                    <div key={sport.key || index} className="border-l-4 border-green-500 pl-3 py-2 bg-gray-50">
                      <div className="font-medium text-sm">{sport.title}</div>
                      <div className="text-xs text-gray-600">
                        Key: {sport.key} • Group: {sport.group}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No sports found
                </div>
              )}
            </div>
          </div>

          {/* Live Sports */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              SofaScore Live Sports ({sofascore.liveSports.length})
            </h2>
            <div className="max-h-96 overflow-y-auto">
              {sofascore.liveSports.length > 0 ? (
                <div className="space-y-2">
                  {sofascore.liveSports.map((sport: any, index: number) => (
                    <div key={sport.id || index} className="border-l-4 border-purple-500 pl-3 py-2 bg-gray-50">
                      <div className="font-medium text-sm">{sport.name}</div>
                      <div className="text-xs text-gray-600">
                        Slug: {sport.slug} • ID: {sport.id}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No live sports found
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Live Events:</span>
                <span className="font-medium">{sofascore.liveEvents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sports:</span>
                <span className="font-medium">{sofascore.sports.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Live Sports:</span>
                <span className="font-medium">{sofascore.liveSports.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tournaments:</span>
                <span className="font-medium">{Object.keys(sofascore.tournaments).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Players:</span>
                <span className="font-medium">{Object.keys(sofascore.players).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Raw Data Preview */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Raw SofaScore Data (First 100 chars)</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
            {JSON.stringify(sofascore, null, 2).substring(0, 1000)}...
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SofascoreDebug;
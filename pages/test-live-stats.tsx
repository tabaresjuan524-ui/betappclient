import React, { useState, useEffect } from 'react';
import LiveMatchHeader from '../components/LiveMatchHeader';
import { SportCategory } from './data/sportCategories';
import { LIVE_STATS_CONFIG } from '../lib/data/liveStatsMapping';

// Mock sport categories for testing
const mockSportCategories: SportCategory[] = [
  {
    id: 1,
    name: 'Fútbol',
    icon: React.createElement('span', { className: 'text-lg' }, '⚽'),
    active: true,
    sportBackground: 'football.svg'
  },
  {
    id: 2,
    name: 'Tenis',
    icon: React.createElement('span', { className: 'text-lg' }, '🎾'),
    active: true,
    sportBackground: 'tennis.svg'
  },
  {
    id: 3,
    name: 'Baloncesto',
    icon: React.createElement('span', { className: 'text-lg' }, '🏀'),
    active: true,
    sportBackground: 'basketball.svg'
  },
  {
    id: 4,
    name: 'Badminton',
    icon: React.createElement('span', { className: 'text-lg' }, '🏸'),
    active: true,
    sportBackground: 'badminton.svg'
  }
];

const TestLiveStatsPage: React.FC = () => {
  const [mockEvents, setMockEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showDictionary, setShowDictionary] = useState(false);

  useEffect(() => {
    // Create mock events with different sports and live data
    const mockData = [
      {
        id: 1,
        sport_group: 'Tenis',
        sport_title: 'US Open - Masculino',
        home_team: 'Stefanos Tsitsipas',
        away_team: 'Daniel Altmaier',
        status: 'live',
        scores: { home: '15', away: '40' },
        team1_score: 15,
        team2_score: 40,
        match_time: '1',
        league_logo: '/cache/league-logos/US.png',
        liveData: {
          Sets: [[6, 7], [6, 1], [6, 4], [1, 3]],
          HomeService: false,
          SetsHome: 2,
          SetsAway: 1,
          Period: 18,
          PeriodName: '4º Set',
          ResultHome: 15,
          ResultAway: 40,
          Time: '01:35',
          MatchTime: -1,
          ParticipantHome: 'Stefanos Tsitsipas',
          ParticipantAway: 'Daniel Altmaier'
        }
      },
      {
        id: 2,
        sport_group: 'Fútbol',
        sport_title: 'Primera División',
        home_team: 'Barcelona',
        away_team: 'Real Madrid',
        status: 'live',
        scores: { home: '2', away: '1' },
        team1_score: 2,
        team2_score: 1,
        match_time: '67',
        league_logo: '/cache/league-logos/ES.png',
        liveData: {
          Period: 2,
          PeriodName: '2º Tiempo',
          ResultHome: 2,
          ResultAway: 1,
          Time: '67:30',
          MatchTime: 67,
          RemainingPeriodTime: '23:00',
          ParticipantHome: 'Barcelona',
          ParticipantAway: 'Real Madrid',
          Actions: [
            {
              Period: 2,
              PeriodName: '2º Tiempo',
              Time: 65,
              ActionType: 1,
              ActionTypeName: 'Gol',
              Participant: 'Messi',
              AffectedParticipant: '',
              IsHomeTeam: true
            }
          ]
        }
      },
      {
        id: 3,
        sport_group: 'Baloncesto',
        sport_title: 'NBA',
        home_team: 'Lakers',
        away_team: 'Warriors',
        status: 'live',
        scores: { home: '98', away: '102' },
        team1_score: 98,
        team2_score: 102,
        match_time: '8',
        league_logo: '/cache/league-logos/NBA2.png',
        liveData: {
          Quarters: [[25, 28], [22, 26], [28, 24], [23, 24]],
          Period: 4,
          PeriodName: '4º Cuarto',
          ResultHome: 98,
          ResultAway: 102,
          Time: '08:45',
          MatchTime: 8,
          RemainingPeriodTime: '08:45',
          ParticipantHome: 'Lakers',
          ParticipantAway: 'Warriors'
        }
      },
      {
        id: 4,
        sport_group: 'Tenis de Mesa',
        sport_title: 'Liga Pro',
        home_team: 'Milan Cetner',
        away_team: 'Michal Syroha',
        status: 'live',
        scores: { home: '0', away: '1' },
        team1_score: 0,
        team2_score: 1,
        match_time: '1',
        league_logo: '/cache/league-logos/CZ.png',
        liveData: {
          Sets: [[10, 12], [0, 1]],
          Period: 16,
          PeriodName: '2º Set',
          ResultHome: 0,
          ResultAway: 1,
          Time: '04:30',
          MatchTime: -1,
          ParticipantHome: 'Milan Cetner',
          ParticipantAway: 'Michal Syroha'
        }
      },
      {
        id: 5,
        sport_group: 'Badminton',
        sport_title: 'Master de Al Ain - Dobles Mixto',
        home_team: 'Team A',
        away_team: 'Team B',
        status: 'live',
        scores: { home: '1', away: '0' },
        team1_score: 1,
        team2_score: 0,
        match_time: '1',
        league_logo: '/cache/league-logos/AE.png',
        liveData: {
          Sets: [[21, 18], [15, 12]],
          Period: 2,
          PeriodName: '2º Set',
          ResultHome: 15,
          ResultAway: 12,
          Time: '25:30',
          MatchTime: -1,
          ParticipantHome: 'Team A',
          ParticipantAway: 'Team B'
        }
      }
    ];
    
    setMockEvents(mockData);
    setSelectedEvent(mockData[0]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Live Statistics Testing</h1>
        
        {/* Event Selector */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">Select Event to Test:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedEvent?.id === event.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                }`}
              >
                <div className="text-white font-semibold">{event.sport_group}</div>
                <div className="text-gray-300 text-sm">{event.home_team} vs {event.away_team}</div>
                <div className="text-green-400 text-xs">LIVE</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Match Header Display */}
        {selectedEvent && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">Live Match Header:</h2>
            <LiveMatchHeader
              event={selectedEvent}
              sportCategories={mockSportCategories}
              onBack={() => console.log('Back clicked')}
            />
          </div>
        )}

        {/* Dictionary Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowDictionary(!showDictionary)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {showDictionary ? 'Hide' : 'Show'} Live Data Dictionary
          </button>
        </div>

        {/* Live Data Dictionary Display */}
        {showDictionary && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Live Data Dictionary</h2>
            <div className="space-y-4">
              {Object.entries(liveDataDictionary).map(([sport, data]) => (
                <div key={sport} className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{sport}</h3>
                  <div className="text-sm text-gray-300 mb-2">
                    Last Updated: {new Date(data.lastUpdated).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    Properties Found: {data.discoveredProperties.length}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {data.discoveredProperties.map((prop) => (
                      <span key={prop} className="bg-blue-600/30 text-blue-200 px-2 py-1 rounded text-xs">
                        {prop}
                      </span>
                    ))}
                  </div>
                  <details className="mt-4">
                    <summary className="text-white cursor-pointer hover:text-blue-400">
                      Sample Data
                    </summary>
                    <pre className="bg-gray-900 p-3 rounded mt-2 text-xs text-gray-300 overflow-auto">
                      {JSON.stringify(data.sampleData, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
              {Object.keys(liveDataDictionary).length === 0 && (
                <div className="text-gray-400 text-center py-8">
                  No live data has been processed yet. Select an event above to populate the dictionary.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Event Debug Info */}
        {selectedEvent && (
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Debug Info for Selected Event</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Event Data</h3>
                <pre className="bg-gray-900 p-3 rounded text-xs text-gray-300 overflow-auto max-h-96">
                  {JSON.stringify(selectedEvent, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Live Data</h3>
                <pre className="bg-gray-900 p-3 rounded text-xs text-gray-300 overflow-auto max-h-96">
                  {JSON.stringify(selectedEvent.liveData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestLiveStatsPage;
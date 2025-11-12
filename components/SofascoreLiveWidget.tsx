import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

/**
 * SofaScore Live Match Widget Component
 * Displays live match information similar to SofaScore UI
 * Shows live scores, match time, odds, and incidents
 */
export const SofascoreLiveWidget: React.FC = () => {
    const sofascoreData = useSelector((state: RootState) => state.odds.sofascore.data);
    const liveWidgetsEnabled = process.env.NEXT_PUBLIC_SOFASCORE_LIVE_WIDGETS === 'true';

    // Extract live events from all sports
    const liveEvents = useMemo(() => {
        if (!sofascoreData || !sofascoreData.sports) return [];

        const events: any[] = [];
        Object.entries(sofascoreData.sports).forEach(([sportName, sportData]: [string, any]) => {
            const liveEventsArray = sportData.liveEvents?.events || [];
            liveEventsArray.forEach((event: any) => {
                events.push({
                    ...event,
                    sportName: sportName,
                    sportDisplayName: sportName.charAt(0).toUpperCase() + sportName.slice(1).replace(/-/g, ' ')
                });
            });
        });

        return events;
    }, [sofascoreData]);

    if (!liveWidgetsEnabled || liveEvents.length === 0) {
        return null;
    }

    return (
        <div className="sofascore-live-widgets-container bg-gray-900 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">🔴 Live Matches</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveEvents.map((event: any) => (
                    <LiveMatchCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
};

/**
 * Individual live match card component
 */
const LiveMatchCard: React.FC<{ event: any }> = ({ event }) => {
    const homeScore = event.homeScore?.display || event.homeScore?.current || 0;
    const awayScore = event.awayScore?.display || event.awayScore?.current || 0;
    const status = event.status?.description || event.status?.type || 'Live';
    const isLive = event.status?.type === 'inprogress';

    return (
        <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700">
            {/* Header: Sport and League */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase">
                        {event.sportDisplayName}
                    </span>
                    {isLive && (
                        <span className="flex items-center">
                            <span className="animate-pulse inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                            <span className="text-xs text-red-500 font-semibold">LIVE</span>
                        </span>
                    )}
                </div>
                <span className="text-xs text-gray-500">
                    {event.tournament?.name || 'League'}
                </span>
            </div>

            {/* Match Score Section */}
            <div className="space-y-2 mb-3">
                {/* Home Team */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                        <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                            {event.homeTeam?.name?.charAt(0) || 'H'}
                        </div>
                        <span className="text-white font-medium text-sm truncate">
                            {event.homeTeam?.name || 'Home Team'}
                        </span>
                    </div>
                    <span className="text-xl font-bold text-white ml-2">
                        {homeScore}
                    </span>
                </div>

                {/* Away Team */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                        <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                            {event.awayTeam?.name?.charAt(0) || 'A'}
                        </div>
                        <span className="text-white font-medium text-sm truncate">
                            {event.awayTeam?.name || 'Away Team'}
                        </span>
                    </div>
                    <span className="text-xl font-bold text-white ml-2">
                        {awayScore}
                    </span>
                </div>
            </div>

            {/* Match Status/Time */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <span className="text-xs text-gray-400">
                    {status}
                </span>
                {event.time?.currentPeriodStartTimestamp && (
                    <span className="text-xs text-green-400 font-semibold">
                        {Math.floor((Date.now() - event.time.currentPeriodStartTimestamp * 1000) / 60000)}'
                    </span>
                )}
            </div>

            {/* Odds Preview (if available) */}
            <OddsPreview event={event} />
        </div>
    );
};

/**
 * Odds preview component showing featured betting odds
 */
const OddsPreview: React.FC<{ event: any }> = ({ event }) => {
    const sofascoreData = useSelector((state: RootState) => state.odds.sofascore.data);
    
    // Get odds data for this event
    const eventId = event.id?.toString();
    const sportData = sofascoreData?.sports?.[event.sportName];
    const oddsData = sportData?.events?.[eventId]?.[`event/${eventId}/odds/1/featured`];

    if (!oddsData?.featured?.default) {
        return null;
    }

    const featuredOdds = oddsData.featured.default;
    const choices = featuredOdds.choices || [];

    // Convert fractional to decimal
    const fractionalToDecimal = (fractional: string) => {
        const parts = fractional.split('/');
        if (parts.length !== 2) return 1.0;
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        return (1 + num / den).toFixed(2);
    };

    return (
        <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">{featuredOdds.marketName}</span>
                {featuredOdds.isLive && (
                    <span className="text-xs text-yellow-500">🔴 Live</span>
                )}
            </div>
            <div className="grid grid-cols-2 gap-2">
                {choices.slice(0, 2).map((choice: any, index: number) => (
                    <button
                        key={index}
                        className="bg-gray-700 hover:bg-yellow-600 transition-colors rounded px-2 py-1.5 text-center"
                        disabled={featuredOdds.suspended}
                    >
                        <div className="text-xs text-gray-300">{choice.name}</div>
                        <div className="text-sm font-bold text-white">
                            {fractionalToDecimal(choice.fractionalValue)}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SofascoreLiveWidget;

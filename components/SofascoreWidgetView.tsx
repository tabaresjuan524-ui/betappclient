import React from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Users, Target } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface SofascoreWidgetViewProps {
    matchId: number;
    sportName: string;
    onBack: () => void;
}

/**
 * SofaScore Widget Detail View
 * Shows comprehensive match data including odds, statistics, incidents, and head-to-head
 */
const SofascoreWidgetView: React.FC<SofascoreWidgetViewProps> = ({ matchId, sportName, onBack }) => {
    const sofascoreData = useSelector((state: RootState) => state.odds.sofascore.data);
    
    // Get event data
    const eventId = matchId.toString();
    const sportData = sofascoreData?.sports?.[sportName];
    const liveEvent = sportData?.liveEvents?.events?.find((e: any) => e.id === matchId);
    const detailedData = sportData?.events?.[eventId];

    if (!liveEvent || !detailedData) {
        return (
            <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
                <header className="p-4 border-b dark:border-zinc-800 flex items-center">
                    <button onClick={onBack} className="mr-3">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-lg font-semibold">SofaScore Match Data</h2>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-slate-500">No SofaScore data available</p>
                </div>
            </div>
        );
    }

    const eventDetails = detailedData[`event/${eventId}`]?.event || liveEvent;
    const oddsData = detailedData[`event/${eventId}/odds/1/featured`];
    const allOddsData = detailedData[`event/${eventId}/odds/1/all`];
    const incidentsData = detailedData[`event/${eventId}/incidents`];
    const h2hData = detailedData[`event/${eventId}/h2h`];
    const statisticsData = detailedData[`event/${eventId}/statistics`];
    const votesData = detailedData[`event/${eventId}/votes`];

    const homeTeam = eventDetails.homeTeam?.name || liveEvent.homeTeam?.name;
    const awayTeam = eventDetails.awayTeam?.name || liveEvent.awayTeam?.name;
    const homeScore = liveEvent.homeScore?.display || liveEvent.homeScore?.current || 0;
    const awayScore = liveEvent.awayScore?.display || liveEvent.awayScore?.current || 0;
    const status = liveEvent.status?.description || liveEvent.status?.type;

    // Convert fractional to decimal
    const fractionalToDecimal = (fractional: string) => {
        if (!fractional) return '1.00';
        const parts = fractional.split('/');
        if (parts.length !== 2) return '1.00';
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        return (1 + num / den).toFixed(2);
    };

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100">
            {/* Header */}
            <header className="shrink-0 p-4 border-b dark:border-zinc-800 bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="flex items-center mb-3">
                    <button onClick={onBack} className="text-white mr-3 hover:bg-white/10 p-2 rounded">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold text-lg">SofaScore</span>
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded font-semibold">LIVE</span>
                    </div>
                </div>
                
                {/* Score Display */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                            <p className="font-semibold text-lg">{homeTeam}</p>
                        </div>
                        <span className="text-3xl font-bold mx-4">{homeScore}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="font-semibold text-lg">{awayTeam}</p>
                        </div>
                        <span className="text-3xl font-bold mx-4">{awayScore}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/20 text-sm">
                        <span className="text-blue-200">{status}</span>
                    </div>
                </div>
            </header>

            {/* Content - FIXED: Added proper overflow */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8">
                {/* Featured Odds */}
                {oddsData?.featured && (
                    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3 flex items-center">
                            <Target className="mr-2" size={20} />
                            Featured Odds
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(oddsData.featured).map(([key, market]: [string, any]) => {
                                if (!market || typeof market !== 'object') return null;
                                return (
                                    <div key={key} className="border dark:border-zinc-800 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">{market.marketName}</span>
                                            {market.isLive && (
                                                <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded">LIVE</span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {market.choices?.map((choice: any, idx: number) => (
                                                <div key={idx} className="bg-slate-100 dark:bg-zinc-800 rounded p-2 text-center">
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">{choice.name}</p>
                                                    <p className="text-lg font-bold">
                                                        {fractionalToDecimal(choice.fractionalValue)}
                                                    </p>
                                                    {choice.change !== 0 && (
                                                        <div className="flex items-center justify-center text-xs mt-1">
                                                            {choice.change > 0 ? (
                                                                <TrendingUp size={12} className="text-green-500 mr-1" />
                                                            ) : (
                                                                <TrendingDown size={12} className="text-red-500 mr-1" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* All Markets */}
                {allOddsData?.markets && allOddsData.markets.length > 0 && (
                    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3">All Markets ({allOddsData.markets.length})</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {allOddsData.markets.slice(0, 10).map((market: any, idx: number) => (
                                <div key={idx} className="border dark:border-zinc-800 rounded p-2">
                                    <p className="text-sm font-medium mb-1">{market.marketName}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {market.choices?.slice(0, 3).map((choice: any, cIdx: number) => (
                                            <span key={cIdx} className="text-xs bg-slate-200 dark:bg-zinc-800 px-2 py-1 rounded">
                                                {choice.name}: <span className="font-semibold">{fractionalToDecimal(choice.fractionalValue)}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Incidents */}
                {incidentsData?.incidents && incidentsData.incidents.length > 0 && (
                    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3 flex items-center">
                            <Clock className="mr-2" size={20} />
                            Match Incidents
                        </h3>
                        <div className="space-y-2">
                            {incidentsData.incidents.slice(0, 10).map((incident: any, idx: number) => (
                                <div key={idx} className="flex items-center border-l-4 border-blue-500 pl-3 py-2">
                                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mr-3">
                                        {incident.time}'
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm">{incident.text || incident.incidentType}</p>
                                        {incident.player && (
                                            <p className="text-xs text-slate-500">{incident.player.name}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Votes/Predictions */}
                {votesData?.vote && (
                    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3 flex items-center">
                            <Users className="mr-2" size={20} />
                            User Predictions
                        </h3>
                        <div className="space-y-2">
                            {votesData.vote.vote1 !== undefined && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{homeTeam} Win</span>
                                    <span className="font-semibold">{votesData.vote.vote1} votes</span>
                                </div>
                            )}
                            {votesData.vote.voteX !== undefined && votesData.vote.voteX !== null && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Draw</span>
                                    <span className="font-semibold">{votesData.vote.voteX} votes</span>
                                </div>
                            )}
                            {votesData.vote.vote2 !== undefined && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{awayTeam} Win</span>
                                    <span className="font-semibold">{votesData.vote.vote2} votes</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Head to Head */}
                {h2hData?.teamDuel && (
                    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3">Head to Head</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Previous encounters and statistics available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SofascoreWidgetView;

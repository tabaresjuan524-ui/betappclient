import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Team {
    name: string;
    shortName?: string;
    id: number;
}

interface Score {
    current: number;
    display: number;
    period1?: number;
    period2?: number;
    normaltime?: number;
}

interface H2HEvent {
    id: number;
    homeTeam: Team;
    awayTeam: Team;
    homeScore: Score;
    awayScore: Score;
    startTimestamp: number;
    status: {
        code: number;
        description: string;
        type: string;
    };
    tournament?: {
        name: string;
        category?: {
            name: string;
        };
    };
    winnerCode?: number;
}

interface TeamEventsData {
    events?: H2HEvent[];
}

interface H2HData {
    events?: H2HEvent[];
    teamDuel?: {
        homeWins: number;
        awayWins: number;
        draws: number;
    };
}

interface SofascoreH2HProps {
    h2hData?: H2HData;
    homeTeamId: number;
    awayTeamId: number;
    homeTeamName: string;
    awayTeamName: string;
    homeTeamColor?: string;
    awayTeamColor?: string;
    homeTeamLastEvents?: TeamEventsData;
    awayTeamLastEvents?: TeamEventsData;
    homeTeamNextEvents?: TeamEventsData;
    awayTeamNextEvents?: TeamEventsData;
}

const SofascoreH2H: React.FC<SofascoreH2HProps> = ({
    h2hData,
    homeTeamId,
    awayTeamId,
    homeTeamName,
    awayTeamName,
    homeTeamColor = '#3b82f6',
    awayTeamColor = '#ef4444',
    homeTeamLastEvents,
    awayTeamLastEvents,
    homeTeamNextEvents,
    awayTeamNextEvents,
}) => {
    const [activeTab, setActiveTab] = useState<'h2h' | 'matches'>('h2h');
    const [showAllH2H, setShowAllH2H] = useState(false);
    const [showAllMatches, setShowAllMatches] = useState(false);

    const h2hEvents = h2hData?.events || [];
    
    // Combine all team matches (last + next)
    const allMatches = [
        ...(homeTeamNextEvents?.events || []),
        ...(awayTeamNextEvents?.events || []),
        ...(homeTeamLastEvents?.events || []),
        ...(awayTeamLastEvents?.events || []),
    ].filter((event, index, self) => 
        index === self.findIndex((e) => e.id === event.id)
    ).sort((a, b) => b.startTimestamp - a.startTimestamp);

    // Debug logging
    console.log('=== H2H Component Debug ===');
    console.log('homeTeamId:', homeTeamId);
    console.log('awayTeamId:', awayTeamId);
    console.log('homeTeamLastEvents:', homeTeamLastEvents);
    console.log('awayTeamLastEvents:', awayTeamLastEvents);
    console.log('homeTeamNextEvents:', homeTeamNextEvents);
    console.log('awayTeamNextEvents:', awayTeamNextEvents);
    console.log('allMatches count:', allMatches.length);
    console.log('allMatches sample:', allMatches.slice(0, 3));
    console.log('h2hEvents count:', h2hEvents.length);
    console.log('h2hEvents sample:', h2hEvents.slice(0, 3));
    
    // Check if last events have scores
    if (homeTeamLastEvents?.events && homeTeamLastEvents.events.length > 0) {
        const sampleLast = homeTeamLastEvents.events[0];
        console.log('🔍 First LAST event detailed:', {
            id: sampleLast.id,
            homeTeam: sampleLast.homeTeam?.name,
            awayTeam: sampleLast.awayTeam?.name,
            status: sampleLast.status,
            homeScore: sampleLast.homeScore,
            awayScore: sampleLast.awayScore,
            startTimestamp: sampleLast.startTimestamp,
            fullObject: sampleLast
        });
    }
    
    if (homeTeamNextEvents?.events && homeTeamNextEvents.events.length > 0) {
        const sampleNext = homeTeamNextEvents.events[0];
        console.log('🔍 First NEXT event detailed:', {
            id: sampleNext.id,
            homeTeam: sampleNext.homeTeam?.name,
            awayTeam: sampleNext.awayTeam?.name,
            status: sampleNext.status,
            homeScore: sampleNext.homeScore,
            awayScore: sampleNext.awayScore,
            startTimestamp: sampleNext.startTimestamp,
            fullObject: sampleNext
        });
    }

    const displayH2HEvents = showAllH2H ? h2hEvents : h2hEvents.slice(0, 5);
    const displayMatches = showAllMatches ? allMatches : allMatches.slice(0, 10);

    const getTeamLogo = (teamId: number) => {
        return `https://img.sofascore.com/api/v1/team/${teamId}/image/small`;
    };

    const renderMatch = (event: H2HEvent, isH2H: boolean = false) => {
        const isLive = event.status.type === 'inprogress';
        const isFinished = event.status.type === 'finished';
        const isUpcoming = event.status.type === 'notstarted';

        // Check if scores exist
        const hasScores = event.homeScore && event.awayScore && 
                         typeof event.homeScore.current !== 'undefined' && 
                         typeof event.awayScore.current !== 'undefined';

        // Debug logging for each match
        if (!isH2H) {
            console.log(`Match ${event.id}:`, {
                homeTeam: event.homeTeam.name,
                awayTeam: event.awayTeam.name,
                status: event.status.type,
                isUpcoming,
                isFinished,
                hasScores,
                homeScore: event.homeScore,
                awayScore: event.awayScore,
                homeScoreCurrent: event.homeScore?.current,
                awayScoreCurrent: event.awayScore?.current
            });
        }

        // Determine result for badge
        const getResultForTeam = (teamId: number) => {
            if (!hasScores) return '';
            
            const isHome = event.homeTeam.id === teamId;
            const teamScore = isHome ? event.homeScore.current : event.awayScore.current;
            const opponentScore = isHome ? event.awayScore.current : event.homeScore.current;

            if (teamScore > opponentScore) return 'W';
            if (teamScore < opponentScore) return 'L';
            return 'D';
        };

        const getResultColor = (result: string) => {
            if (result === 'W') return 'bg-green-500';
            if (result === 'L') return 'bg-red-500';
            return 'bg-slate-400';
        };

        // Determine which team's result to show
        let resultBadge = '';
        if (hasScores && !isUpcoming) {
            if (isH2H) {
                // For H2H tab, show result from perspective of home team
                resultBadge = getResultForTeam(homeTeamId);
            } else {
                // For Matches tab, show result for whichever team from main match is playing
                if (event.homeTeam.id === homeTeamId || event.homeTeam.id === awayTeamId) {
                    resultBadge = getResultForTeam(event.homeTeam.id);
                } else if (event.awayTeam.id === homeTeamId || event.awayTeam.id === awayTeamId) {
                    resultBadge = getResultForTeam(event.awayTeam.id);
                }
            }
        }

        return (
            <div key={event.id} className="py-2 border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between">
                    {/* Date/Status */}
                    <div className="flex flex-col items-start w-20 text-xs text-slate-500 dark:text-slate-400">
                        <div>
                            {isLive && <span className="text-green-500 font-semibold">LIVE</span>}
                            {isFinished && format(new Date(event.startTimestamp * 1000), 'dd/MM/yy')}
                            {isUpcoming && format(new Date(event.startTimestamp * 1000), 'dd/MM/yy')}
                        </div>
                        <div className="mt-0.5">
                            {isFinished && <span className="text-slate-400">FT</span>}
                            {isUpcoming && format(new Date(event.startTimestamp * 1000), 'HH:mm')}
                        </div>
                    </div>

                    {/* Teams and Scores */}
                    <div className="flex-1 px-4">
                        {/* Home Team */}
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center flex-1">
                                <img 
                                    src={getTeamLogo(event.homeTeam.id)} 
                                    alt={event.homeTeam.name}
                                    className="w-4 h-4 mr-2"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                <span className="text-sm text-slate-800 dark:text-slate-100">
                                    {event.homeTeam.shortName || event.homeTeam.name}
                                </span>
                            </div>
                            {hasScores && !isUpcoming && (
                                <span className={`text-sm font-bold ml-2 min-w-[20px] text-right ${
                                    event.homeScore.current > event.awayScore.current ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                    {event.homeScore.current}
                                </span>
                            )}
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                                <img 
                                    src={getTeamLogo(event.awayTeam.id)} 
                                    alt={event.awayTeam.name}
                                    className="w-4 h-4 mr-2"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                <span className="text-sm text-slate-800 dark:text-slate-100">
                                    {event.awayTeam.shortName || event.awayTeam.name}
                                </span>
                            </div>
                            {hasScores && !isUpcoming && (
                                <span className={`text-sm font-bold ml-2 min-w-[20px] text-right ${
                                    event.awayScore.current > event.homeScore.current ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                    {event.awayScore.current}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Competition */}
                    <div className="w-28 text-xs text-slate-500 dark:text-slate-400 text-right truncate mr-2">
                        {event.tournament?.name}
                    </div>

                    {/* Result Badge - Show for all matches */}
                    {!isUpcoming && resultBadge && (
                        <div className={`w-6 h-6 rounded-full ${getResultColor(resultBadge)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {resultBadge}
                        </div>
                    )}
                    {isUpcoming && (
                        <div className="w-6 h-6 flex-shrink-0" />
                    )}
                </div>
            </div>
        );
    };

    if (!h2hData && !allMatches.length) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center text-slate-500 dark:text-slate-400">
                <p>No head-to-head data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('h2h')}
                    className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                        activeTab === 'h2h'
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-800'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                >
                    Head-to-head
                </button>
                <button
                    onClick={() => setActiveTab('matches')}
                    className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                        activeTab === 'matches'
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-800'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                >
                    Matches
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
                {activeTab === 'h2h' && (
                    <div>
                        {h2hData?.teamDuel && (() => {
                            const { homeWins, awayWins, draws } = h2hData.teamDuel;
                            const totalMatches = homeWins + awayWins + draws;
                            const homeWinPercentage = totalMatches > 0 ? (homeWins / totalMatches) * 100 : 0;
                            const drawPercentage = totalMatches > 0 ? (draws / totalMatches) * 100 : 0;
                            const awayWinPercentage = totalMatches > 0 ? (awayWins / totalMatches) * 100 : 0;

                            return (
                                <div className="mb-6">
                                    <div className="grid grid-cols-3 gap-4 items-center mb-3 text-center">
                                        <div className="flex flex-col items-center space-y-1">
                                            <p className="font-bold text-3xl" style={{ color: homeTeamColor }}>{homeWins}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Wins</p>
                                        </div>
                                        <div className="flex flex-col items-center space-y-1">
                                            <p className="font-bold text-3xl text-slate-600 dark:text-slate-300">{draws}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Draws</p>
                                        </div>
                                        <div className="flex flex-col items-center space-y-1">
                                            <p className="font-bold text-3xl" style={{ color: awayTeamColor }}>{awayWins}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Wins</p>
                                        </div>
                                    </div>
                                    <div className="w-full flex h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                                        <div style={{ width: `${homeWinPercentage}%`, backgroundColor: homeTeamColor }} />
                                        <div style={{ width: `${drawPercentage}%` }} className="bg-slate-400 dark:bg-slate-500" />
                                        <div style={{ width: `${awayWinPercentage}%`, backgroundColor: awayTeamColor }} />
                                    </div>
                                    {totalMatches > 0 && <p className="text-center text-xs text-slate-500 mt-2">Based on last {totalMatches} matches.</p>}
                                </div>
                            );
                        })()}

                        <h4 className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-300">Matches</h4>
                        {h2hEvents.length === 0 ? (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                                No head-to-head matches found
                            </p>
                        ) : (
                            <>
                                <div className="space-y-1">
                                    {displayH2HEvents.map(event => renderMatch(event, true))}
                                </div>
                                
                                {h2hEvents.length > 5 && (
                                    <button
                                        onClick={() => setShowAllH2H(!showAllH2H)}
                                        className="w-full mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        {showAllH2H ? (
                                            <>Show less <ChevronUp size={16} className="ml-1" /></>
                                        ) : (
                                            <>Show more <ChevronDown size={16} className="ml-1" /></>
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'matches' && (
                    <div>
                        {allMatches.length === 0 ? (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                                No matches found
                            </p>
                        ) : (
                            <>
                                <div className="space-y-1">
                                    {displayMatches.map(event => renderMatch(event, false))}
                                </div>
                                
                                {allMatches.length > 10 && (
                                    <button
                                        onClick={() => setShowAllMatches(!showAllMatches)}
                                        className="w-full mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        {showAllMatches ? (
                                            <>Show less <ChevronUp size={16} className="ml-1" /></>
                                        ) : (
                                            <>Show more <ChevronDown size={16} className="ml-1" /></>
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SofascoreH2H;

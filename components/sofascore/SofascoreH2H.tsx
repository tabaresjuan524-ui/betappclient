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

    const displayH2HEvents = showAllH2H ? h2hEvents : h2hEvents.slice(0, 5);
    const displayMatches = showAllMatches ? allMatches : allMatches.slice(0, 10);

    const getTeamLogo = (teamId: number) => {
        return `https://img.sofascore.com/api/v1/team/${teamId}/image/small`;
    };

    const getResultBadge = (event: H2HEvent, teamId: number) => {
        const isHome = event.homeTeam.id === teamId;
        const teamScore = isHome ? event.homeScore.current : event.awayScore.current;
        const opponentScore = isHome ? event.awayScore.current : event.homeScore.current;

        if (event.status.type === 'notstarted') {
            return <span className="text-xs text-slate-400">-</span>;
        }

        if (teamScore > opponentScore) {
            return <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">W</div>;
        } else if (teamScore < opponentScore) {
            return <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">L</div>;
        } else {
            return <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-bold">D</div>;
        }
    };

    const renderMatch = (event: H2HEvent, isH2H: boolean = false) => {
        const isLive = event.status.type === 'inprogress';
        const isFinished = event.status.type === 'finished';
        const isUpcoming = event.status.type === 'notstarted';

        return (
            <div key={event.id} className="py-3 border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between">
                    {/* Date/Status */}
                    <div className="w-20 text-xs text-slate-500 dark:text-slate-400">
                        {isLive && <span className="text-green-500 font-semibold">LIVE</span>}
                        {isFinished && format(new Date(event.startTimestamp * 1000), 'dd/MM/yy')}
                        {isUpcoming && format(new Date(event.startTimestamp * 1000), 'dd/MM HH:mm')}
                    </div>

                    {/* Teams and Scores */}
                    <div className="flex-1 px-4">
                        {/* Home Team */}
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center flex-1">
                                <img 
                                    src={getTeamLogo(event.homeTeam.id)} 
                                    alt={event.homeTeam.name}
                                    className="w-5 h-5 mr-2"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                    {event.homeTeam.shortName || event.homeTeam.name}
                                </span>
                            </div>
                            {!isUpcoming && (
                                <span className={`text-sm font-bold ml-2 ${
                                    event.homeScore.current > event.awayScore.current ? 'text-green-600' : 'text-slate-600 dark:text-slate-400'
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
                                    className="w-5 h-5 mr-2"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                    {event.awayTeam.shortName || event.awayTeam.name}
                                </span>
                            </div>
                            {!isUpcoming && (
                                <span className={`text-sm font-bold ml-2 ${
                                    event.awayScore.current > event.homeScore.current ? 'text-green-600' : 'text-slate-600 dark:text-slate-400'
                                }`}>
                                    {event.awayScore.current}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Competition */}
                    <div className="w-32 text-xs text-slate-500 dark:text-slate-400 text-right truncate">
                        {event.tournament?.name}
                    </div>

                    {/* Result Badge (only for H2H and only for our teams) */}
                    {isH2H && !isUpcoming && (
                        <div className="w-8 ml-2">
                            {event.homeTeam.id === homeTeamId && getResultBadge(event, homeTeamId)}
                            {event.awayTeam.id === homeTeamId && getResultBadge(event, homeTeamId)}
                        </div>
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

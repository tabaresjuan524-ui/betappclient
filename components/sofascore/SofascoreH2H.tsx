import React from 'react';
import { format } from 'date-fns';

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
    winnerCode?: number; // 1=home, 2=away, 3=draw
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
}

const SofascoreH2H: React.FC<SofascoreH2HProps> = ({
    h2hData,
    homeTeamId,
    awayTeamId,
    homeTeamName,
    awayTeamName,
    homeTeamColor = '#3b82f6',
    awayTeamColor = '#ef4444',
}) => {
    if (!h2hData || !h2hData.events || h2hData.events.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center text-slate-500 dark:text-slate-400">
                <p>No head-to-head data available</p>
            </div>
        );
    }

    const { events } = h2hData;

    // Calculate statistics
    const homeWins = events.filter(e => {
        if (e.homeTeam.id === homeTeamId) {
            return e.homeScore.current > e.awayScore.current;
        } else if (e.awayTeam.id === homeTeamId) {
            return e.awayScore.current > e.homeScore.current;
        }
        return false;
    }).length;

    const awayWins = events.filter(e => {
        if (e.homeTeam.id === awayTeamId) {
            return e.homeScore.current > e.awayScore.current;
        } else if (e.awayTeam.id === awayTeamId) {
            return e.awayScore.current > e.homeScore.current;
        }
        return false;
    }).length;

    const draws = events.filter(e => e.homeScore.current === e.awayScore.current).length;

    const totalHomeGoals = events.reduce((sum, e) => {
        if (e.homeTeam.id === homeTeamId) {
            return sum + e.homeScore.current;
        } else if (e.awayTeam.id === homeTeamId) {
            return sum + e.awayScore.current;
        }
        return sum;
    }, 0);

    const totalAwayGoals = events.reduce((sum, e) => {
        if (e.homeTeam.id === awayTeamId) {
            return sum + e.homeScore.current;
        } else if (e.awayTeam.id === awayTeamId) {
            return sum + e.awayScore.current;
        }
        return sum;
    }, 0);

    const getResultBadge = (event: H2HEvent) => {
        const isHomeTeamHome = event.homeTeam.id === homeTeamId;
        const homeGoals = event.homeScore.current;
        const awayGoals = event.awayScore.current;

        let result: 'W' | 'D' | 'L';
        if (homeGoals > awayGoals) {
            result = isHomeTeamHome ? 'W' : 'L';
        } else if (awayGoals > homeGoals) {
            result = isHomeTeamHome ? 'L' : 'W';
        } else {
            result = 'D';
        }

        const bgColor = result === 'W' ? 'bg-green-500' : result === 'D' ? 'bg-yellow-500' : 'bg-red-500';

        return (
            <div className={`${bgColor} text-white text-xs font-bold px-2 py-1 rounded`}>
                {result}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <h3 className="text-lg font-bold text-center">Head to Head</h3>
                <p className="text-xs text-center mt-1 text-blue-100">
                    Previous {events.length} encounter{events.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Statistics Summary */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                    {/* Home Team Stats */}
                    <div>
                        <div 
                            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2"
                            style={{ backgroundColor: homeTeamColor }}
                        >
                            {homeWins}
                        </div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {homeTeamName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {totalHomeGoals} goals
                        </p>
                    </div>

                    {/* Draws */}
                    <div>
                        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-slate-400 dark:bg-slate-600 text-white text-2xl font-bold mb-2">
                            {draws}
                        </div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Draws
                        </p>
                    </div>

                    {/* Away Team Stats */}
                    <div>
                        <div 
                            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2"
                            style={{ backgroundColor: awayTeamColor }}
                        >
                            {awayWins}
                        </div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {awayTeamName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {totalAwayGoals} goals
                        </p>
                    </div>
                </div>
            </div>

            {/* Match History */}
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {events.map((event) => {
                    const isHomeTeamHome = event.homeTeam.id === homeTeamId;
                    const displayHomeTeam = isHomeTeamHome ? event.homeTeam : event.awayTeam;
                    const displayAwayTeam = isHomeTeamHome ? event.awayTeam : event.homeTeam;
                    const displayHomeScore = isHomeTeamHome ? event.homeScore.current : event.awayScore.current;
                    const displayAwayScore = isHomeTeamHome ? event.awayScore.current : event.homeScore.current;

                    return (
                        <div 
                            key={event.id} 
                            className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                {/* Date and Competition */}
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    <p className="font-semibold">
                                        {format(new Date(event.startTimestamp * 1000), 'dd MMM yyyy')}
                                    </p>
                                    <p className="text-[10px]">
                                        {event.tournament?.category?.name} - {event.tournament?.name}
                                    </p>
                                </div>

                                {/* Result Badge */}
                                {getResultBadge(event)}
                            </div>

                            {/* Match Result */}
                            <div className="flex items-center justify-between">
                                {/* Home Team */}
                                <div className="flex-1 text-right pr-3">
                                    <p className={`text-sm font-semibold ${
                                        displayHomeScore > displayAwayScore 
                                            ? 'text-slate-800 dark:text-slate-100' 
                                            : 'text-slate-500 dark:text-slate-400'
                                    }`}>
                                        {displayHomeTeam.shortName || displayHomeTeam.name}
                                    </p>
                                </div>

                                {/* Score */}
                                <div className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded">
                                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                        {displayHomeScore} - {displayAwayScore}
                                    </p>
                                </div>

                                {/* Away Team */}
                                <div className="flex-1 text-left pl-3">
                                    <p className={`text-sm font-semibold ${
                                        displayAwayScore > displayHomeScore 
                                            ? 'text-slate-800 dark:text-slate-100' 
                                            : 'text-slate-500 dark:text-slate-400'
                                    }`}>
                                        {displayAwayTeam.shortName || displayAwayTeam.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Stats */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Average goals per game</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            {((totalHomeGoals + totalAwayGoals) / events.length).toFixed(1)}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Win percentage</p>
                        <div className="flex gap-2 mt-1">
                            <div>
                                <span className="text-sm font-bold" style={{ color: homeTeamColor }}>
                                    {((homeWins / events.length) * 100).toFixed(0)}%
                                </span>
                            </div>
                            <span className="text-slate-400">|</span>
                            <div>
                                <span className="text-sm font-bold" style={{ color: awayTeamColor }}>
                                    {((awayWins / events.length) * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SofascoreH2H;

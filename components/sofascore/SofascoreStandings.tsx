import React from 'react';

interface Team {
    name: string;
    shortName: string;
    id: number;
    teamColors?: {
        primary: string;
        secondary: string;
    };
}

interface StandingRow {
    team: Team;
    position: number;
    matches: number;
    wins: number;
    draws: number;
    losses: number;
    scoresFor: number;
    scoresAgainst: number;
    points: number;
    scoreDiffFormatted: string;
    promotion?: {
        text: string;
        id: number;
    };
    liveMatchWinnerCodeColumn?: string; // 'wins' or 'losses' for live match updates
}

interface StandingType {
    type: string; // "total", "home", "away"
    rows: StandingRow[];
    name?: string;
}

interface StandingsData {
    standings: StandingType[];
}

interface SofascoreStandingsProps {
    standingsData?: StandingsData;
    homeTeamId?: number;
    awayTeamId?: number;
}

const SofascoreStandings: React.FC<SofascoreStandingsProps> = ({
    standingsData,
    homeTeamId,
    awayTeamId,
}) => {
    if (!standingsData || !standingsData.standings || standingsData.standings.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center text-slate-500 dark:text-slate-400">
                <p>No standings available</p>
            </div>
        );
    }

    const totalStandings = standingsData.standings.find(s => s.type === 'total');
    if (!totalStandings || !totalStandings.rows) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center text-slate-500 dark:text-slate-400">
                <p>No total standings available</p>
            </div>
        );
    }

    const getPositionColor = (row: StandingRow) => {
        if (row.promotion) {
            // Promotion/qualification zones (top 8)
            if (row.position <= 8) {
                return 'bg-green-500';
            }
        }
        return 'bg-slate-400 dark:bg-slate-600';
    };

    const isMatchTeam = (teamId: number) => {
        return teamId === homeTeamId || teamId === awayTeamId;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <h3 className="text-lg font-bold text-center">
                    League Standings
                </h3>
                {totalStandings.name && (
                    <p className="text-xs text-center mt-1 text-blue-100">
                        {totalStandings.name}
                    </p>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">#</th>
                            <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Team</th>
                            <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">P</th>
                            <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">W</th>
                            <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">D</th>
                            <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">L</th>
                            <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">GF</th>
                            <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">GA</th>
                            <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">GD</th>
                            <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {totalStandings.rows.map((row, index) => {
                            const isHighlighted = isMatchTeam(row.team.id);
                            const rowClass = isHighlighted
                                ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold'
                                : index % 2 === 0
                                ? 'bg-white dark:bg-slate-800'
                                : 'bg-slate-50 dark:bg-slate-850';

                            return (
                                <tr
                                    key={row.team.id}
                                    className={`${rowClass} hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0`}
                                >
                                    {/* Position */}
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-1 h-8 rounded ${getPositionColor(row)}`}
                                            />
                                            <span className={`font-semibold ${isHighlighted ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {row.position}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Team Name */}
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`${isHighlighted ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
                                                {row.team.shortName || row.team.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Matches Played */}
                                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">
                                        {row.matches}
                                    </td>

                                    {/* Wins */}
                                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">
                                        {row.wins}
                                    </td>

                                    {/* Draws */}
                                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">
                                        {row.draws}
                                    </td>

                                    {/* Losses */}
                                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">
                                        {row.losses}
                                    </td>

                                    {/* Goals For */}
                                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">
                                        {row.scoresFor}
                                    </td>

                                    {/* Goals Against */}
                                    <td className="text-center p-3 text-slate-600 dark:text-slate-400">
                                        {row.scoresAgainst}
                                    </td>

                                    {/* Goal Difference */}
                                    <td className="text-center p-3">
                                        <span className={`font-semibold ${
                                            row.scoreDiffFormatted.startsWith('+') 
                                                ? 'text-green-600 dark:text-green-400' 
                                                : row.scoreDiffFormatted.startsWith('-')
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-slate-600 dark:text-slate-400'
                                        }`}>
                                            {row.scoreDiffFormatted}
                                        </span>
                                    </td>

                                    {/* Points */}
                                    <td className="text-center p-3">
                                        <span className={`font-bold ${isHighlighted ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                            {row.points}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-500" />
                        <span className="text-slate-600 dark:text-slate-400">Qualification</span>
                    </div>
                    {homeTeamId && awayTeamId && (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-blue-500" />
                            <span className="text-slate-600 dark:text-slate-400">Match Teams</span>
                        </div>
                    )}
                </div>
                <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <p>P: Played | W: Wins | D: Draws | L: Losses | GF: Goals For | GA: Goals Against | GD: Goal Difference | Pts: Points</p>
                </div>
            </div>
        </div>
    );
};

export default SofascoreStandings;

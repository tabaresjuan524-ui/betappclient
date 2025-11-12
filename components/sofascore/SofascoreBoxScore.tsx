import React from 'react';
import { Users, TrendingUp, Target } from 'lucide-react';

interface BoxScoreProps {
    boxScoreData: any;
    homeTeamName: string;
    awayTeamName: string;
    homeTeamColor?: string;
    awayTeamColor?: string;
}

/**
 * SofaScore Box Score Component
 * Displays player statistics in a table format (basketball, baseball, etc.)
 */
const SofascoreBoxScore: React.FC<BoxScoreProps> = ({
    boxScoreData,
    homeTeamName,
    awayTeamName,
    homeTeamColor = '#3b82f6',
    awayTeamColor = '#ef4444',
}) => {
    if (!boxScoreData) {
        return (
            <div className="text-center py-8 text-slate-500">
                No box score data available
            </div>
        );
    }

    const renderPlayerTable = (players: any[], teamName: string, teamColor: string) => {
        if (!players || players.length === 0) return null;

        // Get all stat keys from first player
        const samplePlayer = players[0];
        const statKeys = Object.keys(samplePlayer).filter(key => 
            !['player', 'playerName', 'jerseyNumber', 'position', 'starter'].includes(key)
        );

        return (
            <div className="mb-6">
                <div 
                    className="px-4 py-2 font-semibold text-white rounded-t-lg"
                    style={{ backgroundColor: teamColor }}
                >
                    <div className="flex items-center">
                        <Users size={18} className="mr-2" />
                        {teamName}
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-slate-100 dark:bg-zinc-800 sticky top-0">
                            <tr>
                                <th className="text-left p-2 border dark:border-zinc-700 font-medium">Player</th>
                                <th className="text-center p-2 border dark:border-zinc-700 font-medium">MIN</th>
                                {statKeys.map(key => (
                                    <th key={key} className="text-center p-2 border dark:border-zinc-700 font-medium uppercase">
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player, idx) => (
                                <tr 
                                    key={idx} 
                                    className={`
                                        ${player.starter ? 'bg-slate-50 dark:bg-zinc-800/50' : 'bg-white dark:bg-zinc-900'}
                                        hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors
                                    `}
                                >
                                    <td className="p-2 border dark:border-zinc-700">
                                        <div className="flex items-center">
                                            {player.jerseyNumber && (
                                                <span className="w-6 h-6 flex items-center justify-center bg-slate-200 dark:bg-zinc-700 rounded-full text-xs font-semibold mr-2">
                                                    {player.jerseyNumber}
                                                </span>
                                            )}
                                            <div>
                                                <div className="font-medium">
                                                    {player.player?.name || player.playerName}
                                                </div>
                                                {player.position && (
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        {player.position}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-2 border dark:border-zinc-700 text-center">
                                        {player.statistics?.minutesPlayed || player.minutesPlayed || '-'}
                                    </td>
                                    {statKeys.map(key => (
                                        <td key={key} className="p-2 border dark:border-zinc-700 text-center font-medium">
                                            {player[key] ?? '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Handle different data structures
    let homeTeamPlayers = [];
    let awayTeamPlayers = [];

    // Check if data has teams structure
    if (boxScoreData.teams) {
        const homeTeam = boxScoreData.teams.find((t: any) => t.teamName === homeTeamName);
        const awayTeam = boxScoreData.teams.find((t: any) => t.teamName === awayTeamName);
        
        homeTeamPlayers = homeTeam?.players || [];
        awayTeamPlayers = awayTeam?.players || [];
    }
    // Check if data has home/away structure
    else if (boxScoreData.homeTeam && boxScoreData.awayTeam) {
        homeTeamPlayers = boxScoreData.homeTeam.players || [];
        awayTeamPlayers = boxScoreData.awayTeam.players || [];
    }
    // Check if data is directly the players array
    else if (Array.isArray(boxScoreData)) {
        // Split by team if possible
        homeTeamPlayers = boxScoreData.filter((p: any) => p.team === 'home' || p.teamSide === 'home');
        awayTeamPlayers = boxScoreData.filter((p: any) => p.team === 'away' || p.teamSide === 'away');
        
        // If no team info, show all players
        if (homeTeamPlayers.length === 0 && awayTeamPlayers.length === 0) {
            homeTeamPlayers = boxScoreData;
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-center text-blue-700 dark:text-blue-300">
                    <Target size={20} className="mr-2" />
                    <p className="text-sm font-medium">
                        Player statistics and performance metrics for this match
                    </p>
                </div>
            </div>

            {homeTeamPlayers.length > 0 && renderPlayerTable(homeTeamPlayers, homeTeamName, homeTeamColor)}
            {awayTeamPlayers.length > 0 && renderPlayerTable(awayTeamPlayers, awayTeamName, awayTeamColor)}

            {homeTeamPlayers.length === 0 && awayTeamPlayers.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    <p className="mb-2">Box score data structure not recognized</p>
                    <details className="text-xs text-left bg-slate-100 dark:bg-zinc-800 p-4 rounded mt-4">
                        <summary className="cursor-pointer font-semibold mb-2">Show raw data</summary>
                        <pre className="overflow-auto max-h-64">
                            {JSON.stringify(boxScoreData, null, 2)}
                        </pre>
                    </details>
                </div>
            )}
        </div>
    );
};

export default SofascoreBoxScore;

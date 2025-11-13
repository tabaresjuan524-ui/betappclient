import React, { useState } from 'react';
import { Shield, TrendingUp, Calendar, DollarSign, Ruler, ArrowUpDown } from 'lucide-react';

interface Player {
    player: {
        name: string;
        shortName: string;
        position: string; // G, D, M, F
        jerseyNumber?: string;
        rating?: number;
        country?: {
            name: string;
            alpha2: string;
        };
        id?: number;
        height?: number;
        dateOfBirthTimestamp?: number;
        marketValueCurrency?: string;
    };
    shirtNumber: number;
    position: string;
    substitute: boolean;
    captain?: boolean;
    statistics?: {
        rating?: number;
        minutesPlayed?: number;
        goals?: number;
        assists?: number;
        yellowCards?: number;
        redCards?: number;
        totalPass?: number;
        accuratePass?: number;
        accuratePassPercentage?: number;
        totalDuels?: number;
        groundDuelsWon?: number;
        aerialDuelsWon?: number;
        tacklesWon?: number;
        possessionLostCtrl?: number;
        wasFouled?: number;
        fouls?: number;
        offsides?: number;
        saves?: number;
        punches?: number;
        highClaims?: number;
        shotsOnTarget?: number;
        shotsOffTarget?: number;
        blockedShots?: number;
        dribbles?: number;
        interceptions?: number;
        clearances?: number;
        defensiveActions?: number;
        keyPasses?: number;
        crossesSuccessful?: number;
        totalCrosses?: number;
        bigChancesCreated?: number;
        bigChancesMissed?: number;
        touches?: number;
        longBallsAccurate?: number;
        longBallsTotal?: number;
    };
}

interface TeamLineup {
    players: Player[];
    formation: string;
    playerColor?: {
        primary: string;
        number: string;
    };
    goalkeeperColor?: {
        primary: string;
        number: string;
    };
}

interface LineupsData {
    confirmed: boolean;
    home: TeamLineup;
    away: TeamLineup;
}

interface SofascoreLineupsProps {
    lineups?: LineupsData;
    homeTeamName: string;
    awayTeamName: string;
    homeTeamColor?: string;
    awayTeamColor?: string;
}

type ViewMode = 'lineups' | 'player-stats';
type LineupFilter = 'performance' | 'club' | 'age' | 'market-value' | 'height';
type StatsCategory = 'general' | 'attacking' | 'defending' | 'passing' | 'duels' | 'goalkeeping';

const SofascoreLineups: React.FC<SofascoreLineupsProps> = ({
    lineups,
    homeTeamName,
    awayTeamName,
    homeTeamColor = '#3b82f6',
    awayTeamColor = '#ef4444',
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('lineups');
    const [lineupFilter, setLineupFilter] = useState<LineupFilter>('performance');
    const [statsCategory, setStatsCategory] = useState<StatsCategory>('general');
    const [sortBy, setSortBy] = useState<string>('rating');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    if (!lineups || !lineups.home || !lineups.away) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center text-slate-500 dark:text-slate-400">
                <p>No lineup information available</p>
            </div>
        );
    }

    const calculateAge = (timestamp?: number) => {
        if (!timestamp) return null;
        const birthDate = new Date(timestamp * 1000);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getPlayerImageUrl = (playerId?: number) => {
        if (!playerId) return null;
        return `https://img.sofascore.com/api/v1/player/${playerId}/image`;
    };

    const renderPlayerCard = (player: Player, teamColor: string, isHome: boolean) => {
        const rating = player.statistics?.rating;
        const getRatingColor = (rating?: number) => {
            if (!rating) return 'bg-slate-300 dark:bg-slate-600';
            if (rating >= 8) return 'bg-green-500';
            if (rating >= 7) return 'bg-lime-500';
            if (rating >= 6.5) return 'bg-yellow-500';
            return 'bg-orange-500';
        };

        return (
            <div
                key={player.shirtNumber}
                className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-md hover:shadow-lg transition-shadow relative"
            >
                {/* Captain Badge */}
                {player.captain && (
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
                        C
                    </div>
                )}

                {/* Jersey Number */}
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 mx-auto"
                    style={{ backgroundColor: teamColor }}
                >
                    {player.shirtNumber}
                </div>

                {/* Player Name */}
                <div className="text-center">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {player.player.shortName || player.player.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">
                        {player.player.position}
                    </p>
                </div>

                {/* Rating */}
                {rating && (
                    <div className="flex items-center justify-center mt-2">
                        <div className={`${getRatingColor(rating)} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                            {rating.toFixed(1)}
                        </div>
                    </div>
                )}

                {/* Stats */}
                {player.statistics && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600 text-[10px] text-slate-600 dark:text-slate-300 space-y-1">
                        {player.statistics.goals !== undefined && player.statistics.goals > 0 && (
                            <div className="flex justify-between">
                                <span>Goals:</span>
                                <span className="font-semibold">{player.statistics.goals}</span>
                            </div>
                        )}
                        {player.statistics.assists !== undefined && player.statistics.assists > 0 && (
                            <div className="flex justify-between">
                                <span>Assists:</span>
                                <span className="font-semibold">{player.statistics.assists}</span>
                            </div>
                        )}
                        {player.statistics.minutesPlayed !== undefined && (
                            <div className="flex justify-between">
                                <span>Minutes:</span>
                                <span className="font-semibold">{player.statistics.minutesPlayed}'</span>
                            </div>
                        )}
                        {player.statistics.totalPass !== undefined && player.statistics.accuratePass !== undefined && (
                            <div className="flex justify-between">
                                <span>Passes:</span>
                                <span className="font-semibold">
                                    {player.statistics.accuratePass}/{player.statistics.totalPass}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderTeamLineup = (team: TeamLineup, teamName: string, teamColor: string, isHome: boolean) => {
        const starters = team.players.filter(p => !p.substitute);
        const substitutes = team.players.filter(p => p.substitute);

        // Group by position
        const goalkeepers = starters.filter(p => p.player.position === 'G');
        const defenders = starters.filter(p => p.player.position === 'D');
        const midfielders = starters.filter(p => p.player.position === 'M');
        const forwards = starters.filter(p => p.player.position === 'F');

        return (
            <div className="space-y-6">
                {/* Formation Header */}
                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                        {teamName}
                    </h3>
                    <div 
                        className="inline-block px-4 py-1 rounded-full text-white font-semibold text-sm"
                        style={{ backgroundColor: teamColor }}
                    >
                        {team.formation}
                    </div>
                    {!lineups.confirmed && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                            ⚠️ Lineup not confirmed
                        </p>
                    )}
                </div>

                {/* Starters by Position */}
                <div className="space-y-4">
                    {/* Forwards */}
                    {forwards.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase">
                                Forwards
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {forwards.map(player => renderPlayerCard(player, teamColor, isHome))}
                            </div>
                        </div>
                    )}

                    {/* Midfielders */}
                    {midfielders.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase">
                                Midfielders
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {midfielders.map(player => renderPlayerCard(player, teamColor, isHome))}
                            </div>
                        </div>
                    )}

                    {/* Defenders */}
                    {defenders.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase">
                                Defenders
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {defenders.map(player => renderPlayerCard(player, teamColor, isHome))}
                            </div>
                        </div>
                    )}

                    {/* Goalkeepers */}
                    {goalkeepers.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase">
                                Goalkeeper
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {goalkeepers.map(player => renderPlayerCard(player, teamColor, isHome))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Substitutes */}
                {substitutes.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase">
                            Substitutes
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {substitutes.map(player => (
                                <div
                                    key={player.shirtNumber}
                                    className="bg-slate-100 dark:bg-slate-700 rounded p-2 text-center"
                                >
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mb-1 mx-auto"
                                        style={{ backgroundColor: teamColor, opacity: 0.7 }}
                                    >
                                        {player.shirtNumber}
                                    </div>
                                    <p className="text-[10px] text-slate-700 dark:text-slate-300 truncate">
                                        {player.player.shortName.split(' ').pop()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 space-y-8">
            {/* Home Team */}
            {renderTeamLineup(lineups.home, homeTeamName, homeTeamColor, true)}

            {/* Divider */}
            <div className="border-t-2 border-dashed border-slate-300 dark:border-slate-600" />

            {/* Away Team */}
            {renderTeamLineup(lineups.away, awayTeamName, awayTeamColor, false)}
        </div>
    );
};

export default SofascoreLineups;

import React, { useState } from 'react';
import { Shield, TrendingUp, Calendar, DollarSign, Ruler, ArrowUpDown } from 'lucide-react';

interface Player {
    player: {
        name: string;
        shortName: string;
        position: string;
        id?: number;
        height?: number;
        dateOfBirthTimestamp?: number;
        marketValueCurrency?: string;
        proposedMarketValue?: number;
        proposedMarketValueRaw?: {
            value: number;
            currency: string;
        };
        country?: {
            alpha2: string;
        };
    };
    teamId?: number;
    shirtNumber: number;
    position: string;
    substitute: boolean;
    captain?: boolean;
    statistics?: {
        rating?: number;
        minutesPlayed?: number;
        goals?: number;
        assists?: number;
        totalPass?: number;
        accuratePass?: number;
        accuratePassPercentage?: number;
        totalDuels?: number;
        groundDuelsWon?: number;
        aerialDuelsWon?: number;
        tacklesWon?: number;
        shotsOnTarget?: number;
        shotsOffTarget?: number;
        blockedShots?: number;
        dribbles?: number;
        interceptions?: number;
        clearances?: number;
        defensiveActions?: number;
        keyPasses?: number;
        crossesSuccessful?: number;
        bigChancesCreated?: number;
        possessionLostCtrl?: number;
        wasFouled?: number;
        fouls?: number;
        saves?: number;
        punches?: number;
        highClaims?: number;
        offsides?: number;
        dribblesSuccessful?: number;
    };
}

interface TeamLineup {
    players: Player[];
    formation: string;
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
    homeTeamId?: number;
    awayTeamId?: number;
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
    homeTeamId,
    awayTeamId,
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

    const getRatingColor = (rating?: number) => {
        if (!rating) return 'bg-slate-400';
        if (rating >= 8) return 'bg-emerald-500';
        if (rating >= 7.5) return 'bg-green-500';
        if (rating >= 7) return 'bg-lime-500';
        if (rating >= 6.5) return 'bg-yellow-500';
        return 'bg-orange-500';
    };

    const getRatingBgColor = (rating?: number) => {
        if (!rating) return 'bg-slate-100 dark:bg-slate-700';
        if (rating >= 8) return 'bg-emerald-50 dark:bg-emerald-900/20';
        if (rating >= 7.5) return 'bg-green-50 dark:bg-green-900/20';
        if (rating >= 7) return 'bg-lime-50 dark:bg-lime-900/20';
        if (rating >= 6.5) return 'bg-yellow-50 dark:bg-yellow-900/20';
        return 'bg-orange-50 dark:bg-orange-900/20';
    };

    const formatMarketValue = (player: any) => {
        // Try different market value fields
        const value = player.proposedMarketValue || player.proposedMarketValueRaw?.value;
        const currency = player.proposedMarketValueRaw?.currency || player.marketValueCurrency || 'EUR';
        
        if (!value) return null;
        
        // Format value (convert to millions/thousands)
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(2)}M €`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K €`;
        }
        return `${value} €`;
    };

    // Render player on field
    const renderFieldPlayer = (player: Player, teamColor: string, isHome: boolean, teamId?: number) => {
        const imageUrl = getPlayerImageUrl(player.player.id);
        const rating = player.statistics?.rating;
        const age = calculateAge(player.player.dateOfBirthTimestamp);

        let displayValue = '';
        let showClubIcon = false;
        
        if (lineupFilter === 'performance' && rating) {
            displayValue = rating.toFixed(1);
        } else if (lineupFilter === 'club') {
            showClubIcon = true;
        } else if (lineupFilter === 'age' && age) {
            displayValue = `${age} y`;
        } else if (lineupFilter === 'height' && player.player.height) {
            displayValue = `${player.player.height} cm`;
        } else if (lineupFilter === 'market-value') {
            const marketValue = formatMarketValue(player.player);
            displayValue = marketValue || 'N/A';
        }

        return (
            <div className="flex items-center gap-1 relative" style={{ flexDirection: isHome ? 'row-reverse' : 'row' }}>
                {/* Player Name (right for home, left for away) */}
                <div className="text-center min-w-[45px] max-w-[55px]">
                    <div className="text-[9px] font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] whitespace-nowrap overflow-hidden text-ellipsis">
                        {player.shirtNumber} {player.player.shortName.split(' ').slice(-1)[0]}
                    </div>
                    {/* Info Badge */}
                    {displayValue && (
                        <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow inline-block ${
                            lineupFilter === 'performance' ? getRatingColor(rating) : 'bg-slate-700'
                        }`}>
                            {displayValue}
                        </div>
                    )}
                </div>

                {/* Player Image */}
                <div className="relative flex-shrink-0">
                    {imageUrl ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-white shadow-lg">
                            <img 
                                src={imageUrl} 
                                alt={player.player.shortName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback to jersey number circle
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.style.backgroundColor = teamColor;
                                }}
                            />
                        </div>
                    ) : (
                        <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg"
                            style={{ backgroundColor: teamColor }}
                        >
                            {player.shirtNumber}
                        </div>
                    )}
                    
                    {/* Jersey Number Badge */}
                    <div 
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shadow"
                        style={{ backgroundColor: teamColor }}
                    >
                        {player.shirtNumber}
                    </div>

                    {/* Captain Badge */}
                    {player.captain && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-900 shadow">
                            C
                        </div>
                    )}
                    
                    {/* Club Icon */}
                    {showClubIcon && player.teamId && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200">
                            <img 
                                src={`https://img.sofascore.com/api/v1/team/${player.teamId}/image`}
                                alt="Club"
                                className="w-4 h-4 object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render team formation on field (horizontal layout with absolute positioning)
    const renderFormationOnField = (team: TeamLineup, teamName: string, teamColor: string, isHome: boolean, teamId?: number) => {
        const starters = team.players.filter(p => !p.substitute);
        
        // Group by tactical position
        const goalkeepers = starters.filter(p => p.position === 'G');
        const defenders = starters.filter(p => p.position === 'D');
        const midfielders = starters.filter(p => p.position === 'M');
        const forwards = starters.filter(p => p.position === 'F');

        // Parse formation (e.g., "3-5-2" = 3 columns with 3,5,2 players each)
        const formationParts = team.formation.split('-').map(Number);
        
        // Build columns array - each formation number is a column with that many players
        const columns: Player[][] = [];
        
        // Goalkeeper column (separate from formation)
        if (goalkeepers.length > 0) {
            columns.push(goalkeepers);
        }
        
        // Collect all outfield players in order: defenders, midfielders, forwards
        const outfieldPlayers = [...defenders, ...midfielders, ...forwards];
        let playerIndex = 0;
        
        // Create columns based on formation numbers
        // For "3-5-2": column with 3 players, column with 5 players, column with 2 players
        formationParts.forEach(count => {
            const columnPlayers = outfieldPlayers.slice(playerIndex, playerIndex + count);
            if (columnPlayers.length > 0) {
                columns.push(columnPlayers);
            }
            playerIndex += count;
        });
        
        // Total columns for field width distribution (GK + formation columns)
        const totalColumns = columns.length;
        
        // Calculate column positions as percentages
        const getColumnPosition = (columnIndex: number) => {
            if (totalColumns === 1) return 50;
            return 8 + (columnIndex / (totalColumns - 1)) * 84; // 8% padding on edges
        };

        return (
            <div className="relative w-full h-full">
                {columns.map((column, colIdx) => {
                    const leftPos = isHome ? getColumnPosition(colIdx) : 100 - getColumnPosition(colIdx);
                    
                    return (
                        <div
                            key={`column-${colIdx}`}
                            className="absolute flex flex-col justify-around items-center"
                            style={{
                                left: `${leftPos}%`,
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                height: '88%'
                            }}
                        >
                            {[...column].reverse().map((player, playerIdx) => (
                                <div key={`${player.position}-${player.shirtNumber}-${colIdx}-${playerIdx}`}>
                                    {renderFieldPlayer(player, teamColor, isHome, teamId)}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Render field visualization
    const renderFieldView = () => {
        return (
            <div className="space-y-4">
                {/* Filter tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setLineupFilter('performance')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                            lineupFilter === 'performance'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                    >
                        <TrendingUp size={14} />
                        Performance
                    </button>
                    <button
                        onClick={() => setLineupFilter('club')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                            lineupFilter === 'club'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                    >
                        <Shield size={14} />
                        Club
                    </button>
                    <button
                        onClick={() => setLineupFilter('age')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                            lineupFilter === 'age'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                    >
                        <Calendar size={14} />
                        Age
                    </button>
                    <button
                        onClick={() => setLineupFilter('market-value')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                            lineupFilter === 'market-value'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                    >
                        <DollarSign size={14} />
                        Market value
                    </button>
                    <button
                        onClick={() => setLineupFilter('height')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                            lineupFilter === 'height'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                    >
                        <Ruler size={14} />
                        Height
                    </button>
                </div>

                {/* Soccer Field - Horizontal */}
                <div className="relative rounded-lg overflow-hidden" style={{ 
                    background: 'linear-gradient(90deg, #2d5016 0%, #3a6b1e 25%, #3a6b1e 75%, #2d5016 100%)',
                    height: '500px',
                    maxHeight: '500px'
                }}>
                    {/* Field markings */}
                    <div className="absolute inset-0">
                        {/* Center line (vertical) */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30" />
                        
                        {/* Center circle */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-white/30" />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30" />
                        
                        {/* Penalty boxes */}
                        <div className="absolute top-1/4 bottom-1/4 left-0 w-16 border-2 border-l-0 border-white/30" />
                        <div className="absolute top-1/4 bottom-1/4 right-0 w-16 border-2 border-r-0 border-white/30" />
                        
                        {/* Goal boxes */}
                        <div className="absolute top-1/3 bottom-1/3 left-0 w-8 border-2 border-l-0 border-white/30" />
                        <div className="absolute top-1/3 bottom-1/3 right-0 w-8 border-2 border-r-0 border-white/30" />
                    </div>

                    {/* Teams on field - Horizontal layout */}
                    <div className="relative grid grid-cols-2 h-full">
                        {/* Home team (left half) */}
                        <div className="relative border-r border-white/20">
                            <div className="absolute top-2 left-2 text-white font-bold text-xs px-2 py-1 rounded" style={{ backgroundColor: homeTeamColor }}>
                                {homeTeamName} - {lineups.home.formation}
                            </div>
                            {renderFormationOnField(lineups.home, homeTeamName, homeTeamColor, true, homeTeamId)}
                        </div>

                        {/* Away team (right half) */}
                        <div className="relative">
                            <div className="absolute top-2 right-2 text-white font-bold text-xs px-2 py-1 rounded" style={{ backgroundColor: awayTeamColor }}>
                                {awayTeamName} - {lineups.away.formation}
                            </div>
                            {renderFormationOnField(lineups.away, awayTeamName, awayTeamColor, false, awayTeamId)}
                        </div>
                    </div>
                </div>

                {/* Managers */}
                <div className="text-center py-4 border-t dark:border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Managers</h4>
                    <div className="mt-2 flex justify-around text-sm">
                        <div>
                            <span className="font-medium">{homeTeamName}:</span>
                            <span className="ml-2 text-slate-600 dark:text-slate-400">Manager info not available</span>
                        </div>
                        <div>
                            <span className="font-medium">{awayTeamName}:</span>
                            <span className="ml-2 text-slate-600 dark:text-slate-400">Manager info not available</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render player stats tables
    const renderPlayerStatsView = () => {
        const allPlayers = [...lineups.home.players, ...lineups.away.players].filter(p => !p.substitute);
        
        const sortPlayers = (players: Player[]) => {
            return [...players].sort((a, b) => {
                let aVal: any = 0;
                let bVal: any = 0;

                switch (sortBy) {
                    case 'rating':
                        aVal = a.statistics?.rating || 0;
                        bVal = b.statistics?.rating || 0;
                        break;
                    case 'goals':
                        aVal = a.statistics?.goals || 0;
                        bVal = b.statistics?.goals || 0;
                        break;
                    case 'assists':
                        aVal = a.statistics?.assists || 0;
                        bVal = b.statistics?.assists || 0;
                        break;
                    case 'tackles':
                        aVal = a.statistics?.tacklesWon || 0;
                        bVal = b.statistics?.tacklesWon || 0;
                        break;
                    case 'passes':
                        aVal = a.statistics?.accuratePassPercentage || 0;
                        bVal = b.statistics?.accuratePassPercentage || 0;
                        break;
                    case 'duels':
                        aVal = a.statistics?.totalDuels || 0;
                        bVal = b.statistics?.totalDuels || 0;
                        break;
                    case 'minutes':
                        aVal = a.statistics?.minutesPlayed || 0;
                        bVal = b.statistics?.minutesPlayed || 0;
                        break;
                    default:
                        aVal = a.statistics?.rating || 0;
                        bVal = b.statistics?.rating || 0;
                }

                return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
            });
        };

        const toggleSort = (column: string) => {
            if (sortBy === column) {
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
            } else {
                setSortBy(column);
                setSortOrder('desc');
            }
        };

        const renderSortIcon = (column: string) => {
            if (sortBy !== column) return <ArrowUpDown size={12} className="opacity-30" />;
            return <ArrowUpDown size={12} className={sortOrder === 'desc' ? 'rotate-180' : ''} />;
        };

        const sortedPlayers = sortPlayers(allPlayers);

        // General stats table
        if (statsCategory === 'general') {
            return (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                            <tr>
                                <th className="text-left p-2 font-medium">Player</th>
                                <th className="text-center p-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700" onClick={() => toggleSort('goals')}>
                                    <div className="flex items-center justify-center gap-1">
                                        Goals {renderSortIcon('goals')}
                                    </div>
                                </th>
                                <th className="text-center p-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700" onClick={() => toggleSort('assists')}>
                                    <div className="flex items-center justify-center gap-1">
                                        Assists {renderSortIcon('assists')}
                                    </div>
                                </th>
                                <th className="text-center p-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700" onClick={() => toggleSort('tackles')}>
                                    <div className="flex items-center justify-center gap-1">
                                        Tackles (won) {renderSortIcon('tackles')}
                                    </div>
                                </th>
                                <th className="text-center p-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700" onClick={() => toggleSort('passes')}>
                                    <div className="flex items-center justify-center gap-1">
                                        Accurate passes {renderSortIcon('passes')}
                                    </div>
                                </th>
                                <th className="text-center p-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700" onClick={() => toggleSort('duels')}>
                                    <div className="flex items-center justify-center gap-1">
                                        Duels (won) {renderSortIcon('duels')}
                                    </div>
                                </th>
                                <th className="text-center p-2">Ground duels (won)</th>
                                <th className="text-center p-2">Aerial duels (won)</th>
                                <th className="text-center p-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700" onClick={() => toggleSort('minutes')}>
                                    <div className="flex items-center justify-center gap-1">
                                        Minutes played {renderSortIcon('minutes')}
                                    </div>
                                </th>
                                <th className="text-center p-2">Position</th>
                                <th className="text-center p-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700" onClick={() => toggleSort('rating')}>
                                    <div className="flex items-center justify-center gap-1">
                                        Sofascore Rating {renderSortIcon('rating')}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlayers.map((player) => {
                                const stats = player.statistics;
                                const rating = stats?.rating;
                                const isHomePlayer = lineups.home.players.some(p => p.shirtNumber === player.shirtNumber && p.player.name === player.player.name);
                                const uniqueKey = `${isHomePlayer ? 'home' : 'away'}-${player.shirtNumber}-${player.player.name.replace(/\s+/g, '-')}`;
                                
                                return (
                                    <tr key={uniqueKey} className={`border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${getRatingBgColor(rating)}`}>
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                {player.player.country?.alpha2 && (
                                                    <img 
                                                        src={`https://flagcdn.com/w20/${player.player.country.alpha2.toLowerCase()}.png`}
                                                        alt=""
                                                        className="w-5 h-3"
                                                    />
                                                )}
                                                <span className="font-medium">{player.player.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-center p-2">{stats?.goals || 0}</td>
                                        <td className="text-center p-2">{stats?.assists || 0}</td>
                                        <td className="text-center p-2">{stats?.tacklesWon || 0}</td>
                                        <td className="text-center p-2">
                                            {stats?.accuratePass && stats?.totalPass 
                                                ? `${stats.accuratePass}/${stats.totalPass} (${stats.accuratePassPercentage}%)`
                                                : '-'}
                                        </td>
                                        <td className="text-center p-2">
                                            {stats?.totalDuels 
                                                ? `${((stats.groundDuelsWon || 0) + (stats.aerialDuelsWon || 0))} (${stats.totalDuels})`
                                                : '-'}
                                        </td>
                                        <td className="text-center p-2">
                                            {stats?.groundDuelsWon 
                                                ? `${stats.groundDuelsWon}`
                                                : '-'}
                                        </td>
                                        <td className="text-center p-2">
                                            {stats?.aerialDuelsWon 
                                                ? `${stats.aerialDuelsWon}`
                                                : '-'}
                                        </td>
                                        <td className="text-center p-2">{stats?.minutesPlayed || 0}'</td>
                                        <td className="text-center p-2">
                                            <span className="font-mono text-xs">{player.player.position}</span>
                                        </td>
                                        <td className="text-center p-2">
                                            {rating && (
                                                <span className={`inline-block px-2 py-1 rounded text-white font-bold ${getRatingColor(rating)}`}>
                                                    {rating.toFixed(1)}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            );
        }

        // Other categories (attacking, defending, etc.) - simplified for now
        return (
            <div className="text-center py-8 text-slate-500">
                {statsCategory} statistics - Implementation coming soon
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg">
            {/* View mode toggle */}
            <div className="flex gap-2 p-4 border-b dark:border-slate-700">
                <button
                    onClick={() => setViewMode('lineups')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        viewMode === 'lineups'
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                >
                    Lineups
                </button>
                <button
                    onClick={() => setViewMode('player-stats')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        viewMode === 'player-stats'
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                >
                    Player stats
                </button>
            </div>

            {/* Stats category tabs (only show in player-stats mode) */}
            {viewMode === 'player-stats' && (
                <div className="flex gap-2 px-4 py-3 border-b dark:border-slate-700 overflow-x-auto">
                    {(['general', 'attacking', 'defending', 'passing', 'duels', 'goalkeeping'] as StatsCategory[]).map(category => (
                        <button
                            key={category}
                            onClick={() => setStatsCategory(category)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                                statsCategory === category
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            )}

            {/* Content */}
            <div className="p-4">
                {viewMode === 'lineups' ? renderFieldView() : renderPlayerStatsView()}
            </div>
        </div>
    );
};

export default SofascoreLineups;

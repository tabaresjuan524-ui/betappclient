import React from 'react';

interface FormItem {
    result: 'W' | 'L' | 'D';
    teamId?: number;
}

interface TeamForm {
    teamId: number;
    teamName: string;
    position: number;
    points: number;
    matches: number;
    wins: number;
    draws: number;
    losses: number;
    form: FormItem[]; // Last 5 matches
}

interface PregameFormData {
    homeTeam?: {
        position?: number;
        value?: string;
        id?: number;
    };
    awayTeam?: {
        position?: number;
        value?: string;
        id?: number;
    };
}

interface SofascorePrematchStandingsProps {
    pregameFormData?: PregameFormData;
    standingsData?: any; // Full standings to get additional info
    homeTeamName: string;
    awayTeamName: string;
    homeTeamId: number;
    awayTeamId: number;
    homeTeamColor?: string;
    awayTeamColor?: string;
}

const SofascorePrematchStandings: React.FC<SofascorePrematchStandingsProps> = ({
    pregameFormData,
    standingsData,
    homeTeamName,
    awayTeamName,
    homeTeamId,
    awayTeamId,
    homeTeamColor = '#3b82f6',
    awayTeamColor = '#ef4444',
}) => {
    // Extract team data from standings
    const getTeamFromStandings = (teamId: number) => {
        if (!standingsData?.standings?.[0]?.rows) return null;
        return standingsData.standings[0].rows.find((row: any) => row.team.id === teamId);
    };

    const homeTeamData = getTeamFromStandings(homeTeamId);
    const awayTeamData = getTeamFromStandings(awayTeamId);

    if (!homeTeamData && !awayTeamData) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center text-slate-500 dark:text-slate-400">
                <p>No form data available</p>
            </div>
        );
    }

    // Parse form from pregameFormData value (e.g., "WWDLW")
    const parseForm = (formString?: string): FormItem[] => {
        if (!formString) return [];
        return formString.split('').slice(0, 5).map(char => ({
            result: char as 'W' | 'L' | 'D'
        }));
    };

    const homeForm = pregameFormData?.homeTeam?.value 
        ? parseForm(pregameFormData.homeTeam.value) 
        : [];
    
    const awayForm = pregameFormData?.awayTeam?.value 
        ? parseForm(pregameFormData.awayTeam.value) 
        : [];

    const FormIndicator = ({ form }: { form: FormItem[] }) => {
        return (
            <div className="flex gap-1">
                {form.map((item, index) => {
                    const bgColor = item.result === 'W' 
                        ? 'bg-green-500' 
                        : item.result === 'D' 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500';
                    
                    return (
                        <div 
                            key={index}
                            className={`${bgColor} w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold`}
                        >
                            {item.result}
                        </div>
                    );
                })}
            </div>
        );
    };

    const TeamCard = ({ 
        teamData, 
        teamName, 
        teamColor, 
        form, 
        position 
    }: { 
        teamData: any; 
        teamName: string; 
        teamColor: string; 
        form: FormItem[];
        position?: number;
    }) => {
        if (!teamData) {
            return (
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">No data</p>
                </div>
            );
        }

        return (
            <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border-2 border-slate-200 dark:border-slate-600">
                {/* Team Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: teamColor }}
                        />
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">
                            {teamName}
                        </h4>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Position</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {position || teamData.position}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-2 mb-3 text-center">
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">P</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {teamData.matches}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">W</p>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {teamData.wins}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">D</p>
                        <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                            {teamData.draws}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">L</p>
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                            {teamData.losses}
                        </p>
                    </div>
                </div>

                {/* Points */}
                <div className="mb-3 p-2 bg-slate-100 dark:bg-slate-600 rounded text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Points</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {teamData.points}
                    </p>
                </div>

                {/* Form */}
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Last 5 matches</p>
                    {form.length > 0 ? (
                        <FormIndicator form={form} />
                    ) : (
                        <p className="text-xs text-slate-400">No form data</p>
                    )}
                </div>

                {/* Goal Difference */}
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Goals</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                            {teamData.scoresFor} - {teamData.scoresAgainst}
                        </span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                        <span className="text-slate-500 dark:text-slate-400">Goal Difference</span>
                        <span className={`font-bold ${
                            teamData.scoreDiffFormatted.startsWith('+') 
                                ? 'text-green-600 dark:text-green-400' 
                                : teamData.scoreDiffFormatted.startsWith('-')
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-slate-600 dark:text-slate-400'
                        }`}>
                            {teamData.scoreDiffFormatted}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
            {/* Header */}
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">
                Current Form & Standing
            </h3>

            {/* Team Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TeamCard 
                    teamData={homeTeamData}
                    teamName={homeTeamName}
                    teamColor={homeTeamColor}
                    form={homeForm}
                    position={pregameFormData?.homeTeam?.position}
                />
                
                <TeamCard 
                    teamData={awayTeamData}
                    teamName={awayTeamName}
                    teamColor={awayTeamColor}
                    form={awayForm}
                    position={pregameFormData?.awayTeam?.position}
                />
            </div>

            {/* Comparison */}
            {homeTeamData && awayTeamData && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center">
                        Quick Comparison
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center text-xs">
                        <div>
                            <p className="font-bold text-lg" style={{ color: homeTeamColor }}>
                                {homeTeamData.points}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">Points</p>
                            <p className="font-bold text-lg" style={{ color: awayTeamColor }}>
                                {awayTeamData.points}
                            </p>
                        </div>
                        <div>
                            <p className="font-bold text-lg" style={{ color: homeTeamColor }}>
                                {homeTeamData.position}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">Position</p>
                            <p className="font-bold text-lg" style={{ color: awayTeamColor }}>
                                {awayTeamData.position}
                            </p>
                        </div>
                        <div>
                            <p className="font-bold text-lg" style={{ color: homeTeamColor }}>
                                {homeTeamData.wins}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">Wins</p>
                            <p className="font-bold text-lg" style={{ color: awayTeamColor }}>
                                {awayTeamData.wins}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SofascorePrematchStandings;

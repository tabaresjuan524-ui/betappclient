import React from 'react';

interface FormItem {
    result: 'W' | 'L' | 'D';
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

interface SofascoreFormProps {
    pregameFormData: PregameFormData;
    homeTeamName: string;
    awayTeamName: string;
    homeTeamColor?: string;
    awayTeamColor?: string;
}

const SofascoreForm: React.FC<SofascoreFormProps> = ({
    pregameFormData,
    homeTeamName,
    awayTeamName,
    homeTeamColor = '#3b82f6',
    awayTeamColor = '#ef4444',
}) => {
    // Parse form from pregameFormData value (e.g., "WWDLW")
    const parseForm = (formString?: string): FormItem[] => {
        if (!formString) return [];
        return formString.split('').map(char => ({
            result: char as 'W' | 'L' | 'D'
        }));
    };

    const homeForm = parseForm(pregameFormData?.homeTeam?.value);
    const awayForm = parseForm(pregameFormData?.awayTeam?.value);

    const FormIndicator = ({ form }: { form: FormItem[] }) => {
        return (
            <div className="flex gap-2">
                {form.length === 0 ? (
                    <span className="text-slate-400 dark:text-slate-500 text-sm">No form data</span>
                ) : (
                    form.map((item, index) => {
                        const bgColor = item.result === 'W' 
                            ? 'bg-green-500' 
                            : item.result === 'D' 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500';
                        
                        return (
                            <div 
                                key={index}
                                className={`${bgColor} w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold shadow-sm`}
                                title={item.result === 'W' ? 'Win' : item.result === 'D' ? 'Draw' : 'Loss'}
                            >
                                {item.result}
                            </div>
                        );
                    })
                )}
            </div>
        );
    };

    const getFormStats = (form: FormItem[]) => {
        const wins = form.filter(f => f.result === 'W').length;
        const draws = form.filter(f => f.result === 'D').length;
        const losses = form.filter(f => f.result === 'L').length;
        const total = form.length;
        const points = wins * 3 + draws;
        const percentage = total > 0 ? ((points / (total * 3)) * 100).toFixed(0) : '0';
        
        return { wins, draws, losses, points, percentage };
    };

    const homeStats = getFormStats(homeForm);
    const awayStats = getFormStats(awayForm);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    Recent Form
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Last {Math.max(homeForm.length, awayForm.length)} matches
                </p>
            </div>

            {/* Home Team Form */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: homeTeamColor }}
                        />
                        <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                            {homeTeamName}
                        </h4>
                        {pregameFormData?.homeTeam?.position && (
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                (Position: {pregameFormData.homeTeam.position})
                            </span>
                        )}
                    </div>
                    {homeForm.length > 0 && (
                        <div className="text-right">
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                {homeStats.percentage}%
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Win rate
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="mb-4">
                    <FormIndicator form={homeForm} />
                </div>
                
                {homeForm.length > 0 && (
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-green-500"></div>
                            <span className="text-slate-600 dark:text-slate-300">
                                {homeStats.wins} W
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-yellow-500"></div>
                            <span className="text-slate-600 dark:text-slate-300">
                                {homeStats.draws} D
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-red-500"></div>
                            <span className="text-slate-600 dark:text-slate-300">
                                {homeStats.losses} L
                            </span>
                        </div>
                        <div className="ml-auto font-semibold text-slate-700 dark:text-slate-200">
                            {homeStats.points} pts
                        </div>
                    </div>
                )}
            </div>

            {/* Away Team Form */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: awayTeamColor }}
                        />
                        <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                            {awayTeamName}
                        </h4>
                        {pregameFormData?.awayTeam?.position && (
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                (Position: {pregameFormData.awayTeam.position})
                            </span>
                        )}
                    </div>
                    {awayForm.length > 0 && (
                        <div className="text-right">
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                {awayStats.percentage}%
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Win rate
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="mb-4">
                    <FormIndicator form={awayForm} />
                </div>
                
                {awayForm.length > 0 && (
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-green-500"></div>
                            <span className="text-slate-600 dark:text-slate-300">
                                {awayStats.wins} W
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-yellow-500"></div>
                            <span className="text-slate-600 dark:text-slate-300">
                                {awayStats.draws} D
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-red-500"></div>
                            <span className="text-slate-600 dark:text-slate-300">
                                {awayStats.losses} L
                            </span>
                        </div>
                        <div className="ml-auto font-semibold text-slate-700 dark:text-slate-200">
                            {awayStats.points} pts
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-center text-sm text-slate-600 dark:text-slate-400">
                <p className="mb-2 font-medium">Form Guide</p>
                <div className="flex justify-center gap-6">
                    <span><span className="font-bold text-green-600">W</span> = Win (3 pts)</span>
                    <span><span className="font-bold text-yellow-600">D</span> = Draw (1 pt)</span>
                    <span><span className="font-bold text-red-600">L</span> = Loss (0 pts)</span>
                </div>
            </div>
        </div>
    );
};

export default SofascoreForm;

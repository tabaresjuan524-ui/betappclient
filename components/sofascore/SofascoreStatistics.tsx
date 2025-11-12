import React, { useState } from 'react';

interface StatisticItem {
    name: string;
    home: string;
    away: string;
    compareCode: number; // 1=home advantage, 2=away advantage, 3=equal
    statisticsType: string; // "positive" or "negative"
    valueType: string;
    homeValue: number;
    awayValue: number;
    homeTotal?: number;
    awayTotal?: number;
    renderType: number; // 1=normal, 2=percentage, 3=ratio, 4=percentage with totals
    key: string;
}

interface StatisticsGroup {
    groupName: string;
    statisticsItems: StatisticItem[];
}

interface StatisticsPeriod {
    period: string; // "ALL", "1ST", "2ND"
    groups: StatisticsGroup[];
}

interface SofascoreStatisticsProps {
    statistics?: StatisticsPeriod[];
    homeTeamName: string;
    awayTeamName: string;
    homeTeamColor?: string;
    awayTeamColor?: string;
}

const SofascoreStatistics: React.FC<SofascoreStatisticsProps> = ({
    statistics,
    homeTeamName,
    awayTeamName,
    homeTeamColor = '#3b82f6',
    awayTeamColor = '#ef4444',
}) => {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');

    if (!statistics || statistics.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center text-slate-500 dark:text-slate-400">
                <p>No statistics available</p>
            </div>
        );
    }

    const currentPeriodData = statistics.find(p => p.period === selectedPeriod);

    const renderStatBar = (item: StatisticItem) => {
        const total = item.homeValue + item.awayValue;
        const homePercentage = total > 0 ? (item.homeValue / total) * 100 : 50;
        const awayPercentage = total > 0 ? (item.awayValue / total) * 100 : 50;

        // For renderType 2 (percentage), use the actual percentage values
        const displayHomePercentage = item.renderType === 2 ? item.homeValue : homePercentage;
        const displayAwayPercentage = item.renderType === 2 ? item.awayValue : awayPercentage;

        const isHomeAdvantage = item.compareCode === 1;
        const isAwayAdvantage = item.compareCode === 2;
        const isEqual = item.compareCode === 3;

        return (
            <div key={item.key} className="mb-4">
                {/* Stat Name and Values */}
                <div className="flex justify-between items-center mb-2">
                    <span 
                        className={`text-xs font-semibold ${
                            isHomeAdvantage ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'
                        }`}
                    >
                        {item.home}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {item.name}
                    </span>
                    <span 
                        className={`text-xs font-semibold ${
                            isAwayAdvantage ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'
                        }`}
                    >
                        {item.away}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="relative flex items-center h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    {/* Home Team Bar */}
                    <div
                        className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-300"
                        style={{ 
                            width: `${displayHomePercentage}%`,
                            backgroundColor: homeTeamColor
                        }}
                    />
                    {/* Away Team Bar */}
                    <div
                        className="h-full bg-red-500 dark:bg-red-600 transition-all duration-300"
                        style={{ 
                            width: `${displayAwayPercentage}%`,
                            backgroundColor: awayTeamColor
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
            {/* Period Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                {statistics.map((period) => {
                    const periodLabel = period.period === 'ALL' ? 'Full Match' : 
                                      period.period === '1ST' ? '1st Half' : 
                                      period.period === '2ND' ? '2nd Half' : period.period;
                    
                    return (
                        <button
                            key={period.period}
                            onClick={() => setSelectedPeriod(period.period)}
                            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                                selectedPeriod === period.period
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-800'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
                            }`}
                        >
                            {periodLabel}
                        </button>
                    );
                })}
            </div>

            {/* Team Names Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-red-50 dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: homeTeamColor }}
                    />
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                        {homeTeamName}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                        {awayTeamName}
                    </span>
                    <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: awayTeamColor }}
                    />
                </div>
            </div>

            {/* Statistics Groups */}
            <div className="p-6">
                {currentPeriodData?.groups.map((group, index) => (
                    <div key={`${group.groupName}-${index}`} className="mb-6 last:mb-0">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wide">
                            {group.groupName}
                        </h3>
                        {group.statisticsItems.map(item => renderStatBar(item))}
                    </div>
                ))}

                {!currentPeriodData && (
                    <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                        No statistics available for this period
                    </div>
                )}
            </div>
        </div>
    );
};

export default SofascoreStatistics;

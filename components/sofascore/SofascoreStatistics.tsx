import React, { useState } from 'react';

/**
 * Enhanced SofaScore Statistics Component with Visual Elements
 * 
 * Features:
 * - Circular progress indicators for shooting stats (Free Throws, 2PT, 3PT, Field Goals)
 * - Enhanced bar charts for lead statistics (Max Points, Time in Lead, etc.)
 * - Period-based filtering (Full Match, 1st Half, 2nd Half)
 * - Team color theming throughout all visualizations
 * - Responsive design for mobile and desktop
 */

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

// Circular progress component
const CircularProgress: React.FC<{
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
}> = ({ 
    percentage, 
    size = 80, 
    strokeWidth = 6, 
    color = '#10b981', 
    backgroundColor = '#e5e7eb' 
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-in-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
};

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

    // Check if an item is a shooting stat that should show circular progress
    const isShootingStat = (key: string) => {
        return ['freeThrowsScored', 'twoPointersScored', 'threePointersScored', 'fieldGoalsScored'].includes(key);
    };

    // Render circular progress for shooting stats
    const renderShootingStats = (items: StatisticItem[]) => {
        const shootingStats = items.filter(item => isShootingStat(item.key));
        
        if (shootingStats.length === 0) return null;

        return (
            <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-6 uppercase tracking-wide text-center">
                    Shooting Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {shootingStats.map(stat => {
                        const homePercentage = stat.homeTotal ? (stat.homeValue / stat.homeTotal) * 100 : 0;
                        const awayPercentage = stat.awayTotal ? (stat.awayValue / stat.awayTotal) * 100 : 0;
                        
                        return (
                            <div key={stat.key} className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-600">
                                <div className="flex justify-center space-x-6 mb-4">
                                    {/* Home Team Circle */}
                                    <div className="text-center">
                                        <div className="mb-2">
                                            <CircularProgress
                                                percentage={homePercentage}
                                                color={homeTeamColor}
                                                backgroundColor="rgba(156, 163, 175, 0.2)"
                                                size={76}
                                            />
                                        </div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            {stat.home}
                                        </p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[60px]">
                                            {homeTeamName}
                                        </p>
                                    </div>
                                    
                                    {/* Away Team Circle */}
                                    <div className="text-center">
                                        <div className="mb-2">
                                            <CircularProgress
                                                percentage={awayPercentage}
                                                color={awayTeamColor}
                                                backgroundColor="rgba(156, 163, 175, 0.2)"
                                                size={76}
                                            />
                                        </div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            {stat.away}
                                        </p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[60px]">
                                            {awayTeamName}
                                        </p>
                                    </div>
                                </div>
                                
                                <h4 className="text-sm font-semibold text-center text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-600 pt-2">
                                    {stat.name}
                                </h4>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Enhanced bar chart for lead statistics
    const renderLeadStats = (items: StatisticItem[]) => {
        const leadStats = items.filter(item => 
            ['maxPointsInARow', 'timeSpentInLead', 'leadChanges', 'biggestLead'].includes(item.key)
        );
        
        if (leadStats.length === 0) return null;

        return (
            <div className="space-y-4">
                {leadStats.map(stat => {
                    const isHomeAdvantage = stat.compareCode === 1;
                    const isAwayAdvantage = stat.compareCode === 2;
                    
                    // Calculate bar widths based on values
                    const total = Math.max(stat.homeValue, stat.awayValue);
                    const homeWidth = total > 0 ? (stat.homeValue / total) * 100 : 0;
                    const awayWidth = total > 0 ? (stat.awayValue / total) * 100 : 0;
                    
                    return (
                        <div key={stat.key} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <span className={`text-sm font-bold ${
                                    isHomeAdvantage ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'
                                }`}>
                                    {stat.home}
                                </span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {stat.name}
                                </span>
                                <span className={`text-sm font-bold ${
                                    isAwayAdvantage ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'
                                }`}>
                                    {stat.away}
                                </span>
                            </div>
                            
                            {/* Enhanced progress bars */}
                            <div className="space-y-2">
                                {/* Home team bar */}
                                <div className="flex items-center">
                                    <span className="text-xs w-12 text-right mr-2 text-slate-500">{homeTeamName}</span>
                                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                        <div
                                            className="h-3 rounded-full transition-all duration-500"
                                            style={{ 
                                                width: `${homeWidth}%`,
                                                backgroundColor: homeTeamColor
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                {/* Away team bar */}
                                <div className="flex items-center">
                                    <span className="text-xs w-12 text-right mr-2 text-slate-500">{awayTeamName}</span>
                                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                        <div
                                            className="h-3 rounded-full transition-all duration-500"
                                            style={{ 
                                                width: `${awayWidth}%`,
                                                backgroundColor: awayTeamColor
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderStatBar = (item: StatisticItem) => {
        // Skip shooting stats as they're rendered separately
        if (isShootingStat(item.key)) return null;
        
        const total = item.homeValue + item.awayValue;
        
        // Calculate percentages - if total is 0, both should be 0%
        let homePercentage = 0;
        let awayPercentage = 0;
        
        if (total > 0) {
            homePercentage = (item.homeValue / total) * 100;
            awayPercentage = (item.awayValue / total) * 100;
        }

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

                {/* Progress Bar - Simple Two-Bar Layout */}
                <div className="flex items-center h-3 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                    {/* Home Team Section (Left Side) */}
                    <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                            width: '50%',
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <div
                            className="h-full transition-all duration-500"
                            style={{ 
                                width: `${displayHomePercentage * 2}%`,
                                backgroundColor: homeTeamColor
                            }}
                        />
                    </div>
                    
                    {/* Center Line */}
                    <div className="w-px h-full bg-slate-400 dark:bg-slate-500 flex-shrink-0" />
                    
                    {/* Away Team Section (Right Side) */}
                    <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                            width: '50%',
                            display: 'flex',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <div
                            className="h-full transition-all duration-500"
                            style={{ 
                                width: `${displayAwayPercentage * 2}%`,
                                backgroundColor: awayTeamColor
                            }}
                        />
                    </div>
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
                {currentPeriodData?.groups.map((group, index) => {
                    // Special rendering for shooting stats
                    if (group.groupName === 'Scoring') {
                        return (
                            <div key={`${group.groupName}-${index}`} className="mb-8 last:mb-0">
                                {renderShootingStats(group.statisticsItems)}
                                {/* Render non-shooting stats normally */}
                                <div className="space-y-4">
                                    {group.statisticsItems
                                        .filter(item => !isShootingStat(item.key))
                                        .map(item => renderStatBar(item))
                                    }
                                </div>
                            </div>
                        );
                    }
                    
                    // Special rendering for Lead stats
                    if (group.groupName === 'Lead') {
                        return (
                            <div key={`${group.groupName}-${index}`} className="mb-6 last:mb-0">
                                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wide">
                                    {group.groupName}
                                </h3>
                                {renderLeadStats(group.statisticsItems)}
                            </div>
                        );
                    }
                    
                    // Default rendering for other groups
                    return (
                        <div key={`${group.groupName}-${index}`} className="mb-6 last:mb-0">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wide">
                                {group.groupName}
                            </h3>
                            {group.statisticsItems.map(item => renderStatBar(item))}
                        </div>
                    );
                })}

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

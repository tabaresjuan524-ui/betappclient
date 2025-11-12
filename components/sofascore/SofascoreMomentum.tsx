import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';

interface GraphPoint {
    minute: number;
    value: number; // Positive values favor home team, negative favor away team
}

interface GraphData {
    graphPoints: GraphPoint[];
    periodTime: number; // 45 for football
    overtimeLength: number; // 15 for football
    periodCount: number; // 2 for football
}

interface SofascoreMomentumProps {
    graphData?: GraphData;
    homeTeamName: string;
    awayTeamName: string;
    homeTeamColor?: string;
    awayTeamColor?: string;
}

const SofascoreMomentum: React.FC<SofascoreMomentumProps> = ({
    graphData,
    homeTeamName,
    awayTeamName,
    homeTeamColor = '#3b82f6',
    awayTeamColor = '#ef4444',
}) => {
    if (!graphData || !graphData.graphPoints || graphData.graphPoints.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center text-slate-500 dark:text-slate-400">
                <p>No momentum data available</p>
            </div>
        );
    }

    const { graphPoints } = graphData;

    // Prepare data for Recharts
    const chartData = graphPoints.map(point => ({
        minute: Math.floor(point.minute) === 45.5 ? '45+' : Math.floor(point.minute).toString(),
        momentum: point.value,
        absValue: Math.abs(point.value),
    }));

    // Calculate max momentum for each team
    const values = graphPoints.map(p => p.value);
    const homeMaxMomentum = Math.max(...values.filter(v => v >= 0));
    const awayMaxMomentum = Math.abs(Math.min(...values.filter(v => v < 0)));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const value = payload[0].value;
            const team = value >= 0 ? homeTeamName : awayTeamName;
            return (
                <div className="bg-slate-900 text-white px-4 py-2 rounded shadow-lg border border-slate-700">
                    <p className="font-semibold">Minute {payload[0].payload.minute}</p>
                    <p className="text-sm">{team}: {Math.abs(value).toFixed(0)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">
                    Match Momentum
                </h3>
                
                {/* Team Names with Momentum Indicators */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: homeTeamColor }}
                        />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {homeTeamName}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            (Peak: {homeMaxMomentum.toFixed(0)})
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            (Peak: {awayMaxMomentum.toFixed(0)})
                        </span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {awayTeamName}
                        </span>
                        <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: awayTeamColor }}
                        />
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="relative" style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                        <XAxis 
                            dataKey="minute" 
                            stroke="#64748b"
                            tick={{ fontSize: 10 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis 
                            stroke="#64748b"
                            tick={{ fontSize: 10 }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} />
                        <Line 
                            type="monotone" 
                            dataKey="momentum" 
                            stroke={homeTeamColor}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Info */}
            <div className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400">
                <p>Momentum shows which team is dominating at each minute of the match</p>
                <p className="mt-1">Positive values favor {homeTeamName}, negative values favor {awayTeamName}</p>
            </div>
        </div>
    );
};

export default SofascoreMomentum;

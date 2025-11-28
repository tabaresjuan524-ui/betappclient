import React from 'react';
import { Shield, Star, Scale } from 'lucide-react';

interface H2HData {
  teamDuel: {
    homeWins: number;
    awayWins: number;
    draws: number;
  };
}

interface H2HDisplayProps {
  data: H2HData;
  homeTeamName: string;
  awayTeamName: string;
}

const H2HDisplay: React.FC<H2HDisplayProps> = ({ data, homeTeamName, awayTeamName }) => {
  if (!data || !data.teamDuel) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 dark:text-slate-400">
        <Scale size={32} className="mb-4" />
        <p className="font-semibold">No head-to-head data available.</p>
        <p className="text-sm">Historical match data could not be found for these teams.</p>
      </div>
    );
  }

  const { homeWins, awayWins, draws } = data.teamDuel;
  const totalMatches = homeWins + awayWins + draws;

  if (totalMatches === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 dark:text-slate-400">
            <Scale size={32} className="mb-4" />
            <p className="font-semibold">No past encounters found.</p>
        </div>
    );
  }

  const homeWinPercentage = (homeWins / totalMatches) * 100;
  const drawPercentage = (draws / totalMatches) * 100;
  const awayWinPercentage = (awayWins / totalMatches) * 100;

  return (
    <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-lg animate-fade-in">
      <h3 className="text-base font-semibold mb-4 text-center text-slate-700 dark:text-slate-200">Head-to-Head</h3>
      
      <div className="grid grid-cols-3 gap-4 items-center mb-5 text-center">
        {/* Home Team Wins */}
        <div className="flex flex-col items-center space-y-1">
          <p className="font-bold text-2xl text-blue-500">{homeWins}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Wins</p>
          <p className="text-sm font-semibold truncate" title={homeTeamName}>{homeTeamName}</p>
        </div>
        
        {/* Draws */}
        <div className="flex flex-col items-center space-y-1">
          <p className="font-bold text-2xl text-slate-600 dark:text-slate-300">{draws}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Draws</p>
          <Star size={16} className="text-yellow-500" />
        </div>
        
        {/* Away Team Wins */}
        <div className="flex flex-col items-center space-y-1">
          <p className="font-bold text-2xl text-red-500">{awayWins}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Wins</p>
          <p className="text-sm font-semibold truncate" title={awayTeamName}>{awayTeamName}</p>
        </div>
      </div>
      
      {/* Win Percentage Bar */}
      <div className="w-full flex h-3 rounded-full overflow-hidden bg-slate-200 dark:bg-zinc-700">
        <div 
          className="bg-blue-500 transition-all duration-500" 
          style={{ width: `${homeWinPercentage}%` }}
          title={`${homeWinPercentage.toFixed(1)}%`}
        ></div>
        <div 
          className="bg-slate-400 dark:bg-slate-500 transition-all duration-500" 
          style={{ width: `${drawPercentage}%` }}
          title={`${drawPercentage.toFixed(1)}%`}
        ></div>
        <div 
          className="bg-red-500 transition-all duration-500" 
          style={{ width: `${awayWinPercentage}%` }}
          title={`${awayWinPercentage.toFixed(1)}%`}
        ></div>
      </div>

      <p className="text-center text-xs text-slate-500 mt-2">Based on the last {totalMatches} matches.</p>
    </div>
  );
};

export default H2HDisplay;

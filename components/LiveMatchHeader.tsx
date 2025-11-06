import React, { useMemo, useState } from 'react';
import { SportCategory } from '../lib/data/sportCategories';
import { LiveEvent } from '../lib/services/sportsService';
import {
  ArrowLeft,
  Clock,
  Trophy,
  Target,
  AlertTriangle,
  Flag,
  Zap,
  Users,
  Timer,
  Activity,
  CornerDownRight,
  Square,
  ChevronUp,
  ChevronDown,
  Circle
} from 'lucide-react';

interface LiveMatchHeaderProps {
  event: LiveEvent;
  sportCategories?: SportCategory[]; // Made optional
  className?: string;
  onBack?: () => void;
}

/**
 * Get sport background SVG filename from sport categories mapping
 */
const getSportBackground = (sportName: string, sportCategories: SportCategory[]): string | null => {
  if (!sportName || !sportCategories || !Array.isArray(sportCategories)) {

    return null;
  }

  // Clean and normalize sport name for matching
  const cleanSportName = sportName.toLowerCase().trim();


  // Try exact matches first
  let foundCategory = sportCategories.find(category => {
    const categoryName = category.name.toLowerCase().trim();
    return categoryName === cleanSportName;
  });

  // If no exact match, try partial matches
  if (!foundCategory) {
    foundCategory = sportCategories.find(category => {
      const categoryName = category.name.toLowerCase().trim();
      return cleanSportName.includes(categoryName) || categoryName.includes(cleanSportName);
    });
  }

  // If still no match, try common mappings and create direct SVG mappings
  if (!foundCategory) {
    const directSvgMappings: { [key: string]: string } = {
      // Spanish mappings
      'fútbol': 'soccer.svg',
      'futbol': 'soccer.svg',
      'soccer': 'soccer.svg',
      'football': 'soccer.svg',
      'baloncesto': 'basketball.svg',
      'basketball': 'basketball.svg',
      'basquet': 'basketball.svg',
      'tenis': 'tennis.svg',
      'tennis': 'tennis.svg',
      'ping pong': 'table_tennis.svg',
      'table tennis': 'table_tennis.svg',
      'tenis de mesa': 'table_tennis.svg',
      'bádminton': 'badminton.svg',
      'badminton': 'badminton.svg',
      'voleibol': 'volleyball.svg',
      'volleyball': 'volleyball.svg',
      'voley': 'volleyball.svg',
      'beach volleyball': 'beach_volleyball.svg',
      'voley playa': 'beach_volleyball.svg',
      'beisbol': 'baseball.svg',
      'béisbol': 'baseball.svg',
      'baseball': 'baseball.svg',
      'hockey': 'ice_hockey.svg',
      'hockey hielo': 'ice_hockey.svg',
      'ice hockey': 'ice_hockey.svg',
      'hockey sobre hielo': 'ice_hockey.svg',
      'balonmano': 'handball.svg',
      'handball': 'handball.svg',
      'boxeo': 'boxing.svg',
      'boxing': 'boxing.svg',
      'mma': 'mma.svg',
      'mixed martial arts': 'mma.svg',
      'golf': 'golf.svg',
      'rugby': 'rugby.svg',
      'cricket': 'cricket.svg',
      'dardos': 'darts.svg',
      'darts': 'darts.svg',
      'futbol sala': 'futsal.svg',
      'futsal': 'futsal.svg',
      'snooker': 'snooker.svg',
      'horse racing': 'horse_racing.svg',
      'carreras de caballos': 'horse_racing.svg',
      'american football': 'american_football.svg',
      'futbol americano': 'american_football.svg',
      // E-Sports mappings
      'e-sports': 'esports.svg',
      'esports': 'esports.svg',
      'e-fútbol': 'efootball.svg',
      'efootball': 'efootball.svg',
      'e-futbol': 'efootball.svg',
      'e-basket': 'ebasket.svg',
      'ebasket': 'ebasket.svg',
      'e-basketball': 'ebasket.svg'
    };

    const mappedSvg = directSvgMappings[cleanSportName];
    if (mappedSvg) {

      return mappedSvg;
    }

    // Try partial matching with direct mappings
    for (const [key, svg] of Object.entries(directSvgMappings)) {
      if (cleanSportName.includes(key) || key.includes(cleanSportName)) {

        return svg;
      }
    }
  }

  if (foundCategory && (foundCategory as any).sportBackground) {

    return (foundCategory as any).sportBackground;
  }


  return null;
};

const LiveMatchHeader: React.FC<LiveMatchHeaderProps> = ({
  event,
  sportCategories = [], // Default to empty array
  className = "",
  onBack
}) => {
  // Add comprehensive debug logging for the entire event object


  // Add safety check for event
  if (!event) {
    return (
      <div className={`relative w-full text-white ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="relative z-10 p-4 flex items-center justify-center">
          <div className="text-center text-gray-400">
            No event data available
          </div>
        </div>
      </div>
    );
  }

  // Memoize background calculation to prevent infinite renders
  const { sportBackground, backgroundImageUrl } = useMemo(() => {
    const background = getSportBackground(event?.sport_group || '', sportCategories);
    const imageUrl = background ? `/cache/sport-backgrounds/${background}` : null;
    return { sportBackground: background, backgroundImageUrl: imageUrl };
  }, [event?.sport_group, sportCategories]);

  // State for collapsing/expanding live data
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Determine sport-specific layout
  const getSportSpecificContent = () => {
    if (!event) return null;

    // Helper function to safely display data or "NO DATA"
    const safeDisplay = (value: any, fallback: string = "NO DATA") => {
      if (value === undefined || value === null || value === '') {
        return fallback;
      }
      return value;
    };

    // Helper function to safely display score data
    const safeScoreDisplay = (homeValue: any, awayValue: any, fallback: string = "NO DATA") => {
      if ((homeValue === undefined || homeValue === null) && (awayValue === undefined || awayValue === null)) {
        return fallback;
      }
      return `${homeValue || 0}-${awayValue || 0}`;
    };

    const liveData = event.liveData;
    const sportType = event.sport_group?.toLowerCase() || '';

    // Table Tennis Layout - Compact Table Style
    if (sportType.includes('table tennis') || sportType.includes('tenis de mesa') || sportType.includes('ping pong')) {
      // Get sport background
      const sportBackground = getSportBackground(sportType, sportCategories);
      
      // Determine number of sets from data
      const setCount = liveData?.Sets ? liveData.Sets.length : 5;

      return (
        <div className="w-full max-w-5xl mx-auto">
          <div className="sb-live-widget">
            <div className={`sb-live-widget--container ${sportBackground}`}>
              {/* Table Tennis Scoreboard Table */}
              <div className="sb-live-scoreboard-sets background-table-tennis w-full mb-1 bg-slate-800/90 rounded-lg border border-slate-600/50 shadow-lg">
                <div className="sb-live-scoreboard-sets--container p-2">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-700/80 border-b-2 border-yellow-500/50">
                        <th className="text-left text-yellow-400 font-bold px-2 py-1.5 rounded-tl-md">
                          {liveData?.PeriodName || 'Set'}
                        </th>
                        {/* Service Indicator column */}
                        <th className="text-center text-yellow-400 font-semibold px-1 py-1.5 min-w-[24px]">🏓</th>
                        {/* Set columns - dynamic based on Sets array */}
                        {Array.from({ length: setCount }).map((_, index) => (
                          <th key={index} className="text-center text-yellow-400 font-semibold px-2 py-1.5 min-w-[32px] border-l border-slate-600/30">
                            {index + 1}
                          </th>
                        ))}
                        {/* Current Score column */}
                        <th className="text-center text-yellow-400 font-bold px-2 py-1.5 min-w-[40px] border-l-2 border-yellow-500/50 rounded-tr-md">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Home Team Row */}
                      <tr className="border-t border-slate-600/50 bg-slate-800/60 hover:bg-slate-700/40 transition-colors">
                        <td className="text-left text-white font-medium px-2 py-1.5 truncate" title={liveData?.ParticipantHome || event.home_team}>
                          <span className="truncate">{liveData?.ParticipantHome || event.home_team}</span>
                        </td>
                        {/* Service Indicator - Green dot for serving player */}
                        <td className="text-center px-1 py-1.5">
                          {(() => {
                            if (liveData && liveData.Sets && Array.isArray(liveData.Sets) && liveData.Sets.length > 0) {
                              const currentSet = liveData.Sets[liveData.Sets.length - 1];
                              if (currentSet && Array.isArray(currentSet)) {
                                const totalPoints = currentSet[0] + currentSet[1];
                                const isHomeServing = Math.floor(totalPoints / 2) % 2 === 0;
                                return <div className={`w-2 h-2 rounded-full mx-auto ${isHomeServing ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-slate-600/30'}`}></div>;
                              }
                            }
                            return <div className="w-2 h-2 rounded-full mx-auto bg-slate-600/30"></div>;
                          })()}
                        </td>
                        {/* Home Set Scores */}
                        {Array.from({ length: setCount }).map((_, index) => (
                          <td key={index} className="text-center text-white font-medium px-2 py-1.5 border-l border-slate-600/30">
                            {liveData?.Sets && liveData.Sets[index] && liveData.Sets[index][0] !== undefined ? liveData.Sets[index][0] : '-'}
                          </td>
                        ))}
                        {/* Home Current Score */}
                        <td className="text-center text-yellow-400 font-bold px-2 py-1.5 text-base border-l-2 border-yellow-500/50 bg-slate-700/50">
                          {liveData?.ResultHome !== undefined ? liveData.ResultHome : '0'}
                        </td>
                      </tr>
                      {/* Away Team Row */}
                      <tr className="border-t border-slate-600/50 bg-slate-800/60 hover:bg-slate-700/40 transition-colors">
                        <td className="text-left text-white font-medium px-2 py-1.5 truncate rounded-bl-md" title={liveData?.ParticipantAway || event.away_team}>
                          <span className="truncate">{liveData?.ParticipantAway || event.away_team}</span>
                        </td>
                        {/* Service Indicator - Green dot for serving player */}
                        <td className="text-center px-1 py-1.5">
                          {(() => {
                            if (liveData && liveData.Sets && Array.isArray(liveData.Sets) && liveData.Sets.length > 0) {
                              const currentSet = liveData.Sets[liveData.Sets.length - 1];
                              if (currentSet && Array.isArray(currentSet)) {
                                const totalPoints = currentSet[0] + currentSet[1];
                                const isHomeServing = Math.floor(totalPoints / 2) % 2 === 0;
                                return <div className={`w-2 h-2 rounded-full mx-auto ${!isHomeServing ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-slate-600/30'}`}></div>;
                              }
                            }
                            return <div className="w-2 h-2 rounded-full mx-auto bg-slate-600/30"></div>;
                          })()}
                        </td>
                        {/* Away Set Scores */}
                        {Array.from({ length: setCount }).map((_, index) => (
                          <td key={index} className="text-center text-white font-medium px-2 py-1.5 border-l border-slate-600/30">
                            {liveData?.Sets && liveData.Sets[index] && liveData.Sets[index][1] !== undefined ? liveData.Sets[index][1] : '-'}
                          </td>
                        ))}
                        {/* Away Current Score */}
                        <td className="text-center text-yellow-400 font-bold px-2 py-1.5 text-base border-l-2 border-yellow-500/50 bg-slate-700/50 rounded-br-md">
                          {liveData?.ResultAway !== undefined ? liveData.ResultAway : '0'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Tennis/Badminton Layout - Return null to show normal header, tennis widget will be handled separately
    if (sportType.includes('tennis') || sportType.includes('tenis') || sportType.includes('badminton') || sportType.includes('bádminton')) {
      const isBadminton = sportType.includes('badminton') || sportType.includes('bádminton');

      // Check if event is truly live using multiple indicators
      const isEventLive = (
        (event?.status && (event.status === 'live' || event.status === 'in_progress' || event.status.toLowerCase().includes('live'))) ||
        event?.active === true ||
        (event as any)?.isLive === true ||
        event?.liveData !== undefined
      ) && (
          !event?.status || (
            event.status !== 'not_started' &&
            event.status !== 'finished' &&
            event.status !== 'postponed'
          )
        );

      console.log('🔍 [LiveMatchHeader] Tennis stats check:', {
        eventId: event?.id,
        sport: sportType,
        status: event?.status,
        active: event?.active,
        isLive: (event as any)?.isLive,
        hasLiveData: !!event?.liveData,
        isEventLive,
        liveDataKeys: event?.liveData ? Object.keys(event.liveData) : []
      });

      // Only show compact tennis widget for actual live events
      if (!isEventLive) {
        return null;
      }

      // Get sport background
      const sportBackground = getSportBackground(sportType, sportCategories);

      return (
        <div className="flex justify-center w-full">
          {/* Compact Tennis Widget - Increased height to show all content */}
          <div
            className="relative w-full max-w-md min-h-[60px] rounded bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/cache/sports/${sportBackground}')`,
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/50 rounded"></div>

            {/* Stats Box - Horizontal Layout like image */}
            <div className="relative z-10 h-full flex items-center p-1 text-white text-xs">
              {/* Tennis Scoreboard - Horizontal Layout */}
              <div className="sb-live-scoreboard-sets background-tennis w-full">
                <div className="sb-live-scoreboard-sets--container flex items-center gap-2">
                  {/* Period on LEFT */}
                  <div className="sb-live-scoreboard-sets--header flex-shrink-0">
                    <span className="sb-live-scoreboard--subtitle text-yellow-400 text-xs font-bold whitespace-nowrap">
                      {liveData?.PeriodName || '1º Set'}
                    </span>
                  </div>

                  {/* Player Names and Scores Section - CENTER to RIGHT */}
                  <div className="flex-1 flex items-center">
                    {/* Player Names Column */}
                    <div className="sb-live-scoreboard-sets--info flex flex-col flex-1 space-y-1">
                      <span className="sb-live-scoreboard--title color-light text-white text-xs truncate" title={event?.home_team}>
                        {event?.home_team || 'Player 1'}
                      </span>
                      <span className="sb-live-scoreboard--title color-light text-white text-xs truncate" title={event?.away_team}>
                        {event?.away_team || 'Player 2'}
                      </span>
                    </div>

                    {/* Score Section */}
                    <div className="sb-live-scoreboard-sets--score flex items-center gap-1">
                      {/* Service Dots */}
                      <div className="sb-live-scoreboard-sets--column has-service-dots flex flex-col justify-center space-y-2">
                        <i className={`sb-scoreboard-dot w-1.5 h-1.5 rounded-full ${liveData?.HomeService === true ? 'bg-green-400' : 'bg-transparent border border-gray-500'}`}></i>
                        <i className={`sb-scoreboard-dot w-1.5 h-1.5 rounded-full ${liveData?.HomeService === false ? 'bg-green-400' : 'bg-transparent border border-gray-500'}`}></i>
                      </div>

                      {/* Current Points */}
                      <div className="sb-live-scoreboard-sets--column is-column-points flex flex-col text-right space-y-1 min-w-[20px]">
                        <span className="sb-live-scoreboard--number color-light text-white text-sm font-bold">
                          {liveData?.ResultHome !== undefined ? liveData.ResultHome : '0'}
                        </span>
                        <span className="sb-live-scoreboard--number color-light text-white text-sm font-bold">
                          {liveData?.ResultAway !== undefined ? liveData.ResultAway : '0'}
                        </span>
                      </div>

                      {/* Sets Columns */}
                      {liveData?.Sets && Array.isArray(liveData.Sets) && liveData.Sets.map((set: any, setIndex: number) => (
                        <div key={setIndex} className="sb-live-scoreboard-sets--column flex flex-col text-center space-y-1 min-w-[16px]">
                          <span className="sb-live-scoreboard--number color-light text-white text-xs">
                            {set[0] || '-'}
                          </span>
                          <span className="sb-live-scoreboard--number color-light text-white text-xs">
                            {set[1] || '-'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // American Football Layout - Compact Table Style
    if (sportType.includes('american football') || sportType.includes('futbol americano') || sportType.includes('fútbol americano')) {
      // Get sport background
      const sportBackground = getSportBackground(sportType, sportCategories);
      
      // Determine number of quarters from data
      const quarterCount = liveData?.Quarters ? liveData.Quarters.length : 4;

      return (
        <div className="w-full max-w-5xl mx-auto">
          <div className="sb-live-widget">
            <div className={`sb-live-widget--container ${sportBackground}`}>
              {/* American Football Scoreboard Table */}
              <div className="sb-live-scoreboard-sets background-american-football w-full mb-1 bg-slate-800/90 rounded-lg border border-slate-600/50 shadow-lg">
                <div className="sb-live-scoreboard-sets--container p-2">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-700/80 border-b-2 border-yellow-500/50">
                        <th className="text-left text-yellow-400 font-bold px-2 py-1.5 rounded-tl-md">Equipo</th>
                        {/* Possession Indicator column */}
                        <th className="text-center text-yellow-400 font-semibold px-1 py-1.5 min-w-[24px]">🏈</th>
                        {/* Quarter columns - dynamic based on Quarters array */}
                        {Array.from({ length: quarterCount }).map((_, index) => (
                          <th key={index} className="text-center text-yellow-400 font-semibold px-2 py-1.5 min-w-[32px] border-l border-slate-600/30">
                            {index + 1}
                          </th>
                        ))}
                        {/* Total Score */}
                        <th className="text-center text-yellow-400 font-bold px-2 py-1.5 min-w-[40px] border-l-2 border-yellow-500/50 rounded-tr-md">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Home Team Row */}
                      <tr className="border-t border-slate-600/50 bg-slate-800/60 hover:bg-slate-700/40 transition-colors">
                        <td className="text-left text-white font-medium px-2 py-1.5 truncate" title={liveData?.ParticipantHome}>
                          <span className="truncate">{liveData?.ParticipantHome || 'Home'}</span>
                        </td>
                        {/* Possession Indicator - Green dot for team with possession */}
                        <td className="text-center px-1 py-1.5">
                          <div className={`w-2 h-2 rounded-full mx-auto ${liveData?.HomeAttacking === true ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-slate-600/30'}`}></div>
                        </td>
                        {/* Home Quarter Scores */}
                        {Array.from({ length: quarterCount }).map((_, index) => (
                          <td key={index} className="text-center text-white font-medium px-2 py-1.5 border-l border-slate-600/30">
                            {liveData?.Quarters && liveData.Quarters[index] && liveData.Quarters[index][0] !== undefined ? liveData.Quarters[index][0] : '-'}
                          </td>
                        ))}
                        {/* Home Total Score */}
                        <td className="text-center text-yellow-400 font-bold px-2 py-1.5 text-base border-l-2 border-yellow-500/50 bg-slate-700/50">
                          {liveData?.ResultHome !== undefined ? liveData.ResultHome : '0'}
                        </td>
                      </tr>
                      {/* Away Team Row */}
                      <tr className="border-t border-slate-600/50 bg-slate-800/60 hover:bg-slate-700/40 transition-colors">
                        <td className="text-left text-white font-medium px-2 py-1.5 truncate rounded-bl-md" title={liveData?.ParticipantAway}>
                          <span className="truncate">{liveData?.ParticipantAway || 'Away'}</span>
                        </td>
                        {/* Possession Indicator - Green dot for team with possession */}
                        <td className="text-center px-1 py-1.5">
                          <div className={`w-2 h-2 rounded-full mx-auto ${liveData?.HomeAttacking === false ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-slate-600/30'}`}></div>
                        </td>
                        {/* Away Quarter Scores */}
                        {Array.from({ length: quarterCount }).map((_, index) => (
                          <td key={index} className="text-center text-white font-medium px-2 py-1.5 border-l border-slate-600/30">
                            {liveData?.Quarters && liveData.Quarters[index] && liveData.Quarters[index][1] !== undefined ? liveData.Quarters[index][1] : '-'}
                          </td>
                        ))}
                        {/* Away Total Score */}
                        <td className="text-center text-yellow-400 font-bold px-2 py-1.5 text-base border-l-2 border-yellow-500/50 bg-slate-700/50 rounded-br-md">
                          {liveData?.ResultAway !== undefined ? liveData.ResultAway : '0'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* American Football Game Status Row */}
              <div className="sb-live-scoreboard-current-data background-american-football w-full bg-slate-700/80 rounded-lg border border-slate-600/50 shadow-md">
                <div className="flex justify-center items-center gap-4 text-xs py-1.5 px-2">
                  <span className="text-yellow-400 font-bold">{liveData?.PeriodName || 'Quarter'}</span>
                  {liveData?.Try && liveData?.Yards && (
                    <span className="text-white font-medium bg-slate-600/50 px-2 py-0.5 rounded">{liveData.Try}° & {liveData.Yards}</span>
                  )}
                  {liveData?.Position && (
                    <span className="text-gray-300 font-medium">Yard {liveData.Position}</span>
                  )}
                  {liveData?.RemainingPeriodTime && (
                    <span className="text-gray-300 font-medium">{liveData.RemainingPeriodTime}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Darts Layout
    if (sportType.includes('darts') || sportType.includes('dardos')) {
      // Check if event is truly live using multiple indicators
      const isEventLive = (
        (event?.status && (event.status === 'live' || event.status === 'in_progress' || event.status.toLowerCase().includes('live'))) ||
        event?.active === true ||
        (event as any)?.isLive === true ||
        event?.liveData !== undefined
      ) && (
          !event?.status || (
            event.status !== 'not_started' &&
            event.status !== 'finished' &&
            event.status !== 'postponed'
          )
        );

      console.log('🎯 [LiveMatchHeader] Darts stats check:', {
        eventId: event?.id,
        sport: sportType,
        status: event?.status,
        active: event?.active,
        isLive: (event as any)?.isLive,
        hasLiveData: !!event?.liveData,
        isEventLive,
        liveDataKeys: event?.liveData ? Object.keys(event.liveData) : [],
        ResultHome: liveData?.ResultHome,
        ResultAway: liveData?.ResultAway,
        Legs: liveData?.Legs
      });

      // Only show live stats for actual live events
      if (!isEventLive) {
        return null;
      }

      // Get sport background
      const sportBackground = getSportBackground(sportType, sportCategories);

      return (
        <div className="flex justify-center w-full">
          {/* Compact Darts Widget - Table Style */}
          <div
            className="relative w-full max-w-md min-h-[60px] rounded bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/cache/sports/${sportBackground}')`,
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/50 rounded"></div>

            {/* Stats Box - Table Layout */}
            <div className="relative z-10 h-full flex items-center p-1 text-white text-xs">
              {/* Darts Scoreboard Table */}
              <div className="sb-live-scoreboard-sets background-darts w-full">
                <div className="sb-live-scoreboard-sets--container">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.PeriodName || 'Live'}
                        </th>
                        {/* Sets column */}
                        <th className="text-center text-gray-300 font-normal px-1 py-0.5 min-w-[32px]">
                          Sets
                        </th>
                        {/* Legs column */}
                        <th className="text-center text-gray-300 font-normal px-1 py-0.5 min-w-[32px]">
                          Legs
                        </th>
                        {/* Remaining Points column */}
                        {liveData?.Legs?.[1] && (liveData.Legs[1][0] !== undefined || liveData.Legs[1][1] !== undefined) && (
                          <th className="text-center text-gray-300 font-normal px-1 py-0.5 min-w-[32px]">
                            Pts
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Home Team Row */}
                      <tr className="border-t border-gray-600/50">
                        <td className="text-left text-white px-1 py-0.5 truncate" title={event?.home_team}>
                          {event?.home_team || 'Home'}
                        </td>
                        {/* Home Sets */}
                        <td className="text-center text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.ResultHome !== undefined ? liveData.ResultHome : '-'}
                        </td>
                        {/* Home Legs */}
                        <td className="text-center text-white px-1 py-0.5">
                          {liveData?.Legs?.[0]?.[0] !== undefined ? liveData.Legs[0][0] : '-'}
                        </td>
                        {/* Home Remaining Points */}
                        {liveData?.Legs?.[1] && (liveData.Legs[1][0] !== undefined || liveData.Legs[1][1] !== undefined) && (
                          <td className="text-center text-white px-1 py-0.5">
                            {liveData.Legs[1][0] !== undefined ? liveData.Legs[1][0] : '-'}
                          </td>
                        )}
                      </tr>

                      {/* Away Team Row */}
                      <tr className="border-t border-gray-600/50">
                        <td className="text-left text-white px-1 py-0.5 truncate" title={event?.away_team}>
                          {event?.away_team || 'Away'}
                        </td>
                        {/* Away Sets */}
                        <td className="text-center text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.ResultAway !== undefined ? liveData.ResultAway : '-'}
                        </td>
                        {/* Away Legs */}
                        <td className="text-center text-white px-1 py-0.5">
                          {liveData?.Legs?.[0]?.[1] !== undefined ? liveData.Legs[0][1] : '-'}
                        </td>
                        {/* Away Remaining Points */}
                        {liveData?.Legs?.[1] && (liveData.Legs[1][0] !== undefined || liveData.Legs[1][1] !== undefined) && (
                          <td className="text-center text-white px-1 py-0.5">
                            {liveData.Legs[1][1] !== undefined ? liveData.Legs[1][1] : '-'}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handball (Balonmano) Layout - Simple Score Display
    if (sportType.includes('handball') || sportType.includes('balonmano')) {
      // Check if event is truly live
      const isEventLive = (
        (event?.status && (event.status === 'live' || event.status === 'in_progress' || event.status.toLowerCase().includes('live'))) ||
        event?.active === true ||
        (event as any)?.isLive === true ||
        event?.liveData !== undefined
      ) && (
          !event?.status || (
            event.status !== 'not_started' &&
            event.status !== 'finished' &&
            event.status !== 'postponed'
          )
        );

      console.log('🤾 [LiveMatchHeader] Handball stats check:', {
        eventId: event?.id,
        sport: sportType,
        status: event?.status,
        active: event?.active,
        isLive: (event as any)?.isLive,
        hasLiveData: !!event?.liveData,
        isEventLive,
        liveDataKeys: event?.liveData ? Object.keys(event.liveData) : [],
        ResultHome: liveData?.ResultHome,
        ResultAway: liveData?.ResultAway,
        MatchTime: liveData?.MatchTime
      });

      // Only show live stats for actual live events
      if (!isEventLive) {
        return null;
      }

      return (
        <div className="w-full max-w-5xl mx-auto">
          <div className="sb-live-widget">
            <div className="sb-live-widget--container">
              {/* Handball Simple Score Display */}
              <div className="bg-slate-800/90 rounded-lg border border-slate-600/50 shadow-lg p-3">
                <div className="flex items-center justify-center gap-6">
                  {/* Period Info */}
                  <div className="text-xs text-gray-300 font-medium">
                    {liveData?.PeriodName || 'Período'}
                  </div>
                  
                  {/* Home Team */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">{liveData?.ParticipantHome || event.home_team}</span>
                    <span className="text-2xl font-bold text-white">{liveData?.ResultHome !== undefined ? liveData.ResultHome : '0'}</span>
                  </div>

                  {/* Score Separator */}
                  <div className="text-2xl font-bold text-yellow-400">:</div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">{liveData?.ParticipantAway || event.away_team}</span>
                    <span className="text-2xl font-bold text-white">{liveData?.ResultAway !== undefined ? liveData.ResultAway : '0'}</span>
                  </div>

                  {/* Time */}
                  {liveData?.MatchTime !== undefined && liveData.MatchTime >= 0 && (
                    <div className="text-xs text-gray-300 font-medium">
                      {liveData.MatchTime}'
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // eSports Layout
    if (sportType.includes('esports') || sportType.includes('e-sports') || sportType.includes('eSports')) {
      // Check if event is truly live using multiple indicators
      const isEventLive = (
        (event?.status && (event.status === 'live' || event.status === 'in_progress' || event.status.toLowerCase().includes('live'))) ||
        event?.active === true ||
        (event as any)?.isLive === true ||
        event?.liveData !== undefined
      ) && (
          !event?.status || (
            event.status !== 'not_started' &&
            event.status !== 'finished' &&
            event.status !== 'postponed'
          )
        );

      console.log('🎮 [LiveMatchHeader] eSports stats check:', {
        eventId: event?.id,
        sport: sportType,
        status: event?.status,
        active: event?.active,
        isLive: (event as any)?.isLive,
        hasLiveData: !!event?.liveData,
        isEventLive,
        liveDataKeys: event?.liveData ? Object.keys(event.liveData) : [],
        ResultHome: liveData?.ResultHome,
        ResultAway: liveData?.ResultAway,
        MatchTime: liveData?.MatchTime
      });

      // Only show live stats for actual live events
      if (!isEventLive) {
        return null;
      }

      return (
        <div className="w-full max-w-3xl mx-auto">
          {/* eSports Stats Container */}
          <div className="bg-slate-700 text-white p-1">

            {/* Ultra-Compact eSports Stats */}
            <div className="grid grid-cols-2 gap-0.5 text-center text-xs mt-0">
              {/* Row 1: Current Score */}
              <div className="bg-slate-600/80 px-0.5 py-0.5 rounded">
                <div className="flex items-center justify-center gap-0.5 text-xs text-gray-300">
                  <Trophy className="w-3 h-3" />
                  <span>Score</span>
                </div>
                <div className="text-xs text-yellow-400">
                  {liveData?.ResultHome || 0}-{liveData?.ResultAway || 0}
                </div>
              </div>

              {/* Row 1: Match Time */}
              <div className="bg-slate-600/80 px-0.5 py-0.5 rounded">
                <div className="flex items-center justify-center gap-0.5 text-xs text-gray-300">
                  <Clock className="w-3 h-3" />
                  <span>Time</span>
                </div>
                <div className="text-xs text-yellow-400">
                  {liveData?.MatchTime || 0}'
                </div>
              </div>

              {/* Row 2: Period/Status */}
              <div className="bg-slate-600/80 px-0.5 py-0.5 rounded col-span-2">
                <div className="flex items-center justify-center gap-0.5 text-xs text-gray-300">
                  <Activity className="w-3 h-3" />
                  <span>Status</span>
                </div>
                <div className="text-xs text-yellow-400">
                  {liveData?.PeriodName || 'Live'}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Ice Hockey Layout - Compact table
    if (sportType.includes('hockey') || sportType.includes('hielo') || sportType.includes('ice hockey')) {
      // Check if event is truly live
      const isEventLive = (
        (event?.status && (event.status === 'live' || event.status === 'in_progress' || event.status.toLowerCase().includes('live'))) ||
        event?.active === true ||
        (event as any)?.isLive === true ||
        event?.liveData !== undefined
      ) && (
          !event?.status || (
            event.status !== 'not_started' &&
            event.status !== 'finished' &&
            event.status !== 'postponed'
          )
        );

      console.log('🏒 [LiveMatchHeader] Ice Hockey stats check:', {
        eventId: event?.id,
        sport: sportType,
        status: event?.status,
        active: event?.active,
        isLive: (event as any)?.isLive,
        hasLiveData: !!event?.liveData,
        isEventLive,
        liveDataKeys: event?.liveData ? Object.keys(event.liveData) : []
      });

      // Only show compact hockey widget for actual live events
      if (!isEventLive) {
        return null;
      }

      // Get sport background
      const sportBackground = getSportBackground(sportType, sportCategories);

      return (
        <div className="flex justify-center w-full">
          {/* Compact Ice Hockey Widget - Table Style */}
          <div
            className="relative w-full max-w-md min-h-[60px] rounded bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/cache/sports/${sportBackground}')`,
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/50 rounded"></div>

            {/* Stats Box - Table Layout */}
            <div className="relative z-10 h-full flex items-center p-1 text-white text-xs">
              {/* Ice Hockey Scoreboard Table */}
              <div className="sb-live-scoreboard-sets background-hockey w-full">
                <div className="sb-live-scoreboard-sets--container">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.PeriodName || 'Live'}
                        </th>
                        {/* Possession indicator column */}
                        <th className="text-center px-0.5 py-0.5 min-w-[16px]"></th>
                        {/* Period Scores as columns */}
                        {liveData?.Periods && Array.isArray(liveData.Periods) && liveData.Periods.map((period: number[], index: number) => (
                          <th key={index} className="text-center text-gray-300 font-normal px-1 py-0.5 min-w-[24px]">
                            {index + 1}
                          </th>
                        ))}
                        {/* Total Score */}
                        <th className="text-center text-yellow-400 font-bold px-1 py-0.5 min-w-[24px]">
                          T
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Home Team Row */}
                      <tr className="border-t border-gray-600/50">
                        <td className="text-left text-white px-1 py-0.5 truncate" title={event?.home_team}>
                          {event?.home_team || 'Home'}
                        </td>
                        {/* Home Possession Indicator */}
                        <td className="text-center px-0.5 py-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full mx-auto ${liveData?.HomeAttacking === true ? 'bg-green-400' : 'bg-transparent'}`}></div>
                        </td>
                        {/* Home Period Scores */}
                        {liveData?.Periods && Array.isArray(liveData.Periods) && liveData.Periods.map((period: number[], index: number) => (
                          <td key={index} className="text-center text-white px-1 py-0.5">
                            {period[0] !== undefined ? period[0] : '-'}
                          </td>
                        ))}
                        {/* Home Total Score */}
                        <td className="text-center text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.ResultHome !== undefined ? liveData.ResultHome : '0'}
                        </td>
                      </tr>

                      {/* Away Team Row */}
                      <tr className="border-t border-gray-600/50">
                        <td className="text-left text-white px-1 py-0.5 truncate" title={event?.away_team}>
                          {event?.away_team || 'Away'}
                        </td>
                        {/* Away Possession Indicator */}
                        <td className="text-center px-0.5 py-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full mx-auto ${liveData?.HomeAttacking === false ? 'bg-green-400' : 'bg-transparent'}`}></div>
                        </td>
                        {/* Away Period Scores */}
                        {liveData?.Periods && Array.isArray(liveData.Periods) && liveData.Periods.map((period: number[], index: number) => (
                          <td key={index} className="text-center text-white px-1 py-0.5">
                            {period[1] !== undefined ? period[1] : '-'}
                          </td>
                        ))}
                        {/* Away Total Score */}
                        <td className="text-center text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.ResultAway !== undefined ? liveData.ResultAway : '0'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Baseball Layout
    if (sportType.includes('baseball') || sportType.includes('beisbol') || sportType.includes('béisbol')) {
      // Check if event is truly live
      const isEventLive = (
        (event?.status && (event.status === 'live' || event.status === 'in_progress' || event.status.toLowerCase().includes('live'))) ||
        event?.active === true ||
        (event as any)?.isLive === true ||
        event?.liveData !== undefined
      ) && (
          !event?.status || (
            event.status !== 'not_started' &&
            event.status !== 'finished' &&
            event.status !== 'postponed'
          )
        );

      console.log('⚾ [LiveMatchHeader] Baseball stats check:', {
        eventId: event?.id,
        sport: sportType,
        status: event?.status,
        active: event?.active,
        isLive: (event as any)?.isLive,
        hasLiveData: !!event?.liveData,
        isEventLive,
        liveDataKeys: event?.liveData ? Object.keys(event.liveData) : []
      });

      // Only show compact baseball widget for actual live events
      if (!isEventLive) {
        return null;
      }

      // Get sport background
      const sportBackground = getSportBackground(sportType, sportCategories);

      // Determine number of innings from mock data structure
      const inningCount = liveData?.Innings ? liveData.Innings.length : 9;

      return (
        <div className="flex justify-center w-full">
          {/* Compact Baseball Widget - Table Style */}
          <div
            className="relative w-full max-w-lg min-h-[80px] rounded bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/cache/sports/${sportBackground}')`,
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/50 rounded"></div>
            {/* Stats Box - Table Layout */}
            <div className="relative z-10 h-full flex flex-col p-1 text-white text-xs">
              {/* Baseball Scoreboard Table */}
              <div className="sb-live-scoreboard-sets background-baseball w-full mb-1">
                <div className="sb-live-scoreboard-sets--container">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left text-yellow-400 font-bold px-1 py-0.5">Equipo</th>
                        {/* Batting Indicator column */}
                        <th className="text-center px-0.5 py-0.5 min-w-[16px]">Bateo</th>
                        {/* Inning columns - dynamic based on Innings array */}
                        {Array.from({ length: inningCount }).map((_, index) => (
                          <th key={index} className="text-center text-gray-300 font-normal px-0.5 py-0.5 min-w-[20px]">
                            {index + 1}
                          </th>
                        ))}
                        {/* Total Score */}
                        <th className="text-center text-yellow-400 font-bold px-1 py-0.5 min-w-[24px]">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Home Team Row */}
                      <tr className="border-t border-gray-600/50">
                        <td className="text-left text-white px-1 py-0.5 truncate" title={liveData?.ParticipantHome}>
                          <span className="truncate">{liveData?.ParticipantHome || 'Home'}</span>
                        </td>
                        {/* Batting Indicator - Bat icon for batting team, ball for pitching team */}
                        <td className="text-center px-0.5 py-0.5">
                          {liveData?.HomeService === false ? (
                            <img src="/cache/icons/baseball-bat-colorful.svg" alt="Bateando" width={18} height={18} className="inline-block align-middle" />
                          ) : (
                            <img src="/cache/icons/baseball-ball.svg" alt="Pitching" width={18} height={18} className="inline-block align-middle" />
                          )}
                        </td>
                        {/* Home Inning Scores */}
                        {Array.from({ length: inningCount }).map((_, index) => (
                          <td key={index} className="text-center text-white px-0.5 py-0.5">
                            {liveData?.Innings && liveData.Innings[index] && liveData.Innings[index][0] !== undefined ? liveData.Innings[index][0] : '-'}
                          </td>
                        ))}
                        {/* Home Total Score */}
                        <td className="text-center text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.ResultHome !== undefined ? liveData.ResultHome : '0'}
                        </td>
                      </tr>
                      {/* Away Team Row */}
                      <tr className="border-t border-gray-600/50">
                        <td className="text-left text-white px-1 py-0.5 truncate" title={liveData?.ParticipantAway}>
                          <span className="truncate">{liveData?.ParticipantAway || 'Away'}</span>
                        </td>
                        {/* Batting Indicator - Bat icon for batting team, ball for pitching team */}
                        <td className="text-center px-0.5 py-0.5">
                          {liveData?.HomeService === true ? (
                            <img src="/cache/icons/baseball-bat-colorful.svg" alt="Bateando" width={18} height={18} className="inline-block align-middle" />
                          ) : (
                            <img src="/cache/icons/baseball-ball.svg" alt="Pitching" width={18} height={18} className="inline-block align-middle" />
                          )}
                        </td>
                        {/* Away Inning Scores */}
                        {Array.from({ length: inningCount }).map((_, index) => (
                          <td key={index} className="text-center text-white px-0.5 py-0.5">
                            {liveData?.Innings && liveData.Innings[index] && liveData.Innings[index][1] !== undefined ? liveData.Innings[index][1] : '-'}
                          </td>
                        ))}
                        {/* Away Total Score */}
                        <td className="text-center text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.ResultAway !== undefined ? liveData.ResultAway : '0'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Baseball Game Status Row */}
              <div className="flex items-center justify-center gap-3 text-xs px-1">
                {/* Bases */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-300">Bases</span>
                  <div className="flex gap-0.5">
                    {liveData?.Bases ? (
                      <>
                        <div className={`w-1.5 h-1.5 rounded-full ${liveData.Bases.Baseone ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${liveData.Bases.Basetwo ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${liveData.Bases.Basethree ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
                      </>
                    ) : (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Balls */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-300">Balls</span>
                  <span className="text-yellow-400 font-bold">{liveData?.Balls !== undefined ? liveData.Balls : '0'}</span>
                </div>

                {/* Strikes */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-300">Strikes</span>
                  <span className="text-yellow-400 font-bold">{liveData?.Strikes !== undefined ? liveData.Strikes : '0'}</span>
                </div>

                {/* Outs */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-300">Out</span>
                  <span className="text-yellow-400 font-bold">{liveData?.Outs !== undefined ? liveData.Outs : '0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Football/Soccer Layout - Compact horizontal widget like tennis
    if (sportType.includes('fútbol') || sportType.includes('football') || sportType.includes('soccer')) {
      // Check if event is truly live
      const isEventLive = (
        (event?.status && (event.status === 'live' || event.status === 'in_progress' || event.status.toLowerCase().includes('live'))) ||
        event?.active === true ||
        (event as any)?.isLive === true ||
        event?.liveData !== undefined
      ) && (
          !event?.status || (
            event.status !== 'not_started' &&
            event.status !== 'finished' &&
            event.status !== 'postponed'
          )
        );

      console.log('⚽ [LiveMatchHeader] Soccer stats check:', {
        eventId: event?.id,
        sport: sportType,
        status: event?.status,
        active: event?.active,
        isLive: (event as any)?.isLive,
        hasLiveData: !!event?.liveData,
        isEventLive,
        liveDataKeys: event?.liveData ? Object.keys(event.liveData) : []
      });

      // Only show compact soccer widget for actual live events
      if (!isEventLive) {
        return null;
      }

      // Calculate corners
      const cornerCount = liveData?.Actions?.filter((action: any) => action.ActionTypeName === "Corner").length || 0;
      const homeCorners = liveData?.Actions?.filter((action: any) => action.ActionTypeName === "Corner" && action.IsHomeTeam).length || 0;
      const awayCorners = cornerCount - homeCorners;

      // Get sport background
      const sportBackground = getSportBackground(sportType, sportCategories);

      return (
        <div className="flex justify-center w-full">
          {/* Compact Soccer Widget - Table Style */}
          <div
            className="relative w-full max-w-md min-h-[60px] rounded bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/cache/sports/${sportBackground}')`,
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/50 rounded"></div>

            {/* Stats Box - Table Layout */}
            <div className="relative z-10 h-full flex items-center p-1 text-white text-xs">
              {/* Soccer Scoreboard Table */}
              <div className="sb-live-scoreboard-sets background-soccer w-full">
                <div className="sb-live-scoreboard-sets--container">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.PeriodName || '1st Half'} {liveData?.MatchTime ? `${liveData.MatchTime}'` : ''}
                        </th>
                        {/* Possession indicator column */}
                        <th className="text-center px-0.5 py-0.5 min-w-[16px]"></th>
                        <th className="text-center text-white font-bold px-1 py-0.5 min-w-[20px]">Score</th>
                        <th className="text-center px-1 py-0.5 min-w-[24px]">
                          <div className="w-2 h-2.5 bg-yellow-400 rounded-sm mx-auto"></div>
                        </th>
                        <th className="text-center px-1 py-0.5 min-w-[24px]">
                          <div className="w-2 h-2.5 bg-red-500 rounded-sm mx-auto"></div>
                        </th>
                        <th className="text-center px-1 py-0.5 min-w-[20px]">
                          <CornerDownRight className="w-3 h-3 mx-auto text-white" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Home Team Row */}
                      <tr className="border-t border-gray-600/50">
                        <td className="text-left text-white px-1 py-0.5 truncate" title={event?.home_team}>
                          {event?.home_team || 'Home'}
                        </td>
                        {/* Home Possession Indicator */}
                        <td className="text-center px-0.5 py-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full mx-auto ${liveData?.HomeAttacking === true ? 'bg-green-400' : 'bg-transparent'}`}></div>
                        </td>
                        <td className="text-center text-white font-bold px-1 py-0.5">
                          {liveData?.ResultHome !== undefined ? liveData.ResultHome : '0'}
                        </td>
                        <td className="text-center px-1 py-0.5">
                          <div className="flex items-center justify-center gap-0.5">
                            {liveData?.YellowCardsHome ? Array.from({ length: Math.min(liveData.YellowCardsHome, 3) }).map((_, i) => (
                              <div key={`yh-${i}`} className="w-1.5 h-2 bg-yellow-400 rounded-sm"></div>
                            )) : <span className="text-gray-500">-</span>}
                          </div>
                        </td>
                        <td className="text-center px-1 py-0.5">
                          <div className="flex items-center justify-center gap-0.5">
                            {liveData?.RedCardsHome ? Array.from({ length: Math.min(liveData.RedCardsHome, 2) }).map((_, i) => (
                              <div key={`rh-${i}`} className="w-1.5 h-2 bg-red-500 rounded-sm"></div>
                            )) : <span className="text-gray-500">-</span>}
                          </div>
                        </td>
                        <td className="text-center text-white px-1 py-0.5">
                          {homeCorners || '0'}
                        </td>
                      </tr>

                      {/* Away Team Row */}
                      <tr className="border-t border-gray-600/50">
                        <td className="text-left text-white px-1 py-0.5 truncate" title={event?.away_team}>
                          {event?.away_team || 'Away'}
                        </td>
                        {/* Away Possession Indicator */}
                        <td className="text-center px-0.5 py-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full mx-auto ${liveData?.HomeAttacking === false ? 'bg-green-400' : 'bg-transparent'}`}></div>
                        </td>
                        <td className="text-center text-white font-bold px-1 py-0.5">
                          {liveData?.ResultAway !== undefined ? liveData.ResultAway : '0'}
                        </td>
                        <td className="text-center px-1 py-0.5">
                          <div className="flex items-center justify-center gap-0.5">
                            {liveData?.YellowCardsAway ? Array.from({ length: Math.min(liveData.YellowCardsAway, 3) }).map((_, i) => (
                              <div key={`ya-${i}`} className="w-1.5 h-2 bg-yellow-400 rounded-sm"></div>
                            )) : <span className="text-gray-500">-</span>}
                          </div>
                        </td>
                        <td className="text-center px-1 py-0.5">
                          <div className="flex items-center justify-center gap-0.5">
                            {liveData?.RedCardsAway ? Array.from({ length: Math.min(liveData.RedCardsAway, 2) }).map((_, i) => (
                              <div key={`ra-${i}`} className="w-1.5 h-2 bg-red-500 rounded-sm"></div>
                            )) : <span className="text-gray-500">-</span>}
                          </div>
                        </td>
                        <td className="text-center text-white px-1 py-0.5">
                          {awayCorners || '0'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Basketball Layout (including e-basket)
    if (sportType.includes('basketball') || sportType.includes('baloncesto') || sportType.includes('e-basket') || sportType.includes('ebasket')) {
      // Check if event is truly live
      const isEventLive = (
        (event?.status && (event.status === 'live' || event.status === 'in_progress' || event.status.toLowerCase().includes('live'))) ||
        event?.active === true ||
        (event as any)?.isLive === true ||
        event?.liveData !== undefined
      ) && (
          !event?.status || (
            event.status !== 'not_started' &&
            event.status !== 'finished' &&
            event.status !== 'postponed'
          )
        );

      console.log('🏀 [LiveMatchHeader] Basketball stats check:', {
        eventId: event?.id,
        sport: sportType,
        status: event?.status,
        active: event?.active,
        isLive: (event as any)?.isLive,
        hasLiveData: !!event?.liveData,
        isEventLive,
        liveDataKeys: event?.liveData ? Object.keys(event.liveData) : []
      });

      // Only show compact basketball widget for actual live events
      if (!isEventLive) {
        return null;
      }

      // Get sport background
      const sportBackground = getSportBackground(sportType, sportCategories);

      return (
        <div className="flex justify-center w-full">
          {/* Compact Basketball Widget - Table Style */}
          <div
            className="relative w-full max-w-md min-h-[60px] rounded bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/cache/sports/${sportBackground}')`,
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/50 rounded"></div>

            {/* Stats Box - Table Layout */}
            <div className="relative z-10 h-full flex items-center p-1 text-white text-xs">
              {/* Basketball Scoreboard Table */}
              <div className="sb-live-scoreboard-sets background-basketball w-full">
                <div className="sb-live-scoreboard-sets--container">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.PeriodName || 'En pausa'} · {liveData?.Time || '10:00'}
                        </th>
                        {/* Possession indicator column */}
                        <th className="text-center px-0.5 py-0.5 min-w-[16px]"></th>
                        {/* Quarter Scores as columns */}
                        {liveData?.Quarters && Array.isArray(liveData.Quarters) && liveData.Quarters.map((quarter: number[], index: number) => (
                          <th key={index} className="text-center text-gray-300 font-normal px-1 py-0.5 min-w-[24px]">
                            {index + 1}
                          </th>
                        ))}
                        {/* Total Score */}
                        <th className="text-center text-yellow-400 font-bold px-1 py-0.5 min-w-[24px]">
                          T
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Home Team Row */}
                      <tr className="border-t border-gray-600/50">
                        <td className="text-left text-white px-1 py-0.5 truncate" title={event?.home_team}>
                          {event?.home_team || 'Home'}
                        </td>
                        {/* Home Possession Indicator */}
                        <td className="text-center px-0.5 py-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full mx-auto ${liveData?.HomeAttacking === true ? 'bg-green-400' : 'bg-transparent'}`}></div>
                        </td>
                        {/* Home Quarter Scores */}
                        {liveData?.Quarters && Array.isArray(liveData.Quarters) && liveData.Quarters.map((quarter: number[], index: number) => (
                          <td key={index} className="text-center text-white px-1 py-0.5">
                            {quarter[0] !== undefined ? quarter[0] : '-'}
                          </td>
                        ))}
                        {/* Home Total Score */}
                        <td className="text-center text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.ResultHome !== undefined ? liveData.ResultHome : '0'}
                        </td>
                      </tr>

                      {/* Away Team Row */}
                      <tr className="border-t border-gray-600/50">
                        <td className="text-left text-white px-1 py-0.5 truncate" title={event?.away_team}>
                          {event?.away_team || 'Away'}
                        </td>
                        {/* Away Possession Indicator */}
                        <td className="text-center px-0.5 py-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full mx-auto ${liveData?.HomeAttacking === false ? 'bg-green-400' : 'bg-transparent'}`}></div>
                        </td>
                        {/* Away Quarter Scores */}
                        {liveData?.Quarters && Array.isArray(liveData.Quarters) && liveData.Quarters.map((quarter: number[], index: number) => (
                          <td key={index} className="text-center text-white px-1 py-0.5">
                            {quarter[1] !== undefined ? quarter[1] : '-'}
                          </td>
                        ))}
                        {/* Away Total Score */}
                        <td className="text-center text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.ResultAway !== undefined ? liveData.ResultAway : '0'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Boxing/MMA Layout
    if (sportType.includes('boxeo') || sportType.includes('boxing') || sportType.includes('mma') || sportType.includes('mixed martial arts')) {
      return (
        <div className="w-full max-w-3xl mx-auto">
          {/* Boxing Stats Container */}
          <div className="bg-slate-800 text-white p-4">
            <div className="space-y-3">

              {/* Round Scores */}
              {liveData?.Rounds && (
                <div className="grid grid-cols-6 gap-2 text-sm">
                  <div className="text-center font-medium">Rounds</div>
                  {liveData.Rounds.slice(0, 5).map((round: any, index: number) => (
                    <div key={index} className="text-center">
                      <div className="bg-slate-600 p-1 mb-1 text-xs">R{index + 1}</div>
                      <div className="text-yellow-400">{round[0]} - {round[1]}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fight Stats */}
              <div className="flex justify-center space-x-6 text-sm">
                {liveData?.Strikes && (
                  <div className="bg-slate-600 px-3 py-1 rounded">
                    <span className="text-gray-300">Strikes </span>
                    <span className="text-yellow-400">{liveData.Strikes.Home} - {liveData.Strikes.Away}</span>
                  </div>
                )}
                {liveData?.TakeDowns && (
                  <div className="bg-slate-600 px-3 py-1 rounded">
                    <span className="text-gray-300">Takedowns </span>
                    <span className="text-yellow-400">{liveData.TakeDowns.Home} - {liveData.TakeDowns.Away}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Cricket Layout
    if (sportType.includes('cricket')) {
      return (
        <div className="w-full max-w-4xl mx-auto">
          {/* Cricket Stats Container */}
          <div className="bg-slate-800 text-white p-4">
            <div className="space-y-3">
              {/* Cricket Details */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-600 p-2 rounded">
                  <div className="text-xs text-gray-300">Wickets/Overs</div>
                  <div className="text-sm text-yellow-400">
                    {liveData?.Wickets?.Home !== undefined && `${liveData.Wickets.Home} wickets`}
                    {liveData?.Overs?.Home && ` • ${liveData.Overs.Home} overs`}
                  </div>
                </div>
                <div className="bg-slate-600 p-2 rounded">
                  <div className="text-xs text-gray-300">Wickets/Overs</div>
                  <div className="text-sm text-yellow-400">
                    {liveData?.Wickets?.Away !== undefined && `${liveData.Wickets.Away} wickets`}
                    {liveData?.Overs?.Away && ` • ${liveData.Overs.Away} overs`}
                  </div>
                </div>
              </div>

              {/* Current Batting */}
              <div className="text-center text-sm text-gray-300">
                {liveData?.CurrentBatsman && (
                  <div>Batting: {liveData.CurrentBatsman}</div>
                )}
                {liveData?.CurrentBowler && (
                  <div>Bowling: {liveData.CurrentBowler}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Rugby Layout
    if (sportType.includes('rugby')) {
      return (
        <div className="w-full max-w-3xl mx-auto">
          {/* Rugby Stats Container */}
          <div className="bg-slate-800 text-white p-4">

            {/* Rugby Stats */}
            <div className="flex justify-center space-x-6 text-sm mt-4">
              {liveData?.Tries && (
                <div className="bg-slate-600 px-3 py-1 rounded">
                  <span className="text-gray-300">Tries </span>
                  <span className="text-yellow-400">{liveData.Tries.Home} - {liveData.Tries.Away}</span>
                </div>
              )}
              {liveData?.Conversions && (
                <div className="bg-slate-600 px-3 py-1 rounded">
                  <span className="text-gray-300">Conversions </span>
                  <span className="text-yellow-400">{liveData.Conversions.Home} - {liveData.Conversions.Away}</span>
                </div>
              )}
              {liveData?.Penalties && (
                <div className="bg-slate-600 px-3 py-1 rounded">
                  <span className="text-gray-300">Penalties </span>
                  <span className="text-yellow-400">{liveData.Penalties.Home} - {liveData.Penalties.Away}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Volleyball Layout (Enhanced)
    if (sportType.includes('voleibol') || sportType.includes('volleyball')) {
      // Check if event is truly live
      const isEventLive = (
        (event?.status && (event.status === 'live' || event.status === 'in_progress' || event.status.toLowerCase().includes('live'))) ||
        event?.active === true ||
        (event as any)?.isLive === true ||
        event?.liveData !== undefined
      ) && (
          !event?.status || (
            event.status !== 'not_started' &&
            event.status !== 'finished' &&
            event.status !== 'postponed'
          )
        );

      console.log('🏐 [LiveMatchHeader] Volleyball stats check:', {
        eventId: event?.id,
        sport: sportType,
        status: event?.status,
        active: event?.active,
        isLive: (event as any)?.isLive,
        hasLiveData: !!event?.liveData,
        isEventLive,
        liveDataKeys: event?.liveData ? Object.keys(event.liveData) : []
      });

      // Only show compact volleyball widget for actual live events
      if (!isEventLive) {
        return null;
      }

      // Get sport background
      const sportBackground = getSportBackground(sportType, sportCategories);

      return (
        <div className="flex justify-center w-full">
          {/* Compact Volleyball Widget - Table Style */}
          <div
            className="relative w-full max-w-md min-h-[60px] rounded bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/cache/sports/${sportBackground}')`,
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/50 rounded"></div>

            {/* Stats Box - Table Layout */}
            <div className="relative z-10 h-full flex items-center p-1 text-white text-xs">
              {/* Volleyball Scoreboard Table */}
              <div className="sb-live-scoreboard-sets background-volleyball w-full">
                <div className="sb-live-scoreboard-sets--container">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.PeriodName || '2º Set'}
                        </th>
                        {/* Serving indicator column */}
                        <th className="text-center px-0.5 py-0.5 min-w-[16px]"></th>
                        {/* Set Scores as columns */}
                        {liveData?.Sets && Array.isArray(liveData.Sets) && liveData.Sets.map((set: number[], index: number) => (
                          <th key={index} className="text-center text-gray-300 font-normal px-1 py-0.5 min-w-[24px]">
                            {index + 1}
                          </th>
                        ))}
                        {/* Current set points column header */}
                        <th className="text-center text-gray-300 font-normal px-1 py-0.5 min-w-[24px]">
                          Pts
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Home Team Row */}
                      <tr className="border-t border-gray-600/50">
                        <td className="text-left text-white px-1 py-0.5 truncate" title={event?.home_team}>
                          {event?.home_team || 'Home'}
                        </td>
                        {/* Home Serving Indicator */}
                        <td className="text-center px-0.5 py-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full mx-auto ${liveData?.HomeService === true ? 'bg-green-400' : 'bg-transparent'}`}></div>
                        </td>
                        {/* Home Set Scores */}
                        {liveData?.Sets && Array.isArray(liveData.Sets) && liveData.Sets.map((set: number[], index: number) => (
                          <td key={index} className="text-center text-white px-1 py-0.5">
                            {set[0] !== undefined ? set[0] : '-'}
                          </td>
                        ))}
                        {/* Home Current Points */}
                        <td className="text-center text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.ResultHome !== undefined ? liveData.ResultHome : '0'}
                        </td>
                      </tr>

                      {/* Away Team Row */}
                      <tr className="border-t border-gray-600/50">
                        <td className="text-left text-white px-1 py-0.5 truncate" title={event?.away_team}>
                          {event?.away_team || 'Away'}
                        </td>
                        {/* Away Serving Indicator */}
                        <td className="text-center px-0.5 py-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full mx-auto ${liveData?.HomeService === false ? 'bg-green-400' : 'bg-transparent'}`}></div>
                        </td>
                        {/* Away Set Scores */}
                        {liveData?.Sets && Array.isArray(liveData.Sets) && liveData.Sets.map((set: number[], index: number) => (
                          <td key={index} className="text-center text-white px-1 py-0.5">
                            {set[1] !== undefined ? set[1] : '-'}
                          </td>
                        ))}
                        {/* Away Current Points */}
                        <td className="text-center text-yellow-400 font-bold px-1 py-0.5">
                          {liveData?.ResultAway !== undefined ? liveData.ResultAway : '0'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default Layout for other sports
    return (
      <div className="w-full max-w-2xl mx-auto">
        {/* Default Sports Stats Container */}
        <div className="bg-slate-800 text-white p-1">
          <div className="grid grid-cols-2 gap-0.5 text-center text-xs mt-2">
            <div className="bg-slate-600/80 px-0.5 py-0.5 rounded">
              <div className="flex items-center justify-center gap-0.5 text-xs text-gray-300">
                <Clock className="w-3 h-3" />
                <span>Time</span>
              </div>
              <div className="text-xs text-yellow-400">
                {safeDisplay(liveData?.Time)}
              </div>
            </div>

            <div className="bg-slate-600/80 px-0.5 py-0.5 rounded">
              <div className="flex items-center justify-center gap-0.5 text-xs text-gray-300">
                <Activity className="w-3 h-3" />
                <span>Match Time</span>
              </div>
              <div className="text-xs text-yellow-400">
                {liveData?.MatchTime && liveData.MatchTime !== '-1' && parseInt(liveData.MatchTime) >= 0 ? `${liveData.MatchTime}'` : "NO DATA"}
              </div>
            </div>

            <div className="bg-slate-600/80 px-0.5 py-0.5 rounded">
              <div className="flex items-center justify-center gap-0.5 text-xs text-gray-300">
                <Target className="w-3 h-3" />
                <span>Score</span>
              </div>
              <div className="text-xs text-yellow-400">
                {safeScoreDisplay(liveData?.ResultHome, liveData?.ResultAway)}
              </div>
            </div>

            <div className="bg-slate-600/80 px-0.5 py-0.5 rounded">
              <div className="flex items-center justify-center gap-0.5 text-xs text-gray-300">
                <Flag className="w-3 h-3" />
                <span>Period</span>
              </div>
              <div className="text-xs text-yellow-400">
                {safeDisplay(liveData?.PeriodName || `Period ${liveData?.Period || ''}`)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative w-full text-white ${className}`}>
      {/* Sport Background SVG - Enhanced visibility and positioning */}
      {backgroundImageUrl && (
        <div
          className="absolute inset-0 opacity-75"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'brightness(0.9) contrast(1.4) saturate(1.1)'
          }}
        />
      )}

      {/* Gradient Background - Lighter overlay to show sport background better */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-slate-800/20 to-slate-900/30" />

      {/* Content */}
      <div className={`relative z-10 ${isExpanded ? 'p-1' : 'p-0.5'}`}>
        {/* Top Bar */}
        <div className={`flex items-center justify-between ${isExpanded ? 'mb-1' : 'mb-0.5'}`}>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <div className="flex items-center gap-2">
                <span className="text-sm">{event?.sport_group || 'Sports'}</span>
                {/* League Logo and Name next to Sport Name */}
                {(() => {

                  return null;
                })()}
                {event?.league_logo ? (
                  <>
                    <span className="text-white/60">|</span>
                    <img
                      src={event.league_logo}
                      alt={event?.sport_title || 'League'}
                      className="w-4 h-4 rounded"
                      onError={(e) => {

                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                      onLoad={(e) => {

                      }}
                    />
                    <span className="text-xs text-white/80">{event?.sport_title || 'League'}</span>
                  </>
                ) : event?.sport_title ? (
                  <>
                    <span className="text-white/60">|</span>
                    <span className="text-xs text-white/80">{event.sport_title}</span>
                  </>
                ) : null}
              </div>
            </button>
          )}

          {/* Live Indicator */}
          {event?.active && (
            <div className="flex items-center gap-2 bg-green-600 px-3 py-1 rounded text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="font-semibold">LIVE</span>
            </div>
          )}
        </div>

        {/* Critical Info (Always Visible) - Centered Score Layout - Only for sports without custom widgets */}
        {!((event?.sport_group?.toLowerCase() || '').includes('tennis') ||
          (event?.sport_group?.toLowerCase() || '').includes('tenis') ||
          (event?.sport_title?.toLowerCase() || '').includes('tennis') ||
          (event?.sport_title?.toLowerCase() || '').includes('tenis') ||
          (event?.sport_group?.toLowerCase() || '').includes('badminton') ||
          (event?.sport_group?.toLowerCase() || '').includes('bádminton') ||
          (event?.sport_group?.toLowerCase() || '').includes('fútbol') ||
          (event?.sport_group?.toLowerCase() || '').includes('football') ||
          (event?.sport_group?.toLowerCase() || '').includes('soccer') ||
          (event?.sport_group?.toLowerCase() || '').includes('basketball') ||
          (event?.sport_group?.toLowerCase() || '').includes('baloncesto') ||
          (event?.sport_group?.toLowerCase() || '').includes('e-basket') ||
          (event?.sport_group?.toLowerCase() || '').includes('ebasket') ||
          (event?.sport_group?.toLowerCase() || '').includes('volleyball') ||
          (event?.sport_group?.toLowerCase() || '').includes('voleibol') ||
          (event?.sport_group?.toLowerCase() || '').includes('darts') ||
          (event?.sport_group?.toLowerCase() || '').includes('dardos') ||
          (event?.sport_group?.toLowerCase() || '').includes('hockey') ||
          (event?.sport_group?.toLowerCase() || '').includes('hielo') ||
          (event?.sport_group?.toLowerCase() || '').includes('ice hockey') ||
          (event?.sport_group?.toLowerCase() || '').includes('baseball') ||
          (event?.sport_group?.toLowerCase() || '').includes('beisbol') ||
          (event?.sport_group?.toLowerCase() || '').includes('béisbol')) && (
            <div className={`bg-slate-700/50 rounded ${isExpanded ? 'px-3 py-2' : 'px-2 py-1'} ${isExpanded ? 'mb-2' : 'mb-1'}`}>
              {/* Main Score Section - Centered */}
              <div className={`flex items-center justify-center ${isExpanded ? 'mb-2' : 'mb-1'}`}>
                {/* Home Team */}
                <div className="flex-1 text-center px-1">
                  <div className="text-sm font-bold break-words leading-tight">{event?.home_team || 'Team 1'}</div>
                </div>

                {/* Score - Centered */}
                <div className={`flex-shrink-0 ${isExpanded ? 'mx-6' : 'mx-4'}`}>
                  <div className="text-2xl font-bold text-yellow-400 text-center">
                    {(() => {
                      // Check if event is actually live
                      // Check multiple indicators of live status
                      const isEventLive = (
                        (event?.status && (event.status === 'live' || event.status === 'in_progress' || event.status.toLowerCase().includes('live'))) ||
                        event?.active === true ||
                        (event as any)?.isLive === true ||
                        event?.liveData !== undefined
                      ) && (
                          !event?.status || (
                            event.status !== 'not_started' &&
                            event.status !== 'finished' &&
                            event.status !== 'postponed'
                          )
                        );

                      console.log('🔍 [LiveMatchHeader] Score check:', {
                        eventId: event?.id,
                        status: event?.status,
                        active: event?.active,
                        isLive: (event as any)?.isLive,
                        hasLiveData: !!event?.liveData,
                        isEventLive,
                        ResultHome: event?.liveData?.ResultHome,
                        ResultAway: event?.liveData?.ResultAway,
                        scoresHome: event?.scores?.home,
                        scoresAway: event?.scores?.away
                      });

                      if (!isEventLive) {
                        return "- : -";
                      }

                      const homeScore = Math.max(0, event?.liveData?.ResultHome || event?.scores?.home || 0);
                      const awayScore = Math.max(0, event?.liveData?.ResultAway || event?.scores?.away || 0);
                      return `${homeScore} - ${awayScore}`;
                    })()}
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex-1 text-center px-1">
                  <div className="text-sm font-bold break-words leading-tight">{event?.away_team || 'Team 2'}</div>
                </div>
              </div>

              {/* Period and Toggle Button - Same Row */}
              <div className="flex items-center justify-between mb-2">
                {/* Period - Left Aligned */}
                <div className="text-sm text-gray-300 font-medium">
                  {(() => {
                    const periodName = event?.liveData?.PeriodName;
                    const status = event?.status;
                    const matchTime = event?.liveData?.MatchTime;
                    const liveDataStatus = event?.liveData?.Status;
                    const liveDataPeriod = event?.liveData?.Period;

                    // Check all possible period-related fields in the event
                    const allPossiblePeriodFields = {
                      'liveData.PeriodName': event?.liveData?.PeriodName,
                      'status': event?.status,
                      'liveData.Status': event?.liveData?.Status,
                      'liveData.Period': event?.liveData?.Period,
                      'match_status': (event as any)?.match_status,
                      'period_name': (event as any)?.period_name,
                      'period': (event as any)?.period,
                      'game_period': (event as any)?.game_period,
                      'current_period': (event as any)?.current_period
                    };



                    // Enhanced priority logic to catch period info from any source
                    let displayPeriod;

                    // Try PeriodName first
                    if (periodName && periodName.trim() !== '') {
                      displayPeriod = periodName.trim();

                    }
                    // Try status and check if it contains period-like info (Set, Tiempo, Period, etc.)
                    else if (status && status.trim() !== '') {
                      const cleanStatus = status.replace(/_/g, ' ').trim();
                      // Check if status contains period indicators
                      if (cleanStatus.toLowerCase() !== 'live' &&
                        (cleanStatus.includes('Set') || cleanStatus.includes('Tiempo') ||
                          cleanStatus.includes('Period') || cleanStatus.includes('Quarter') ||
                          cleanStatus.includes('º') || cleanStatus.includes('°'))) {
                        displayPeriod = cleanStatus;

                      } else if (cleanStatus.toLowerCase() !== 'live') {
                        displayPeriod = cleanStatus;

                      }
                    }

                    // Try other liveData fields
                    if (!displayPeriod && liveDataStatus && liveDataStatus.trim() !== '' && liveDataStatus.toLowerCase() !== 'live') {
                      displayPeriod = liveDataStatus.trim();

                    }

                    // Try numeric period
                    if (!displayPeriod && liveDataPeriod && liveDataPeriod > 0) {
                      displayPeriod = `Period ${liveDataPeriod}`;

                    }

                    // Fallback to Live/Scheduled
                    if (!displayPeriod) {
                      displayPeriod = event?.active ? 'Live' : 'Scheduled';

                    }

                    const timeInfo = matchTime && matchTime !== '-1' && parseInt(matchTime) >= 0 ? ` • ${matchTime}'` : '';
                    const result = `${displayPeriod}${timeInfo}`;

                    return result;
                  })()}
                </div>

                {/* Toggle Button - Right Aligned */}
                <button
                  onClick={toggleExpanded}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <span>Hide</span>
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <span>Show</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        {/* Collapsible Sport-Specific Content */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
          {getSportSpecificContent()}
        </div>
      </div>
    </div>
  );
};

export default LiveMatchHeader;


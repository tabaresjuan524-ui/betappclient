import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Users, Target, BarChart3, Shield, Activity, Trophy, History, TrendingUpIcon, Clipboard } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import SofascoreStatistics from './sofascore/SofascoreStatistics';
import SofascoreLineups from './sofascore/SofascoreLineupsNew';
import SofascoreMomentum from './sofascore/SofascoreMomentum';
import SofascoreStandings from './sofascore/SofascoreStandings';
import SofascoreH2H from './sofascore/SofascoreH2H';
import SofascorePrematchStandings from './sofascore/SofascorePrematchStandings';
import SofascoreBoxScore from './sofascore/SofascoreBoxScore';
import SofascoreForm from './sofascore/SofascoreForm';

interface SofascoreWidgetViewProps {
    matchId: number;
    sportName: string;
    onBack: () => void;
}

type TabType = 'overview' | 'boxscore' | 'statistics' | 'lineups' | 'momentum' | 'standings' | 'form' | 'h2h';

interface TabItem {
    id: TabType;
    label: string;
    icon: React.ReactNode;
}

/**
 * SofaScore Widget Detail View
 * Shows comprehensive match data including odds, statistics, incidents, and head-to-head
 */
const SofascoreWidgetView: React.FC<SofascoreWidgetViewProps> = ({ matchId, sportName, onBack }) => {
    const sofascoreData = useSelector((state: RootState) => state.odds.sofascore.data);
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    
    // Get event data - try both lowercase and capitalized sport names
    const eventId = matchId.toString();
    const sportNameLower = sportName.toLowerCase();
    const sportData = sofascoreData?.sports?.[sportNameLower] || sofascoreData?.sports?.[sportName];
    
    // Debug logging
    console.log('🔍 SofascoreWidgetView Debug:', {
        matchId,
        eventId,
        sportName,
        sportNameLower,
        availableSports: sofascoreData?.sports ? Object.keys(sofascoreData.sports) : [],
        sportData: sportData ? 'found' : 'not found',
        events: sportData?.events ? Object.keys(sportData.events) : []
    });
    
    const liveEvent = sportData?.liveEvents?.events?.find((e: any) => e.id === matchId) 
        || sportData?.liveEvents?.find((e: any) => e.id === matchId);
    const detailedData = sportData?.events?.[eventId];
    
    // Additional debug for detailedData
    if (detailedData) {
        console.log('📊 Available endpoints:', Object.keys(detailedData));
    } else {
        console.log('❌ No detailedData found for eventId:', eventId);
    }
    
    if (!sportData || !detailedData) {
        console.log('❌ Missing data:', { 
            sportData: !!sportData, 
            detailedData: !!detailedData, 
            liveEvent: !!liveEvent,
            allData: sofascoreData 
        });
        return (
            <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100">
                <header className="p-4 border-b dark:border-zinc-800 flex items-center">
                    <button onClick={onBack} className="mr-3 hover:bg-slate-100 dark:hover:bg-zinc-800 p-2 rounded">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-lg font-semibold">SofaScore Match Data</h2>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <p className="text-slate-500 mb-4">No SofaScore data available for this match</p>
                    <div className="text-xs text-slate-400 space-y-1 bg-slate-100 dark:bg-zinc-800 p-4 rounded">
                        <p><strong>Match ID:</strong> {matchId}</p>
                        <p><strong>Event ID:</strong> {eventId}</p>
                        <p><strong>Sport:</strong> {sportName} / {sportNameLower}</p>
                        <p><strong>Available sports:</strong> {sofascoreData?.sports ? Object.keys(sofascoreData.sports).join(', ') : 'none'}</p>
                        <p><strong>Sport data found:</strong> {sportData ? 'yes' : 'no'}</p>
                        <p><strong>Events in sport:</strong> {sportData?.events ? Object.keys(sportData.events).join(', ') : 'none'}</p>
                        <p><strong>Detailed data found:</strong> {detailedData ? 'yes' : 'no'}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Define available tabs
    const tabs: TabItem[] = [
        { id: 'overview', label: 'Overview', icon: <Target size={16} /> },
        { id: 'boxscore', label: 'Box Score', icon: <Clipboard size={16} /> },
        { id: 'statistics', label: 'Statistics', icon: <BarChart3 size={16} /> },
        { id: 'lineups', label: 'Lineups', icon: <Shield size={16} /> },
        { id: 'momentum', label: 'Momentum', icon: <Activity size={16} /> },
        { id: 'standings', label: 'Standings', icon: <Trophy size={16} /> },
        { id: 'form', label: 'Form', icon: <TrendingUpIcon size={16} /> },
        { id: 'h2h', label: 'H2H', icon: <History size={16} /> },
    ];
    
    // Log available endpoints for debugging
    console.log('📋 Extracting data for event:', eventId);
    console.log('🔑 detailedData keys:', detailedData ? Object.keys(detailedData) : []);
    
    // Try different possible key formats
    const possibleStatKeys = [
        `event/${eventId}/statistics`,
        `event_${eventId}_statistics`,
        'statistics'
    ];
    
    let foundStatisticsData = null;
    for (const key of possibleStatKeys) {
        if (detailedData?.[key]) {
            console.log(`✅ Found statistics at key: "${key}"`);
            foundStatisticsData = detailedData[key];
            break;
        }
    }
    
    console.log('Statistics data check:', {
        statisticsKey: `event/${eventId}/statistics`,
        found: !!foundStatisticsData,
        data: foundStatisticsData
    });

    // Extract all endpoint data
    const eventDetails = detailedData?.[`event/${eventId}`]?.event || liveEvent;
    const oddsData = detailedData?.[`event/${eventId}/odds/1/featured`];
    const allOddsData = detailedData?.[`event/${eventId}/odds/1/all`];
    const incidentsData = detailedData?.[`event/${eventId}/incidents`];
    // Combine H2H data from both endpoints - basic stats and events history
    const h2hBasic = detailedData?.[`event/${eventId}/h2h`];
    const h2hEvents = detailedData?.[`event/${eventDetails?.customId}/h2h/events`];
    
    // Merge h2hBasic stats with h2hEvents data
    let h2hData = null;
    if (h2hEvents?.events) {
        // If we have the events endpoint data, use it and merge with basic stats
        h2hData = {
            ...h2hBasic,
            ...h2hEvents
        };
    } else if (h2hBasic?.events) {
        // Fallback: if basic endpoint has events, use it
        h2hData = h2hBasic;
    }
    
    // Get team events data for H2H matches section
    const homeTeamLastEvents = detailedData?.[`team/${eventDetails?.homeTeam?.id}/events/last/0`];
    const awayTeamLastEvents = detailedData?.[`team/${eventDetails?.awayTeam?.id}/events/last/0`];
    const homeTeamNextEvents = detailedData?.[`team/${eventDetails?.homeTeam?.id}/events/next/0`];
    const awayTeamNextEvents = detailedData?.[`team/${eventDetails?.awayTeam?.id}/events/next/0`];
    
    // Debug H2H data extraction
    console.log('🔍 H2H Debug:', {
        eventId,
        customId: eventDetails?.customId,
        h2hBasicKey: `event/${eventId}/h2h`,
        h2hEventsKey: `event/${eventDetails?.customId}/h2h/events`,
        h2hBasicExists: !!h2hBasic,
        h2hBasic_teamDuel: h2hBasic?.teamDuel,
        h2hEventsExists: !!h2hEvents,
        h2hEvents_eventsLength: h2hEvents?.events?.length || 0,
        finalH2hData: !!h2hData,
        eventsCount: h2hData?.events?.length || 0
    });
    const statisticsData = detailedData?.[`event/${eventId}/statistics`];
    const votesData = detailedData?.[`event/${eventId}/votes`];
    const lineupsData = detailedData?.[`event/${eventId}/lineups`];
    const graphData = detailedData?.[`event/${eventId}/graph`];
    const standingsData = detailedData?.[`tournament/${eventDetails?.tournament?.uniqueTournament?.id}/season/${eventDetails?.season?.id}/standings/total`];
    const pregameFormData = detailedData?.[`event/${eventId}/pregame-form`];
    const boxScoreData = detailedData?.[`event/${eventId}/boxscore`] || detailedData?.[`event/${eventId}/box-score`];
    
    const homeTeam = eventDetails?.homeTeam?.name || liveEvent?.homeTeam?.name;
    const awayTeam = eventDetails?.awayTeam?.name || liveEvent?.awayTeam?.name;
    const homeScore = liveEvent?.homeScore?.display || liveEvent?.homeScore?.current || 0;
    const awayScore = liveEvent?.awayScore?.display || liveEvent?.awayScore?.current || 0;
    const status = liveEvent?.status?.description || liveEvent?.status?.type;
    
    // Team colors (can be customized based on team data)
    const homeTeamColor = '#3b82f6'; // blue
    const awayTeamColor = '#ef4444'; // red

    // Convert fractional to decimal
    const fractionalToDecimal = (fractional: string) => {
        if (!fractional) return '1.00';
        const parts = fractional.split('/');
        if (parts.length !== 2) return '1.00';
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        return (1 + num / den).toFixed(2);
    };

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100">
            {/* Header */}
            <header className="shrink-0 border-b dark:border-zinc-800">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800">
                    <div className="flex items-center mb-3">
                        <button onClick={onBack} className="text-white mr-3 hover:bg-white/10 p-2 rounded">
                            <ArrowLeft size={24} />
                        </button>
                        <div className="flex items-center space-x-2">
                            <span className="text-white font-semibold text-lg">SofaScore</span>
                            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded font-semibold">LIVE</span>
                        </div>
                    </div>
                    
                    {/* Score Display */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                                <p className="font-semibold text-lg">{homeTeam}</p>
                            </div>
                            <span className="text-3xl font-bold mx-4">{homeScore}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="font-semibold text-lg">{awayTeam}</p>
                            </div>
                            <span className="text-3xl font-bold mx-4">{awayScore}</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/20 text-sm">
                            <span className="text-blue-200">{status}</span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex overflow-x-auto bg-slate-50 dark:bg-zinc-800/50 border-b dark:border-zinc-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                                activeTab === tab.id
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-zinc-900'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-zinc-700'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'overview' && (
                    <div className="p-4 space-y-4 pb-8">
                        {/* Featured Odds */}
                        {oddsData?.featured && (
                            <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-3 flex items-center">
                                    <Target className="mr-2" size={20} />
                                    Featured Odds
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(oddsData.featured).map(([key, market]: [string, any]) => {
                                        if (!market || typeof market !== 'object') return null;
                                        return (
                                            <div key={key} className="border dark:border-zinc-800 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium">{market.marketName}</span>
                                                    {market.isLive && (
                                                        <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded">LIVE</span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {market.choices?.map((choice: any, idx: number) => (
                                                        <div key={idx} className="bg-slate-100 dark:bg-zinc-800 rounded p-2 text-center">
                                                            <p className="text-xs text-slate-600 dark:text-slate-400">{choice.name}</p>
                                                            <p className="text-lg font-bold">
                                                                {fractionalToDecimal(choice.fractionalValue)}
                                                            </p>
                                                            {choice.change !== 0 && (
                                                                <div className="flex items-center justify-center text-xs mt-1">
                                                                    {choice.change > 0 ? (
                                                                        <TrendingUp size={12} className="text-green-500 mr-1" />
                                                                    ) : (
                                                                        <TrendingDown size={12} className="text-red-500 mr-1" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* All Markets */}
                        {allOddsData?.markets && allOddsData.markets.length > 0 && (
                            <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-3">All Markets ({allOddsData.markets.length})</h3>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {allOddsData.markets.slice(0, 10).map((market: any, idx: number) => (
                                        <div key={idx} className="border dark:border-zinc-800 rounded p-2">
                                            <p className="text-sm font-medium mb-1">{market.marketName}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {market.choices?.slice(0, 3).map((choice: any, cIdx: number) => (
                                                    <span key={cIdx} className="text-xs bg-slate-200 dark:bg-zinc-800 px-2 py-1 rounded">
                                                        {choice.name}: <span className="font-semibold">{fractionalToDecimal(choice.fractionalValue)}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Incidents */}
                        {incidentsData?.incidents && incidentsData.incidents.length > 0 && (
                            <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-3 flex items-center">
                                    <Clock className="mr-2" size={20} />
                                    Match Incidents
                                </h3>
                                <div className="space-y-2">
                                    {incidentsData.incidents.slice(0, 10).map((incident: any, idx: number) => (
                                        <div key={idx} className="flex items-center border-l-4 border-blue-500 pl-3 py-2">
                                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mr-3">
                                                {incident.time}'
                                            </span>
                                            <div className="flex-1">
                                                <p className="text-sm">{incident.text || incident.incidentType}</p>
                                                {incident.player && (
                                                    <p className="text-xs text-slate-500">{incident.player.name}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Votes/Predictions */}
                        {votesData?.vote && (
                            <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-3 flex items-center">
                                    <Users className="mr-2" size={20} />
                                    User Predictions
                                </h3>
                                <div className="space-y-2">
                                    {votesData.vote.vote1 !== undefined && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">{homeTeam} Win</span>
                                            <span className="font-semibold">{votesData.vote.vote1} votes</span>
                                        </div>
                                    )}
                                    {votesData.vote.voteX !== undefined && votesData.vote.voteX !== null && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Draw</span>
                                            <span className="font-semibold">{votesData.vote.voteX} votes</span>
                                        </div>
                                    )}
                                    {votesData.vote.vote2 !== undefined && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">{awayTeam} Win</span>
                                            <span className="font-semibold">{votesData.vote.vote2} votes</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'boxscore' && (
                    <div className="p-4">
                        {boxScoreData ? (
                            <SofascoreBoxScore
                                boxScoreData={boxScoreData}
                                homeTeamName={homeTeam}
                                awayTeamName={awayTeam}
                                homeTeamColor={homeTeamColor}
                                awayTeamColor={awayTeamColor}
                            />
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No box score data available
                                <p className="text-xs mt-2 text-slate-400">
                                    (Box score is typically available for basketball, baseball, and similar sports)
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'statistics' && (
                    <div className="p-4">
                        {statisticsData?.statistics ? (
                            <SofascoreStatistics
                                statistics={statisticsData.statistics}
                                homeTeamName={homeTeam}
                                awayTeamName={awayTeam}
                                homeTeamColor={homeTeamColor}
                                awayTeamColor={awayTeamColor}
                            />
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No statistics data available
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'lineups' && (
                    <div className="p-4">
                        {lineupsData ? (
                            <SofascoreLineups
                                lineups={lineupsData}
                                homeTeamName={homeTeam}
                                awayTeamName={awayTeam}
                                homeTeamId={eventDetails?.homeTeam?.id}
                                awayTeamId={eventDetails?.awayTeam?.id}
                                homeTeamColor={homeTeamColor}
                                awayTeamColor={awayTeamColor}
                            />
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No lineup data available
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'momentum' && (
                    <div className="p-4">
                        {graphData?.graphPoints && graphData.graphPoints.length > 0 ? (
                            <SofascoreMomentum
                                graphData={graphData}
                                homeTeamName={homeTeam}
                                awayTeamName={awayTeam}
                                homeTeamColor={homeTeamColor}
                                awayTeamColor={awayTeamColor}
                            />
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No momentum data available
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'standings' && (
                    <div className="p-4">
                        {standingsData?.standings && standingsData.standings.length > 0 ? (
                            <SofascoreStandings
                                standingsData={standingsData}
                                homeTeamId={eventDetails?.homeTeam?.id}
                                awayTeamId={eventDetails?.awayTeam?.id}
                            />
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No standings data available
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'form' && (
                    <div className="p-4">
                        {pregameFormData ? (
                            standingsData ? (
                                <SofascorePrematchStandings
                                    standingsData={standingsData}
                                    pregameFormData={pregameFormData}
                                    homeTeamId={eventDetails?.homeTeam?.id}
                                    awayTeamId={eventDetails?.awayTeam?.id}
                                    homeTeamName={homeTeam}
                                    awayTeamName={awayTeam}
                                    homeTeamColor={homeTeamColor}
                                    awayTeamColor={awayTeamColor}
                                />
                            ) : (
                                <SofascoreForm
                                    pregameFormData={pregameFormData}
                                    homeTeamName={homeTeam}
                                    awayTeamName={awayTeam}
                                    homeTeamColor={homeTeamColor}
                                    awayTeamColor={awayTeamColor}
                                />
                            )
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No form data available
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'h2h' && (
                    <div className="p-4">
                        {h2hData ? (
                            <SofascoreH2H
                                h2hData={h2hData}
                                homeTeamId={eventDetails?.homeTeam?.id}
                                awayTeamId={eventDetails?.awayTeam?.id}
                                homeTeamName={homeTeam}
                                awayTeamName={awayTeam}
                                homeTeamColor={homeTeamColor}
                                awayTeamColor={awayTeamColor}
                                homeTeamLastEvents={homeTeamLastEvents}
                                awayTeamLastEvents={awayTeamLastEvents}
                                homeTeamNextEvents={homeTeamNextEvents}
                                awayTeamNextEvents={awayTeamNextEvents}
                            />
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No head-to-head data available
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SofascoreWidgetView;

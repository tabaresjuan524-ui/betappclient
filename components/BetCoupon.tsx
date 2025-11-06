import React, { useState, useRef, useEffect } from 'react';
import { SelectedBet } from '../data/betSlipTypes';
import { ChevronUp, ChevronDown, Trash2, Share2, Settings, X, Facebook, Twitter, Copy as CopyIcon, MessageSquare, Loader2, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, easeInOut, Variants } from 'framer-motion';
import { store } from "../store";
import { LiveEvent } from '../services/sportsService';

interface BetCouponProps {
    selectedBets: SelectedBet[];
    onRemoveBet: (betId: string) => void;
    onClearAllBets: () => void;
    onUpdateBetAmount: (betId: string, amount: string) => void;
    onCloseCoupon: () => void;
    onBetOddAccepted: (betId: string, newOddValue: number) => void;
}

type CouponTab = 'simple' | 'combined' | 'system';

const BetCoupon: React.FC<BetCouponProps> = ({
    selectedBets,
    onRemoveBet,
    onClearAllBets,
    onUpdateBetAmount,
    onCloseCoupon,
    onBetOddAccepted,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeTab, setActiveTab] = useState<CouponTab>('simple');
    const [activeSystemKey, setActiveSystemKey] = useState<string | null>(null);
    const [systemStakePerLine, setSystemStakePerLine] = useState<string>('');
    const [showShareOptions, setShowShareOptions] = useState<boolean>(false);
    const [showBetSettings, setShowBetSettings] = useState<boolean>(false);
    const [acceptAnyOddChange, setAcceptAnyOddChange] = useState<boolean>(false);
    const [acceptHigherOddsOnly, setAcceptHigherOddsOnly] = useState<boolean>(false);
    const [combinedBetAmount, setCombinedBetAmount] = useState<string>('');
    const shareOptionsRef = useRef<HTMLDivElement>(null);
    const shareButtonRef = useRef<HTMLButtonElement>(null);
    
    // Bet placement state
    const [betPlacementStatus, setBetPlacementStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [betValidationErrors, setBetValidationErrors] = useState<string[]>([]);
    const [lastPlaceBetTime, setLastPlaceBetTime] = useState<number | null>(null);

    const nCr = (n: number, r: number): number => {
        if (r < 0 || r > n) return 0;
        if (r === 0 || r === n) return 1;
        if (r > n / 2) r = n - r;
        let res = 1;
        for (let i = 1; i <= r; i++) {
            res = res * (n - i + 1) / i;
        }
        return res;
    };

    const generateCombinations = <T,>(array: T[], k: number): T[][] => {
        if (k < 0 || k > array.length) return [];
        if (k === 0) return [[]];
        if (k === array.length) return [array];
        if (array.length === 0) return [];
        const head = array[0];
        const tail = array.slice(1);
        const combsWithHead = generateCombinations(tail, k - 1).map(comb => [head, ...comb]);
        const combsWithoutHead = generateCombinations(tail, k);
        return [...combsWithHead, ...combsWithoutHead];
    };

    interface SystemDefinition {
        key: string; name: string;
        getDescription: (numSelections: number) => string;
        minSelections: number; maxSelections?: number;
        getNumBets: (numSelections: number) => number;
        calculateMaxWin: (bets: SelectedBet[], stakePerLineValue: number) => number;
    }

    const systemDefinitions: SystemDefinition[] = [
        { key: 'doubles', name: 'Doubles', minSelections: 2, getDescription: n => `${nCr(n, 2)} x Doubles`, getNumBets: n => nCr(n, 2), calculateMaxWin: (bets, stake) => generateCombinations(bets, 2).reduce((sum, combo) => sum + (stake * combo[0].selectedOddValue * combo[1].selectedOddValue), 0), },
        { key: 'trebles', name: 'Trebles', minSelections: 3, getDescription: n => `${nCr(n, 3)} x Trebles`, getNumBets: n => nCr(n, 3), calculateMaxWin: (bets, stake) => generateCombinations(bets, 3).reduce((sum, combo) => sum + (stake * combo[0].selectedOddValue * combo[1].selectedOddValue * combo[2].selectedOddValue), 0), },
        { key: 'trixie', name: 'Trixie', minSelections: 3, maxSelections: 3, getDescription: () => '3 Doubles, 1 Treble (4 bets)', getNumBets: () => 4, calculateMaxWin: (bets, stake) => { if (bets.length !== 3) return 0; const doublesCombos = generateCombinations(bets, 2); const trebleCombo = generateCombinations(bets, 3)[0]; let win = 0; doublesCombos.forEach(dc => win += stake * dc[0].selectedOddValue * dc[1].selectedOddValue); if (trebleCombo) win += stake * trebleCombo[0].selectedOddValue * trebleCombo[1].selectedOddValue * trebleCombo[2].selectedOddValue; return win; } },
        { key: 'patent', name: 'Patent', minSelections: 3, maxSelections: 3, getDescription: () => '3 Singles, 3 Doubles, 1 Treble (7 bets)', getNumBets: () => 7, calculateMaxWin: (bets, stake) => { if (bets.length !== 3) return 0; let win = 0; bets.forEach(b => win += stake * b.selectedOddValue); generateCombinations(bets, 2).forEach(dc => win += stake * dc[0].selectedOddValue * dc[1].selectedOddValue); const trebleCombo = generateCombinations(bets, 3)[0]; if (trebleCombo) win += stake * trebleCombo[0].selectedOddValue * trebleCombo[1].selectedOddValue * trebleCombo[2].selectedOddValue; return win; } },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                shareOptionsRef.current &&
                !shareOptionsRef.current.contains(event.target as Node) &&
                shareButtonRef.current &&
                !shareButtonRef.current.contains(event.target as Node)
            ) {
                setShowShareOptions(false);
            }
        };
        if (showShareOptions) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showShareOptions]);

    // Monitor live events for bet validation during bet placement
    useEffect(() => {
        if (betPlacementStatus === 'loading' && lastPlaceBetTime) {
            const timeSinceStart = Date.now() - lastPlaceBetTime;
            
            // After 2 seconds of loading, start monitoring for live data updates
            if (timeSinceStart > 2000) {
                const { liveEvents } = store.getState().odds;
                
                // Check if we have fresh data (this is simplified - in reality you'd check timestamps)
                const hasFreshData = liveEvents.length > 0;
                
                if (hasFreshData) {
                    console.log('📡 Fresh market data detected during bet placement validation');
                    
                    // The actual validation will be handled by handlePlaceBet's re-validation
                    // This just logs that we're monitoring
                }
            }
        }
    }, [betPlacementStatus, lastPlaceBetTime]);

    // Optional: Auto-update bet odds when live data changes (if user has acceptance enabled)
    useEffect(() => {
        if (selectedBets.length === 0 || (!acceptAnyOddChange && !acceptHigherOddsOnly)) return;

        const { liveEvents } = store.getState().odds;
        let hasUpdates = false;
        
        const updatedBets = selectedBets.map(bet => {
            const validation = validateSingleBet(bet, liveEvents);
            if (validation.isValid && validation.newOddValue !== undefined && validation.newOddValue !== bet.selectedOddValue) {
                hasUpdates = true;
                console.log(`📈 Auto-updating odds for ${bet.selectedOddName}: ${bet.selectedOddValue.toFixed(2)} → ${validation.newOddValue.toFixed(2)}`);
                onBetOddAccepted(bet.id, validation.newOddValue);
                return { ...bet, selectedOddValue: validation.newOddValue };
            }
            return bet;
        });

        if (hasUpdates) {
            console.log('🔄 Bet odds auto-updated based on user acceptance settings');
        }
    }, [store.getState().odds.liveEvents, acceptAnyOddChange, acceptHigherOddsOnly]);

    const totalBetAmount = selectedBets.reduce((sum, bet) => sum + (parseFloat(bet.betAmount) || 0), 0);
    const currentOddsForCalculation = selectedBets.map(bet => bet.selectedOddValue);
    const combinedOdd = currentOddsForCalculation.reduce((product, odd) => product * (odd || 1), 1);
    const potentialWinsCombined = (parseFloat(combinedBetAmount) || 0) * combinedOdd;
    const potentialWinsSimple = selectedBets.reduce((sum, bet) => {
        const currentOdd = bet.selectedOddValue;
        return sum + ((parseFloat(bet.betAmount) || 0) * currentOdd);
    }, 0);

    const availableSystems = systemDefinitions.filter(sys => selectedBets.length >= sys.minSelections && (sys.maxSelections === undefined || selectedBets.length <= sys.maxSelections));
    const activeSystem = activeSystemKey ? systemDefinitions.find(s => s.key === activeSystemKey) : null;
    const parsedSystemStakePerLine = parseFloat(systemStakePerLine) || 0;

    let numSystemLines = 0;
    let totalSystemStake = 0;
    let maxSystemWin = 0;

    if (activeSystem && parsedSystemStakePerLine > 0) {
        numSystemLines = activeSystem.getNumBets(selectedBets.length);
        totalSystemStake = numSystemLines * parsedSystemStakePerLine;
        maxSystemWin = activeSystem.calculateMaxWin(selectedBets, parsedSystemStakePerLine);
    }

    const displayTotalStake = activeTab === 'system' && activeSystem ? totalSystemStake : activeTab === 'combined' ? (parseFloat(combinedBetAmount) || 0) : totalBetAmount;
    const displayPotentialWin = activeTab === 'simple' ? potentialWinsSimple : activeTab === 'combined' ? potentialWinsCombined : activeTab === 'system' && activeSystem ? maxSystemWin : 0;

    // Bet validation functions
    const validateSingleBet = (bet: SelectedBet, currentLiveEvents: LiveEvent[]): { isValid: boolean; reason?: string; newOddValue?: number } => {
        // Find the current live event
        const liveMatch = currentLiveEvents.find(event => String(event.id) === bet.matchId);
        if (!liveMatch) {
            return { isValid: false, reason: 'Match no longer available' };
        }

        // Check if betting is still active
        if (!liveMatch.active || !liveMatch.bettingActive) {
            return { isValid: false, reason: 'Betting is no longer active for this match' };
        }

        // Find the market
        const liveMarket = liveMatch.markets.find((market: any) => String(market.key) === bet.selectedOddKey);
        if (!liveMarket) {
            return { isValid: false, reason: 'Market no longer available' };
        }

        // Find the outcome
        const liveOutcome = liveMarket.outcomes.find((outcome: { name: string; }) => outcome.name === bet.selectedOddName);
        if (!liveOutcome) {
            return { isValid: false, reason: 'Selection no longer available' };
        }

        // Check if outcome is suspended
        if (liveOutcome.suspended) {
            return { isValid: false, reason: 'Selection is currently suspended' };
        }

        const currentOddValue = liveOutcome.price;
        const originalOddValue = bet.selectedOddValue;

        // Check odds acceptance rules
        if (currentOddValue !== originalOddValue) {
            if (acceptAnyOddChange) {
                return { isValid: true, newOddValue: currentOddValue };
            } else if (acceptHigherOddsOnly && currentOddValue > originalOddValue) {
                return { isValid: true, newOddValue: currentOddValue };
            } else if (!acceptAnyOddChange && !acceptHigherOddsOnly) {
                return { isValid: false, reason: `Odds changed from ${originalOddValue.toFixed(2)} to ${currentOddValue.toFixed(2)}. Update your odds acceptance settings.` };
            } else {
                return { isValid: false, reason: `Odds decreased from ${originalOddValue.toFixed(2)} to ${currentOddValue.toFixed(2)}` };
            }
        }

        return { isValid: true, newOddValue: currentOddValue };
    };

    const validateAllBets = (): { isValid: boolean; errors: string[]; validatedBets: SelectedBet[] } => {
        const { liveEvents } = store.getState().odds;
        const errors: string[] = [];
        const validatedBets: SelectedBet[] = [];

        // First check if we have any stake validation issues
        if (activeTab === 'simple') {
            const emptyStakeBets = selectedBets.filter(bet => !bet.betAmount || parseFloat(bet.betAmount) <= 0);
            if (emptyStakeBets.length > 0) {
                emptyStakeBets.forEach(bet => {
                    errors.push(`${bet.teamA} vs ${bet.teamB} - ${bet.selectedOddName}: Please enter a stake amount`);
                });
            }
        } else if (activeTab === 'combined') {
            if (!combinedBetAmount || parseFloat(combinedBetAmount) <= 0) {
                errors.push('Please enter a combined bet amount');
            }
        } else if (activeTab === 'system' && activeSystem) {
            if (!systemStakePerLine || parseFloat(systemStakePerLine) <= 0) {
                errors.push('Please enter a stake per line for system bet');
            }
        }

        // If we have stake errors, don't proceed with odds validation
        if (errors.length > 0) {
            return { isValid: false, errors, validatedBets: [] };
        }

        // Now validate odds and availability
        for (const bet of selectedBets) {
            const validation = validateSingleBet(bet, liveEvents);
            if (validation.isValid) {
                // Update bet with current odds if they changed
                const updatedBet = validation.newOddValue !== undefined && validation.newOddValue !== bet.selectedOddValue
                    ? { ...bet, selectedOddValue: validation.newOddValue }
                    : bet;
                validatedBets.push(updatedBet);
            } else {
                errors.push(`${bet.teamA} vs ${bet.teamB} - ${bet.selectedOddName}: ${validation.reason}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            validatedBets
        };
    };

    const logBetAttempt = (bets: SelectedBet[], status: 'attempt' | 'success' | 'failure', errors?: string[]) => {
        const timestamp = new Date().toISOString();
        
        // Calculate stake information based on bet type
        let stakeInfo = {};
        if (activeTab === 'simple') {
            stakeInfo = {
                individualStakes: bets.map(bet => ({ 
                    betId: bet.id, 
                    stake: bet.betAmount, 
                    valid: bet.betAmount && parseFloat(bet.betAmount) > 0 
                }))
            };
        } else if (activeTab === 'combined') {
            stakeInfo = {
                combinedStake: combinedBetAmount,
                stakeValid: combinedBetAmount && parseFloat(combinedBetAmount) > 0
            };
        } else if (activeTab === 'system') {
            stakeInfo = {
                stakePerLine: systemStakePerLine,
                systemType: activeSystem?.name,
                numberOfLines: activeSystem ? activeSystem.getNumBets(selectedBets.length) : 0,
                stakeValid: systemStakePerLine && parseFloat(systemStakePerLine) > 0
            };
        }
        
        const logData = {
            timestamp,
            status,
            betType: activeTab,
            totalStake: displayTotalStake,
            potentialWin: displayPotentialWin,
            oddsAcceptance: {
                acceptAny: acceptAnyOddChange,
                acceptHigherOnly: acceptHigherOddsOnly
            },
            stakeValidation: stakeInfo,
            bets: bets.map(bet => ({
                matchId: bet.matchId,
                teams: `${bet.teamA} vs ${bet.teamB}`,
                selection: bet.selectedOddName,
                originalOdd: bet.selectedOddValue,
                stake: bet.betAmount,
                stakeValid: bet.betAmount && parseFloat(bet.betAmount) > 0,
                sport: bet.sportCategoryName
            })),
            errors: errors || []
        };

        console.log(`🎰 BET ${status.toUpperCase()}:`, logData);
        return logData;
    };

    const handlePlaceBet = async () => {
        setBetPlacementStatus('loading');
        setBetValidationErrors([]);
        setLastPlaceBetTime(Date.now());

        // Log bet attempt
        logBetAttempt(selectedBets, 'attempt');

        // Wait a moment to simulate checking latest data
        await new Promise(resolve => setTimeout(resolve, 500));

        // Validate all bets against current live data
        const validation = validateAllBets();

        if (validation.isValid) {
            // Simulate waiting for next market data update
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Re-validate after waiting for fresh data
            const finalValidation = validateAllBets();

            if (finalValidation.isValid) {
                setBetPlacementStatus('success');
                logBetAttempt(finalValidation.validatedBets, 'success');
                
                // Auto-reset after showing success
                setTimeout(() => {
                    setBetPlacementStatus('idle');
                    // Optionally clear bets after successful placement
                    // onClearAllBets();
                }, 3000);
            } else {
                setBetPlacementStatus('error');
                setBetValidationErrors(finalValidation.errors);
                logBetAttempt(selectedBets, 'failure', finalValidation.errors);
                
                // Auto-reset error state
                setTimeout(() => {
                    setBetPlacementStatus('idle');
                    setBetValidationErrors([]);
                }, 5000);
            }
        } else {
            setBetPlacementStatus('error');
            setBetValidationErrors(validation.errors);
            logBetAttempt(selectedBets, 'failure', validation.errors);
            
            // Auto-reset error state
            setTimeout(() => {
                setBetPlacementStatus('idle');
                setBetValidationErrors([]);
            }, 5000);
        }
    };

    const renderPlaceBetButton = () => {
        // Check if all bets have valid stake amounts for simple tab
        const hasEmptyStakes = activeTab === 'simple' && selectedBets.some(bet => !bet.betAmount || parseFloat(bet.betAmount) <= 0);
        
        // Check if combined bet has valid amount
        const hasEmptyCombinedStake = activeTab === 'combined' && (!combinedBetAmount || parseFloat(combinedBetAmount) <= 0);
        
        // Check if system bet has valid amount
        const hasEmptySystemStake = activeTab === 'system' && activeSystem && (!systemStakePerLine || parseFloat(systemStakePerLine) <= 0);
        
        // Additional check: ensure total stake is greater than 0
        const totalStakeIsZero = displayTotalStake <= 0;
        
        const isDisabled = selectedBets.length === 0 || 
                          betPlacementStatus === 'loading' || 
                          hasEmptyStakes || 
                          hasEmptyCombinedStake || 
                          hasEmptySystemStake ||
                          totalStakeIsZero;
        
        let buttonContent;
        let buttonClass = "w-full font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2";

        switch (betPlacementStatus) {
            case 'loading':
                buttonContent = (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Validating Bet...
                    </>
                );
                buttonClass += " bg-yellow-500 text-black cursor-not-allowed";
                break;
            case 'success':
                buttonContent = (
                    <>
                        <Check className="w-4 h-4" />
                        Bet Placed Successfully!
                    </>
                );
                buttonClass += " bg-green-600 text-white";
                break;
            case 'error':
                buttonContent = (
                    <>
                        <X className="w-4 h-4" />
                        Bet Failed
                    </>
                );
                buttonClass += " bg-red-500 text-white";
                break;
            default:
                buttonContent = "Place Bet";
                buttonClass += isDisabled 
                    ? " bg-gray-400 text-gray-700 cursor-not-allowed"
                    : " bg-green-500 hover:bg-green-600 text-white";
        }

        return (
            <button 
                onClick={handlePlaceBet}
                disabled={isDisabled}
                className={buttonClass}
                title={isDisabled && betPlacementStatus === 'idle' ? 
                    (selectedBets.length === 0 ? "No bets selected" :
                     hasEmptyStakes ? "Please enter stakes for all bets" : 
                     hasEmptyCombinedStake ? "Please enter a combined bet amount" :
                     hasEmptySystemStake ? "Please enter stake per line" : 
                     totalStakeIsZero ? "Total stake must be greater than 0" :
                     "Please check your bet inputs") : undefined}
            >
                {buttonContent}
            </button>
        );
    };

    const generateBetShareData = () => {
        const siteUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://example.com/sports';
        const betParams = selectedBets.map(bet => `${bet.matchId}_${bet.selectedOddKey}_${parseFloat(bet.betAmount) || '0'}`).join(';');
        const shareLink = `${siteUrl}?bet_slip=${encodeURIComponent(betParams)}`;
        let shareTextForWhatsApp = `Check out my bet slip on 6666Block! ${selectedBets.length} selection(s).\n\n`;
        selectedBets.forEach(bet => { shareTextForWhatsApp += `⚽ ${bet.teamA} vs ${bet.teamB}\nPick: ${bet.selectedOddName} @ ${bet.selectedOddValue.toFixed(2)}\n\n`; });
        shareTextForWhatsApp += `Total Stake: $${displayTotalStake.toFixed(2)}\nPotential Win: $${displayPotentialWin.toFixed(2)}\n\nView details or place your own bet: ${shareLink}`;
        const shortShareTextForX = `My ${selectedBets.length}-selection bet slip on 6666Block! Stake: $${displayTotalStake.toFixed(2)}, Pot. Win: $${displayPotentialWin.toFixed(2)}.`;
        return { shareLink, shareTextForWhatsApp, shortShareTextForX };
    };

    const handleShare = (platform: 'facebook' | 'x' | 'whatsapp' | 'copy') => {
        const { shareLink, shareTextForWhatsApp, shortShareTextForX } = generateBetShareData();
        let url = '';
        switch (platform) {
            case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`; window.open(url, '_blank', 'noopener,noreferrer'); break;
            case 'x': url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shortShareTextForX)}&url=${encodeURIComponent(shareLink)}`; window.open(url, '_blank', 'noopener,noreferrer'); break;
            case 'whatsapp': url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTextForWhatsApp)}`; window.open(url, '_blank', 'noopener,noreferrer'); break;
            case 'copy': navigator.clipboard.writeText(shareLink).then(() => alert('Link copied to clipboard!')).catch(err => console.error('Failed to copy link: ', err)); break;
        }
        setShowShareOptions(false);
    };

    const couponContentVariants: Variants = {
        open: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: easeInOut } },
        collapsed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: easeInOut } }
    };

    const renderBetItem = (bet: SelectedBet) => (
        <div key={bet.id} className="p-3 rounded shadow bg-slate-50 dark:bg-zinc-800">
            <div className="flex justify-between items-start mb-1">
                <span className="text-xs text-slate-500 dark:text-zinc-400">{bet.sportCategoryName}</span>
                <button onClick={() => onRemoveBet(bet.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{bet.teamA} - {bet.teamB}</span>
                <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{bet.selectedOddValue.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-300 mb-2">{bet.selectedOddName}</p>
            {activeTab === 'simple' && (
                <div className="flex items-center">
                    <span className="text-xs text-slate-500 dark:text-zinc-400 mr-2">Stake:</span>
                    <input type="number" value={bet.betAmount} onChange={(e) => onUpdateBetAmount(bet.id, e.target.value)} placeholder="0.00" className="w-full p-1 text-sm border border-slate-300 dark:border-zinc-600 rounded bg-slate-50 dark:bg-zinc-700 text-slate-800 dark:text-slate-100 focus:ring-yellow-500 focus:border-yellow-500" />
                </div>
            )}
        </div>
    );

    return (
        <motion.div
            id="bet-coupon"
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 md:w-96 md:right-4 md:left-auto md:rounded-lg shadow-2xl
            transition-all duration-300 ease-in-out
            ${isExpanded
                ? 'h-[90dvh] sm:h-auto sm:max-h-[80vh] flex flex-col md:bottom-4'
                : 'h-auto max-h-[56px] md:bottom-0' // NOTE: overflow-hidden is removed
            }`}>
            <div
                className="flex items-center justify-between p-3 bg-yellow-500 text-black cursor-pointer flex-shrink-0 md:rounded-t-lg relative"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    <span className="ml-2 font-semibold">Bet Slip ({selectedBets.length} Selection{selectedBets.length === 1 ? '' : 's'})</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex relative">
                        <button ref={shareButtonRef} onClick={(e) => { e.stopPropagation(); setShowShareOptions(prev => !prev); }} className="text-black hover:text-slate-700" title="Share Bet Slip"><Share2 size={20} /></button>
                        <AnimatePresence>
                            {showShareOptions && (
                                <div
                                    ref={shareOptionsRef}
                                    className={`absolute right-0 w-52 bg-white dark:bg-zinc-700 rounded-md shadow-xl border border-slate-200 dark:border-zinc-600 z-50 py-1
                                    ${isExpanded ? 'top-full mt-2' : 'bottom-full mb-2'}`}
                                >
                                    <button onClick={() => handleShare('facebook')} className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-600 flex items-center transition-colors"><Facebook size={16} className="mr-2 text-[#1877F2]" /> Share on Facebook</button>
                                    <button onClick={() => handleShare('x')} className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-600 flex items-center transition-colors"><Twitter size={16} className="mr-2 text-[#1DA1F2]" /> Share on X</button>
                                    <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-600 flex items-center transition-colors"><MessageSquare size={16} className="mr-2 text-[#25D366]" /> Share on WhatsApp</button>
                                    <button onClick={() => handleShare('copy')} className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-600 flex items-center transition-colors"><CopyIcon size={16} className="mr-2" /> Copy Link</button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onCloseCoupon(); }} className="p-1 hover:bg-yellow-600 rounded-full" aria-label="Clear All Bets and Close Bet Slip"><X size={18} /></button>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        key="coupon-content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={couponContentVariants}
                        className="flex flex-col flex-grow overflow-hidden" // overflow-hidden is needed for content
                    >
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-zinc-700">
                                <button onClick={onClearAllBets} className="text-slate-600 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400" title="Clear all bets"><Trash2 size={20} /></button>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Your Bets</span>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => setShowBetSettings(prev => !prev)} className={`p-1 rounded-full transition-colors ${showBetSettings ? 'bg-yellow-200 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-300' : 'text-slate-600 dark:text-zinc-300 hover:text-yellow-500'}`} title="Bet Settings"><Settings size={20} /></button>
                                </div>
                            </div>

                            {showBetSettings && (
                                <div className="p-3 border-b border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 space-y-3">
                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Odds Change Acceptance</h4>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="acceptAny" className="text-xs text-slate-600 dark:text-zinc-300 cursor-pointer">Accept ALL odds changes</label>
                                        <button id="acceptAny" onClick={() => { setAcceptAnyOddChange(!acceptAnyOddChange); if (!acceptAnyOddChange) setAcceptHigherOddsOnly(false); }} className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${acceptAnyOddChange ? 'bg-green-500 justify-end' : 'bg-slate-300 dark:bg-zinc-600 justify-start'}`}><span className="block w-4 h-4 bg-white rounded-full shadow" /></button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="acceptHigher" className="text-xs text-slate-600 dark:text-zinc-300 cursor-pointer">Accept only HIGHER odds</label>
                                        <button id="acceptHigher" onClick={() => { setAcceptHigherOddsOnly(!acceptHigherOddsOnly); if (!acceptHigherOddsOnly) setAcceptAnyOddChange(false); }} disabled={acceptAnyOddChange} className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${acceptHigherOddsOnly ? 'bg-green-500 justify-end' : 'bg-slate-300 dark:bg-zinc-600 justify-start'} ${acceptAnyOddChange ? 'opacity-50 cursor-not-allowed' : ''}`}><span className="block w-4 h-4 bg-white rounded-full shadow" /></button>
                                    </div>
                                </div>
                            )}

                            <div className="flex border-b border-slate-200 dark:border-zinc-700">
                                {(['simple', 'combined', 'system'] as CouponTab[]).map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 px-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700'}`}>{tab}</button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto p-3 space-y-3 bg-slate-100 dark:bg-zinc-900 scrollbar-thin">
                            {(activeTab === 'simple' || activeTab === 'combined') && selectedBets.map(renderBetItem)}
                            {activeTab === 'simple' && selectedBets.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-zinc-700">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-slate-700 dark:text-slate-200">Potential Wins:</span>
                                        <span className="text-green-600 dark:text-green-400">${potentialWinsSimple.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'combined' && (<> <div className="mt-3 pt-3 border-t border-slate-200 dark:border-zinc-700"><div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-zinc-300 font-semibold">Combined Odd:</span><span className="font-bold text-yellow-600 dark:text-yellow-400">{combinedOdd.toFixed(2)}</span></div></div><div className="flex items-center"><span className="text-xs text-slate-500 dark:text-zinc-400 mr-2">Stake:</span><input type="number" value={combinedBetAmount} onChange={(e) => setCombinedBetAmount(e.target.value)} placeholder="0.00" className="w-full p-1 text-sm border border-slate-300 dark:border-zinc-600 rounded bg-slate-50 dark:bg-zinc-700 text-slate-800 dark:text-slate-100 focus:ring-yellow-500 focus:border-yellow-500" /></div></>)}
                            {activeTab === 'system' && (<div className="space-y-3">{selectedBets.length < 2 ? (<p className="text-center text-sm text-slate-500 dark:text-zinc-400 py-4">Please select at least 2 bets to view system options.</p>) : availableSystems.length === 0 ? (<p className="text-center text-sm text-slate-500 dark:text-zinc-400 py-4">No system bets available for {selectedBets.length} selections.</p>) : (<> <div className="space-y-2 mb-4"><p className="font-semibold text-slate-700 dark:text-slate-200">Available Systems:</p>{availableSystems.map(sysDef => (<button key={sysDef.key} onClick={() => setActiveSystemKey(sysDef.key)} className={`w-full text-left p-2 rounded border transition-all ${activeSystemKey === sysDef.key ? 'bg-yellow-100 dark:bg-yellow-700 border-yellow-500 ring-1 ring-yellow-500' : 'bg-slate-50 dark:bg-zinc-800 border-slate-300 dark:border-zinc-600 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}><span className="font-medium text-slate-800 dark:text-slate-100">{sysDef.name}</span><span className="block text-xs text-slate-500 dark:text-zinc-400">{sysDef.getDescription(selectedBets.length)}</span></button>))}</div>{activeSystem && (<div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-700 space-y-2"><h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Configure {activeSystem.name}</h4><div><label htmlFor="systemStake" className="block text-xs mb-1 text-slate-600 dark:text-zinc-300">Stake per bet:</label><input id="systemStake" type="number" value={systemStakePerLine} onChange={e => setSystemStakePerLine(e.target.value)} placeholder="0.00" className="w-full p-1.5 text-sm border border-slate-300 dark:border-zinc-600 rounded bg-slate-50 dark:bg-zinc-700 text-slate-800 dark:text-slate-100 focus:ring-yellow-500 focus:border-yellow-500" /></div><p className="text-xs text-slate-600 dark:text-zinc-300">Number of bets: <span className="font-semibold text-slate-800 dark:text-slate-100">{numSystemLines}</span></p></div>)}</>)}</div>)}
                        </div>

                        <div className="p-3 border-t border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 flex-shrink-0">
                            {betValidationErrors.length > 0 && (
                                <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        <span className="text-sm font-medium text-red-700 dark:text-red-300">Bet Validation Failed</span>
                                    </div>
                                    <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                                        {betValidationErrors.map((error, index) => (
                                            <li key={index}>• {error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-zinc-300">Total Stake:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-100">${displayTotalStake.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-slate-600 dark:text-zinc-300">Potential Win:</span>
                                <span className="font-bold text-green-600 dark:text-green-400">${displayPotentialWin.toFixed(2)}</span>
                            </div>
                            {renderPlaceBetButton()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default BetCoupon;
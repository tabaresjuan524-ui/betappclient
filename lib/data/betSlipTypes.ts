export interface SelectedBet {
  id: string; // Unique ID for the bet selection, e.g., `${matchId}-${oddKey}`
  matchId: string;
  sportCategoryName: string; // To display which sport it belongs to
  teamA: string;
  teamB: string;
  selectedOddName: string; // Descriptive name like "Home Win", "Draw", "Away Win"
  selectedOddKey: string; // To identify which odd it was
  selectedOddValue: number;
  betAmount: string; // Use string for input field, convert to number when needed
  matchTime?: string;
  currentScore?: string;
}

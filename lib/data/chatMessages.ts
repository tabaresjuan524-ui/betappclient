export interface ChatMessage {
  id: number;
  username: string;
  message: string;
  timestamp: Date;
}

export const initialChatMessages: ChatMessage[] = [
  { id: 1, username: "Jayes", message: "That's not in the rules", timestamp: new Date() },
  { id: 2, username: "Jayes", message: "can't even hit any good wins now what a great start lmao", timestamp: new Date() },
  { id: 3, username: "BTCdilleway", message: "Missy didn't you say that was your last depo the other day lg missy", timestamp: new Date() },
  { id: 4, username: "Starcrossed", message: "good luck everyone", timestamp: new Date() },
  { id: 5, username: "Ja", message: "Anyone hitting?", timestamp: new Date() },
  { id: 6, username: "tanqr", message: "Good luck guys in playing", timestamp: new Date() },
  { id: 7, username: "Traben122", message: "I am gonna die, fuck my life, fuck my life", timestamp: new Date() },
  { id: 8, username: "Steith17", message: "What is monthly bonus with $2300 wager?", timestamp: new Date() },
  { id: 9, username: "Hoho1212", message: "sup peeps", timestamp: new Date() },
  { id: 10, username: "CryptoKing", message: "Just won big on the new slot!", timestamp: new Date() },
  { id: 11, username: "GamerGirl", message: "Any good live tables open?", timestamp: new Date() },
  { id: 12, username: "HighRoller", message: "Let's go for another round!", timestamp: new Date() },
  { id: 13, username: "TheGambler", message: "The sportsbook odds are looking good today.", timestamp: new Date() },
  { id: 14, username: "LadyLuck", message: "Wishing everyone the best of luck!", timestamp: new Date() },
  { id: 15, username: "SlotMaster", message: "Hammer Vulkan is on fire!", timestamp: new Date() },
  { id: 16, username: "BettingPro", message: "That was a close call, but I won!", timestamp: new Date() },
  { id: 17, username: "CasinoQueen", message: "The new crash game is intense!", timestamp: new Date() },
  { id: 18, username: "WinnerWinner", message: "Just hit a massive multiplier. So happy!", timestamp: new Date() },
  { id: 19, username: "Allin", message: "Going all in on this next hand.", timestamp: new Date() },
  { id: 20, username: "PokerFace", message: "Anyone up for a game of poker?", timestamp: new Date() },
  { id: 21, username: "SportsFan", message: "That last-minute goal was a game-changer.", timestamp: new Date() },
  { id: 22, username: "Lucky7", message: "Feeling lucky tonight!", timestamp: new Date() },
  { id: 23, username: "NoobPlayer", message: "How do I use my free spins?", timestamp: new Date() },
  { id: 24, username: "HighStakes", message: "Big bets, big wins!", timestamp: new Date() },
  { id: 25, username: "TheJoker", message: "Why so serious? Let's have some fun!", timestamp: new Date() },
  { id: 26, username: "RouletteKing", message: "Red or black? That is the question.", timestamp: new Date() },
  { id: 27, username: "BlackjackPro", message: "21! I love it when that happens.", timestamp: new Date() },
  { id: 28, username: "CryptoWhale", message: "Depositing some more crypto for the big game.", timestamp: new Date() },
  { id: 29, username: "SlotMachineGod", message: "The reels are being kind to me today.", timestamp: new Date() },
  { id: 30, username: "JackpotHunter", message: "Hunting for that big jackpot!", timestamp: new Date() },
];
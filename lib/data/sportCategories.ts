import React from "react";
import { TrendingUp, Star } from "lucide-react";
import { RiGalleryView } from "react-icons/ri";
export interface SportCategory {
  id: number;
  name: string;
  icon: React.ReactNode;
  active: boolean;
  favoritesCount?: number;
  liveEventsCount?: number;
  aliases?: string[];
  sportBackground?: string; // SVG background for sport header
}

export const initialSportCategories: SportCategory[] = [
  {
    id: 99,
    name: "My Live",
    icon: React.createElement(Star, { size: 18, fill: "currentColor" }),
    active: false,
    favoritesCount: 0,
  },
  {
    id: 1,
    name: "Live",
    icon: React.createElement(TrendingUp, { size: 18 }),
    active: true,
  },
  {
    id: 2,
    name: "Fútbol",
    aliases: ["Fútbol", "Football", "Soccer"],
    icon: React.createElement("span", { className: "text-lg" }, "⚽"),
    active: false,
    sportBackground: "soccer.svg"
  },
  {
    id: 3,
    name: "Horse Racing",
    icon: React.createElement("span", { className: "text-lg" }, "🐴"),
    active: false,
    sportBackground: "horse_racing.svg"
  },
  {
    id: 4,
    name: "Tenis",
    aliases: ["Tennis", "tenis"],
    icon: React.createElement("span", { className: "text-lg" }, "🎾"),
    active: false,
    sportBackground: "tennis.svg"
  },
  {
    id: 5,
    name: "Baloncesto",
    aliases: ["Basketball", "Basquet"],
    icon: React.createElement("span", { className: "text-lg" }, "🏀"),
    active: false,
    sportBackground: "basketball.svg"
  },
  {
    id: 6,
    name: "Hockey Hielo",
    icon: React.createElement("span", { className: "text-lg" }, "🏒"),
    active: false,
    sportBackground: "ice_hockey.svg"
  },
  {
    id: 7,
    name: "Voleibol",
    icon: React.createElement("span", { className: "text-lg" }, "🏐"),
    active: false,
    sportBackground: "volleyball.svg"
  },
  {
    id: 8,
    name: "Beisbol", //should be 'Béisbol' too
    aliases: ["Béisbol"],
    icon: React.createElement("span", { className: "text-lg" }, "⚾"),
    active: false,
    sportBackground: "baseball.svg"
  },
  {
    id: 9,
    name: "Boxeo",
    icon: React.createElement("span", { className: "text-lg" }, "🥊"),
    active: false,
    sportBackground: "boxing.svg"
  },
  {
    id: 10,
    name: "MMA",
    icon: React.createElement("span", { className: "text-lg" }, "🥋"),
    active: false,
    sportBackground: "mma.svg"
  },
  {
    id: 11,
    name: "Cricket",
    icon: React.createElement("span", { className: "text-lg" }, "🏏"),
    active: false,
    sportBackground: "cricket.svg"
  },
  {
    id: 12,
    name: "Rugby",
    icon: React.createElement("span", { className: "text-lg" }, "🏉"),
    active: false,
    sportBackground: "rugby.svg"
  },
  {
    id: 13,
    name: "Dardos",
    aliases: ["Darts"],
    icon: React.createElement("span", { className: "text-lg" }, "🎯"),
    active: false,
    sportBackground: "darts.svg"
  },
  {
    id: 14,
    name: "Snooker",
    icon: React.createElement("span", { className: "text-lg" }, "🎱"),
    active: false,
    sportBackground: "snooker.svg"

  },
  {
    id: 17,
    name: "Lacrosse",
    icon: React.createElement("span", { className: "text-lg" }, "🥍"),
    active: false,
  },
  {
    id: 18,
    name: "American Football",
    aliases: ["Fútbol Americano"],
    icon: React.createElement("span", { className: "text-lg" }, "🏈"),
    active: false,
    sportBackground: "american_football.svg"
  },
  {
    id: 19,
    name: "Aussie Rules",
    icon: React.createElement("span", { className: "text-lg" }, "🏉"),
    active: false,
  },
  {
    id: 20,
    name: "Golf",
    icon: React.createElement("span", { className: "text-lg" }, "🏌️‍♂️"),
    active: false,
    sportBackground: "golf.svg"
  },
  {
    id: 21,
    name: "Politics",
    aliases: ["Politica"],
    icon: React.createElement("span", { className: "text-lg" }, "👔"),
    active: false,
  },
  {
    id: 23,
    name: "Fútbol Sala",
    icon: React.createElement("span", { className: "text-lg" }, "🥅"),
    active: false,
    sportBackground: "futsal.svg"
  },
  {
    id: 24,
    name: "Badminton",
    aliases: ["Bádminton", "Badmington"],
    icon: React.createElement("span", { className: "text-lg" }, "🏸"),
    active: false,
    sportBackground: "badminton.svg"
  },
  {
    id: 25,
    name: "Tenis De Mesa",
    aliases: ["Tenis de Mesa", "Table Tennis", "Ping Pong", "Tenis de mesa"],
    icon: React.createElement("span", { className: "text-lg" }, "🏓"),
    active: false,
    sportBackground: "table_tennis.svg"
  },
  {
    id: 26,
    name: "Voleiplaya",
    icon: React.createElement("span", { className: "text-lg" }, "🏐"),
    active: false,
    sportBackground: "beach_volleyball.svg"
  },
  {
    id: 27,
    name: "Balonmano",
    icon: React.createElement("span", { className: "text-lg" }, "🤾"),
    active: false,
    sportBackground: "handball.svg"
  },
  {
    id: 28,
    name: "e-Basket",
    aliases: ["E-Basket", "E-Baloncesto"],
    icon: React.createElement("span", { className: "text-lg" }, "🏀"),
    active: false,
    sportBackground: "ebasket.svg"
  },
  {
    id: 29,
    name: "e-Fútbol",
    aliases: ["E-Football", "E-Fútbol", "Efootball"],
    icon: React.createElement("span", { className: "text-lg" }, "⚽"),
    active: false,
    sportBackground: "efootball.svg"
  },
  {
    id: 30,
    name: "eSports",
    aliases: ["Esports", "E-Sports"],
    icon: React.createElement("span", { className: "text-lg" }, "🎮"),
    active: false,
    sportBackground: "esports.svg"
  },
  {
    id: 31,
    name: "Motor",
    icon: React.createElement("span", { className: "text-lg" }, "🏎️"),
    active: false,
  },
  {
    id: 32,
    name: "Ciclismo",
    icon: React.createElement("span", { className: "text-lg" }, "🚴"),
    active: false,
  },
  {
    id: 33,
    name: "Cine/TV",
    icon: React.createElement("span", { className: "text-lg" }, "🎬"),
    active: false,
  },
  {
    id: 34,
    name: "Pádel",
    icon: React.createElement("span", { className: "text-lg" }, "🥍"),
    active: false,
  },
];


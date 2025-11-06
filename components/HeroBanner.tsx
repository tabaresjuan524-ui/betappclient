import React from "react";
import { Gamepad2, Twitch, MessageSquare } from "lucide-react";

const HeroBanner: React.FC = () => (
  <div className="relative bg-slate-100 dark:bg-zinc-800 rounded-lg mx-4 mt-4 overflow-hidden">
    <div className="flex items-center p-6">
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
          START WINNING
        </h2>
        <p className="text-slate-600 dark:text-zinc-400 text-sm mb-4">
          Experience true innovation with the highest rewards program within the industry
        </p>
        <div className="flex items-center gap-4">
          <button className="bg-yellow-500 text-black px-6 py-2 rounded-md hover:bg-yellow-400 transition-colors font-semibold whitespace-nowrap">
            Register now
          </button>
          <span className="text-slate-600 dark:text-zinc-400">
            or
          </span>
          <div className="flex gap-2">
            <button
              aria-label="Steam"
              className="bg-[#939393] dark:bg-zinc-700 w-10 h-10 rounded-3xl flex items-center justify-center text-[#2C2C2C] dark:text-white hover:bg-[#7a7a7a] dark:hover:bg-zinc-600 transition-all"
            >
              <Gamepad2 size={22} />
            </button>
            <button
              aria-label="Twitch"
              className="bg-[#939393] dark:bg-zinc-700 w-10 h-10 rounded-3xl flex items-center justify-center text-[#2C2C2C] dark:text-white hover:bg-[#7a7a7a] dark:hover:bg-zinc-600 transition-all"
            >
              <Twitch size={22} />
            </button>
            <button
              aria-label="Social"
              className="bg-[#939393] dark:bg-zinc-700 w-10 h-10 rounded-3xl flex items-center justify-center text-[#2C2C2C] dark:text-white hover:bg-[#7a7a7a] dark:hover:bg-zinc-600 transition-all"
            >
              <MessageSquare size={22} />
            </button>
          </div>
        </div>
      </div>
      <div className="hidden lg:block ml-6">
        <img
          src="https://raw.githubusercontent.com/juandata/publicAssets/refs/heads/main/images/casino_and_sports_app/octopus_svg.svg"
          alt="Octopus"
          className="h-40 rounded-3xl"
        />
      </div>
    </div>
  </div>
);

export default HeroBanner;
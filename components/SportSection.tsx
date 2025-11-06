import React from "react";

const SportSection: React.FC = () => (
  <div className="flex flex-col">
    <div className="w-full">
      <img
        src="https://juandata.github.io/publicAssets/images/casino_and_sports_app/sport_.jpg"
        alt="Sport"
        className="w-full h-auto rounded-3xl"
      />
    </div>
    <div className="p-6 relative flex flex-col flex-grow">
      <p className="text-slate-900 dark:text-white mb-6 font-semibold">
        All sport betting, 24/7
      </p>
      <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6">
        Bet on almost any global sporting event, and dive into our selection of virtual sports available even when the real-world champions are off the field. Our platform offers endless betting opportunities, bridging the gap between virtual and reality in the sports world.
      </p>
      <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-md transition-colors font-semibold mt-auto">
        Go to Sport
      </button>
    </div>
  </div>
);

export default SportSection;
import React from "react";

const CasinoSection: React.FC = () => (
  <div className="flex flex-col">
    <div className="w-full">
      <img
        src="https://juandata.github.io/publicAssets/images/casino_and_sports_app/dog.jpg"
        alt="Dog Character"
        className="w-full h-auto rounded-3xl"
      />
    </div>
    <div className="p-6 relative flex flex-col flex-grow">
      <p className="text-slate-900 dark:text-white mb-6 font-semibold">
        Your crypto casino experience
      </p>
      <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6">
        Experience the thrill of slots, live dealer games, and exclusive original titles, with unique VIP rewards and bonuses. We offer instant crypto deposits and withdrawals, along with an instant and easy signup.
      </p>
      <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-md transition-colors font-semibold mt-auto">
        Go to Casino
      </button>
    </div>
  </div>
);

export default CasinoSection;
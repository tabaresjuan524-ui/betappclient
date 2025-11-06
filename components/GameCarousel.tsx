import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Game } from "../data/games";

interface GameCarouselProps {
  slotGames: Game[];
  slotGameStartIndex: number;
  setSlotGameStartIndex: (idx: number) => void;
  slotGamesPerPage: number;
}

const GameCarousel: React.FC<GameCarouselProps> = ({
  slotGames,
  slotGameStartIndex,
  setSlotGameStartIndex,
  slotGamesPerPage,
}) => {
  const visibleSlotGames = slotGames.slice(
    slotGameStartIndex,
    slotGameStartIndex + slotGamesPerPage
  );
  const canGoPrevSlotGames = slotGameStartIndex > 0;
  const canGoNextSlotGames =
    slotGameStartIndex <
      Math.max(0, slotGames.length - slotGamesPerPage) &&
    slotGames.length > slotGamesPerPage;

  return (
    <div className="px-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Lucky Block Pick
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSlotGameStartIndex(Math.max(0, slotGameStartIndex - 1))}
            disabled={!canGoPrevSlotGames}
            className={`bg-slate-200 dark:bg-zinc-800 p-1 rounded-full ${!canGoPrevSlotGames
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-slate-300 dark:hover:bg-zinc-700"
              }`}
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-white" />
          </button>
          <button
            onClick={() =>
              setSlotGameStartIndex(
                Math.min(
                  slotGameStartIndex + 1,
                  Math.max(0, slotGames.length - slotGamesPerPage)
                )
              )
            }
            disabled={!canGoNextSlotGames}
            className={`bg-slate-200 dark:bg-zinc-800 p-1 rounded-full ${!canGoNextSlotGames
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-slate-300 dark:hover:bg-zinc-700"
              }`}
          >
            <ArrowRight className="w-5 h-5 text-slate-700 dark:text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
        {visibleSlotGames.map((game) => (
          <div
            key={game.id}
            className="relative rounded-lg overflow-hidden group"
          >
            <img
              src={game.image}
              alt={game.name}
              className="w-full aspect-[3/4] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent dark:from-black/90"></div>
            <div className="absolute bottom-2 left-0 right-0 p-2">
              <p className="text-white text-sm font-bold">
                {game.name}
              </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 dark:bg-black/60">
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1 rounded-md text-sm font-bold">
                PLAY
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameCarousel;
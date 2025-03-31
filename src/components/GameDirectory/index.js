import React from "react";
import { useGameContext } from "../../context/GameContext";
import Filter from "../Filter";
import GameCard from "../GameCard";

function GameDirectory() {
  const { games, loading } = useGameContext();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Game Directory</h1>

      <Filter />

      {loading ? (
        <div className="text-center py-8">Loading games...</div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          No games found matching your criteria.
        </div>
      )}
    </div>
  );
}

export default GameDirectory;

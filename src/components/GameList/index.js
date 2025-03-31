import { useGameContext } from "../../context/GameContext";
import GameCard from "../GameCard";

function GameList() {
  const { games, loading } = useGameContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">No games found</h3>
        <p className="text-gray-400">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    );
  }

  // Add mock data for top badges (in a real app, this would come from the API)
  const gamesWithBadges = games.map((game, index) => ({
    ...game,
    is_top_25: index < 2, // Just for demo purposes
    is_top_100: index >= 2 && index < 4, // Just for demo purposes
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          ALL GAMES
          <span className="ml-2 text-sm text-gray-400">
            ({games.length} results)
          </span>
        </h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-400 mr-2">SORT BY:</span>
          <select className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Name (A-Z)</option>
            <option>Name (Z-A)</option>
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gamesWithBadges.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

export default GameList;

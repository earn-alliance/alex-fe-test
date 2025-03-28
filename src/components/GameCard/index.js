import React from "react";

function GameCard({ game }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col overflow-hidden">
      <div className="relative">
        {game.directory_image_name && (
          <img
            src={`/images/${game.directory_image_name}`}
            alt={game.name}
            className="w-full h-48 object-cover"
          />
        )}
        {game.is_live && (
          <span className="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            Live
          </span>
        )}
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold">{game.name}</h3>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="mt-auto space-y-3">
          {game.genres && game.genres.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Genres:</h4>
              <div className="flex flex-wrap gap-1">
                {game.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                  >
                    {genre.genre_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {game.platforms && game.platforms.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Platforms:</h4>
              <div className="flex flex-wrap gap-1">
                {game.platforms.map((platform, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                  >
                    {platform.platform_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameCard;

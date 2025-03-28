"use client";
import { useGameContext } from "../../context/GameContext";
import "./Filter.css";

function Filter() {
  const { genres, platforms, filters, updateFilter } = useGameContext();
  const { searchQuery, selectedGenre, selectedPlatform, liveOnly } = filters;

  // Toggle handler function
  const handleToggleLive = () => {
    updateFilter("liveOnly", !liveOnly);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8 p-6">
      <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search games by name..."
            value={searchQuery}
            onChange={(e) => updateFilter("searchQuery", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="genre-filter" className="block text-sm font-medium">
              Filter by Genre
            </label>
            <select
              id="genre-filter"
              value={selectedGenre}
              onChange={(e) => updateFilter("selectedGenre", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Genres</option>
              {genres.map((genre, index) => (
                <option key={index} value={genre.genre_name}>
                  {genre.genre_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="platform-filter"
              className="block text-sm font-medium"
            >
              Filter by Platform
            </label>
            <select
              id="platform-filter"
              value={selectedPlatform}
              onChange={(e) => updateFilter("selectedPlatform", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Platforms</option>
              {platforms.map((platform, index) => (
                <option key={index} value={platform.platform_name}>
                  {platform.platform_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="flex items-center space-x-2 pt-2"
          onClick={handleToggleLive}
        >
          <div className="relative inline-block w-10 mr-2 align-middle select-none cursor-pointer">
            <input
              type="checkbox"
              checked={liveOnly}
              onChange={handleToggleLive}
              className="sr-only"
            />
            <div
              className={`block w-10 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                liveOnly
                  ? "bg-blue-500 dark:bg-blue-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out cursor-pointer ${
                liveOnly ? "transform translate-x-4" : ""
              }`}
            ></div>
          </div>
          <span className="text-sm font-medium cursor-pointer">
            {liveOnly ? "Showing live games" : "Showing non-live games"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Filter;

"use client";
import { useGameContext } from "../../context/GameContext";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const { genres, platforms, filters, updateFilter, updateMultipleFilters } =
    useGameContext();
  const { searchQuery, selectedGenres, selectedPlatforms, liveOnly } = filters;
  const location = useLocation();
  const navigate = useNavigate();

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    genres: false,
    platforms: false,
  });

  // Toggle handler function
  const handleToggleLive = () => {
    updateFilter("liveOnly", !liveOnly);
  };

  // Clear all filters
  const handleClearFilters = () => {
    updateMultipleFilters({
      searchQuery: "",
      selectedGenres: [],
      selectedPlatforms: [],
      // Keep liveOnly as is
    });
  };

  // Toggle genre selection
  const toggleGenre = (genreName) => {
    const newSelectedGenres = [...selectedGenres];
    const index = newSelectedGenres.indexOf(genreName);

    if (index === -1) {
      newSelectedGenres.push(genreName);
    } else {
      newSelectedGenres.splice(index, 1);
    }

    updateFilter("selectedGenres", newSelectedGenres);
  };

  // Toggle platform selection
  const togglePlatform = (platformName) => {
    const newSelectedPlatforms = [...selectedPlatforms];
    const index = newSelectedPlatforms.indexOf(platformName);

    if (index === -1) {
      newSelectedPlatforms.push(platformName);
    } else {
      newSelectedPlatforms.splice(index, 1);
    }

    updateFilter("selectedPlatforms", newSelectedPlatforms);
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("search", searchQuery);
    }

    if (selectedGenres.length > 0) {
      params.set("genres", selectedGenres.join(","));
    }

    if (selectedPlatforms.length > 0) {
      params.set("platforms", selectedPlatforms.join(","));
    }

    params.set("live", liveOnly.toString());

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    navigate(newUrl, { replace: true });
  }, [searchQuery, selectedGenres, selectedPlatforms, liveOnly, navigate]);

  // Parse URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const initialFilters = {};

    if (params.has("search")) {
      initialFilters.searchQuery = params.get("search");
    }

    if (params.has("genres")) {
      initialFilters.selectedGenres = params.get("genres").split(",");
    }

    if (params.has("platforms")) {
      initialFilters.selectedPlatforms = params.get("platforms").split(",");
    }

    if (params.has("live")) {
      initialFilters.liveOnly = params.get("live") === "true";
    }

    if (Object.keys(initialFilters).length > 0) {
      updateMultipleFilters(initialFilters);
    }
  }, [location.search, updateMultipleFilters]);

  // Determine which genres to show based on expansion state
  const visibleGenres = expandedSections.genres ? genres : genres.slice(0, 6);

  // Determine which platforms to show based on expansion state
  const visiblePlatforms = expandedSections.platforms
    ? platforms
    : platforms.slice(0, 6);

  return (
    <aside className="w-64 bg-gray-800 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold uppercase tracking-wider">
          Filter
        </h2>
        {(searchQuery ||
          selectedGenres.length > 0 ||
          selectedPlatforms.length > 0) && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
          >
            Clear
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Looking for something?"
          value={searchQuery}
          onChange={(e) => updateFilter("searchQuery", e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Live/Non-Live Toggle */}
      <div
        className="flex items-center space-x-2 mb-6 p-2 bg-gray-700 rounded-md cursor-pointer"
        onClick={handleToggleLive}
      >
        <div className="relative inline-block w-10 mr-2 align-middle select-none">
          <input
            type="checkbox"
            checked={liveOnly}
            onChange={handleToggleLive}
            className="sr-only"
          />
          <div
            className={`block w-10 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
              liveOnly ? "bg-blue-500" : "bg-gray-500"
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out cursor-pointer ${
              liveOnly ? "transform translate-x-4" : ""
            }`}
          ></div>
        </div>
        <span className="text-sm font-medium">
          {liveOnly ? "Showing live games" : "Showing non-live games"}
        </span>
      </div>

      {/* Genre Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Gameplay
          </h3>
          {genres.length > 6 && (
            <button
              onClick={() => toggleSection("genres")}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Show {expandedSections.genres ? "Less" : "More"}
            </button>
          )}
        </div>
        <div className="space-y-2">
          {visibleGenres.map((genre, index) => (
            <div
              key={index}
              className="flex items-center p-2 rounded-md hover:bg-gray-700"
            >
              <label className="flex items-center w-full cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.genre_name)}
                  onChange={() => toggleGenre(genre.genre_name)}
                  className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-500 bg-gray-700 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
                <span className="ml-2 text-sm">{genre.genre_name}</span>
                <span className="ml-auto text-xs text-gray-400">
                  ({genre.count || 0})
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Platform
          </h3>
          {platforms.length > 6 && (
            <button
              onClick={() => toggleSection("platforms")}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Show {expandedSections.platforms ? "Less" : "More"}
            </button>
          )}
        </div>
        <div className="space-y-2">
          {visiblePlatforms.map((platform, index) => (
            <div
              key={index}
              className="flex items-center p-2 rounded-md hover:bg-gray-700"
            >
              <label className="flex items-center w-full cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(platform.platform_name)}
                  onChange={() => togglePlatform(platform.platform_name)}
                  className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-500 bg-gray-700 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
                <span className="ml-2 text-sm">{platform.platform_name}</span>
                <span className="ml-auto text-xs text-gray-400">
                  ({platform.count || 0})
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

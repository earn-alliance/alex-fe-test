"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { fetchGames, fetchGenres, fetchPlatforms } from "../api";

// Create the context
const GameContext = createContext();

// Custom hook to use the game context
export const useGameContext = () => useContext(GameContext);

// Provider component
export function GameProvider({ children }) {
  // State for games data
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for filters - set liveOnly to true by default
  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedGenre: "",
    selectedPlatform: "",
    liveOnly: true, // Default to showing live games
  });

  // Load genres and platforms on initial render
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [genreData, platformData] = await Promise.all([
          fetchGenres(),
          fetchPlatforms(),
        ]);
        setGenres(genreData);
        setPlatforms(platformData);
      } catch (error) {
        console.error("Error loading filter data:", error);
      }
    };

    loadFilters();
  }, []);

  // Load games whenever filters change
  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        const gameData = await fetchGames({
          nameSearch: filters.searchQuery,
          genreFilter:
            filters.selectedGenre !== "all" ? filters.selectedGenre : "",
          platformFilter:
            filters.selectedPlatform !== "all" ? filters.selectedPlatform : "",
          liveOnly: filters.liveOnly,
        });
        setGames(gameData);
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many requests
    const handler = setTimeout(() => {
      loadGames();
    }, 300);

    return () => clearTimeout(handler);
  }, [
    filters.searchQuery,
    filters.selectedGenre,
    filters.selectedPlatform,
    filters.liveOnly,
  ]);

  // Update filter function
  const updateFilter = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  // Context value
  const contextValue = {
    games,
    genres,
    platforms,
    loading,
    filters,
    updateFilter,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
}

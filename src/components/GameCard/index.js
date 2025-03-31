"use client";

import { useState, useEffect } from "react";

function GameCard({ game }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [gifLoaded, setGifLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Preload the image and gif with proper error handling and timeouts
  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds max loading time

    // Handle image loading
    if (game.directory_image_name) {
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
        checkAllLoaded();
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${game.directory_image_name}`);
        setImageError(true);
        setImageLoaded(true); // Mark as loaded even on error to prevent infinite loading
        checkAllLoaded();
      };
      img.src = `/images/${game.directory_image_name}`;
    } else {
      setImageError(true);
      setImageLoaded(true);
      checkAllLoaded();
    }

    // Handle gif loading
    if (game.directory_gif_name) {
      const gif = new Image();
      gif.onload = () => {
        setGifLoaded(true);
        checkAllLoaded();
      };
      gif.onerror = () => {
        console.error(`Failed to load gif: ${game.directory_gif_name}`);
        setGifLoaded(true); // Mark as loaded even on error to prevent infinite loading
        checkAllLoaded();
      };
      gif.src = `/images/${game.directory_gif_name}`;
    } else {
      setGifLoaded(true);
      checkAllLoaded();
    }

    // Helper function to check if all media is loaded
    function checkAllLoaded() {
      if (imageLoaded && gifLoaded) {
        setIsLoading(false);
        clearTimeout(loadingTimeout);
      }
    }

    // Cleanup
    return () => clearTimeout(loadingTimeout);
  }, [game.directory_image_name, game.directory_gif_name]);

  // Skeleton UI component for just the image area
  const ImageSkeletonUI = () => (
    <div className="absolute inset-0 bg-gray-800 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:400%_100%] animate-[gradient_2s_ease_infinite]"></div>
    </div>
  );

  return (
    <div
      className={`relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 aspect-[16/9] ${
        isHovered
          ? "transform scale-115 z-10 border-2 border-[#fdd987]"
          : "border border-gray-700"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformOrigin: "center" }}
    >
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Media container - takes full card size */}
      <div className="absolute inset-0">
        {/* Show skeleton if image failed to load */}
        {imageError && !isLoading ? (
          <ImageSkeletonUI />
        ) : (
          <>
            {/* Show GIF on hover, otherwise show static image */}
            {!isHovered && game.directory_image_name && (
              <img
                src={`/images/${game.directory_image_name}`}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            )}
            {isHovered && game.directory_gif_name ? (
              <img
                src={`/images/${game.directory_gif_name}`}
                alt={`${game.name} animation`}
                className="w-full h-full object-cover"
              />
            ) : isHovered &&
              !game.directory_gif_name &&
              game.directory_image_name ? (
              <img
                src={`/images/${game.directory_image_name}`}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            ) : null}
          </>
        )}

        {/* Gradient overlay for text readability - always show */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>

      {/* Game name overlay - always show */}
      <div className="absolute inset-x-0 bottom-0 p-4 z-10">
        <h3 className="text-xl font-bold text-white text-center uppercase tracking-wider">
          {game.name}
        </h3>
      </div>

      {/* Special badges - always show */}
      <div className="absolute top-0 left-0 p-2 z-10">
        {game.is_top_25 && (
          <div className="bg-pink-600 text-white text-xs font-bold py-1 px-2 rounded">
            TOP 25
          </div>
        )}
        {game.is_top_100 && (
          <div className="bg-teal-600 text-white text-xs font-bold py-1 px-2 rounded">
            TOP 100
          </div>
        )}
      </div>

      {/* Live badge - always show */}
      {game.is_live && (
        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10">
          LIVE
        </span>
      )}
    </div>
  );
}

export default GameCard;

import { gql, GraphQLClient } from "graphql-request";

// Initialize the GraphQL client
const endpoint =
  process.env.REACT_APP_HASURA_ENDPOINT || "http://localhost:8080/v1/graphql";
const client = new GraphQLClient(endpoint, {
  headers: {
    "x-hasura-admin-secret":
      process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET || "",
  },
});

/**
 * Fetch all genre types with their game counts
 * Uses a single query to get both genre types and counts
 */
export async function fetchGenres() {
  // Query to get both genre types and all game_genres in a single request
  const query = gql`
    query GetGenresWithCounts {
      # Get all genre types
      game_genre_types {
        genre_name
      }

      # Get all game_genres to count occurrences
      game_genres {
        genre_name
      }
    }
  `;

  try {
    const data = await client.request(query);

    // Count occurrences of each genre in game_genres
    const countMap = {};
    data.game_genres.forEach((genre) => {
      const genreName = genre.genre_name;
      countMap[genreName] = (countMap[genreName] || 0) + 1;
    });

    // Add counts to genre types
    return data.game_genre_types.map((genre) => ({
      ...genre,
      count: countMap[genre.genre_name] || 0,
    }));
  } catch (error) {
    console.error("Error fetching genres:", error);
    console.error("Error details:", error.response?.errors || error.message);
    return [];
  }
}

/**
 * Fetch all platform types with their game counts
 * Uses a single query to get both platform types and counts
 */
export async function fetchPlatforms() {
  // Query to get both platform types and all game_platforms in a single request
  const query = gql`
    query GetPlatformsWithCounts {
      # Get all platform types
      game_platform_types {
        platform_name
      }

      # Get all game_platforms to count occurrences
      game_platforms {
        platform_name
      }
    }
  `;

  try {
    const data = await client.request(query);

    // Count occurrences of each platform in game_platforms
    const countMap = {};
    data.game_platforms.forEach((platform) => {
      const platformName = platform.platform_name;
      countMap[platformName] = (countMap[platformName] || 0) + 1;
    });

    // Add counts to platform types
    return data.game_platform_types.map((platform) => ({
      ...platform,
      count: countMap[platform.platform_name] || 0,
    }));
  } catch (error) {
    console.error("Error fetching platforms:", error);
    console.error("Error details:", error.response?.errors || error.message);
    return [];
  }
}

/**
 * Fetch games with filters
 * @param {Object} options - Filter options
 * @param {string} options.nameSearch - Search term for game names
 * @param {string[]} options.genreFilters - Array of genre names to filter by
 * @param {string[]} options.platformFilters - Array of platform names to filter by
 * @param {boolean} options.liveOnly - Whether to show only live games
 * @returns {Promise<Array>} - Array of games matching the filters
 */
export async function fetchGames({
  nameSearch = "",
  genreFilters = [],
  platformFilters = [],
  liveOnly = false,
}) {
  // Create base query parts
  const whereConditions = [];

  // Always add name filter if provided
  if (nameSearch) {
    whereConditions.push({ name: { _ilike: `%${nameSearch}%` } });
  }

  // Add live filter - always filter based on the toggle state
  whereConditions.push({ is_live: { _eq: liveOnly } });

  // Add genre filters if specified
  if (genreFilters.length > 0) {
    whereConditions.push({
      genres: {
        genre_name: { _in: genreFilters },
      },
    });
  }

  // Add platform filters if specified
  if (platformFilters.length > 0) {
    whereConditions.push({
      platforms: {
        platform_name: { _in: platformFilters },
      },
    });
  }

  // Build the query
  const query = gql`
    query GetGames($where: games_bool_exp!) {
      games(where: $where, order_by: { name: asc }) {
        id
        name
        is_live
        directory_image_name
        directory_gif_name
        genres {
          genre_name
        }
        platforms {
          platform_name
        }
      }
    }
  `;

  // Prepare variables for the query
  const variables = {
    where: { _and: whereConditions },
  };

  try {
    const data = await client.request(query, variables);
    return data.games.map((game) => ({
      ...game,
      // Add any additional processing if needed
      image_url: game.directory_image_name
        ? `/images/${game.directory_image_name}`
        : null,
      gif_url: game.directory_gif_name
        ? `/gifs/${game.directory_gif_name}`
        : null,
    }));
  } catch (error) {
    console.error("Error fetching games:", error);
    console.error("Query:", query);
    console.error("Variables:", JSON.stringify(variables, null, 2));
    return [];
  }
}

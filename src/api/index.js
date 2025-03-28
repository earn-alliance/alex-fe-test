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

// Fetch all genre types
export async function fetchGenres() {
  const query = gql`
    query GetGenreTypes {
      game_genre_types {
        genre_name
      }
    }
  `;

  try {
    const data = await client.request(query);
    return data.game_genre_types;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

// Fetch all platform types
export async function fetchPlatforms() {
  const query = gql`
    query GetPlatformTypes {
      game_platform_types {
        platform_name
      }
    }
  `;

  try {
    const data = await client.request(query);
    return data.game_platform_types;
  } catch (error) {
    console.error("Error fetching platforms:", error);
    return [];
  }
}

// Fetch games with filters
export async function fetchGames({
  nameSearch = "",
  genreFilter = "",
  platformFilter = "",
  liveOnly = false,
}) {
  // Create base query parts
  const whereConditions = [];

  // Always add name filter if provided
  if (nameSearch) {
    whereConditions.push({ name: { _ilike: `%${nameSearch}%` } });
  }

  // Add live filter - always filter based on the toggle state
  // If liveOnly is true, show only live games
  // If liveOnly is false, show only non-live games
  whereConditions.push({ is_live: { _eq: liveOnly } });

  // Add genre filter if specified
  if (genreFilter && genreFilter !== "all") {
    whereConditions.push({
      genres: {
        genre_name: { _eq: genreFilter },
      },
    });
  }

  // Add platform filter if specified
  if (platformFilter && platformFilter !== "all") {
    whereConditions.push({
      platforms: {
        platform_name: { _eq: platformFilter },
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

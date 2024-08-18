export const liveScoreConstants = {
  // Search API
  SEARCH_API_GEN: (query: string) =>
    `https://search-api.livescore.com/api/v2/search/soccer?query=${query}&limit=10&locale=en&countryCode=CL&categories=true&stages=true&teams=true`,

  // Team API
  TEAM_API_GEN: (team_id: string) =>
    `https://team-api.livescore.com/v1/api/app/team/${team_id}/details`,
};

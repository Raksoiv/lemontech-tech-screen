export const liveScoreConstants = {
  // Search API
  SEARCH_API_GEN: (query: string) =>
    `https://search-api.livescore.com/api/v2/search/soccer?query=${query}&limit=10&locale=en&countryCode=CL&categories=true&stages=true&teams=true`,

  // Team API
  TEAM_API_GEN: (team_id: string) =>
    `https://team-api.livescore.com/v1/api/app/team/${team_id}/details`,

  // Event (Scoreboard) API
  EVENT_SCORE_API_GEN: (event_id: string) =>
    `https://prod-public-api.livescore.com/v1/api/app/scoreboard/soccer/${event_id}`,

  // Event (Incidents) API
  EVENT_INCIDENTS_API_GEN: (event_id: string) =>
    `https://prod-public-api.livescore.com/v1/api/app/incidents/soccer/${event_id}`,

  // Goal Template
  GOAL_TEMPLATE: (
    team1: string,
    team2: string,
    player: string,
    score1: number,
    score2: number,
    minute: string,
  ) =>
    `Gol de ${team1}! ${player} anota el ${score1}-${score2} contra el ${team2} en el minuto ${minute}`,

  // Goal & Assist Template
  GOAL_ASSIST_TEMPLATE: (
    team1: string,
    team2: string,
    scorer: string,
    assist: string,
    score1: number,
    score2: number,
    minute: string,
  ) =>
    `Gol de ${team1}! ${scorer} asistido por ${assist} anotan el ${score1}-${score2} contra el ${team2} en el minuto ${minute}`,

  // Penalty Sored Template
  PENALTY_SCORED_TEMPLATE: (
    team1: string,
    team2: string,
    player: string,
    score1: number,
    score2: number,
    minute: string,
  ) =>
    `Gol de penal para ${team1}! ${player} anota el ${score1}-${score2} contra el ${team2} en el minuto ${minute}`,

  // Penalty Missed Template
  PENALTY_MISSED_TEMPLATE: (
    team1: string,
    team2: string,
    player: string,
    score1: number,
    score2: number,
    minute: string,
  ) =>
    `Penal fallado para ${team1}! ${player} falla el penal y el marcador se mantiene ${score1}-${score2} contra el ${team2} en el minuto ${minute}`,

  // Yellow Card Template
  YELLOW_CARD_TEMPLATE: (team: string, player: string, minute: string) =>
    `${team}: Tarjeta amarilla para ${player} en el minuto ${minute}`,

  // Red Card Template
  RED_CARD_TEMPLATE: (team: string, player: string, minute: string) =>
    `${team}: Tarjeta roja para ${player} en el minuto ${minute}`,

  // Penalty Phase Attempt Scored Template
  PENALTY_PHASE_ATTEMPT_SCORED_TEMPLATE: (
    team1: string,
    team2: string,
    player: string,
    score1: number,
    score2: number,
  ) =>
    `En la fase de penales ${player} anota para ${team1}! ${team1} ${score1}-${score2} ${team2}`,

  // Penalty Phase Attempt Missed Template
  PENALTY_PHASE_ATTEMPT_MISSED_TEMPLATE: (
    team1: string,
    team2: string,
    player: string,
    score1: number,
    score2: number,
  ) =>
    `En la fase de penales ${player} falla para ${team1}! ${team1} ${score1}-${score2} ${team2}`,
};

export const dateConstants = {
  CHILEAN_DATE: function getChileanTime(): Date {
    // Create a Date object in UTC
    const utcDate = new Date();

    // Calculate the time difference between UTC and Chile (adjust for DST if necessary)
    const chileOffset = -3 * 60 * 60 * 1000; // -3 hours in milliseconds

    // Create a new Date object with the Chilean time
    const chileanDate = new Date(utcDate.getTime() + chileOffset);
    return chileanDate;
  },
  LIVESCORE_DATE: function stringToDateRegex(dateString: string): Date {
    const match = dateString.match(
      /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
    );
    if (!match) {
      throw new Error('Invalid date string format');
    }
    const [, year, month, day, hours, minutes, seconds] = match;
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hours, 10),
      parseInt(minutes, 10),
      parseInt(seconds, 10),
    );
  },
};

export const CAREER_SCORE_DIMENSIONS = [
  "positioning",
  "authority",
  "visibility",
  "networking",
  "opportunities",
  "impact",
] as const;

export type CareerScoreDimension = (typeof CAREER_SCORE_DIMENSIONS)[number];

export type PulseScoreInput = {
  upvotes?: number;
  comments?: number;
  views?: number;
  followers?: number;
};

export function calculatePulseScore({
  upvotes = 0,
  comments = 0,
  views = 0,
  followers = 0,
}: PulseScoreInput) {
  return Math.round(upvotes * 10 + comments * 5 + views / 100 + followers * 2);
}

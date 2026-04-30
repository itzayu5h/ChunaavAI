export function calculateScore(correct: number, total: number): number {
  if (total === 0 || correct < 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getBadge(score: number): string {
  if (score >= 90) return "Perfect";
  if (score >= 50) return "Good";
  return "Keep Learning";
}

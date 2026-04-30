export function calculateProgress(completed: number, total: number): string {
  if (total === 0 || completed < 0) return "0%";
  const percentage = Math.round((completed / total) * 100);
  return `${percentage}%`;
}

export function isStepUnlocked(stepIndex: number, completedIndices: number[]): boolean {
  if (stepIndex === 0) return true; // first is always unlocked
  return completedIndices.includes(stepIndex - 1); // unlocked if previous is completed
}

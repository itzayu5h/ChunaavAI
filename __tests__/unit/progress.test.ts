import { calculateProgress, isStepUnlocked } from '@/lib/progress';

describe('Progress Logic', () => {
  describe('calculateProgress', () => {
    it('calculateProgress(completed: 0, total: 7) = "0%"', () => {
      expect(calculateProgress(0, 7)).toBe('0%');
    });

    it('calculateProgress(completed: 7, total: 7) = "100%"', () => {
      expect(calculateProgress(7, 7)).toBe('100%');
    });

    it('calculateProgress(completed: 3, total: 7) = "43%"', () => {
      expect(calculateProgress(3, 7)).toBe('43%');
    });
  });

  describe('isStepUnlocked', () => {
    it('isStepUnlocked(stepIndex: 0, completed: []) = true (first always unlocked)', () => {
      expect(isStepUnlocked(0, [])).toBe(true);
    });

    it('isStepUnlocked(stepIndex: 1, completed: [0]) = true', () => {
      expect(isStepUnlocked(1, [0])).toBe(true);
    });

    it('isStepUnlocked(stepIndex: 2, completed: [0]) = false', () => {
      expect(isStepUnlocked(2, [0])).toBe(false);
    });
  });
});

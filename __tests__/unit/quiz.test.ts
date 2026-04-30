import { calculateScore, getBadge } from '@/lib/quiz';

describe('Quiz Logic', () => {
  describe('calculateScore', () => {
    it('calculateScore(correct: 3, total: 5) = 60', () => {
      expect(calculateScore(3, 5)).toBe(60);
    });

    it('calculateScore(correct: 5, total: 5) = 100', () => {
      expect(calculateScore(5, 5)).toBe(100);
    });

    it('calculateScore(correct: 0, total: 5) = 0', () => {
      expect(calculateScore(0, 5)).toBe(0);
    });
  });

  describe('getBadge', () => {
    it('getBadge(score: 100) returns "Perfect"', () => {
      expect(getBadge(100)).toBe('Perfect');
    });

    it('getBadge(score: 60) returns "Good"', () => {
      expect(getBadge(60)).toBe('Good');
    });

    it('getBadge(score: 20) returns "Keep Learning"', () => {
      expect(getBadge(20)).toBe('Keep Learning');
    });
  });
});

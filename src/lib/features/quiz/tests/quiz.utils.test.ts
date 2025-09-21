import { describe, it, expect } from 'vitest';
import {
  isCorrectAnswer,
  formatAnswerDate,
  getAnswerStats,
} from '../utils/quiz.utils';

describe('Quiz Utils', () => {
  describe('isCorrectAnswer', () => {
    it('should return true for correct answer', () => {
      expect(isCorrectAnswer('answer1', 'answer1')).toBe(true);
    });

    it('should return false for incorrect answer', () => {
      expect(isCorrectAnswer('answer1', 'answer2')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(isCorrectAnswer('', '')).toBe(true);
      expect(isCorrectAnswer('answer1', '')).toBe(false);
    });
  });

  describe('formatAnswerDate', () => {
    it('should format date correctly', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const formatted = formatAnswerDate(dateString);
      expect(formatted).toMatch(/\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}/);
    });

    it('should handle invalid date', () => {
      const result = formatAnswerDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('getAnswerStats', () => {
    it('should calculate stats correctly', () => {
      const answersHistory = [
        { is_correct: true },
        { is_correct: false },
        { is_correct: true },
        { is_correct: true },
      ];

      const stats = getAnswerStats(answersHistory);
      expect(stats).toEqual({
        total: 4,
        correct: 3,
        incorrect: 1,
        successRate: 75,
      });
    });

    it('should handle empty history', () => {
      const stats = getAnswerStats([]);
      expect(stats).toEqual({
        total: 0,
        correct: 0,
        incorrect: 0,
        successRate: 0,
      });
    });

    it('should handle all incorrect answers', () => {
      const answersHistory = [{ is_correct: false }, { is_correct: false }];

      const stats = getAnswerStats(answersHistory);
      expect(stats).toEqual({
        total: 2,
        correct: 0,
        incorrect: 2,
        successRate: 0,
      });
    });
  });
});

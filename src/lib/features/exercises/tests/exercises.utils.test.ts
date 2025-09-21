import { describe, it, expect } from 'vitest';
import {
  getExerciseStatus,
  isExerciseCompleted,
  isExerciseCorrect,
  getExerciseButtonText,
  getExerciseStatusText,
  getExerciseStatusDescription,
  filterAnswersByExercise,
  validateAnswerData,
} from '../utils/exercises.utils';
import type { AnswerHistory, ExerciseStatus } from '../types/exercises.types';

describe('exercises.utils', () => {
  const mockAnswersHistory: AnswerHistory[] = [
    {
      id: 1,
      user_id: 'user1',
      exercise_id: 'ex1',
      selected_answer_id: 'answer1',
      is_correct: true,
      answered_at: '2024-01-02T00:00:00Z',
    },
    {
      id: 2,
      user_id: 'user1',
      exercise_id: 'ex1',
      selected_answer_id: 'answer2',
      is_correct: false,
      answered_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      user_id: 'user1',
      exercise_id: 'ex2',
      selected_answer_id: 'answer3',
      is_correct: false,
      answered_at: '2024-01-01T00:00:00Z',
    },
  ];

  describe('getExerciseStatus', () => {
    it('should return undefined for exercise without answers', () => {
      const result = getExerciseStatus(mockAnswersHistory, 'ex3');
      expect(result).toBeUndefined();
    });

    it('should return correct status for exercise with answers', () => {
      const result = getExerciseStatus(mockAnswersHistory, 'ex1');
      expect(result).toEqual({
        isCompleted: true,
        isCorrect: true,
      });
    });

    it('should return latest answer status', () => {
      const result = getExerciseStatus(mockAnswersHistory, 'ex1');
      expect(result?.isCorrect).toBe(true); // Последний ответ был правильным
    });
  });

  describe('isExerciseCompleted', () => {
    it('should return false for undefined status', () => {
      expect(isExerciseCompleted(undefined)).toBe(false);
    });

    it('should return false for incomplete exercise', () => {
      const status: ExerciseStatus = { isCompleted: false, isCorrect: false };
      expect(isExerciseCompleted(status)).toBe(false);
    });

    it('should return true for completed exercise', () => {
      const status: ExerciseStatus = { isCompleted: true, isCorrect: true };
      expect(isExerciseCompleted(status)).toBe(true);
    });
  });

  describe('isExerciseCorrect', () => {
    it('should return false for undefined status', () => {
      expect(isExerciseCorrect(undefined)).toBe(false);
    });

    it('should return false for incorrect exercise', () => {
      const status: ExerciseStatus = { isCompleted: true, isCorrect: false };
      expect(isExerciseCorrect(status)).toBe(false);
    });

    it('should return true for correct exercise', () => {
      const status: ExerciseStatus = { isCompleted: true, isCorrect: true };
      expect(isExerciseCorrect(status)).toBe(true);
    });
  });

  describe('getExerciseButtonText', () => {
    it('should return "Начать" for incomplete exercise', () => {
      expect(getExerciseButtonText(undefined)).toBe('Начать');
      expect(
        getExerciseButtonText({ isCompleted: false, isCorrect: false })
      ).toBe('Начать');
    });

    it('should return "Повторить" for completed exercise', () => {
      expect(
        getExerciseButtonText({ isCompleted: true, isCorrect: true })
      ).toBe('Повторить');
      expect(
        getExerciseButtonText({ isCompleted: true, isCorrect: false })
      ).toBe('Повторить');
    });
  });

  describe('getExerciseStatusText', () => {
    it('should return "Не решено" for incomplete exercise', () => {
      expect(getExerciseStatusText(undefined)).toBe('Не решено');
      expect(
        getExerciseStatusText({ isCompleted: false, isCorrect: false })
      ).toBe('Не решено');
    });

    it('should return "Решено" for correctly completed exercise', () => {
      expect(
        getExerciseStatusText({ isCompleted: true, isCorrect: true })
      ).toBe('Решено');
    });

    it('should return "Ошибка" for incorrectly completed exercise', () => {
      expect(
        getExerciseStatusText({ isCompleted: true, isCorrect: false })
      ).toBe('Ошибка');
    });
  });

  describe('getExerciseStatusDescription', () => {
    it('should return correct description for incomplete exercise', () => {
      expect(getExerciseStatusDescription(undefined)).toBe(
        'Упражнение не выполнено'
      );
    });

    it('should return correct description for correctly completed exercise', () => {
      const status: ExerciseStatus = { isCompleted: true, isCorrect: true };
      expect(getExerciseStatusDescription(status)).toBe(
        'Упражнение выполнено правильно'
      );
    });

    it('should return correct description for incorrectly completed exercise', () => {
      const status: ExerciseStatus = { isCompleted: true, isCorrect: false };
      expect(getExerciseStatusDescription(status)).toBe(
        'Упражнение выполнено с ошибками'
      );
    });
  });

  describe('filterAnswersByExercise', () => {
    it('should filter answers by exercise ID', () => {
      const result = filterAnswersByExercise(mockAnswersHistory, 'ex1');
      expect(result).toHaveLength(2);
      expect(result.every((answer) => answer.exercise_id === 'ex1')).toBe(true);
    });

    it('should return empty array for non-existent exercise', () => {
      const result = filterAnswersByExercise(mockAnswersHistory, 'ex999');
      expect(result).toHaveLength(0);
    });
  });

  describe('validateAnswerData', () => {
    it('should return true for valid data', () => {
      expect(validateAnswerData('answer1', true)).toBe(true);
      expect(validateAnswerData('answer2', false)).toBe(true);
    });

    it('should return false for invalid selectedAnswerId', () => {
      expect(validateAnswerData('', true)).toBe(false);
      expect(validateAnswerData(null, true)).toBe(false);
      expect(validateAnswerData(undefined, true)).toBe(false);
      expect(validateAnswerData(123, true)).toBe(false);
    });

    it('should return false for invalid isCorrect', () => {
      expect(validateAnswerData('answer1', 'true')).toBe(false);
      expect(validateAnswerData('answer1', 1)).toBe(false);
      expect(validateAnswerData('answer1', null)).toBe(false);
      expect(validateAnswerData('answer1', undefined)).toBe(false);
    });
  });
});

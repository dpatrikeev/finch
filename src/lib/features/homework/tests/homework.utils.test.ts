import { describe, it, expect } from 'vitest';
import {
  calculateExerciseStatus,
  calculateProgressPercentage,
  isHomeworkCompleted,
  calculateOverallStats,
  getProgressColor,
  getExerciseStatusDisplay,
  hasExerciseChanges,
  validateExercises,
} from '../utils/homework.utils';
import type {
  HomeworkWithProgress,
  AnswerRecord,
} from '../types/homework.types';

describe('homework.utils', () => {
  describe('calculateExerciseStatus', () => {
    it('should calculate status for completed exercise', () => {
      const exercisesCompleted = ['ex1', 'ex2'];
      const answerRecords: AnswerRecord[] = [
        {
          exercise_id: 'ex1',
          selected_answer_id: 'answer1',
          is_correct: true,
          answered_at: '2024-01-01T10:00:00Z',
        },
        {
          exercise_id: 'ex1',
          selected_answer_id: 'answer2',
          is_correct: false,
          answered_at: '2024-01-01T11:00:00Z',
        },
      ];

      const result = calculateExerciseStatus(
        'ex1',
        exercisesCompleted,
        answerRecords
      );

      expect(result.completed).toBe(true);
      expect(result.attempts).toBe(2);
      expect(result.last_attempt_at).toBe('2024-01-01T11:00:00Z');
    });

    it('should calculate status for incomplete exercise', () => {
      const exercisesCompleted: string[] = [];
      const answerRecords: AnswerRecord[] = [
        {
          exercise_id: 'ex1',
          selected_answer_id: 'answer1',
          is_correct: false,
          answered_at: '2024-01-01T10:00:00Z',
        },
      ];

      const result = calculateExerciseStatus(
        'ex1',
        exercisesCompleted,
        answerRecords
      );

      expect(result.completed).toBe(false);
      expect(result.attempts).toBe(1);
      expect(result.last_attempt_at).toBe('2024-01-01T10:00:00Z');
    });

    it('should calculate status for exercise with no attempts', () => {
      const exercisesCompleted: string[] = [];
      const answerRecords: AnswerRecord[] = [];

      const result = calculateExerciseStatus(
        'ex1',
        exercisesCompleted,
        answerRecords
      );

      expect(result.completed).toBe(false);
      expect(result.attempts).toBe(0);
      expect(result.last_attempt_at).toBeUndefined();
    });

    it('should mark exercise as completed based on global answer history even if not in exercises_completed', () => {
      // Сценарий: ученик решил упражнение в первой домашке,
      // учитель создал новую домашку с тем же упражнением
      const exercisesCompleted: string[] = []; // Новая домашка, пустой список
      const answerRecords: AnswerRecord[] = [
        {
          exercise_id: 'ex1',
          selected_answer_id: 'answer1',
          is_correct: true, // Ученик уже решил это упражнение правильно
          answered_at: '2024-01-01T10:00:00Z',
        },
      ];

      const result = calculateExerciseStatus(
        'ex1',
        exercisesCompleted,
        answerRecords
      );

      // Упражнение должно считаться выполненным, так как есть правильный ответ в истории
      expect(result.completed).toBe(true);
      expect(result.attempts).toBe(1);
      expect(result.last_attempt_at).toBe('2024-01-01T10:00:00Z');
    });

    it('should handle null/undefined answerRecords gracefully', () => {
      const exercisesCompleted: string[] = [];
      const answerRecords = null as any;

      const result = calculateExerciseStatus(
        'ex1',
        exercisesCompleted,
        answerRecords
      );

      expect(result.completed).toBe(false);
      expect(result.attempts).toBe(0);
      expect(result.last_attempt_at).toBeUndefined();
    });
  });

  describe('calculateProgressPercentage', () => {
    it('should calculate 0% for no exercises', () => {
      expect(calculateProgressPercentage(0, 0)).toBe(0);
    });

    it('should calculate 50% for half completed', () => {
      expect(calculateProgressPercentage(4, 2)).toBe(50);
    });

    it('should calculate 100% for all completed', () => {
      expect(calculateProgressPercentage(3, 3)).toBe(100);
    });

    it('should round to nearest integer', () => {
      expect(calculateProgressPercentage(3, 1)).toBe(33);
    });
  });

  describe('isHomeworkCompleted', () => {
    it('should return true when all exercises completed', () => {
      expect(isHomeworkCompleted(3, 3)).toBe(true);
    });

    it('should return false when not all exercises completed', () => {
      expect(isHomeworkCompleted(3, 2)).toBe(false);
    });

    it('should return false when no exercises', () => {
      expect(isHomeworkCompleted(0, 0)).toBe(false);
    });
  });

  describe('calculateOverallStats', () => {
    it('should calculate correct overall stats', () => {
      const homework: HomeworkWithProgress[] = [
        {
          id: 1,
          created_at: '2024-01-01T10:00:00Z',
          teacher_id: 'teacher1',
          student_id: 'student1',
          exercises: ['ex1', 'ex2'],
          is_completed: true,
          progress_percentage: 100,
          exercises_status: {
            ex1: { completed: true, attempts: 1 },
            ex2: { completed: true, attempts: 1 },
          },
          total_attempts: 2,
          correct_attempts: 2,
        },
        {
          id: 2,
          created_at: '2024-01-02T10:00:00Z',
          teacher_id: 'teacher1',
          student_id: 'student1',
          exercises: ['ex3'],
          is_completed: false,
          progress_percentage: 0,
          exercises_status: {
            ex3: { completed: false, attempts: 0 },
          },
          total_attempts: 0,
          correct_attempts: 0,
        },
      ];

      const result = calculateOverallStats(homework);

      expect(result.totalHomework).toBe(2);
      expect(result.completedHomework).toBe(1);
      expect(result.totalExercises).toBe(3);
      expect(result.completedExercises).toBe(2);
      expect(result.totalAttempts).toBe(2);
      expect(result.correctAttempts).toBe(2);
      expect(result.completionRate).toBe(50);
      expect(result.exerciseCompletionRate).toBe(67);
      expect(result.accuracy).toBe(100);
    });

    it('should handle empty homework list', () => {
      const result = calculateOverallStats([]);

      expect(result.totalHomework).toBe(0);
      expect(result.completedHomework).toBe(0);
      expect(result.completionRate).toBe(0);
      expect(result.exerciseCompletionRate).toBe(0);
      expect(result.accuracy).toBe(0);
    });
  });

  describe('getProgressColor', () => {
    it('should return green for 100%', () => {
      expect(getProgressColor(100)).toBe('bg-green-500');
    });

    it('should return blue for 70%+', () => {
      expect(getProgressColor(70)).toBe('bg-blue-500');
      expect(getProgressColor(85)).toBe('bg-blue-500');
    });

    it('should return yellow for 40-69%', () => {
      expect(getProgressColor(40)).toBe('bg-yellow-500');
      expect(getProgressColor(65)).toBe('bg-yellow-500');
    });

    it('should return gray for <40%', () => {
      expect(getProgressColor(39)).toBe('bg-gray-300');
      expect(getProgressColor(0)).toBe('bg-gray-300');
    });
  });

  describe('getExerciseStatusDisplay', () => {
    it('should return completed status', () => {
      const hw: HomeworkWithProgress = {
        id: 1,
        created_at: '2024-01-01T10:00:00Z',
        teacher_id: 'teacher1',
        student_id: 'student1',
        exercises: ['ex1'],
        is_completed: true,
        progress_percentage: 100,
        exercises_status: {
          ex1: { completed: true, attempts: 1 },
        },
      };

      const result = getExerciseStatusDisplay('ex1', hw);

      expect(result.icon).toBe('CircleCheck');
      expect(result.color).toBe('text-green-600');
      expect(result.text).toBe('Выполнено');
    });

    it('should return in progress status', () => {
      const hw: HomeworkWithProgress = {
        id: 1,
        created_at: '2024-01-01T10:00:00Z',
        teacher_id: 'teacher1',
        student_id: 'student1',
        exercises: ['ex1'],
        is_completed: false,
        progress_percentage: 0,
        exercises_status: {
          ex1: { completed: false, attempts: 2 },
        },
      };

      const result = getExerciseStatusDisplay('ex1', hw);

      expect(result.icon).toBe('CircleAlert');
      expect(result.color).toBe('text-orange-500');
      expect(result.text).toBe('Попыток: 2');
    });

    it('should return not started status', () => {
      const hw: HomeworkWithProgress = {
        id: 1,
        created_at: '2024-01-01T10:00:00Z',
        teacher_id: 'teacher1',
        student_id: 'student1',
        exercises: ['ex1'],
        is_completed: false,
        progress_percentage: 0,
        exercises_status: {
          ex1: { completed: false, attempts: 0 },
        },
      };

      const result = getExerciseStatusDisplay('ex1', hw);

      expect(result.icon).toBe('Clock');
      expect(result.color).toBe('text-gray-400');
      expect(result.text).toBe('Не начато');
    });
  });

  describe('hasExerciseChanges', () => {
    it('should detect changes in exercise order', () => {
      const original = ['ex1', 'ex2', 'ex3'];
      const current = ['ex3', 'ex1', 'ex2'];

      expect(hasExerciseChanges(original, current)).toBe(false); // Same elements, different order
    });

    it('should detect changes in exercise content', () => {
      const original = ['ex1', 'ex2'];
      const current = ['ex1', 'ex3'];

      expect(hasExerciseChanges(original, current)).toBe(true);
    });

    it('should detect no changes', () => {
      const original = ['ex1', 'ex2'];
      const current = ['ex1', 'ex2'];

      expect(hasExerciseChanges(original, current)).toBe(false);
    });
  });

  describe('validateExercises', () => {
    it('should validate correct exercises array', () => {
      const result = validateExercises(['ex1', 'ex2', 'ex3']);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty array', () => {
      const result = validateExercises([]);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Необходимо выбрать хотя бы одно упражнение');
    });

    it('should reject non-array input', () => {
      const result = validateExercises('not an array' as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Упражнения должны быть массивом');
    });

    it('should reject array with empty strings', () => {
      const result = validateExercises(['ex1', '', 'ex3']);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Все ID упражнений должны быть непустыми строками'
      );
    });

    it('should reject array with non-string elements', () => {
      const result = validateExercises(['ex1', 123, 'ex3'] as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Все ID упражнений должны быть непустыми строками'
      );
    });
  });
});

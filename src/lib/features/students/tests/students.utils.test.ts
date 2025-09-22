import { describe, it, expect } from 'vitest';
import {
  calculateStudentsStats,
  calculateOverallHomeworkStats,
  filterStudents,
  sortStudents,
} from '../utils/students.utils';
import type { StudentInfo, HomeworkWithProgress } from '../types';

describe('Students Utils', () => {
  describe('calculateStudentsStats', () => {
    const mockStudents: StudentInfo[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        imageUrl: null,
        totalExercises: 10,
        correctAnswers: 8,
        accuracy: 80,
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        imageUrl: null,
        totalExercises: 0,
        correctAnswers: 0,
        accuracy: 0,
      },
    ];

    it('should calculate stats correctly', () => {
      const stats = calculateStudentsStats(mockStudents, 15);
      expect(stats.totalStudents).toBe(2);
      expect(stats.totalExercises).toBe(15);
      expect(stats.activeStudents).toBe(1); // Только John решал задачи
      expect(stats.totalCorrectAnswers).toBe(8);
    });

    it('should handle empty students array', () => {
      const stats = calculateStudentsStats([], 10);
      expect(stats.totalStudents).toBe(0);
      expect(stats.activeStudents).toBe(0);
      expect(stats.totalCorrectAnswers).toBe(0);
    });
  });

  describe('calculateOverallHomeworkStats', () => {
    const mockHomework: HomeworkWithProgress[] = [
      {
        id: 1,
        created_at: '2023-01-01',
        teacher_id: 'teacher1',
        student_id: 'student1',
        exercises: ['ex1', 'ex2'],
        exercises_status: {
          ex1: { completed: true, attempts: 1 },
          ex2: { completed: false, attempts: 2 },
        },
        is_completed: false,
        total_attempts: 3,
        correct_attempts: 1,
        progress_percentage: 50,
      },
      {
        id: 2,
        created_at: '2023-01-01',
        teacher_id: 'teacher1',
        student_id: 'student1',
        exercises: ['ex3'],
        exercises_status: {
          ex3: { completed: true, attempts: 1 },
        },
        is_completed: true,
        total_attempts: 1,
        correct_attempts: 1,
        progress_percentage: 100,
      },
    ];

    it('should calculate overall stats correctly', () => {
      const stats = calculateOverallHomeworkStats(mockHomework);
      expect(stats.totalHomework).toBe(2);
      expect(stats.completedHomework).toBe(1);
      expect(stats.totalExercises).toBe(3);
      expect(stats.completedExercises).toBe(2);
      expect(stats.totalAttempts).toBe(4);
      expect(stats.correctAttempts).toBe(2);
      expect(stats.completionRate).toBe(50);
      expect(stats.exerciseCompletionRate).toBe(67);
      expect(stats.accuracy).toBe(50);
    });

    it('should handle empty homework array', () => {
      const stats = calculateOverallHomeworkStats([]);
      expect(stats.totalHomework).toBe(0);
      expect(stats.completedHomework).toBe(0);
      expect(stats.completionRate).toBe(0);
      expect(stats.accuracy).toBe(0);
    });
  });

  describe('filterStudents', () => {
    const mockStudents: StudentInfo[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        imageUrl: null,
        totalExercises: 10,
        correctAnswers: 8,
        accuracy: 80,
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        imageUrl: null,
        totalExercises: 5,
        correctAnswers: 3,
        accuracy: 60,
      },
    ];

    it('should filter by name', () => {
      const filtered = filterStudents(mockStudents, 'John');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].firstName).toBe('John');
    });

    it('should filter by email', () => {
      const filtered = filterStudents(mockStudents, 'jane@');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].email).toBe('jane@example.com');
    });

    it('should return all students for empty query', () => {
      const filtered = filterStudents(mockStudents, '');
      expect(filtered).toHaveLength(2);
    });

    it('should be case insensitive', () => {
      const filtered = filterStudents(mockStudents, 'JOHN');
      expect(filtered).toHaveLength(1);
    });
  });

  describe('sortStudents', () => {
    const mockStudents: StudentInfo[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        imageUrl: null,
        totalExercises: 5,
        correctAnswers: 3,
        accuracy: 60,
      },
      {
        id: '2',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        imageUrl: null,
        totalExercises: 10,
        correctAnswers: 8,
        accuracy: 80,
      },
    ];

    it('should sort by name (ascending)', () => {
      const sorted = sortStudents(mockStudents, 'name');
      expect(sorted[0].firstName).toBe('Alice');
      expect(sorted[1].firstName).toBe('John');
    });

    it('should sort by accuracy (descending)', () => {
      const sorted = sortStudents(mockStudents, 'accuracy');
      expect(sorted[0].accuracy).toBe(80);
      expect(sorted[1].accuracy).toBe(60);
    });

    it('should sort by exercises (descending)', () => {
      const sorted = sortStudents(mockStudents, 'exercises');
      expect(sorted[0].totalExercises).toBe(10);
      expect(sorted[1].totalExercises).toBe(5);
    });

    it('should not mutate original array', () => {
      const original = [...mockStudents];
      sortStudents(mockStudents, 'name');
      expect(mockStudents).toEqual(original);
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  getAccuracyColor,
  getAccuracyTextColor,
  formatStudentInitials,
  formatStudentFullName,
  calculateStudentsStats,
  getProgressColor,
  calculateOverallHomeworkStats,
  filterStudents,
  sortStudents,
  isValidStudentInfo,
} from '../utils/students.utils';
import type {
  StudentInfo,
  HomeworkWithProgress,
} from '../types/students.types';

describe('Students Utils', () => {
  describe('getAccuracyColor', () => {
    it('should return green for high accuracy', () => {
      expect(getAccuracyColor(85)).toBe('bg-green-500');
    });

    it('should return yellow for medium accuracy', () => {
      expect(getAccuracyColor(65)).toBe('bg-yellow-500');
    });

    it('should return red for low accuracy', () => {
      expect(getAccuracyColor(45)).toBe('bg-red-500');
    });
  });

  describe('getAccuracyTextColor', () => {
    it('should return green text for high accuracy', () => {
      expect(getAccuracyTextColor(85)).toBe('text-green-600');
    });

    it('should return yellow text for medium accuracy', () => {
      expect(getAccuracyTextColor(65)).toBe('text-yellow-600');
    });

    it('should return red text for low accuracy', () => {
      expect(getAccuracyTextColor(45)).toBe('text-red-600');
    });
  });

  describe('formatStudentInitials', () => {
    it('should format initials correctly', () => {
      expect(formatStudentInitials('John', 'Doe')).toBe('JD');
    });

    it('should handle null values', () => {
      expect(formatStudentInitials(null, 'Doe')).toBe('D');
      expect(formatStudentInitials('John', null)).toBe('J');
      expect(formatStudentInitials(null, null)).toBe('');
    });

    it('should handle empty strings', () => {
      expect(formatStudentInitials('', 'Doe')).toBe('D');
      expect(formatStudentInitials('John', '')).toBe('J');
    });
  });

  describe('formatStudentFullName', () => {
    it('should format full name correctly', () => {
      expect(formatStudentFullName('John', 'Doe')).toBe('John Doe');
    });

    it('should handle null values', () => {
      expect(formatStudentFullName(null, 'Doe')).toBe('Doe');
      expect(formatStudentFullName('John', null)).toBe('John');
      expect(formatStudentFullName(null, null)).toBe('');
    });

    it('should handle empty strings', () => {
      expect(formatStudentFullName('', 'Doe')).toBe('Doe');
      expect(formatStudentFullName('John', '')).toBe('John');
    });
  });

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
      expect(stats.activeStudents).toBe(1);
      expect(stats.totalCorrectAnswers).toBe(8);
    });
  });

  describe('getProgressColor', () => {
    it('should return correct colors for different percentages', () => {
      expect(getProgressColor(100)).toBe('bg-green-500');
      expect(getProgressColor(75)).toBe('bg-blue-500');
      expect(getProgressColor(45)).toBe('bg-yellow-500');
      expect(getProgressColor(20)).toBe('bg-gray-300');
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
        progress_percentage: 100,
      },
    ];

    it('should calculate overall stats correctly', () => {
      const stats = calculateOverallHomeworkStats(mockHomework);
      expect(stats.totalHomework).toBe(2);
      expect(stats.completedHomework).toBe(1);
      expect(stats.totalExercises).toBe(3);
      expect(stats.completedExercises).toBe(2);
      expect(stats.completionRate).toBe(50);
      expect(stats.exerciseCompletionRate).toBe(67);
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

    it('should sort by name', () => {
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
  });

  describe('isValidStudentInfo', () => {
    it('should validate correct student info', () => {
      const validStudent = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        imageUrl: null,
        totalExercises: 10,
        correctAnswers: 8,
        accuracy: 80,
      };
      expect(isValidStudentInfo(validStudent)).toBe(true);
    });

    it('should reject invalid student info', () => {
      expect(isValidStudentInfo(null)).toBe(false);
      expect(isValidStudentInfo({})).toBe(false);
      expect(isValidStudentInfo({ id: 123 })).toBe(false);
    });
  });
});

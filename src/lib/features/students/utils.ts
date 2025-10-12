import type {
  StudentInfo,
  StudentsStatsData,
} from '$lib/features/students/types';

interface FullName {
  first: string | null;
  last: string | null;
}

export const formatFullName = ({ first, last }: FullName) => {
  return [first, last].filter(Boolean).join(' ');
};

export const formatInitials = ({ first, last }: FullName) => {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase();
};

export const getAccuracyColorClass = (accuracy: number) =>
  accuracy >= 80
    ? 'bg-green-500'
    : accuracy >= 60
    ? 'bg-yellow-500'
    : 'bg-red-500';

export const getAccuracyTextClass = (accuracy: number) =>
  accuracy >= 80
    ? 'text-green-600'
    : accuracy >= 60
    ? 'text-yellow-600'
    : 'text-red-600';

/**
 * Вычисляет общую статистику по списку студентов
 */
export function calculateStudentsStats(
  students: StudentInfo[],
  totalExercises: number = 0
): StudentsStatsData {
  return {
    totalStudents: students.length,
    totalExercises,
    activeStudents: students.filter((student) => student.correctAnswers > 0)
      .length,
    totalCorrectAnswers: students.reduce(
      (sum, student) => sum + student.correctAnswers,
      0
    ),
  };
}

/**
 * Фильтрует студентов по поисковому запросу
 */
export function filterStudents(
  students: StudentInfo[],
  searchQuery: string
): StudentInfo[] {
  if (!searchQuery.trim()) return students;

  const query = searchQuery.toLowerCase();
  return students.filter((student) => {
    const fullName = [student.firstName, student.lastName]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const email = student.email.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });
}

/**
 * Сортирует студентов по заданному критерию
 */
export function sortStudents(
  students: StudentInfo[],
  sortBy: 'name' | 'accuracy' | 'exercises'
): StudentInfo[] {
  return [...students].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        const nameA = [a.firstName, a.lastName].filter(Boolean).join(' ');
        const nameB = [b.firstName, b.lastName].filter(Boolean).join(' ');
        return nameA.localeCompare(nameB);
      case 'accuracy':
        return b.accuracy - a.accuracy;
      case 'exercises':
        return b.totalExercises - a.totalExercises;
      default:
        return 0;
    }
  });
}

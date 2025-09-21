import type {
  StudentInfo,
  StudentsStatsData,
  HomeworkWithProgress,
} from '../types/students.types';

/**
 * Вычисляет цвет для отображения точности студента
 */
export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 80) return 'bg-green-500';
  if (accuracy >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

/**
 * Вычисляет цвет текста для отображения точности студента
 */
export function getAccuracyTextColor(accuracy: number): string {
  if (accuracy >= 80) return 'text-green-600';
  if (accuracy >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Форматирует инициалы студента из имени и фамилии
 */
export function formatStudentInitials(
  firstName: string | null,
  lastName: string | null
): string {
  const first = firstName?.[0]?.toUpperCase() || '';
  const last = lastName?.[0]?.toUpperCase() || '';
  return first + last;
}

/**
 * Форматирует полное имя студента
 */
export function formatStudentFullName(
  firstName: string | null,
  lastName: string | null
): string {
  return [firstName, lastName].filter(Boolean).join(' ');
}

/**
 * Вычисляет общую статистику по списку студентов
 */
export function calculateStudentsStats(
  students: StudentInfo[],
  totalExercises: number
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
 * Получает статус упражнения в домашнем задании
 */
export function getExerciseStatus(
  exerciseId: string,
  homework: HomeworkWithProgress
) {
  const status = homework.exercises_status[exerciseId];

  if (!status) {
    return {
      icon: 'Clock',
      color: 'text-gray-400',
      text: 'Не начато',
    };
  }

  if (status.completed) {
    return {
      icon: 'CircleCheck',
      color: 'text-green-600',
      text: 'Выполнено',
    };
  } else if (status.attempts > 0) {
    return {
      icon: 'CircleAlert',
      color: 'text-orange-500',
      text: `Попыток: ${status.attempts}`,
    };
  }

  return {
    icon: 'Clock',
    color: 'text-gray-400',
    text: 'Не начато',
  };
}

/**
 * Получает цвет прогресс-бара в зависимости от процента выполнения
 */
export function getProgressColor(percentage: number): string {
  if (percentage === 100) return 'bg-green-500';
  if (percentage >= 70) return 'bg-blue-500';
  if (percentage >= 40) return 'bg-yellow-500';
  return 'bg-gray-300';
}

/**
 * Вычисляет общую статистику по всем домашним заданиям студента
 */
export function calculateOverallHomeworkStats(
  homework: HomeworkWithProgress[]
) {
  const totalHomework = homework.length;
  const completedHomework = homework.filter((hw) => hw.is_completed).length;
  const totalExercises = homework.reduce(
    (sum, hw) => sum + hw.exercises.length,
    0
  );
  const completedExercises = homework.reduce((sum, hw) => {
    return (
      sum +
      Object.values(hw.exercises_status).filter((status) => status.completed)
        .length
    );
  }, 0);
  const totalAttempts = homework.reduce(
    (sum, hw) => sum + (hw.total_attempts || 0),
    0
  );
  const correctAttempts = homework.reduce(
    (sum, hw) => sum + (hw.correct_attempts || 0),
    0
  );

  return {
    totalHomework,
    completedHomework,
    totalExercises,
    completedExercises,
    totalAttempts,
    correctAttempts,
    completionRate:
      totalHomework > 0
        ? Math.round((completedHomework / totalHomework) * 100)
        : 0,
    exerciseCompletionRate:
      totalExercises > 0
        ? Math.round((completedExercises / totalExercises) * 100)
        : 0,
    accuracy:
      totalAttempts > 0
        ? Math.round((correctAttempts / totalAttempts) * 100)
        : 0,
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
    const fullName = formatStudentFullName(
      student.firstName,
      student.lastName
    ).toLowerCase();
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
        const nameA = formatStudentFullName(a.firstName, a.lastName);
        const nameB = formatStudentFullName(b.firstName, b.lastName);
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

/**
 * Проверяет, валидны ли данные студента
 */
export function isValidStudentInfo(student: any): student is StudentInfo {
  return (
    typeof student === 'object' &&
    student !== null &&
    typeof student.id === 'string' &&
    typeof student.email === 'string' &&
    typeof student.totalExercises === 'number' &&
    typeof student.correctAnswers === 'number' &&
    typeof student.accuracy === 'number'
  );
}

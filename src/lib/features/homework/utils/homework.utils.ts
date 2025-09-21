import { formatDistance, format } from 'date-fns';
import type {
  HomeworkItem,
  HomeworkWithProgress,
  ExerciseStatus,
  AnswerRecord,
  ExerciseStat,
  HomeworkStats,
} from '../types/homework.types';

/**
 * Вычисляет статус упражнения на основе данных о прогрессе
 */
export function calculateExerciseStatus(
  exerciseId: string,
  exercisesCompleted: string[],
  answerRecords: AnswerRecord[]
): ExerciseStatus {
  // Ищем все ответы по этому упражнению в глобальной истории
  const exerciseAnswers = (answerRecords || []).filter(
    (record) => record && record.exercise_id === exerciseId
  );

  // Упражнение считается выполненным, если есть хотя бы один правильный ответ в истории
  // ИЛИ если оно есть в exercises_completed (для обратной совместимости)
  const hasCorrectAnswer = exerciseAnswers.some((record) => record.is_correct);
  const isCompleted =
    hasCorrectAnswer || exercisesCompleted.includes(exerciseId);

  const attempts = exerciseAnswers.length;
  const lastAttempt = exerciseAnswers[exerciseAnswers.length - 1];

  return {
    completed: isCompleted,
    attempts,
    last_attempt_at: lastAttempt?.answered_at,
  };
}

/**
 * Вычисляет процент выполнения домашнего задания
 */
export function calculateProgressPercentage(
  totalExercises: number,
  completedExercises: number
): number {
  if (totalExercises === 0) return 0;
  return Math.round((completedExercises / totalExercises) * 100);
}

/**
 * Проверяет, завершено ли домашнее задание
 */
export function isHomeworkCompleted(
  totalExercises: number,
  completedExercises: number
): boolean {
  return totalExercises > 0 && completedExercises === totalExercises;
}

/**
 * Вычисляет общую статистику по домашним заданиям
 */
export function calculateOverallStats(homework: HomeworkWithProgress[]) {
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
 * Получает цвет прогресс-бара на основе процента выполнения
 */
export function getProgressColor(percentage: number): string {
  if (percentage === 100) return 'bg-green-500';
  if (percentage >= 70) return 'bg-blue-500';
  if (percentage >= 40) return 'bg-yellow-500';
  return 'bg-gray-300';
}

/**
 * Получает статус упражнения для отображения в UI
 */
export function getExerciseStatusDisplay(
  exerciseId: string,
  hw: HomeworkWithProgress
) {
  const status = hw.exercises_status[exerciseId];
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
 * Форматирует дату в относительном формате
 */
export function formatRelativeDate(dateStr: string, locale: any): string {
  return formatDistance(new Date(dateStr), new Date(), {
    addSuffix: true,
    locale,
  });
}

/**
 * Форматирует дату в абсолютном формате
 */
export function formatAbsoluteDate(dateStr: string, locale: any): string {
  return format(new Date(dateStr), 'dd.MM.yyyy', { locale });
}

/**
 * Создает расширенный объект домашнего задания с прогрессом
 */
export function createHomeworkWithProgress(
  homework: HomeworkItem,
  answerRecords: AnswerRecord[]
): HomeworkWithProgress {
  const exercisesStatus: Record<string, ExerciseStatus> = {};
  homework.exercises.forEach((exerciseId) => {
    exercisesStatus[exerciseId] = calculateExerciseStatus(
      exerciseId,
      homework.exercises_completed || [],
      answerRecords
    );
  });

  // Считаем завершенные упражнения на основе статуса (учитывает глобальную историю)
  const completedExercisesCount = Object.values(exercisesStatus).filter(
    (status) => status.completed
  ).length;

  const progressPercentage = calculateProgressPercentage(
    homework.exercises.length,
    completedExercisesCount
  );
  const isCompleted = isHomeworkCompleted(
    homework.exercises.length,
    completedExercisesCount
  );

  return {
    ...homework,
    is_completed: isCompleted,
    progress_percentage: progressPercentage,
    exercises_status: exercisesStatus,
  };
}

/**
 * Вычисляет статистику по упражнению
 */
export function calculateExerciseStats(
  exerciseId: string,
  answerRecords: AnswerRecord[]
): ExerciseStat {
  const exerciseAnswers = answerRecords.filter(
    (record) => record.exercise_id === exerciseId
  );
  const totalAttempts = exerciseAnswers.length;
  const correctAttempts = exerciseAnswers.filter(
    (record) => record.is_correct
  ).length;
  const completionRate =
    totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  const lastAttempt = exerciseAnswers[exerciseAnswers.length - 1];
  const firstAttempt = exerciseAnswers[0];

  // Упражнение считается выполненным, если есть хотя бы один правильный ответ
  const isCompleted = correctAttempts > 0;

  return {
    exercise_id: exerciseId,
    total_attempts: totalAttempts,
    correct_attempts: correctAttempts,
    completion_rate: completionRate,
    last_attempt_at: lastAttempt?.answered_at,
    is_completed: isCompleted,
    first_attempt_at: firstAttempt?.answered_at,
    answers_history: exerciseAnswers,
  };
}

/**
 * Создает статистику по домашнему заданию
 */
export function createHomeworkStats(
  homework: HomeworkItem,
  student: {
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
  },
  answerRecords: AnswerRecord[]
): HomeworkStats {
  const exercisesStats = homework.exercises.map((exerciseId) =>
    calculateExerciseStats(exerciseId, answerRecords)
  );

  const totalExercises = homework.exercises.length;
  // Считаем завершенные упражнения на основе статистики (есть правильные ответы)
  const completedExercises = exercisesStats.filter(
    (stat) => stat.is_completed
  ).length;
  const totalAttempts = exercisesStats.reduce(
    (sum, stat) => sum + stat.total_attempts,
    0
  );
  const correctAttempts = exercisesStats.reduce(
    (sum, stat) => sum + stat.correct_attempts,
    0
  );

  return {
    homework,
    student,
    exercises_stats: exercisesStats,
    overall_progress: {
      total_exercises: totalExercises,
      completed_exercises: completedExercises,
      completion_percentage: calculateProgressPercentage(
        totalExercises,
        completedExercises
      ),
      total_attempts: totalAttempts,
      correct_attempts: correctAttempts,
      accuracy_percentage:
        totalAttempts > 0
          ? Math.round((correctAttempts / totalAttempts) * 100)
          : 0,
    },
  };
}

/**
 * Проверяет, есть ли изменения в списке упражнений
 */
export function hasExerciseChanges(
  original: string[],
  current: string[]
): boolean {
  const originalSorted = [...original].sort();
  const currentSorted = [...current].sort();
  return JSON.stringify(originalSorted) !== JSON.stringify(currentSorted);
}

/**
 * Валидирует список упражнений
 */
export function validateExercises(exercises: string[]): {
  isValid: boolean;
  error?: string;
} {
  if (!Array.isArray(exercises)) {
    return { isValid: false, error: 'Упражнения должны быть массивом' };
  }

  if (exercises.length === 0) {
    return {
      isValid: false,
      error: 'Необходимо выбрать хотя бы одно упражнение',
    };
  }

  if (exercises.some((id) => typeof id !== 'string' || id.trim() === '')) {
    return {
      isValid: false,
      error: 'Все ID упражнений должны быть непустыми строками',
    };
  }

  return { isValid: true };
}

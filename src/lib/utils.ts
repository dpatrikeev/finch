import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type {
  AnswerRecord,
  ExerciseStatus,
  HomeworkItem,
  HomeworkWithProgress,
} from '$lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any }
  ? Omit<T, 'children'>
  : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};

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

function isHomeworkCompleted(
  totalExercises: number,
  completedExercises: number
): boolean {
  return totalExercises > 0 && completedExercises === totalExercises;
}

function calculateProgressPercentage(
  totalExercises: number,
  completedExercises: number
): number {
  if (totalExercises === 0) return 0;
  return Math.round((completedExercises / totalExercises) * 100);
}

function calculateExerciseStatus(
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

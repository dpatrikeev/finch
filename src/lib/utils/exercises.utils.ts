import type { ExerciseStatus } from '$lib/types/exercises.types';

/**
 * Возвращает текст статуса упражнения
 */
export function getExerciseStatusText(status?: ExerciseStatus): string {
  if (!status?.completed) {
    return 'Не решено';
  }

  return status.completed ? 'Решено' : 'Ошибка';
}

/**
 * Проверяет, является ли упражнение завершенным
 */
export function isExerciseCompleted(status?: ExerciseStatus): boolean {
  return status?.completed ?? false;
}

/**
 * Проверяет, правильно ли выполнено упражнение
 */
export function isExerciseCorrect(status?: ExerciseStatus): boolean {
  return status?.completed ?? false;
}

/**
 * Возвращает описание статуса для tooltip
 */
export function getExerciseStatusDescription(status?: ExerciseStatus): string {
  if (!status?.completed) {
    return 'Упражнение не выполнено';
  }

  return status.completed
    ? 'Упражнение выполнено правильно'
    : 'Упражнение выполнено с ошибками';
}

/**
 * Возвращает текст для кнопки в зависимости от статуса упражнения
 */
export function getExerciseButtonText(status?: ExerciseStatus): string {
  return isExerciseCompleted(status) ? 'Повторить' : 'Начать';
}

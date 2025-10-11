import type { ExerciseStatus } from '$lib/features/exercises/types';

/**
 * Возвращает текст статуса упражнения
 */
export function getExerciseStatusText(status?: ExerciseStatus): string {
  if (!status?.isCompleted) {
    return 'Не решено';
  }

  return status.isCompleted ? 'Решено' : 'Ошибка';
}

/**
 * Проверяет, является ли упражнение завершенным
 */
export function isExerciseCompleted(status?: ExerciseStatus): boolean {
  return status?.isCompleted ?? false;
}

/**
 * Проверяет, правильно ли выполнено упражнение
 */
export function isExerciseCorrect(status?: ExerciseStatus): boolean {
  return status?.isCompleted ?? false;
}

/**
 * Возвращает описание статуса для tooltip
 */
export function getExerciseStatusDescription(status?: ExerciseStatus): string {
  if (!status?.isCompleted) {
    return 'Упражнение не выполнено';
  }

  return status.isCompleted
    ? 'Упражнение выполнено правильно'
    : 'Упражнение выполнено с ошибками';
}

/**
 * Возвращает текст для кнопки в зависимости от статуса упражнения
 */
export function getExerciseButtonText(status?: ExerciseStatus): string {
  return isExerciseCompleted(status) ? 'Повторить' : 'Начать';
}

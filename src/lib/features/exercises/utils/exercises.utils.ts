import type { ExerciseStatus, AnswerHistory } from '../types/exercises.types';

/**
 * Определяет статус упражнения на основе истории ответов
 */
export function getExerciseStatus(
  answersHistory: AnswerHistory[],
  exerciseId: string
): ExerciseStatus | undefined {
  const exerciseAnswers = answersHistory.filter(
    (answer) => answer.exercise_id === exerciseId
  );

  if (exerciseAnswers.length === 0) {
    return undefined;
  }

  // Берем последний ответ (самый свежий)
  const latestAnswer = exerciseAnswers[0]; // История уже отсортирована по убыванию даты

  return {
    isCompleted: true,
    isCorrect: latestAnswer.is_correct,
  };
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
  return status?.isCorrect ?? false;
}

/**
 * Возвращает текст для кнопки в зависимости от статуса упражнения
 */
export function getExerciseButtonText(status?: ExerciseStatus): string {
  return isExerciseCompleted(status) ? 'Повторить' : 'Начать';
}

/**
 * Возвращает текст статуса упражнения
 */
export function getExerciseStatusText(status?: ExerciseStatus): string {
  if (!status?.isCompleted) {
    return 'Не решено';
  }

  return status.isCorrect ? 'Решено' : 'Ошибка';
}

/**
 * Возвращает описание статуса для tooltip
 */
export function getExerciseStatusDescription(status?: ExerciseStatus): string {
  if (!status?.isCompleted) {
    return 'Упражнение не выполнено';
  }

  return status.isCorrect
    ? 'Упражнение выполнено правильно'
    : 'Упражнение выполнено с ошибками';
}

/**
 * Фильтрует историю ответов по ID упражнения
 */
export function filterAnswersByExercise(
  answersHistory: AnswerHistory[],
  exerciseId: string
): AnswerHistory[] {
  return answersHistory.filter((answer) => answer.exercise_id === exerciseId);
}

/**
 * Проверяет валидность данных ответа
 */
export function validateAnswerData(
  selectedAnswerId: unknown,
  isCorrect: unknown
): boolean {
  return (
    typeof selectedAnswerId === 'string' &&
    selectedAnswerId.length > 0 &&
    typeof isCorrect === 'boolean'
  );
}

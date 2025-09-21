/**
 * Проверяет, является ли выбранный ответ правильным
 * @param selectedAnswerId - ID выбранного ответа
 * @param correctAnswerId - ID правильного ответа
 * @returns true если ответ правильный
 */
export function isCorrectAnswer(
  selectedAnswerId: string,
  correctAnswerId: string
): boolean {
  return selectedAnswerId === correctAnswerId;
}

/**
 * Форматирует дату для отображения в истории ответов
 * @param dateString - строка с датой
 * @returns отформатированная строка даты
 */
export function formatAnswerDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Получает статистику по ответам пользователя
 * @param answersHistory - история ответов
 * @returns объект со статистикой
 */
export function getAnswerStats(answersHistory: Array<{ is_correct: boolean }>) {
  const total = answersHistory.length;
  const correct = answersHistory.filter((answer) => answer.is_correct).length;
  const incorrect = total - correct;
  const successRate = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    total,
    correct,
    incorrect,
    successRate,
  };
}

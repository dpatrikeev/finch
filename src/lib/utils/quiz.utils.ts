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

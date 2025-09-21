import { describe, it, expect } from 'vitest';

/**
 * Тесты для логики состояния Quiz компонента
 * Эти тесты проверяют чистые функции и логику без UI
 */

// Симулируем логику состояния Quiz как отдельные функции для тестирования
class QuizState {
  private submittedAnswers = new Set<string>();
  private hasInitialAnswer = false;

  constructor(hasInitialAnswer = false) {
    this.hasInitialAnswer = hasInitialAnswer;
  }

  /**
   * Проверяет, можно ли отправить ответ
   */
  canSubmitAnswer(exerciseId: string, selectedOption: string): boolean {
    const answerKey = `${exerciseId}-${selectedOption}`;
    return !this.hasInitialAnswer && !this.submittedAnswers.has(answerKey);
  }

  /**
   * Отмечает ответ как отправленный
   */
  markAnswerAsSubmitted(exerciseId: string, selectedOption: string): void {
    const answerKey = `${exerciseId}-${selectedOption}`;
    this.submittedAnswers.add(answerKey);
  }

  /**
   * Сбрасывает состояние викторины (кроме отправленных ответов)
   */
  resetQuiz(): void {
    this.hasInitialAnswer = false;
    // НЕ очищаем submittedAnswers
  }

  /**
   * Получает количество отправленных ответов
   */
  getSubmittedAnswersCount(): number {
    return this.submittedAnswers.size;
  }

  /**
   * Проверяет, был ли конкретный ответ уже отправлен
   */
  isAnswerSubmitted(exerciseId: string, selectedOption: string): boolean {
    const answerKey = `${exerciseId}-${selectedOption}`;
    return this.submittedAnswers.has(answerKey);
  }

  /**
   * Удаляет ответ из отправленных (используется при ошибках)
   */
  removeSubmittedAnswer(exerciseId: string, selectedOption: string): void {
    const answerKey = `${exerciseId}-${selectedOption}`;
    this.submittedAnswers.delete(answerKey);
  }
}

describe('Quiz State Logic', () => {
  describe('canSubmitAnswer', () => {
    it('should allow submission for new user without initial answer', () => {
      const state = new QuizState(false);

      expect(state.canSubmitAnswer('exercise-1', 'option-1')).toBe(true);
    });

    it('should not allow submission if user has initial answer', () => {
      const state = new QuizState(true);

      expect(state.canSubmitAnswer('exercise-1', 'option-1')).toBe(false);
    });

    it('should not allow duplicate submission of same answer', () => {
      const state = new QuizState(false);

      // First submission should be allowed
      expect(state.canSubmitAnswer('exercise-1', 'option-1')).toBe(true);

      // Mark as submitted
      state.markAnswerAsSubmitted('exercise-1', 'option-1');

      // Second submission should be blocked
      expect(state.canSubmitAnswer('exercise-1', 'option-1')).toBe(false);
    });

    it('should allow submission of different answer for same exercise', () => {
      const state = new QuizState(false);

      // Submit first answer
      state.markAnswerAsSubmitted('exercise-1', 'option-1');
      expect(state.canSubmitAnswer('exercise-1', 'option-1')).toBe(false);

      // Different answer should be allowed
      expect(state.canSubmitAnswer('exercise-1', 'option-2')).toBe(true);
    });

    it('should allow same answer for different exercises', () => {
      const state = new QuizState(false);

      // Submit answer for first exercise
      state.markAnswerAsSubmitted('exercise-1', 'option-1');
      expect(state.canSubmitAnswer('exercise-1', 'option-1')).toBe(false);

      // Same answer for different exercise should be allowed
      expect(state.canSubmitAnswer('exercise-2', 'option-1')).toBe(true);
    });
  });

  describe('resetQuiz', () => {
    it('should reset hasInitialAnswer but preserve submitted answers', () => {
      const state = new QuizState(true);
      state.markAnswerAsSubmitted('exercise-1', 'option-1');

      expect(state.canSubmitAnswer('exercise-1', 'option-1')).toBe(false); // blocked by hasInitialAnswer

      state.resetQuiz();

      // Still blocked because answer was submitted, not because of hasInitialAnswer
      expect(state.canSubmitAnswer('exercise-1', 'option-1')).toBe(false);

      // But different answer should now be allowed
      expect(state.canSubmitAnswer('exercise-1', 'option-2')).toBe(true);
    });
  });

  describe('markAnswerAsSubmitted', () => {
    it('should correctly track submitted answers', () => {
      const state = new QuizState(false);

      expect(state.getSubmittedAnswersCount()).toBe(0);
      expect(state.isAnswerSubmitted('exercise-1', 'option-1')).toBe(false);

      state.markAnswerAsSubmitted('exercise-1', 'option-1');

      expect(state.getSubmittedAnswersCount()).toBe(1);
      expect(state.isAnswerSubmitted('exercise-1', 'option-1')).toBe(true);
      expect(state.isAnswerSubmitted('exercise-1', 'option-2')).toBe(false);
    });

    it('should handle multiple submissions correctly', () => {
      const state = new QuizState(false);

      state.markAnswerAsSubmitted('exercise-1', 'option-1');
      state.markAnswerAsSubmitted('exercise-1', 'option-2');
      state.markAnswerAsSubmitted('exercise-2', 'option-1');

      expect(state.getSubmittedAnswersCount()).toBe(3);

      // Try to submit duplicate
      state.markAnswerAsSubmitted('exercise-1', 'option-1');

      // Count should remain the same (Set prevents duplicates)
      expect(state.getSubmittedAnswersCount()).toBe(3);
    });
  });

  describe('answer key generation', () => {
    it('should generate unique keys for different exercise-option combinations', () => {
      const state = new QuizState(false);

      state.markAnswerAsSubmitted('exercise-1', 'option-1');
      state.markAnswerAsSubmitted('exercise-1', 'option-2');
      state.markAnswerAsSubmitted('exercise-2', 'option-1');

      // All combinations should be tracked separately
      expect(state.isAnswerSubmitted('exercise-1', 'option-1')).toBe(true);
      expect(state.isAnswerSubmitted('exercise-1', 'option-2')).toBe(true);
      expect(state.isAnswerSubmitted('exercise-2', 'option-1')).toBe(true);
      expect(state.isAnswerSubmitted('exercise-2', 'option-2')).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should allow retry after removing failed submission', () => {
      const state = new QuizState(false);

      // Mark as submitted (simulating start of submission)
      state.markAnswerAsSubmitted('exercise-1', 'option-1');
      expect(state.canSubmitAnswer('exercise-1', 'option-1')).toBe(false);

      // Remove after error (simulating submission failure)
      state.removeSubmittedAnswer('exercise-1', 'option-1');

      // Should be able to try again
      expect(state.canSubmitAnswer('exercise-1', 'option-1')).toBe(true);
    });

    it('should handle removal of non-existent answer gracefully', () => {
      const state = new QuizState(false);

      expect(() =>
        state.removeSubmittedAnswer('exercise-1', 'option-1')
      ).not.toThrow();
      expect(state.getSubmittedAnswersCount()).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings gracefully', () => {
      const state1 = new QuizState(false);
      const state2 = new QuizState(false);

      // Test that methods don't throw with empty strings
      expect(() => state1.canSubmitAnswer('', '')).not.toThrow();
      expect(() => state1.markAnswerAsSubmitted('', '')).not.toThrow();

      // Test submission logic with empty strings
      expect(state2.canSubmitAnswer('', '')).toBe(true);
      state2.markAnswerAsSubmitted('', '');
      expect(state2.canSubmitAnswer('', '')).toBe(false);
    });

    it('should handle special characters in IDs', () => {
      const state = new QuizState(false);
      const exerciseId = 'exercise-with-special-chars-123!@#';
      const optionId = 'option-with-special-chars-456$%^';

      expect(state.canSubmitAnswer(exerciseId, optionId)).toBe(true);
      state.markAnswerAsSubmitted(exerciseId, optionId);
      expect(state.canSubmitAnswer(exerciseId, optionId)).toBe(false);
    });
  });
});

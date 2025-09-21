import { fail } from '@sveltejs/kit';
import { createUpdateHomeworkProgressAction } from '$lib/features/homework/api';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Создает action для сохранения ответа на упражнение
 */
export function createSaveAnswerAction() {
  return async (event: RequestEvent) => {
    const { request, locals, params } = event;
    const auth = locals.auth();

    if (!auth.userId) {
      return fail(401, { error: 'Необходима авторизация' });
    }

    const formData = await request.formData();
    const selectedAnswerId = formData.get('selectedAnswerId') as string;
    const isCorrect = formData.get('isCorrect') === 'true';

    if (!selectedAnswerId) {
      return fail(400, { error: 'Не выбран ответ' });
    }

    try {
      // Обновляем прогресс домашки, если это упражнение является частью домашки
      // createUpdateHomeworkProgressAction уже сохраняет ответ в answers_history
      const updateAction = await createUpdateHomeworkProgressAction();
      const updateFormData = new FormData();
      updateFormData.set('exerciseId', params.exerciseId!);
      updateFormData.set('isCorrect', isCorrect.toString());
      updateFormData.set('userAnswer', selectedAnswerId);

      const mockRequest = {
        formData: () => Promise.resolve(updateFormData),
      } as Request;

      await updateAction({ request: mockRequest, locals } as any);

      return { success: true };
    } catch (err) {
      console.error('Unexpected error:', err);
      return fail(500, { error: 'Неожиданная ошибка' });
    }
  };
}

// Объект для удобного импорта
export const exerciseActions = {
  saveAnswer: createSaveAnswerAction(),
};

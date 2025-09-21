import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import type { Exercise } from '$lib/notation/types';
import { supabase } from '$lib/supabase';
import { formatISO } from 'date-fns';
import { createUpdateHomeworkProgressAction } from '$lib/features/homework/api';

export const load: PageServerLoad = async ({ fetch, params, locals }) => {
  const response = await fetch(`/exercises/${params.exerciseId}.json`);

  if (!response.ok) error(404, 'Упражнение с таким номером не найдено');

  const exercise: Exercise = await response.json();

  // Загружаем историю ответов для текущего пользователя и упражнения
  const auth = locals.auth();
  let answersHistory = [];

  if (auth.userId) {
    const { data, error: historyError } = await supabase(locals)
      .from('answers_history')
      .select('*')
      .eq('user_id', auth.userId)
      .eq('exercise_id', params.exerciseId)
      .order('answered_at', { ascending: false });

    if (!historyError && data) {
      answersHistory = data;
    }
  }

  return {
    exercise,
    answersHistory,
  };
};

export const actions: Actions = {
  saveAnswer: async ({ request, locals, params }) => {
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
      // Сохраняем ответ в историю
      const { error: saveError } = await supabase(locals)
        .from('answers_history')
        .insert({
          user_id: auth.userId,
          exercise_id: params.exerciseId,
          selected_answer_id: selectedAnswerId,
          is_correct: isCorrect,
          answered_at: formatISO(new Date()),
        });

      if (saveError) {
        console.error('Error saving answer:', saveError);
        return fail(500, { error: 'Ошибка при сохранении ответа' });
      }

      // Обновляем прогресс домашки, если это упражнение является частью домашки
      const updateAction = await createUpdateHomeworkProgressAction();
      const updateFormData = new FormData();
      updateFormData.set('exerciseId', params.exerciseId);
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
  },
};

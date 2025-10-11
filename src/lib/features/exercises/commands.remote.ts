import { command, getRequestEvent } from '$app/server';
import { supabase } from '$lib/server/database';
import { boolean, object, string } from 'valibot';
import { error } from '@sveltejs/kit';
import { getAnswersHistory, getExerciseStatus } from './queries.remote';

/**
 * Сохраняет ответ пользователя на упражнение
 */
export const saveAnswer = command(
  object({
    exerciseId: string(),
    selectedAnswerId: string(),
    isCorrect: boolean(),
  }),
  async ({ exerciseId, selectedAnswerId, isCorrect }) => {
    const { locals } = getRequestEvent();
    const auth = locals.auth();
    const userId = auth.userId as string;

    if (!userId) {
      throw error(401, 'Необходима авторизация');
    }

    const { data, error: insertError } = await supabase(locals)
      .from('answers_history')
      .insert({
        user_id: userId,
        exercise_id: exerciseId,
        selected_answer_id: selectedAnswerId,
        is_correct: isCorrect,
        answered_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error saving answer:', insertError);
      throw error(500, 'Ошибка при сохранении ответа');
    }

    // Обновляем связанные queries
    await getAnswersHistory(exerciseId).refresh();
    await getExerciseStatus(exerciseId).refresh();

    return { success: true, answer: data };
  }
);

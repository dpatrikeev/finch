import { command, getRequestEvent, prerender, query } from '$app/server';
import { supabase } from '$lib/server/database';
import type { Exercise, ExerciseAnswersHistory } from '$lib/types';
import { error } from '@sveltejs/kit';
import { boolean, object, string } from 'valibot';
import { getAuthorizedUser } from './user.remote';

export const getExercise = prerender(
  string(),
  async (exerciseId: string): Promise<Exercise> => {
    const { request } = getRequestEvent();
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const response = await fetch(`${baseUrl}/exercises/${exerciseId}.json`);

    if (!response.ok) {
      error(404, 'Упражнение с таким номером не найдено');
    }

    return await response.json();
  }
);

export const getAnswersHistory = query(
  string(),
  async (exerciseId: string): Promise<ExerciseAnswersHistory[]> => {
    const { locals } = getRequestEvent();
    const { userId } = await getAuthorizedUser();

    const query = supabase(locals)
      .from('answers_history')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .order('answered_at', { ascending: false });

    const { data, error: historyError } = await query;

    if (historyError) {
      console.error('Error loading answers history:', historyError);
      return [];
    }

    return data || [];
  }
);

export const saveAnswer = command(
  object({
    exerciseId: string(),
    selectedAnswerId: string(),
    isCorrect: boolean(),
  }),
  async ({ exerciseId, selectedAnswerId, isCorrect }) => {
    const { locals } = getRequestEvent();
    const { userId } = await getAuthorizedUser();

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

    // Обновляем историю ответов (статус обновится автоматически через зависимости)
    await getAnswersHistory(exerciseId).refresh();

    return { success: true, answer: data };
  }
);

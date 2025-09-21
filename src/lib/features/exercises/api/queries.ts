import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { BasicExercise, AnswerHistory } from '../types/exercises.types';
import type { QuizExercise } from '$lib/features/quiz';

/**
 * Загружает упражнение по ID
 */
export async function loadExercise(
  fetch: typeof globalThis.fetch,
  exerciseId: string
): Promise<QuizExercise> {
  const response = await fetch(`/exercises/${exerciseId}.json`);

  if (!response.ok) {
    error(404, 'Упражнение с таким номером не найдено');
  }

  return await response.json();
}

/**
 * Загружает историю ответов пользователя для упражнения
 */
export async function loadAnswersHistory(
  locals: App.Locals,
  userId: string,
  exerciseId?: string
): Promise<AnswerHistory[]> {
  const query = supabase(locals)
    .from('answers_history')
    .select('*')
    .eq('user_id', userId)
    .order('answered_at', { ascending: false });

  // Если передан exerciseId, фильтруем по нему
  if (exerciseId) {
    query.eq('exercise_id', exerciseId);
  }

  const { data, error: historyError } = await query;

  if (historyError) {
    console.error('Error loading answers history:', historyError);
    return [];
  }

  return data || [];
}

/**
 * Загружает данные для страницы упражнения
 */
export async function loadExercisePageData(
  fetch: typeof globalThis.fetch,
  locals: App.Locals,
  params: { exerciseId: string }
) {
  const exercise = await loadExercise(fetch, params.exerciseId);

  const auth = locals.auth();
  let answersHistory: AnswerHistory[] = [];

  if (auth.userId) {
    answersHistory = await loadAnswersHistory(
      locals,
      auth.userId,
      params.exerciseId
    );
  }

  return {
    exercise,
    answersHistory,
  };
}

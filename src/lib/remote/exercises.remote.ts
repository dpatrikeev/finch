import { command, getRequestEvent, query } from '$app/server';
import type { ExerciseInfo } from '$lib/types/students.types';
import { supabase } from '$lib/server/database';
import { boolean, object, string } from 'valibot';
import type {
  AnswerHistory,
  ExerciseStatus,
  QuizExercise,
} from '$lib/types/exercises.types';
import { error } from '@sveltejs/kit';

/**
 * Загружает доступные упражнения
 */
export const getExercises = query(async (): Promise<ExerciseInfo[]> => {
  const { locals } = getRequestEvent();

  const { data: exercises, error } = await supabase(locals)
    .from('exercises')
    .select('id, title, description')
    .order('id');

  if (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }

  return exercises || [];
});

/**
 * Получает статус выполнения конкретного упражнения для текущего пользователя
 */
export const getExerciseStatus = query(
  string(),
  async (exerciseId: string): Promise<ExerciseStatus> => {
    const { locals } = getRequestEvent();
    const auth = locals.auth();
    const userId = auth.userId as string;

    // Получаем последний ответ для конкретного упражнения
    const { data: lastAnswer } = await supabase(locals)
      .from('answers_history')
      .select('exercise_id, is_correct, answered_at')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .order('answered_at', { ascending: false })
      .limit(1)
      .single();

    if (!lastAnswer) {
      return {
        completed: false,
        is_correct: false,
      };
    }

    return {
      completed: true,
      is_correct: lastAnswer.is_correct,
    };
  }
);

/**
 * Загружает упражнение по ID
 */
export const getExercise = query(
  string(),
  async (exerciseId: string): Promise<QuizExercise> => {
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

/**
 * Загружает историю ответов пользователя для упражнения
 */
export const getAnswersHistory = query(
  string(),
  async (exerciseId: string): Promise<AnswerHistory[]> => {
    const { locals } = getRequestEvent();
    const auth = locals.auth();
    const userId = auth.userId as string;

    if (!userId) {
      return [];
    }

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

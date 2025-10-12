import { getRequestEvent, prerender, query } from '$app/server';
import { supabase } from '$lib/server/database';
import { string } from 'valibot';
import { error } from '@sveltejs/kit';

import type {
  ExerciseAnswersHistory,
  ExerciseStatus,
  QuizExercise,
  ExerciseInfo,
} from './types';

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
 * Загружает упражнения со статусом выполнения для текущего пользователя
 */
export const getExercisesWithStatus = query(
  async (): Promise<(ExerciseInfo & ExerciseStatus)[]> => {
    const { locals } = getRequestEvent();
    const auth = locals.auth();
    const userId = auth.userId as string;

    // Получаем все упражнения
    const { data: exercises, error: exercisesError } = await supabase(locals)
      .from('exercises')
      .select('id, title, description')
      .order('id');

    if (exercisesError) {
      console.error('Error fetching exercises:', exercisesError);
      return [];
    }

    if (!exercises || exercises.length === 0) {
      return [];
    }

    // Получаем последние ответы пользователя для всех упражнений одним запросом
    const { data: answers, error: answersError } = await supabase(locals)
      .from('answers_history')
      .select('exercise_id, is_correct, answered_at')
      .eq('user_id', userId)
      .order('answered_at', { ascending: false });

    if (answersError) {
      console.error('Error fetching answers:', answersError);
      // Возвращаем упражнения без статуса
      return exercises.map((ex) => ({
        ...ex,
        isCompleted: false,
        isCorrect: false,
      }));
    }

    // Создаем карту последних ответов по exercise_id
    const lastAnswersMap = new Map<string, { is_correct: boolean }>();
    (answers || []).forEach((answer) => {
      if (!lastAnswersMap.has(answer.exercise_id)) {
        lastAnswersMap.set(answer.exercise_id, {
          is_correct: answer.is_correct,
        });
      }
    });

    // Объединяем упражнения со статусами
    return exercises.map((ex) => {
      const lastAnswer = lastAnswersMap.get(ex.id);
      return {
        id: ex.id,
        title: ex.title,
        description: ex.description,
        isCompleted: !!lastAnswer,
        isCorrect: lastAnswer?.is_correct || false,
      };
    });
  }
);

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
        isCompleted: false,
        isCorrect: false,
      };
    }

    return {
      isCompleted: true,
      isCorrect: lastAnswer.is_correct,
    };
  }
);

/**
 * Загружает упражнение по ID
 */
export const getExercise = prerender(
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
  async (exerciseId: string): Promise<ExerciseAnswersHistory[]> => {
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

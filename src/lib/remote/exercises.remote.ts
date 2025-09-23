import { getRequestEvent, query } from '$app/server';
import type { ExerciseInfo } from '$lib/types/students.types';
import { supabase } from '$lib/server/database';

/**
 * Загружает доступные упражнения
 */
export const getExercises = query(async (): Promise<ExerciseInfo[]> => {
  const { locals } = getRequestEvent();

  try {
    const { data: exercises, error } = await supabase(locals)
      .from('exercises')
      .select('id, title, description')
      .order('id');

    if (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }

    return exercises || [];
  } catch (error) {
    console.error('Error in getExercises:', error);
    return [];
  }
});

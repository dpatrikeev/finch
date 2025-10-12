import { getRequestEvent, query } from '$app/server';
import { supabase } from '$lib/server/database';
import { createHomeworkWithProgress } from './utils';
import type { HomeworkWithProgress } from './types';

export const getHomeworkCount = query(async () => {
  const { locals } = getRequestEvent();
  const auth = locals.auth();
  const userId = auth.userId;

  if (!userId) {
    return 0;
  }

  const { data: homework, error } = await supabase(locals)
    .from('homework')
    .select('id')
    .eq('student_id', userId);

  if (error) {
    console.error('Error fetching new homework count:', error);
    return 0;
  }

  return homework?.length;
});

/**
 * Загружает домашние задания студента с прогрессом
 */
export const getStudentHomework = query(
  async (): Promise<HomeworkWithProgress[]> => {
    const { locals } = getRequestEvent();
    const auth = locals.auth();
    const userId = auth.userId;

    if (!userId) {
      return [];
    }

    const { data: homework, error: homeworkError } = await supabase(locals)
      .from('homework')
      .select('*')
      .eq('student_id', userId)
      .order('created_at', { ascending: false });

    if (homeworkError) {
      console.error('Error fetching homework:', homeworkError);
      return [];
    }

    if (!homework || homework.length === 0) {
      return [];
    }

    // Получаем записи ответов для всех упражнений
    const exerciseIds = homework.flatMap((hw) => hw.exercises);
    const { data: answerRecords, error: answersError } = await supabase(locals)
      .from('answers_history')
      .select('*')
      .in('exercise_id', exerciseIds)
      .eq('user_id', userId);

    if (answersError) {
      console.error('Error fetching answer records:', answersError);
    }

    // Создаем расширенные объекты с прогрессом
    return homework.map((hw) =>
      createHomeworkWithProgress(hw, answerRecords || [])
    );
  }
);

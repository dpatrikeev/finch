import { subDays, formatISO } from 'date-fns';
import { getRequestEvent, query } from '$app/server';
import { string } from 'valibot';
import { supabase } from '$lib/server/database';
import { createHomeworkWithProgress } from './utils';
import type { HomeworkWithProgress } from './types';

export const getHomeworkCount = query(string(), async (studentId: string) => {
  const { locals } = getRequestEvent();

  // Для простоты будем считать новыми все домашки за последние 24 часа
  const oneDayAgo = subDays(new Date(), 1);

  const { data: homework, error } = await supabase(locals)
    .from('homework')
    .select('id')
    .eq('student_id', studentId)
    .gte('created_at', formatISO(oneDayAgo));

  if (error) {
    console.error('Error fetching new homework count:', error);
    return 0;
  }

  return homework?.length || 0;
});

/**
 * Загружает домашние задания студента с прогрессом
 */
export const getStudentHomework = query(
  string(),
  async (studentId: string): Promise<HomeworkWithProgress[]> => {
    const { locals } = getRequestEvent();

    const { data: homework, error: homeworkError } = await supabase(locals)
      .from('homework')
      .select('*')
      .eq('student_id', studentId)
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
      .eq('user_id', studentId);

    if (answersError) {
      console.error('Error fetching answer records:', answersError);
    }

    // Создаем расширенные объекты с прогрессом
    return homework.map((hw) =>
      createHomeworkWithProgress(hw, answerRecords || [])
    );
  }
);

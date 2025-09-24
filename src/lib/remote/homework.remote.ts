import { subDays, formatISO } from 'date-fns';
import { command, getRequestEvent, query } from '$app/server';
import {
  array,
  minLength,
  number,
  object,
  pipe,
  string,
  integer,
} from 'valibot';
import { supabase } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import {
  createHomeworkWithProgress,
  validateExercises,
} from '$lib/utils/homework.utils';
import type { HomeworkWithProgress } from '$lib/types/homework.types';

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
 * Назначает домашнее задание студенту
 */
export const assignHomework = command(
  object({
    studentId: pipe(string(), minLength(1, 'ID студента обязателен')),
    exercises: pipe(
      array(string()),
      minLength(1, 'Необходимо выбрать хотя бы одно упражнение')
    ),
  }),
  async ({ studentId, exercises }) => {
    const { locals } = getRequestEvent();
    const auth = locals.auth();

    if (!auth.userId) {
      throw error(401, 'Необходима авторизация');
    }

    // Валидация упражнений
    const validation = validateExercises(exercises);
    if (!validation.isValid) {
      throw error(400, validation.error);
    }

    const { data, error: insertError } = await supabase(locals)
      .from('homework')
      .insert({
        teacher_id: auth.userId,
        student_id: studentId,
        exercises,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error assigning homework:', insertError);
      throw error(500, 'Ошибка при назначении домашнего задания');
    }

    // Обновляем связанные queries
    await getStudentHomework(studentId).refresh();

    return { success: true, homework: data };
  }
);

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

/**
 * Обновляет домашнее задание
 */
export const updateHomework = command(
  object({
    homeworkId: pipe(number(), integer()),
    exercises: pipe(
      array(string()),
      minLength(1, 'Необходимо выбрать хотя бы одно упражнение')
    ),
  }),
  async ({ homeworkId, exercises }) => {
    const { locals } = getRequestEvent();
    const auth = locals.auth();

    if (!auth.userId) {
      return { success: false, homework: null };
    }

    // Валидация упражнений
    const validation = validateExercises(exercises);
    if (!validation.isValid) {
      throw error(400, validation.error);
    }

    // Получаем homework для проверки прав и студента
    const { data: homework, error: fetchError } = await supabase(locals)
      .from('homework')
      .select('teacher_id, student_id')
      .eq('id', homeworkId)
      .single();

    if (fetchError || !homework || homework.teacher_id !== auth.userId) {
      throw error(403, 'Домашнее задание не найдено или не принадлежит вам');
    }

    const { data, error: updateError } = await supabase(locals)
      .from('homework')
      .update({ exercises })
      .eq('id', homeworkId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating homework:', updateError);
      throw error(500, 'Ошибка при обновлении домашнего задания');
    }

    // Обновляем связанные queries
    await getStudentHomework(homework.student_id).refresh();

    return { success: true, homework: data };
  }
);

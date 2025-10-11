import { command, getRequestEvent } from '$app/server';
import {
  array,
  integer,
  minLength,
  number,
  object,
  pipe,
  string,
} from 'valibot';
import { supabase } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import { validateExercises } from './utils';
import { getStudentHomework } from './queries.remote';

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

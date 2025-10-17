import { command, getRequestEvent, query } from '$app/server';
import { supabase } from '$lib/server/database';
import { array, minLength, object, pipe, string } from 'valibot';
import type {
  AnswerRecord,
  HomeworkItem,
  HomeworkWithProgress,
} from '$lib/types';
import { createHomeworkWithProgress, validateExercises } from '$lib/utils';
import { error } from '@sveltejs/kit';

export const getStudentHomeworkWithProgress = query(
  string(),
  async (studentId: string): Promise<HomeworkWithProgress[]> => {
    const { locals } = getRequestEvent();

    const { data: homework, error: homeworkError } = await supabase(locals)
      .from('homework')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: true });

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
      createHomeworkWithProgress(
        hw as HomeworkItem,
        (answerRecords as AnswerRecord[]) || []
      )
    );
  }
);

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

    try {
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

      // Обновляем домашку студента
      await getStudentHomeworkWithProgress(studentId).refresh();

      return { success: true, homework: data };
    } catch (err) {
      console.error('Error in assignHomework:', err);
      throw error(500, 'Внутренняя ошибка сервера');
    }
  }
);

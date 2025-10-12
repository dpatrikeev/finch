import { getRequestEvent, query } from '$app/server';
import { supabase } from '$lib/server/database';
import { clerkClient } from 'svelte-clerk/server';
import * as v from 'valibot';
import type {
  HomeworkWithProgress,
  HomeworkStats,
  AnswerRecord,
} from './types';
import { createHomeworkWithProgress, createHomeworkStats } from './utils';

/**
 * Загружает количество домашних заданий студента
 */
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

  return homework?.length || 0;
});

/**
 * Загружает домашние задания студента с прогрессом
 */
export const getStudentHomeworkWithProgress = query(
  v.string(),
  async (studentId: string): Promise<HomeworkWithProgress[]> => {
    const { locals } = getRequestEvent();

    try {
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
      const { data: answerRecords, error: answersError } = await supabase(
        locals
      )
        .from('answers_history')
        .select('*')
        .in('exercise_id', exerciseIds)
        .eq('user_id', studentId);

      if (answersError) {
        console.error('Error fetching answer records:', answersError);
      }

      // Создаем расширенные объекты с прогрессом
      return homework.map((hw) =>
        createHomeworkWithProgress(hw, (answerRecords as AnswerRecord[]) || [])
      );
    } catch (error) {
      console.error('Error in getStudentHomeworkWithProgress:', error);
      return [];
    }
  }
);

/**
 * Загружает домашние задания текущего пользователя
 */
export const getMyHomework = query(
  async (): Promise<HomeworkWithProgress[]> => {
    const { locals } = getRequestEvent();
    const auth = locals.auth();

    if (!auth.userId) {
      return [];
    }

    return await getStudentHomeworkWithProgress(auth.userId);
  }
);

/**
 * Загружает список доступных упражнений
 */
export const getAvailableExercises = query(
  async (): Promise<
    Array<{ id: string; title: string; description?: string | null }>
  > => {
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
      console.error('Error in getAvailableExercises:', error);
      return [];
    }
  }
);

/**
 * Получает информацию о текущем пользователе
 */
export const getCurrentUserInfo = query(async () => {
  const { locals } = getRequestEvent();
  const auth = locals.auth();
  const userId = auth.userId as string;

  if (!userId) return null;

  try {
    const user = await clerkClient.users.getUser(userId);

    // Получаем статистику пользователя
    const { data: answers } = await supabase(locals)
      .from('answers_history')
      .select('exercise_id, is_correct')
      .eq('user_id', userId);

    // Подсчитываем уникальные упражнения и правильные ответы
    const uniqueExercises = new Set(answers?.map((a) => a.exercise_id) || []);
    const correctAnswers = answers?.filter((a) => a.is_correct).length || 0;
    const totalExercises = uniqueExercises.size;

    return {
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.emailAddresses[0]?.emailAddress || '',
      imageUrl: user.imageUrl || '',
      totalExercises,
      correctAnswers,
      accuracy:
        totalExercises > 0
          ? Math.round((correctAnswers / totalExercises) * 100)
          : 0,
    };
  } catch (error) {
    console.error('Error fetching current user info:', error);
    return null;
  }
});

/**
 * Загружает статистику по конкретному домашнему заданию
 */
export const getHomeworkStats = query(
  v.object({
    homeworkId: v.pipe(v.number(), v.integer()),
    studentId: v.string(),
  }),
  async ({ homeworkId, studentId }): Promise<HomeworkStats | null> => {
    const { locals } = getRequestEvent();

    try {
      // Получаем домашнее задание
      const { data: homework, error: homeworkError } = await supabase(locals)
        .from('homework')
        .select('*')
        .eq('id', homeworkId)
        .eq('student_id', studentId)
        .maybeSingle();

      if (homeworkError) {
        console.error('Error fetching homework:', homeworkError);
        return null;
      }

      if (!homework) {
        return null;
      }

      // Получаем информацию о студенте через Clerk
      let student;
      try {
        const user = await clerkClient.users.getUser(studentId);
        student = {
          student_id: user.id,
          first_name: user.firstName || '',
          last_name: user.lastName || '',
          email: user.emailAddresses[0]?.emailAddress || '',
        };
      } catch (error) {
        console.error('Error fetching student:', error);
        return null;
      }

      // Получаем записи ответов
      const { data: answerRecords, error: answersError } = await supabase(
        locals
      )
        .from('answers_history')
        .select('*')
        .in('exercise_id', homework.exercises)
        .eq('user_id', studentId);

      if (answersError) {
        console.error('Error fetching answer records:', answersError);
      }

      return createHomeworkStats(
        homework,
        student,
        (answerRecords as AnswerRecord[]) || []
      );
    } catch (error) {
      console.error('Error in getHomeworkStats:', error);
      return null;
    }
  }
);

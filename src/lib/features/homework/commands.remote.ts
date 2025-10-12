import { command, getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { supabase } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import { validateExercises } from './utils';
import {
  getStudentHomeworkWithProgress,
  getMyHomework,
  getHomeworkStats,
} from './queries.remote';
import type { HomeworkItem } from './types';

/**
 * Назначает домашнее задание студенту
 */
export const assignHomework = command(
  v.object({
    studentId: v.pipe(v.string(), v.minLength(1, 'ID студента обязателен')),
    exercises: v.pipe(
      v.array(v.string()),
      v.minLength(1, 'Необходимо выбрать хотя бы одно упражнение')
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

      // Обновляем связанные queries
      await getStudentHomeworkWithProgress(studentId).refresh();
      await getMyHomework().refresh();

      return { success: true, homework: data };
    } catch (err) {
      console.error('Error in assignHomework:', err);
      throw error(500, 'Внутренняя ошибка сервера');
    }
  }
);

/**
 * Назначает домашнее задание нескольким студентам
 */
export const assignHomeworkToMultiple = command(
  v.object({
    studentIds: v.pipe(
      v.array(v.string()),
      v.minLength(1, 'Необходимо выбрать хотя бы одного студента')
    ),
    exercises: v.pipe(
      v.array(v.string()),
      v.minLength(1, 'Необходимо выбрать хотя бы одно упражнение')
    ),
  }),
  async ({ studentIds, exercises }) => {
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
      const homeworkData = studentIds.map((studentId) => ({
        teacher_id: auth.userId,
        student_id: studentId,
        exercises,
      }));

      const { data, error: insertError } = await supabase(locals)
        .from('homework')
        .insert(homeworkData)
        .select();

      if (insertError) {
        console.error(
          'Error assigning homework to multiple students:',
          insertError
        );
        throw error(500, 'Ошибка при назначении домашних заданий');
      }

      // Обновляем queries для всех студентов
      for (const studentId of studentIds) {
        await getStudentHomeworkWithProgress(studentId).refresh();
      }
      await getMyHomework().refresh();

      return { success: true, homework: data };
    } catch (err) {
      console.error('Error in assignHomeworkToMultiple:', err);
      throw error(500, 'Внутренняя ошибка сервера');
    }
  }
);

/**
 * Обновляет домашнее задание
 */
export const updateHomework = command(
  v.object({
    homeworkId: v.pipe(v.number(), v.integer()),
    exercises: v.pipe(
      v.array(v.string()),
      v.minLength(1, 'Необходимо выбрать хотя бы одно упражнение')
    ),
  }),
  async ({ homeworkId, exercises }) => {
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
      await getStudentHomeworkWithProgress(homework.student_id).refresh();
      await getHomeworkStats({
        homeworkId,
        studentId: homework.student_id,
      }).refresh();

      return { success: true, homework: data };
    } catch (err) {
      console.error('Error in updateHomework:', err);
      throw error(500, 'Внутренняя ошибка сервера');
    }
  }
);

/**
 * Удаляет домашнее задание
 */
export const deleteHomework = command(
  v.pipe(v.number(), v.integer()),
  async (homeworkId: number) => {
    const { locals } = getRequestEvent();
    const auth = locals.auth();

    if (!auth.userId) {
      throw error(401, 'Необходима авторизация');
    }

    try {
      // Получаем homework для проверки прав и студента
      const { data: homework, error: fetchError } = await supabase(locals)
        .from('homework')
        .select('teacher_id, student_id')
        .eq('id', homeworkId)
        .single();

      if (fetchError || !homework || homework.teacher_id !== auth.userId) {
        throw error(403, 'Домашнее задание не найдено или не принадлежит вам');
      }

      const { error: deleteError } = await supabase(locals)
        .from('homework')
        .delete()
        .eq('id', homeworkId);

      if (deleteError) {
        console.error('Error deleting homework:', deleteError);
        throw error(500, 'Ошибка при удалении домашнего задания');
      }

      // Обновляем связанные queries
      await getStudentHomeworkWithProgress(homework.student_id).refresh();

      return { success: true, message: 'Домашнее задание успешно удалено!' };
    } catch (err) {
      console.error('Error in deleteHomework:', err);
      throw error(500, 'Внутренняя ошибка сервера');
    }
  }
);

/**
 * Обновляет прогресс выполнения домашнего задания
 */
export const updateHomeworkProgress = command(
  v.object({
    exerciseId: v.pipe(v.string(), v.minLength(1, 'ID упражнения обязателен')),
    isCorrect: v.boolean(),
    userAnswer: v.optional(v.string()),
  }),
  async ({ exerciseId, isCorrect, userAnswer }) => {
    const { locals } = getRequestEvent();
    const auth = locals.auth();

    if (!auth.userId) {
      throw error(401, 'Необходима авторизация');
    }

    try {
      // Записываем ответ
      const { error: answerError } = await supabase(locals)
        .from('answers_history')
        .insert({
          user_id: auth.userId,
          exercise_id: exerciseId,
          selected_answer_id: userAnswer || '',
          is_correct: isCorrect,
        });

      if (answerError) {
        console.error('Error recording answer:', answerError);
        throw error(500, 'Ошибка при записи ответа');
      }

      // Находим все домашние задания, содержащие это упражнение
      const { data: relevantHomework, error: homeworkError } = await supabase(
        locals
      )
        .from('homework')
        .select('*')
        .eq('student_id', auth.userId)
        .contains('exercises', [exerciseId]);

      if (homeworkError) {
        console.error('Error fetching relevant homework:', homeworkError);
        throw error(500, 'Ошибка при получении домашних заданий');
      }

      if (!relevantHomework || relevantHomework.length === 0) {
        return { success: true };
      }

      // Обновляем каждую релевантную домашку
      for (const hw of relevantHomework) {
        const updates: Partial<HomeworkItem> = {};

        // Если это первый ответ на любое упражнение в домашке, отмечаем started_at
        if (!hw.started_at) {
          updates.started_at = new Date().toISOString();
        }

        // Обновляем exercises_completed если ответ правильный
        if (isCorrect) {
          const currentCompleted = hw.exercises_completed || [];
          if (!currentCompleted.includes(exerciseId)) {
            updates.exercises_completed = [...currentCompleted, exerciseId];
          }

          // Проверяем, завершена ли вся домашка
          const allExercisesCompleted = hw.exercises.every((ex: string) =>
            [...currentCompleted, exerciseId].includes(ex)
          );

          if (allExercisesCompleted && !hw.completed_at) {
            updates.completed_at = new Date().toISOString();
          }
        }

        // Обновляем счетчики попыток
        updates.total_attempts = (hw.total_attempts || 0) + 1;
        if (isCorrect) {
          updates.correct_attempts = (hw.correct_attempts || 0) + 1;
        }

        // Применяем обновления
        if (Object.keys(updates).length > 0) {
          await supabase(locals)
            .from('homework')
            .update(updates)
            .eq('id', hw.id);
        }
      }

      // Обновляем связанные queries
      await getMyHomework().refresh();

      return { success: true };
    } catch (err) {
      console.error('Error in updateHomeworkProgress:', err);
      throw error(500, 'Внутренняя ошибка сервера');
    }
  }
);

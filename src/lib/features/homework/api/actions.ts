import { supabase } from '$lib/supabase';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { formatISO } from 'date-fns';
import type { HomeworkItem } from '../types/homework.types';
import { validateExercises } from '../utils/homework.utils';

/**
 * Назначает домашнее задание студенту
 */
export async function createAssignHomeworkAction() {
  return async (event: RequestEvent) => {
    const { request, locals } = event;
    const formData = await request.formData();

    const studentId = formData.get('studentId') as string;
    const exercisesJson = formData.get('exercises') as string;

    if (!studentId) {
      return fail(400, { error: 'ID студента обязателен' });
    }

    if (!exercisesJson) {
      return fail(400, { error: 'Список упражнений обязателен' });
    }

    let exercises: string[];
    try {
      exercises = JSON.parse(exercisesJson);
    } catch {
      return fail(400, { error: 'Неверный формат списка упражнений' });
    }

    // Валидация упражнений
    const validation = validateExercises(exercises);
    if (!validation.isValid) {
      return fail(400, { error: validation.error });
    }

    // Получаем информацию о текущем пользователе
    const auth = locals.auth();
    if (!auth.userId) {
      return fail(401, { error: 'Необходима авторизация' });
    }

    try {
      const { data, error } = await supabase(locals)
        .from('homework')
        .insert({
          teacher_id: auth.userId,
          student_id: studentId,
          exercises,
        })
        .select()
        .single();

      if (error) {
        console.error('Error assigning homework:', error);
        return fail(500, { error: 'Ошибка при назначении домашнего задания' });
      }

      return { success: true, homework: data };
    } catch (error) {
      console.error('Error in assignHomework:', error);
      return fail(500, { error: 'Внутренняя ошибка сервера' });
    }
  };
}

/**
 * Назначает домашнее задание нескольким студентам
 */
export async function createAssignHomeworkToMultipleStudentsAction() {
  return async (event: RequestEvent) => {
    const { request, locals } = event;
    const formData = await request.formData();

    const studentIdsJson = formData.get('studentIds') as string;
    const exercisesJson = formData.get('exercises') as string;

    if (!studentIdsJson) {
      return fail(400, { error: 'Список студентов обязателен' });
    }

    if (!exercisesJson) {
      return fail(400, { error: 'Список упражнений обязателен' });
    }

    let studentIds: string[];
    let exercises: string[];

    try {
      studentIds = JSON.parse(studentIdsJson);
      exercises = JSON.parse(exercisesJson);
    } catch {
      return fail(400, { error: 'Неверный формат данных' });
    }

    // Валидация
    const validation = validateExercises(exercises);
    if (!validation.isValid) {
      return fail(400, { error: validation.error });
    }

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return fail(400, { error: 'Необходимо выбрать хотя бы одного студента' });
    }

    const auth = locals.auth();
    if (!auth.userId) {
      return fail(401, { error: 'Необходима авторизация' });
    }

    try {
      const homeworkData = studentIds.map((studentId) => ({
        teacher_id: auth.userId,
        student_id: studentId,
        exercises,
      }));

      const { data, error } = await supabase(locals)
        .from('homework')
        .insert(homeworkData)
        .select();

      if (error) {
        console.error('Error assigning homework to multiple students:', error);
        return fail(500, { error: 'Ошибка при назначении домашних заданий' });
      }

      return { success: true, homework: data };
    } catch (error) {
      console.error('Error in assignHomeworkToMultipleStudents:', error);
      return fail(500, { error: 'Внутренняя ошибка сервера' });
    }
  };
}

/**
 * Обновляет домашнее задание
 */
export async function createUpdateHomeworkAction() {
  return async (event: RequestEvent) => {
    const { request, locals, params } = event;
    const formData = await request.formData();

    const homeworkId = parseInt(params.homeworkId as string);
    const exercisesJson = formData.get('exercises') as string;

    if (isNaN(homeworkId)) {
      return fail(400, { error: 'Неверный ID домашнего задания' });
    }

    if (!exercisesJson) {
      return fail(400, { error: 'Список упражнений обязателен' });
    }

    let exercises: string[];
    try {
      exercises = JSON.parse(exercisesJson);
    } catch {
      return fail(400, { error: 'Неверный формат списка упражнений' });
    }

    // Валидация упражнений
    const validation = validateExercises(exercises);
    if (!validation.isValid) {
      return fail(400, { error: validation.error });
    }

    try {
      const { data, error } = await supabase(locals)
        .from('homework')
        .update({ exercises })
        .eq('id', homeworkId)
        .select()
        .single();

      if (error) {
        console.error('Error updating homework:', error);
        return fail(500, { error: 'Ошибка при обновлении домашнего задания' });
      }

      return { success: true, homework: data };
    } catch (error) {
      console.error('Error in updateHomework:', error);
      return fail(500, { error: 'Внутренняя ошибка сервера' });
    }
  };
}

/**
 * Удаляет домашнее задание
 */
export async function createDeleteHomeworkAction() {
  return async (event: RequestEvent) => {
    const { locals, params } = event;

    const homeworkId = parseInt(params.homeworkId as string);

    if (isNaN(homeworkId)) {
      return fail(400, { error: 'Неверный ID домашнего задания' });
    }

    try {
      const { error } = await supabase(locals)
        .from('homework')
        .delete()
        .eq('id', homeworkId);

      if (error) {
        console.error('Error deleting homework:', error);
        return fail(500, { error: 'Ошибка при удалении домашнего задания' });
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteHomework:', error);
      return fail(500, { error: 'Внутренняя ошибка сервера' });
    }
  };
}

/**
 * Обновляет прогресс выполнения домашнего задания
 */
export async function createUpdateHomeworkProgressAction() {
  return async (event: RequestEvent) => {
    const { request, locals } = event;
    const formData = await request.formData();

    const exerciseId = formData.get('exerciseId') as string;
    const isCorrect = formData.get('isCorrect') === 'true';
    const userAnswer = formData.get('userAnswer') as string;

    if (!exerciseId) {
      return fail(400, { error: 'ID упражнения обязателен' });
    }

    const auth = locals.auth();
    if (!auth.userId) {
      return fail(401, { error: 'Необходима авторизация' });
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
          answered_at: formatISO(new Date()),
        });

      if (answerError) {
        console.error('Error recording answer:', answerError);
        return fail(500, { error: 'Ошибка при записи ответа' });
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
        return fail(500, { error: 'Ошибка при получении домашних заданий' });
      }

      if (!relevantHomework || relevantHomework.length === 0) {
        return { success: true };
      }

      // Обновляем каждую релевантную домашку
      for (const hw of relevantHomework) {
        const updates: Partial<HomeworkItem> = {};

        // Если это первый ответ на любое упражнение в домашке, отмечаем started_at
        if (!hw.started_at) {
          updates.started_at = formatISO(new Date());
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
            updates.completed_at = formatISO(new Date());
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

      return { success: true };
    } catch (error) {
      console.error('Error in updateHomeworkProgress:', error);
      return fail(500, { error: 'Внутренняя ошибка сервера' });
    }
  };
}

// Экспорт всех actions для удобного использования
export const homeworkActions = {
  assignHomework: createAssignHomeworkAction(),
  assignHomeworkToMultipleStudents:
    createAssignHomeworkToMultipleStudentsAction(),
  updateHomework: createUpdateHomeworkAction(),
  deleteHomework: createDeleteHomeworkAction(),
  updateHomeworkProgress: createUpdateHomeworkProgressAction(),
};

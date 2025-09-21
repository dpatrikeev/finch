import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { getTeacherStudents } from '$lib/utils/user';
import { supabase } from '$lib/supabase';
import { clerkClient } from 'svelte-clerk/server';
import type { HomeworkStats } from '$lib/features/homework/types/homework.types';
import { createHomeworkStats } from '$lib/features/homework/utils/homework.utils';

async function loadHomeworkStats(
  locals: App.Locals,
  homeworkId: number,
  studentId: string
): Promise<HomeworkStats | null> {
  try {
    // Получаем домашнее задание
    const { data: homework, error: homeworkError } = await supabase(locals)
      .from('homework')
      .select('*')
      .eq('id', homeworkId)
      .eq('student_id', studentId)
      .single();

    if (homeworkError || !homework) {
      console.error('Error fetching homework:', homeworkError);
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
    const { data: answerRecords, error: answersError } = await supabase(locals)
      .from('answers_history')
      .select('*')
      .in('exercise_id', homework.exercises)
      .eq('user_id', studentId);

    if (answersError) {
      console.error('Error fetching answer records:', answersError);
    }

    return createHomeworkStats(homework, student, answerRecords || []);
  } catch (error) {
    console.error('Error in loadHomeworkStats:', error);
    return null;
  }
}

export const load: PageServerLoad = async ({ params, locals }) => {
  const auth = locals.auth();

  if (!auth.userId) {
    error(401, 'Необходима авторизация');
  }

  const studentId = params.studentId;
  const homeworkId = parseInt(params.homeworkId);

  if (isNaN(homeworkId)) {
    error(404, 'Неверный ID домашнего задания');
  }

  // Проверяем, что студент принадлежит этому учителю
  const students = await getTeacherStudents(locals);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    error(404, 'Студент не найден или не принадлежит вам');
  }

  // Получаем статистику по домашке
  const stats = await loadHomeworkStats(locals, homeworkId, studentId);

  if (!stats) {
    error(404, 'Домашнее задание не найдено');
  }

  // Получаем список всех доступных упражнений для редактирования
  const { data: exercises, error: exercisesError } = await supabase(locals)
    .from('exercises')
    .select('id, title, description')
    .order('id');

  if (exercisesError) {
    console.error('Error fetching exercises:', exercisesError);
  }

  return {
    student,
    stats,
    exercises: exercises || [],
  };
};

export const actions: Actions = {
  updateHomework: async ({ request, params, locals }) => {
    const auth = locals.auth();

    if (!auth.userId) {
      return fail(401, { error: 'Необходима авторизация' });
    }

    const studentId = params.studentId;
    const homeworkId = parseInt(params.homeworkId);

    if (isNaN(homeworkId)) {
      return fail(400, { error: 'Неверный ID домашнего задания' });
    }

    const formData = await request.formData();
    const selectedExercises = JSON.parse(
      formData.get('exercises') as string
    ) as string[];

    if (selectedExercises.length === 0) {
      return fail(400, { error: 'Необходимо выбрать хотя бы одно упражнение' });
    }

    try {
      // Проверяем, что домашка принадлежит этому учителю
      const { data: homework, error: fetchError } = await supabase(locals)
        .from('homework')
        .select('teacher_id')
        .eq('id', homeworkId)
        .eq('student_id', studentId)
        .single();

      if (fetchError || !homework || homework.teacher_id !== auth.userId) {
        return fail(403, {
          error: 'Домашнее задание не найдено или не принадлежит вам',
        });
      }

      // Обновляем упражнения в домашке
      const { error: updateError } = await supabase(locals)
        .from('homework')
        .update({ exercises: selectedExercises })
        .eq('id', homeworkId);

      if (updateError) {
        console.error('Error updating homework:', updateError);
        return fail(500, { error: 'Ошибка при обновлении домашнего задания' });
      }

      return { success: true, message: 'Домашнее задание успешно обновлено!' };
    } catch (error) {
      console.error('Error in updateHomework:', error);
      return fail(500, {
        error: 'Неожиданная ошибка при обновлении домашнего задания',
      });
    }
  },

  deleteHomework: async ({ params, locals }) => {
    const auth = locals.auth();

    if (!auth.userId) {
      return fail(401, { error: 'Необходима авторизация' });
    }

    const studentId = params.studentId;
    const homeworkId = parseInt(params.homeworkId);

    if (isNaN(homeworkId)) {
      return fail(400, { error: 'Неверный ID домашнего задания' });
    }

    try {
      // Проверяем, что домашка принадлежит этому учителю
      const { data: homework, error: fetchError } = await supabase(locals)
        .from('homework')
        .select('teacher_id')
        .eq('id', homeworkId)
        .eq('student_id', studentId)
        .single();

      if (fetchError || !homework || homework.teacher_id !== auth.userId) {
        return fail(403, {
          error: 'Домашнее задание не найдено или не принадлежит вам',
        });
      }

      // Удаляем домашку
      const { error: deleteError } = await supabase(locals)
        .from('homework')
        .delete()
        .eq('id', homeworkId);

      if (deleteError) {
        console.error('Error deleting homework:', deleteError);
        return fail(500, { error: 'Ошибка при удалении домашнего задания' });
      }

      return {
        success: true,
        message: 'Домашнее задание успешно удалено!',
        redirect: true,
      };
    } catch (error) {
      console.error('Error in deleteHomework:', error);
      return fail(500, {
        error: 'Неожиданная ошибка при удалении домашнего задания',
      });
    }
  },
};

import type { PageServerLoad, Actions } from './$types';
import { getTeacherStudents } from '$lib/utils/user';
import { assignHomeworkToStudent } from '$lib/utils/teacher-homework';
import { supabase } from '$lib/supabase';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const students = await getTeacherStudents(locals);

  // Получаем список доступных упражнений
  const { data: exercises, error } = await supabase(locals)
    .from('exercises')
    .select('id, title, description')
    .order('id');

  if (error) {
    console.error('Error fetching exercises:', error);
  }

  return {
    students,
    exercises: exercises || [],
  };
};

export const actions: Actions = {
  assignHomework: async ({ request, locals }) => {
    const auth = locals.auth();

    if (!auth.userId) {
      return fail(401, { error: 'Необходима авторизация' });
    }

    const formData = await request.formData();
    const studentId = formData.get('studentId') as string;
    const exercisesJson = formData.get('exercises') as string;

    if (!studentId || !exercisesJson) {
      return fail(400, { error: 'Не указан студент или упражнения' });
    }

    let exercises: string[];
    try {
      exercises = JSON.parse(exercisesJson);
    } catch {
      return fail(400, { error: 'Неверный формат упражнений' });
    }

    if (exercises.length === 0) {
      return fail(400, { error: 'Не выбрано ни одного упражнения' });
    }

    // Проверяем, что студент принадлежит этому учителю
    const students = await getTeacherStudents(locals);
    const student = students.find((s) => s.id === studentId);

    if (!student) {
      return fail(403, { error: 'Студент не найден или не принадлежит вам' });
    }

    // Создаем домашнее задание
    const homework = await assignHomeworkToStudent(
      locals,
      auth.userId,
      studentId,
      exercises
    );

    if (!homework) {
      return fail(500, { error: 'Ошибка при создании домашнего задания' });
    }

    return {
      success: true,
      message: `Домашнее задание назначено студенту ${student.firstName} ${student.lastName}`,
      homeworkId: homework.id,
    };
  },
};

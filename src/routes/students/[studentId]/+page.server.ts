import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { getTeacherStudents } from '$lib/utils/user';
import { loadStudentHomework } from '$lib/features/homework';
import { assignHomeworkToStudent } from '$lib/utils/teacher-homework';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async ({ params, locals }) => {
  const auth = locals.auth();

  if (!auth.userId) {
    error(401, 'Необходима авторизация');
  }

  const studentId = params.studentId;

  // Проверяем, что студент принадлежит этому учителю
  const students = await getTeacherStudents(locals);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    error(404, 'Студент не найден или не принадлежит вам');
  }

  // Получаем домашки студента с прогрессом
  const homework = await loadStudentHomework(locals, studentId);

  // Получаем список доступных упражнений из базы данных
  const { data: exercises, error: exercisesError } = await supabase(locals)
    .from('exercises')
    .select('id, title, description')
    .order('id');

  if (exercisesError) {
    console.error('Error fetching exercises:', exercisesError);
  }

  return {
    student,
    homework,
    exercises: exercises || [],
    isTeacherView: true,
  };
};

export const actions: Actions = {
  assignHomework: async ({ request, params, locals }) => {
    const auth = locals.auth();

    if (!auth.userId) {
      return fail(401, { error: 'Необходима авторизация' });
    }

    const studentId = params.studentId;
    const formData = await request.formData();
    const exercisesJson = formData.get('exercises') as string;

    if (!exercisesJson) {
      return fail(400, { error: 'Не указаны упражнения' });
    }

    let exercises: string[];
    try {
      exercises = JSON.parse(exercisesJson);
    } catch (error) {
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

import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getTeacherStudents } from '$lib/utils/user';
import { getHomeworkWithProgress } from '$lib/utils/homework';

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
  const homework = await getHomeworkWithProgress(locals, studentId);

  return {
    student,
    homework,
    isTeacherView: true,
  };
};

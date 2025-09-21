import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import {
  loadStudentById,
  loadExercises,
  studentsActions,
} from '$lib/features/students/api';
import { loadStudentHomework } from '$lib/features/homework';

export const load: PageServerLoad = async ({ params, locals }) => {
  const auth = locals.auth();

  if (!auth.userId) {
    error(401, 'Необходима авторизация');
  }

  const studentId = params.studentId;

  const student = await loadStudentById(locals, studentId);
  if (!student) {
    error(404, 'Студент не найден или не принадлежит вам');
  }

  const [homework, exercises] = await Promise.all([
    loadStudentHomework(locals, studentId),
    loadExercises(locals),
  ]);

  return {
    student,
    homework,
    exercises,
    isTeacherView: true,
  };
};

export const actions: Actions = {
  assignHomework: studentsActions.assignHomework,
};

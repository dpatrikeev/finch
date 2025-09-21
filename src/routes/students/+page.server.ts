import type { PageServerLoad, Actions } from './$types';
import {
  loadTeacherStudents,
  loadExercises,
  studentsActions,
} from '$lib/features/students/api';

export const load: PageServerLoad = async ({ locals }) => {
  const [students, exercises] = await Promise.all([
    loadTeacherStudents(locals),
    loadExercises(locals),
  ]);

  return {
    students,
    exercises,
  };
};

export const actions: Actions = {
  assignHomework: studentsActions.assignHomework,
};

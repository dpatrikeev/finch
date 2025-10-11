import { getExercises } from '$lib/features/exercises/queries.remote';
import { getTeacherStudents } from '$lib/features/students/queries.remote';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const [students, exercises] = await Promise.all([
    getTeacherStudents(),
    getExercises(),
  ]);

  return {
    exercises,
    students,
  };
};

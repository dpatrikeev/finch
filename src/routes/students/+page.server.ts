import { getExercises } from '$lib/features/exercises';
import { getTeacherStudents } from '$lib/features/students';
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

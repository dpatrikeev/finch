import type { LayoutServerLoad } from './$types';
import { getExercises, getTeacherStudents } from '$lib/remote/students.remote';
import { getClerkUser } from '$lib/remote/user.remote';

export const load: LayoutServerLoad = async () => {
  const exercises = await getExercises();
  const studentIds = await getTeacherStudents();
  const students = await Promise.all(
    studentIds.map(({ student_id }) => getClerkUser(student_id))
  );

  return {
    exercises,
    studentIds,
    students,
  };
};

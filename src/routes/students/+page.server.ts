import type { PageServerLoad } from './$types';
import { getTeacherStudents } from '$lib/utils/user';

export const load: PageServerLoad = async ({ locals }) => {
  const students = await getTeacherStudents(locals);

  return {
    students,
  };
};

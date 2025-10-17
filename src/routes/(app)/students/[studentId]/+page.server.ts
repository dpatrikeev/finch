import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
  const { studentIds } = await parent();
  const { studentId } = params;

  const isValidStudentId = studentIds.some(
    (student) => student.student_id === studentId
  );

  if (!isValidStudentId) {
    error(404, 'Студент не найден');
  }

  return {
    studentId,
  };
};

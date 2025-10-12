import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  return {
    homeworkId: parseInt(params.homeworkId || '0'),
    studentId: params.studentId || '',
  };
};

import type { PageServerLoad } from './$types';
import { loadStudentHomework } from '$lib/features/homework';
import { getCurrentUserInfo } from '$lib/utils/user';

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { userId } = await parent();

  const [homeworkWithProgress, userInfo] = await Promise.all([
    loadStudentHomework(locals, userId),
    getCurrentUserInfo(locals),
  ]);

  return {
    homework: homeworkWithProgress,
    user: userInfo,
  };
};

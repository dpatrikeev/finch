import type { PageServerLoad } from './$types';
import { getHomeworkWithProgress } from '$lib/utils/homework';
import { getCurrentUserInfo } from '$lib/utils/user';

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { userId } = await parent();

  const [homeworkWithProgress, userInfo] = await Promise.all([
    getHomeworkWithProgress(locals, userId),
    getCurrentUserInfo(locals),
  ]);

  return {
    homework: homeworkWithProgress,
    user: userInfo,
  };
};

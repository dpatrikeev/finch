import type { PageServerLoad } from './$types';
import { getHomeworkWithProgress } from '$lib/utils/homework';

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { userId } = await parent();

  const homeworkWithProgress = await getHomeworkWithProgress(locals, userId);

  return {
    homework: homeworkWithProgress,
  };
};

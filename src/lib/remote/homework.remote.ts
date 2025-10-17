import { getRequestEvent, query } from '$app/server';
import type { HomeworkWithProgress } from '$lib/types';
import { getStudentHomeworkWithProgress } from '$lib/remote/student.remote';
import { getAuthorizedUser } from '$lib/remote/user.remote';

export const getMyHomework = query(
  async (): Promise<HomeworkWithProgress[]> => {
    const { userId } = await getAuthorizedUser();
    const homework = await getStudentHomeworkWithProgress(userId);

    return homework;
  }
);

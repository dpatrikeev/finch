import { buildClerkProps } from 'svelte-clerk/server';
import type { LayoutServerLoad } from './$types';
import { getUserRole } from '$lib/utils/user';
import { getNewHomeworkCount } from '$lib/utils/homework';

export const load: LayoutServerLoad = async ({ locals }) => {
  const auth = locals.auth();
  const userId = auth.userId as string;
  const role = await getUserRole(userId);

  const clerkProps = buildClerkProps(auth);
  const clerk = { ...clerkProps.initialState };

  // Получаем количество новых домашек для студентов
  let newHomeworkCount = 0;
  if (role === 'student' && userId) {
    newHomeworkCount = await getNewHomeworkCount(locals, userId);
  }

  return {
    clerk,
    role,
    newHomeworkCount,
  };
};

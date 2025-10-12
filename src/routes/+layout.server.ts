import { buildClerkProps } from 'svelte-clerk/server';
import { getUserRole } from '$lib/features/user';
import { getHomeworkCount } from '$lib/features/homework';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async ({ locals }: RequestEvent) => {
  const auth = locals.auth();
  const userId = auth.userId as string;
  const role = await getUserRole(userId);

  const clerkProps = buildClerkProps(auth);
  const clerk = { ...clerkProps.initialState };

  // Получаем количество новых домашек для студентов
  let newHomeworkCount = 0;
  if (role === 'student' && userId) {
    newHomeworkCount = await getHomeworkCount();
  }

  return {
    clerk,
    role,
    newHomeworkCount,
  };
};

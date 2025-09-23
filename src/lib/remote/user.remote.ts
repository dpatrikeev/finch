import { getRequestEvent, query } from '$app/server';
import { clerkClient } from 'svelte-clerk/server';
import { string } from 'valibot';

export type UserRole = 'teacher' | 'student';

export const getUserRole = query(string(), async (userId: string) => {
  if (!userId) return 'student';

  const user = await clerkClient.users.getUser(userId);

  return user.publicMetadata.role || 'student';
});

export const getUserId = query(async () => {
  const { locals } = getRequestEvent();
  const auth = locals.auth();

  return auth.userId as string;
});

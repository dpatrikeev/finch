import { getRequestEvent, query } from '$app/server';
import { clerkClient } from 'svelte-clerk/server';
import { string } from 'valibot';

export const getUserRole = query(string(), async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);

  return (user.publicMetadata as UserPublicMetadata).role || 'student';
});

export const getUserId = query(async () => {
  const { locals } = getRequestEvent();
  const auth = locals.auth();

  return auth.userId as string;
});

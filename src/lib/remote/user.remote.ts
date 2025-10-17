import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import { clerkClient } from 'svelte-clerk/server';
import { string } from 'valibot';
import type { BaseUser } from '$lib/types';

export const getClerkUser = query(
  string(),
  async (userId: string): Promise<BaseUser> => {
    const user = await clerkClient.users.getUser(userId);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      emailAddress: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
    };
  }
);

export const getUser = query(async () => {
  const { locals } = getRequestEvent();
  const auth = locals.auth();
  const userId = auth.userId;
  let userRole = null;

  if (userId) {
    const userMetadata = auth.sessionClaims?.metadata as UserPublicMetadata;
    userRole = userMetadata.role || 'student';
  }

  return {
    userId,
    userRole,
  };
});

export const getAuthorizedUser = query(async () => {
  const { userId, userRole } = await getUser();

  if (!userId) {
    throw error(401, 'Unauthorized');
  }

  return {
    userId,
    userRole,
  } as { userId: string; userRole: UserPublicMetadata['role'] };
});

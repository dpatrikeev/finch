import { withClerkHandler } from 'svelte-clerk/server';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';

import type { Handle } from '@sveltejs/kit';

const clerkHandler = withClerkHandler();

const publicPaths = new Set(['/']);

const authHandler: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;
  const auth = event.locals.auth();
  const userId = auth.userId;
  const isPublic = publicPaths.has(pathname);

  if (!userId && !isPublic) {
    redirect(302, '/');
  }

  return resolve(event);
};

const roleHandler: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;
  const auth = event.locals.auth();
  const userId = auth.userId;

  if (userId) {
    const userMetadata = auth.sessionClaims?.metadata as UserPublicMetadata;
    const userRole = userMetadata.role;

    if (pathname.startsWith('/homework') && userRole === 'teacher') {
      redirect(302, '/students');
    }

    if (pathname.startsWith('/students') && userRole === 'student') {
      redirect(302, '/homework');
    }
  }

  return resolve(event);
};

export const handle = sequence(clerkHandler, authHandler, roleHandler);

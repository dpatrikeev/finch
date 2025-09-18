import { withClerkHandler } from 'svelte-clerk/server';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { getUserRole } from '$lib/utils/user';
import type { Handle } from '@sveltejs/kit';

const clerkHandler = withClerkHandler();

const roleBasedHandler: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;
  const userId = event.locals.auth().userId as string;
  const userRole = await getUserRole(userId);

  // Проверяем защищенные маршруты
  if (pathname.startsWith('/my-students')) {
    if (userRole !== 'teacher') {
      redirect(302, '/');
    }
  }

  if (pathname.startsWith('/my-homework')) {
    if (userRole !== 'student') {
      redirect(302, '/');
    }
  }

  return resolve(event);
};

export const handle = sequence(clerkHandler, roleBasedHandler);

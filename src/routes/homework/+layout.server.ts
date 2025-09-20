import type { LayoutServerLoad } from './$types';
import { getUserRole } from '$lib/utils/user';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
  const auth = locals.auth();
  const userId = auth.userId as string;

  if (!userId) {
    redirect(302, '/');
  }

  const role = await getUserRole(userId);

  if (role !== 'student') {
    redirect(302, '/');
  }

  return {
    userId,
  };
};


import type { LayoutServerLoad } from './$types';
import { getUserRole } from '$lib/remote/user.remote';

export const load: LayoutServerLoad = async ({ locals }) => {
  const auth = locals.auth();
  const userId = auth.userId as string;
  const userRole = await getUserRole(userId);

  return {
    userRole,
    userId,
  };
};

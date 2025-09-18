import { buildClerkProps } from 'svelte-clerk/server';
import type { LayoutServerLoad } from './$types';
import { getUserRole } from '$lib/utils/user';

export const load: LayoutServerLoad = async ({ locals }) => {
  const auth = locals.auth();
  const userId = auth.userId as string;
  const role = await getUserRole(userId);

  const clerkProps = buildClerkProps(auth);
  const clerk = { ...clerkProps.initialState };

  return {
    clerk,
    role,
  };
};

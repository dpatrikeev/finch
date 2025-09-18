import { clerkClient } from 'svelte-clerk/server';

export const checkUserRole = async (locals: App.Locals) => {
  const { userId } = locals.auth();
  const user = await clerkClient.users.getUser(userId as string);

  return user.publicMetadata.role;
};

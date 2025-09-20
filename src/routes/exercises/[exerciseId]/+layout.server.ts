import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
  const auth = locals.auth();

  if (!auth.userId) {
    redirect(302, '/');
  }
};

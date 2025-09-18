import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';
import { checkUserRole } from '$lib/utils/user';

export const load: PageServerLoad = async ({ locals }) => {
  // const response = await fetch('/exercises.json');
  // const exercises = await response.json();

  const role = await checkUserRole(locals);
  const { data } = await supabase(locals).from('exercises').select();

  return {
    exercises: data ?? [],
    role,
  };
};

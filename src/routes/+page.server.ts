import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async ({ locals }) => {
  // const response = await fetch('/exercises.json');
  // const exercises = await response.json();

  const { data } = await supabase(locals).from('exercises').select();

  console.log('data', data);

  return {
    exercises: data ?? [],
  };
};

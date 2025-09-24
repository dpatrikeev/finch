import { getExercises } from '$lib/remote/exercises.remote';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const exercises = await getExercises();

  return {
    exercises,
  };
};

import { getExercisesWithStatus } from '$lib/features/exercises';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const exercises = await getExercisesWithStatus();

  return {
    exercises,
  };
};

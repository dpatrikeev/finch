import {
  getExercises,
  getExerciseStatus,
} from '$lib/features/exercises/queries.remote';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const exercises = await getExercises();
  const exercisesWithStatus = await Promise.all(
    exercises.map(async (exercise) => {
      const status = await getExerciseStatus(exercise.id);

      return {
        ...exercise,
        ...status,
      };
    })
  );

  return {
    exercises: exercisesWithStatus,
  };
};

import type { PageServerLoad } from './$types';
import { loadAnswersHistory, loadExercise } from '$lib/remote/exercises.remote';

export const load: PageServerLoad = async ({ params }) => {
  const exercise = await loadExercise(params.exerciseId);
  const answersHistory = await loadAnswersHistory(params.exerciseId);

  return {
    exercise,
    answersHistory,
  };
};

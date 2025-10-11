import type { PageServerLoad } from './$types';
import {
  getAnswersHistory,
  getExercise,
} from '$lib/features/exercises/queries.remote';

export const load: PageServerLoad = async ({ params }) => {
  const exercise = await getExercise(params.id);
  const answersHistory = await getAnswersHistory(params.id);

  return {
    exercise,
    answersHistory,
  };
};

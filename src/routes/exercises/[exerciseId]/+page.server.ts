import type { PageServerLoad, Actions } from './$types';
import { loadExercisePageData, exerciseActions } from '$lib/features/exercises';

export const load: PageServerLoad = async ({ fetch, params, locals }) => {
  return await loadExercisePageData(fetch, locals, params);
};

export const actions: Actions = {
  saveAnswer: exerciseActions.saveAnswer,
};

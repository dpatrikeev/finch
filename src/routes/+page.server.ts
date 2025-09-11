import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch('/exercises.json');
  const exercises = await response.json();

  return {
    exercises,
  };
};

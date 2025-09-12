import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Exercise } from '$lib/notation/types';

export const load: PageServerLoad = async ({ fetch, params }) => {
  const response = await fetch(`/exercises/${params.exercise}.json`);

  if (!response.ok) error(404, 'Упражнение с таким номером не найдено');

  const exercise: Exercise = await response.json();

  return { exercise };
};

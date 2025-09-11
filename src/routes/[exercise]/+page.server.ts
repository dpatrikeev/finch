import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params }) => {
  const response = await fetch(`/exercises/${params.exercise}.json`);

  if (!response.ok) error(404, 'Упражнение с таким номером не найдено');

  const data = await response.json();
  const { id, title, topic, measures } = data;

  return { id, title, topic, measures };
};

import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getUserRole } from '$lib/utils/user';

export const load: PageServerLoad = async ({ params, locals }) => {
  const auth = locals.auth();
  const userId = auth.userId as string;

  if (!userId) {
    error(401, 'Необходима авторизация');
  }

  const role = await getUserRole(userId);

  // Студенты больше не имеют доступа к детальной статистике
  // Перенаправляем их на основную страницу домашек
  if (role === 'student') {
    redirect(302, '/homework');
  }

  // Учителя не должны заходить на этот маршрут
  // У них есть свой маршрут /students/[studentId]/homework/[homeworkId]
  if (role === 'teacher') {
    redirect(302, '/students');
  }

  error(403, 'Доступ запрещен');
};

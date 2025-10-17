import { getRequestEvent, query } from '$app/server';
import type { NavigationItem } from '$lib/components';
import { supabase } from '$lib/server/database';
import { getAuthorizedUser } from '$lib/remote/user.remote';
import { string } from 'valibot';

export const getNavigation = query(async () => {
  const { userId, userRole } = await getAuthorizedUser();
  const navigation: NavigationItem[] = [];

  if (userRole === 'teacher') {
    navigation.push({
      href: '/students',
      label: 'Мои студенты',
    });
  }

  if (userRole === 'student') {
    navigation.push({
      href: '/homework',
      label: 'Моя домашка',
      badge: await getHomeworkCount(userId),
    });
  }

  return navigation;
});

export const getHomeworkCount = query(string(), async (userId: string) => {
  const { locals } = getRequestEvent();

  const { data: homework, error } = await supabase(locals)
    .from('homework')
    .select('id')
    .eq('student_id', userId);

  if (error) {
    console.error('Error fetching new homework count:', error);
    return 0;
  }

  return homework?.length || 0;
});

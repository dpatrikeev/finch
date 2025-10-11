import { BookOpenCheck, Users } from 'lucide-svelte';
import type { NavigationItem } from './types';

export function getNavigationItems(
  role: UserPublicMetadata['role']
): NavigationItem[] {
  const items: NavigationItem[] = [];

  if (role === 'teacher') {
    items.push({
      href: '/students',
      label: 'Мои студенты',
      icon: Users,
    });
  }

  if (role === 'student') {
    items.push({
      href: '/homework',
      label: 'Моя домашка',
      icon: BookOpenCheck,
    });
  }

  return items;
}

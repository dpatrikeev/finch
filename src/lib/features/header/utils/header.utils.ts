import type { UserRole } from '$lib/utils/user';
import type { NavigationItem } from '../types/header.types';

/**
 * Получает навигационные элементы для роли пользователя
 */
export function getNavigationItems(
  role: UserRole,
  newHomeworkCount = 0
): NavigationItem[] {
  const items: NavigationItem[] = [];

  if (role === 'teacher') {
    items.push({
      href: '/students',
      label: 'Мои студенты',
      icon: 'Users',
    });
  }

  if (role === 'student') {
    items.push({
      href: '/homework',
      label: 'Моя домашка',
      icon: 'BookOpenCheck',
      showBadge: newHomeworkCount > 0,
      badgeCount: newHomeworkCount,
    });
  }

  return items;
}

/**
 * Проверяет, нужно ли показывать бейдж с количеством
 */
export function shouldShowBadge(count: number): boolean {
  return count > 0;
}

/**
 * Форматирует количество для отображения в бейдже
 */
export function formatBadgeCount(count: number): string {
  return count > 99 ? '99+' : count.toString();
}

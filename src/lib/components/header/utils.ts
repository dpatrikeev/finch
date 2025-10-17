import { BookOpenCheck, Users, type Icon as IconType } from '@lucide/svelte';
import type { NavigationItem, NavigationItemWithIcon } from './types';

const iconMap: Record<string, typeof IconType> = {
  '/students': Users,
  '/homework': BookOpenCheck,
};

export function getNavigationWithIcons(
  navigation: NavigationItem[]
): NavigationItemWithIcon[] {
  return navigation.map((item) => {
    const icon = iconMap[item.href];

    return {
      ...item,
      icon,
    };
  });
}

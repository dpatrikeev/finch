import type { Icon as IconType } from '@lucide/svelte';

export interface NavigationItem {
  href: string;
  label: string;
  badge?: number;
}

export interface NavigationItemWithIcon extends NavigationItem {
  icon: typeof IconType;
}

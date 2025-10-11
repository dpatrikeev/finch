import type { Icon as IconType } from 'lucide-svelte';

export interface NavigationItem {
  href: string;
  label: string;
  icon: typeof IconType;
}

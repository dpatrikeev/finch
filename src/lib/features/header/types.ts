import type { IconProps } from 'lucide-svelte';
import type { Component } from 'svelte';

export interface NavigationItem {
  href: string;
  label: string;
  icon: Component<IconProps>;
}

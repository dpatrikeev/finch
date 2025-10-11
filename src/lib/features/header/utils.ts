import { BookOpenCheck, Users } from 'lucide-svelte';
import type { Component } from 'svelte';
import type { NavigationItem } from './types';

export function getNavigationItems(
  role: UserPublicMetadata['role']
): NavigationItem[] {
  const items: NavigationItem[] = [];

  if (role === 'teacher') {
    items.push({
      href: '/students',
      label: 'Мои студенты',
      icon: Users as unknown as Component,
    });
  }

  if (role === 'student') {
    items.push({
      href: '/homework',
      label: 'Моя домашка',
      icon: BookOpenCheck as unknown as Component,
    });
  }

  return items;
}

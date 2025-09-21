<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Sheet from '$lib/components/ui/sheet';
  import { Menu, Users, BookOpen } from 'lucide-svelte';
  import { UserButton } from 'svelte-clerk';
  import type { MobileMenuProps } from '../types/header.types';
  import { getNavigationItems, shouldShowBadge } from '../utils/header.utils';

  const {
    role,
    newHomeworkCount = 0,
    isOpen: _isOpen,
    onClose,
  }: MobileMenuProps = $props();
  let isOpen = $state(_isOpen);

  const navigationItems = $derived(getNavigationItems(role, newHomeworkCount));

  const iconMap = {
    Users,
    BookOpen,
  };
</script>

<div class="flex items-center gap-2 md:hidden">
  <Sheet.Root bind:open={isOpen}>
    <Sheet.Trigger>
      <Button variant="ghost" size="sm" class="p-2">
        <Menu class="w-5 h-5" />
      </Button>
    </Sheet.Trigger>
    <Sheet.Content side="right" class="w-80">
      <Sheet.Header>
        <Sheet.Title>Меню</Sheet.Title>
      </Sheet.Header>
      <div class="mt-6 space-y-4">
        {#each navigationItems as item}
          {@const IconComponent = iconMap[item.icon as keyof typeof iconMap]}
          <div class="relative">
            <Button
              variant="ghost"
              class="w-full justify-start"
              href={item.href}
              onclick={onClose}
            >
              <IconComponent class="w-4 h-4 mr-2" />
              {item.label}
              {#if item.showBadge && shouldShowBadge(item.badgeCount || 0)}
                <Badge
                  variant="destructive"
                  class="ml-auto h-5 w-6 rounded-full text-xs"
                >
                  {item.badgeCount}
                </Badge>
              {/if}
            </Button>
          </div>
        {/each}
      </div>
    </Sheet.Content>
  </Sheet.Root>

  <UserButton
    appearance={{
      elements: {
        avatarBox: 'w-8 h-8',
      },
    }}
  />
</div>

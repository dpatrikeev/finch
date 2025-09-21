<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { UserButton } from 'svelte-clerk';
  import { Users, BookOpenCheck } from 'lucide-svelte';
  import type { DesktopMenuProps } from '../types/header.types';
  import { getNavigationItems, shouldShowBadge } from '../utils/header.utils';

  const { role, newHomeworkCount = 0 }: DesktopMenuProps = $props();

  const navigationItems = $derived(getNavigationItems(role, newHomeworkCount));

  const iconMap = {
    Users,
    BookOpenCheck,
  };
</script>

<div class="hidden md:flex items-center justify-center">
  {#each navigationItems as item}
    {@const IconComponent = iconMap[item.icon as keyof typeof iconMap]}
    <div class="relative mr-2">
      <Button variant="ghost" href={item.href}>
        <IconComponent class="w-4 h-4 mr-2" />
        {item.label}
      </Button>
      {#if item.showBadge && shouldShowBadge(item.badgeCount || 0)}
        <Badge
          variant="destructive"
          class="absolute -top-0 -right-2 h-4 w-5 rounded-full text-xs"
        >
          {item.badgeCount}
        </Badge>
      {/if}
    </div>
  {/each}

  <div class="flex flex-col items-center justify-center min-w-10 min-h-10">
    <UserButton
      appearance={{
        elements: {
          avatarBox: 'w-10 h-10',
        },
      }}
    />
  </div>
</div>

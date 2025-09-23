<script lang="ts">
  import { Menu } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Sheet from '$lib/components/ui/sheet';
  import type { NavigationItem } from '$lib/types/header.types';
  import Nav from './nav.svelte';

  interface Props {
    navigationItems: NavigationItem[];
    userId: string;
  }

  const { navigationItems, userId }: Props = $props();

  let isMobileOpen = $state(false);

  function handleClose() {
    isMobileOpen = false;
  }
</script>

<div class="hidden md:flex justify-center gap-4">
  <Nav {navigationItems} {userId} />
</div>

<Sheet.Root bind:open={isMobileOpen}>
  <Sheet.Trigger>
    <Button
      variant="ghost"
      size="sm"
      class="p-2 md:hidden"
      onclick={handleClose}
    >
      <Menu class="w-5 h-5" />
    </Button>
  </Sheet.Trigger>
  <Sheet.Content side="right" class="w-80">
    <Sheet.Header>
      <Sheet.Title>Меню</Sheet.Title>
    </Sheet.Header>
    <div class="p-4 w-full flex flex-col">
      <Nav
        {navigationItems}
        {userId}
        {handleClose}
        buttonStyle="w-full justify-start mb-2 bg-secondary/40"
      />
    </div>
  </Sheet.Content>
</Sheet.Root>

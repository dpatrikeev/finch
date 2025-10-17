<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { getNavigationWithIcons } from './utils';
  import type { NavigationItem } from './types';

  interface Props {
    navigation: NavigationItem[];
    handleClose?(): void;
    class?: string;
  }

  let { handleClose, navigation, class: className }: Props = $props();
  let navigationWithIcons = $derived(getNavigationWithIcons(navigation));
</script>

{#each navigationWithIcons as { href, label, badge, icon: Icon }}
  <div class="relative w-full">
    <Button variant="ghost" {href} onclick={handleClose} class={className}>
      {#if Icon}<Icon class="w-5 h-5" />{/if}
      {label}
    </Button>
    {#if badge && badge > 0}
      <Badge
        variant="destructive"
        class="absolute -top-0 -right-2 h-4 w-5 rounded-full text-xs"
      >
        {badge}
      </Badge>
    {/if}
  </div>
{/each}

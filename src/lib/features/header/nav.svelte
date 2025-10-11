<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import type { NavigationItem } from './types';
  import { getHomeworkCount } from '$lib/features/homework/queries.remote';

  interface Props {
    navigationItems: NavigationItem[];
    userId: string;
    handleClose?(): void;
    class?: string;
  }

  let {
    navigationItems,
    userId,
    handleClose,
    class: className,
  }: Props = $props();
</script>

{#each navigationItems as { href, label, icon: Icon }}
  <div class="relative w-full">
    <Button variant="ghost" {href} onclick={handleClose} class={className}>
      {#if Icon}<Icon class="w-5 h-5" />{/if}
      {label}
    </Button>
    {#if href === '/homework'}
      {#await getHomeworkCount(userId) then homeworkCount}
        {#if homeworkCount > 0}
          <Badge
            variant="destructive"
            class="absolute -top-0 -right-2 h-4 w-5 rounded-full text-xs"
          >
            {homeworkCount}
          </Badge>
        {/if}
      {/await}
    {/if}
  </div>
{/each}

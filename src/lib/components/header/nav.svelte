<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import type { NavigationItem } from '$lib/types/header.types';
  import { getHomeworkCount } from '$lib/remote/homework.remote';

  interface Props {
    navigationItems: NavigationItem[];
    userId: string;
    handleClose?(): void;
    buttonStyle?: string;
  }

  const { navigationItems, userId, handleClose, buttonStyle }: Props = $props();
</script>

{#each navigationItems as { href, label, icon: Icon }}
  <div class="relative w-full">
    <Button variant="ghost" {href} onclick={handleClose} class={buttonStyle}>
      {#if Icon}<Icon class="w-5 h-5" />{/if}
      {label}
    </Button>
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
  </div>
{/each}

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import type { NavigationItem } from './types';

  interface Props {
    navigationItems: NavigationItem[];
    homeworkBadge?: Snippet;
    handleClose?(): void;
    class?: string;
  }

  let {
    navigationItems,
    homeworkBadge,
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
    {#if homeworkBadge}
      {@render homeworkBadge()}
    {/if}
  </div>
{/each}

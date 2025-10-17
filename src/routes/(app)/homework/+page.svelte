<script lang="ts">
  import { EmptyHomework, HomeworkCard } from '$lib/components';
  import { BookOpenCheck } from '@lucide/svelte';
  import { getMyHomework } from '$lib/remote/homework.remote';

  const homework = $derived(await getMyHomework());
</script>

<svelte:head>
  <title>Домашние задания - Finch</title>
</svelte:head>

<div class="flex items-center gap-3 mb-8">
  <BookOpenCheck class="w-8 h-8 text-primary" />
  <h1 class="text-2xl md:text-3xl font-medium text-foreground">
    Мои домашние задания
  </h1>
</div>

{#if homework.length === 0}
  <EmptyHomework />
{:else}
  <div class="space-y-4 md:space-y-6">
    {#each homework as hw, index}
      <HomeworkCard homework={hw} {index} />
    {/each}
  </div>
{/if}

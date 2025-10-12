<script lang="ts">
  import { Spinner } from '$lib/components';
  import { BookOpenCheck } from 'lucide-svelte';
  import {
    getMyHomework,
    getCurrentUserInfo,
    HomeworkCard,
    HomeworkStatsCard,
    EmptyHomework,
  } from '$lib/features/homework';

  const homework = $derived(await getMyHomework());
  const userInfo = $derived(await getCurrentUserInfo());
</script>

<svelte:head>
  <title>Домашние задания - Finch</title>
</svelte:head>

<svelte:boundary>
  <section class="mx-auto p-5 md:p-10">
    <div class="flex items-center gap-3 mb-8">
      <BookOpenCheck class="w-8 h-8 text-primary" />
      <h1 class="text-2xl md:text-3xl font-medium text-foreground">
        Мои домашние задания
      </h1>
    </div>

    {#if homework.length === 0}
      <EmptyHomework />
    {:else}
      {#if userInfo}
        <HomeworkStatsCard {homework} user={userInfo} />
      {/if}

      <div class="space-y-4 md:space-y-6">
        {#each homework as hw}
          <HomeworkCard homework={hw} showDetails={false} />
        {/each}
      </div>
    {/if}
  </section>

  {#snippet pending()}
    <div class="flex justify-center py-8">
      <Spinner />
    </div>
  {/snippet}
</svelte:boundary>

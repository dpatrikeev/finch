<script lang="ts">
  import { getMyHomework, getCurrentUserInfo } from './queries.remote';
  import HomeworkCard from './homework-card.svelte';
  import HomeworkStatsCard from './homework-stats.svelte';
  import EmptyHomework from './empty-homework.svelte';

  // Прямая загрузка данных в компоненте
  const homework = $derived(await getMyHomework());
  const userInfo = $derived(await getCurrentUserInfo());
</script>

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

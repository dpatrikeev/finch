<script lang="ts">
  import type { HomeworkProps } from './types/homework.types';
  import { HomeworkCard, HomeworkStats, EmptyHomework } from './components';

  const { homework, user }: HomeworkProps = $props();
</script>

{#if homework.length === 0}
  <EmptyHomework />
{:else}
  {#if user}
    <HomeworkStats {homework} {user} />
  {/if}

  <div class="space-y-4 md:space-y-6">
    {#each homework as hw}
      <HomeworkCard homework={hw} showDetails={false} />
    {/each}
  </div>
{/if}

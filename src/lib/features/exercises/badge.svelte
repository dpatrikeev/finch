<script lang="ts">
  import { CircleCheck, CircleX, type Icon as IconType } from 'lucide-svelte';
  import { Badge } from '$lib/components/ui/badge';
  import * as Tooltip from '$lib/components/ui/tooltip';

  import type { ExerciseStatus } from './types';

  let { isCompleted, isCorrect }: ExerciseStatus = $props();
</script>

<Tooltip.Provider>
  <Tooltip.Root>
    {#if isCompleted && isCorrect}
      {@render badge(
        'Решено',
        'Упражнение выполнено правильно',
        'bg-green-100',
        CircleCheck
      )}
    {:else if isCompleted && !isCorrect}
      {@render badge(
        'C ошибкой',
        'Упражнение выполнено неправильно',
        'bg-red-100',
        CircleX
      )}
    {:else}
      {@render badge(
        'Не решено',
        'Упражнение не выполнено',
        'bg-gray-100',
        CircleCheck
      )}
    {/if}
  </Tooltip.Root>
</Tooltip.Provider>

{#snippet badge(
  title: string,
  tooltip: string,
  bg: string,
  Icon: typeof IconType
)}
  <Tooltip.Trigger>
    <Badge variant="secondary" class={bg}>
      <Icon class="w-3 h-3 mr-1" />
      {title}
    </Badge>
  </Tooltip.Trigger>
  <Tooltip.Content>{tooltip}</Tooltip.Content>
{/snippet}

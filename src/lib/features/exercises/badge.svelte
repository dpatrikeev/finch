<script lang="ts">
  import { CircleCheck, CircleX } from 'lucide-svelte';
  import { Badge } from '$lib/components/ui/badge';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import type { ExerciseStatus } from '$lib/features/exercises/types';
  import { cn } from '$lib/utils/cn';

  interface Props extends ExerciseStatus {
    class?: string;
  }

  let { isCompleted, isCorrect, class: className }: Props = $props();

  let statusText = $derived(isCompleted ? 'Решено' : 'Не решено');
  let tooltipText = $state();

  if (isCompleted && isCorrect) {
    tooltipText = 'Упражнение выполнено правильно';
  } else if (isCompleted && !isCorrect) {
    tooltipText = 'Упражнение выполнено неправильно';
  } else {
    tooltipText = 'Упражнение не выполнено';
  }

  const statusStyles = isCompleted
    ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
    : 'bg-gray-100 text-gray-600 border-gray-200';
</script>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Badge class={cn(statusStyles, 'text-xs', className)}>
        {#if isCompleted}
          <CircleCheck class="w-3 h-3 mr-1" />
        {:else}
          <CircleX class="w-3 h-3 mr-1 opacity-50" />
        {/if}
        {statusText}
      </Badge>
    </Tooltip.Trigger>
    <Tooltip.Content>{tooltipText}</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>

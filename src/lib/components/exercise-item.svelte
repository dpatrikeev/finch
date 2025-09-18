<script lang="ts">
  import { CircleCheck, CircleX } from '@lucide/svelte';
  import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
  } from '$lib/components/ui/tooltip';

  interface Exercise {
    id: string;
    title: string;
    description: string;
  }

  interface ExerciseStatus {
    isCompleted: boolean;
    isCorrect: boolean;
  }

  let { exercise, status }: { exercise: Exercise; status?: ExerciseStatus } =
    $props();
</script>

<li
  class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
>
  <div class="flex items-start justify-between">
    <div class="flex-1">
      <div class="flex items-center gap-3">
        <a
          href="/{exercise.id}"
          class="text-blue-600 hover:text-blue-800 font-medium text-lg"
        >
          {exercise.title}
        </a>
        {#if status?.isCompleted}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {#if status.isCorrect}
                  <CircleCheck class="w-5 h-5 text-green-500" />
                {:else}
                  <CircleX class="w-5 h-5 text-red-500" />
                {/if}
              </TooltipTrigger>
              <TooltipContent>
                {status.isCorrect
                  ? 'Выполнено правильно'
                  : 'Выполнено неправильно'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        {/if}
      </div>
      <p class="text-gray-600 mt-2 text-sm">
        {exercise.description}
      </p>
    </div>
  </div>
</li>

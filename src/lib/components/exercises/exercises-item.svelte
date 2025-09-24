<script lang="ts">
  import { CircleCheck, CircleX, BookOpen, ArrowRight } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import * as Card from '$lib/components/ui/card';
  import type { ExerciseInfo } from '$lib/types/students.types';
  import type { ExerciseStatus } from '$lib/types/exercises.types';
  import {
    getExerciseButtonText,
    getExerciseStatusDescription,
    getExerciseStatusText,
    isExerciseCompleted,
    isExerciseCorrect,
  } from '$lib/utils/exercises.utils';

  interface Props {
    exercise: ExerciseInfo;
    status: ExerciseStatus;
  }

  const { exercise, status }: Props = $props();
</script>

<Card.Root
  class="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
>
  <Card.Content class="p-4 md:p-6">
    <div
      class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex-1 space-y-3">
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-2">
            <BookOpen class="w-5 h-5 text-primary" />
            <Badge variant="outline" class="font-mono text-xs">
              {exercise.id}
            </Badge>
          </div>

          {#if isExerciseCompleted(status)}
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  {#if isExerciseCorrect(status)}
                    <Badge
                      class="text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                    >
                      <CircleCheck class="w-3 h-3 mr-1" />
                      {getExerciseStatusText(status)}
                    </Badge>
                  {:else}
                    <Badge
                      class="text-xs bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                    >
                      <CircleX class="w-3 h-3 mr-1" />
                      {getExerciseStatusText(status)}
                    </Badge>
                  {/if}
                </Tooltip.Trigger>
                <Tooltip.Content>
                  {getExerciseStatusDescription(status)}
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          {:else}
            <Badge class="text-xs bg-gray-100 text-gray-600 border-gray-200">
              <CircleX class="w-3 h-3 mr-1 opacity-50" />
              {getExerciseStatusText(status)}
            </Badge>
          {/if}
        </div>

        <div class="space-y-2">
          <h3
            class="text-lg md:text-xl font-medium text-foreground group-hover:text-primary transition-colors"
          >
            {exercise.title}
          </h3>
          <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
            {exercise.description}
          </p>
        </div>
      </div>

      <div class="w-full md:w-auto md:ml-6">
        <Button
          href="/exercises/{exercise.id}"
          variant="secondary"
          class="w-full md:w-auto group-hover:shadow-md transition-shadow"
          size="lg"
        >
          {getExerciseButtonText(status)}
          <ArrowRight
            class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
          />
        </Button>
      </div>
    </div>
  </Card.Content>
</Card.Root>

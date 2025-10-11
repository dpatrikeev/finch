<script lang="ts">
  import { BookOpen, ArrowRight } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import ExerciseBadge from './badge.svelte';

  import type { ExerciseStatus, ExerciseInfo } from './types';

  interface Props {
    exercise: ExerciseInfo & ExerciseStatus;
  }

  let { exercise }: Props = $props();
  let { isCompleted, isCorrect } = $derived(exercise);
  let buttonText = $derived(isCompleted ? 'Повторить' : 'Начать');
</script>

<Card.Root class="flex justify-between md:flex-row md:items-center">
  <Card.Content>
    <Card.Header class="flex items-center gap-2 p-0 mb-4">
      <BookOpen class="w-5 h-5 text-primary" />
      <Badge variant="outline" class="font-mono text-xs">
        {exercise.id}
      </Badge>

      <ExerciseBadge {isCompleted} {isCorrect} />
    </Card.Header>
    <Card.Title class="text-lg md:text-xl font-medium text-foreground">
      {exercise.title}
    </Card.Title>
    <Card.Description
      class="text-sm md:text-base text-muted-foreground leading-relaxed"
    >
      {exercise.description}
    </Card.Description>
  </Card.Content>
  <Card.Footer>
    <Button
      href="/exercises/{exercise.id}"
      variant="secondary"
      class="w-full md:w-auto group-hover:shadow-md transition-shadow"
      size="lg"
    >
      {buttonText}
      <ArrowRight
        class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
      />
    </Button>
  </Card.Footer>
</Card.Root>

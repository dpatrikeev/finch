<script lang="ts">
  import type { BasicExercise, AnswerHistory } from './types/exercises.types';
  import { ExerciseItem } from './components';
  import { getExerciseStatus } from './utils/exercises.utils';

  interface Props {
    exercises: BasicExercise[];
    answersHistory?: AnswerHistory[];
  }

  let { exercises, answersHistory = [] }: Props = $props();
</script>

<div class="space-y-4">
  {#each exercises as exercise (exercise.id)}
    {@const status = getExerciseStatus(answersHistory, exercise.id)}
    <ExerciseItem {exercise} {status} />
  {/each}
</div>

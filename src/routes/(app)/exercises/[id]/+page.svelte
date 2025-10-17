<script lang="ts">
  import { page } from '$app/state';
  import { Title } from '$lib/components';
  import { Quiz } from '$lib/features/quiz';
  import { getExercise, getAnswersHistory } from '$lib/remote/exercises.remote';

  const exerciseId = $derived(page.params.id || '');
  const exercise = $derived(await getExercise(exerciseId));
  const answersHistory = $derived(await getAnswersHistory(exerciseId));
</script>

<Title title={exercise.title} />
{#if exercise.description}
  <p class="text-lg mb-6 text-slate-700">{exercise.description}</p>
{/if}

<Quiz {exercise} {answersHistory} />

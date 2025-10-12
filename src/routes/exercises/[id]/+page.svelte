<script lang="ts">
  import { page } from '$app/state';
  import { Title } from '$lib/components';
  import { Quiz } from '$lib/features/quiz';
  import { getExercise, getAnswersHistory } from '$lib/features/exercises';

  const exerciseId = $derived(page.params.id || '');
  const exercise = $derived(await getExercise(exerciseId));
  const answersHistory = $derived(await getAnswersHistory(exerciseId));
</script>

<section class="mx-auto p-5 md:p-10">
  <Title title={exercise.title} />
  {#if exercise.description}
    <p class="text-lg mb-6 text-slate-700">{exercise.description}</p>
  {/if}

  <Quiz {exercise} {answersHistory} />
</section>

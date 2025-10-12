<script lang="ts">
  import { Title } from '$lib/components';
  import { Quiz } from '$lib/features/quiz';

  let { data } = $props();
  let { exercise, answersHistory } = $derived(data);
</script>

<section class="mx-auto p-5 md:p-10">
  <Title title={exercise.title} />
  {#if exercise.description}
    <p class="text-lg mb-6 text-slate-700">{exercise.description}</p>
  {/if}

  <Quiz {exercise} {answersHistory} />
</section>

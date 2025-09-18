<script lang="ts">
  import type { PageData } from './$types';
  import { Title } from '$lib/components';
  import Quiz from '$lib/notation/Quiz.svelte';

  let { data }: { data: PageData } = $props();
  let { exercise, answersHistory } = $derived(data);
</script>

<section class="mx-auto p-10">
  <Title title={exercise.title} />

  {#if exercise.description}
    <p class="text-lg mb-6 text-slate-700">{exercise.description}</p>
  {/if}

  <Quiz {exercise} {answersHistory} />
</section>

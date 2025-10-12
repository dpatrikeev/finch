<script lang="ts">
  import { Homework } from '$lib/features/homework';
  import { Spinner } from '$lib/components';
  import { BookOpenCheck } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Домашние задания - Finch</title>
</svelte:head>

<svelte:boundary>
  <section class="mx-auto p-5 md:p-10">
    <div class="flex items-center gap-3 mb-8">
      <BookOpenCheck class="w-8 h-8 text-primary" />
      <h1 class="text-2xl md:text-3xl font-medium text-foreground">
        Мои домашние задания
      </h1>
    </div>

    <Homework />
  </section>

  {#snippet pending()}
    <div class="flex justify-center py-8">
      <Spinner />
    </div>
  {/snippet}
</svelte:boundary>

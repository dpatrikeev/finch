<script lang="ts">
  import type { PageData } from './$types';
  import StudentCard from '$lib/components/student-card.svelte';
  import { Users } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();
  const { students } = data;
</script>

<svelte:head>
  <title>Мои студенты - Finch</title>
</svelte:head>

<section class="mx-auto p-10">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Мои студенты</h1>
    <p class="text-gray-600">
      Просмотрите прогресс и статистику ваших студентов
    </p>
  </div>

  {#if students.length === 0}
    <div class="text-center py-12">
      <Users class="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h3 class="text-xl font-medium text-gray-900 mb-2">Пока нет студентов</h3>
      <p class="text-gray-500">
        У вас пока нет студентов. Студенты будут добавлены администратором.
      </p>
    </div>
  {:else}
    <div class="mb-4 text-sm text-gray-500">
      Всего студентов: {students.length}
    </div>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each students as student}
        <StudentCard {student} />
      {/each}
    </div>
  {/if}
</section>

<script lang="ts">
  import GraduationCap from '@lucide/svelte/icons/graduation-cap';
  import { EmptyStudents, StudentCard } from '$lib/components';
  import { getClerkUser } from '$lib/remote/user.remote';

  let { data } = $props();
  let { studentIds, exercises, students } = $derived(data);
</script>

<svelte:head>
  <title>Finch - Мои студенты</title>
</svelte:head>

<div class="mb-8">
  <div class="flex items-center gap-3 mb-4">
    <GraduationCap class="w-8 h-8 text-primary" />
    <h1 class="text-2xl md:text-3xl font-medium text-foreground">
      Мои студенты
    </h1>
  </div>
  <p class="text-sm md:text-base text-muted-foreground">
    Просмотрите прогресс и статистику ваших студентов, назначайте домашние
    задания
  </p>
</div>

{#if studentIds.length === 0}
  <EmptyStudents />
{:else}
  <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
    {#each students as student}
      <StudentCard {student} {exercises} />
    {/each}
  </div>
{/if}

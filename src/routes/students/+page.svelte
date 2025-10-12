<script lang="ts">
  import type { StudentInfo } from '$lib/features/students';
  import type { ExerciseInfo } from '$lib/features/exercises';
  import { GraduationCap } from 'lucide-svelte';
  import { AssignHomeworkButton } from '$lib/features/homework';
  import { calculateStudentsStats } from '$lib/features/students/utils';
  import StudentsStats from '$lib/features/students/stats.svelte';
  import StudentCard from '$lib/features/students/card.svelte';
  import EmptyStudents from './empty.svelte';

  let { data } = $props();
  let { exercises, students } = $derived(data);
  let stats = $derived(calculateStudentsStats(students, exercises.length));
</script>

<svelte:head>
  <title>Finch - Мои студенты</title>
</svelte:head>

<section class="mx-auto p-5 md:p-10">
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

  {#if students.length === 0}
    <EmptyStudents />
  {:else}
    <StudentsStats {stats} />

    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {#each students as student}
        <StudentCard {student}>
          {@render assignHomework(student, exercises)}
        </StudentCard>
      {/each}
    </div>
  {/if}
</section>

{#snippet assignHomework(student: StudentInfo, exercises: ExerciseInfo[])}
  <AssignHomeworkButton {student} {exercises} class="w-full flex-1 min-h-10" />
{/snippet}

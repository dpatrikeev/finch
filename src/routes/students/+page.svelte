<script lang="ts">
  import Students from '$lib/components/students/students.svelte';
  import type { StudentInfo, ExerciseInfo } from '$lib/types/students.types';
  import { Spinner } from '$lib/components';
  import { GraduationCap } from 'lucide-svelte';
  import { AssignHomeworkButton } from '$lib/components/homework';
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

  <svelte:boundary>
    <Students {assignHomework} exercisesAmount={0} />

    {#snippet pending()}
      <Spinner />
    {/snippet}
  </svelte:boundary>
</section>

{#snippet assignHomework(student: StudentInfo, exercises: ExerciseInfo[])}
  <AssignHomeworkButton {student} {exercises} />
{/snippet}

<script lang="ts">
  import { GraduationCap } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { page } from '$app/state';
  import { StudentCard, StudentsStats, EmptyStudents } from './components';
  import { calculateStudentsStats } from './utils/students.utils';
  import type { StudentsListProps } from './types/students.types';

  const { students, exercises }: StudentsListProps = $props();

  const handleAssigned = () => {
    // Обновляем страницу после назначения домашнего задания
    window.location.reload();
  };

  // Показываем уведомление об успешном назначении
  $effect(() => {
    if (page.form?.success) {
      toast.success(page.form.message || 'Домашнее задание успешно назначено!');
    } else if (page.form?.error) {
      toast.error(page.form.error);
    }
  });

  // Вычисляем статистику
  const stats = $derived(calculateStudentsStats(students, exercises.length));
</script>

<svelte:head>
  <title>Мои студенты - Finch</title>
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
    <!-- Статистика -->
    <StudentsStats {stats} />

    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {#each students as student}
        <StudentCard {student} {exercises} onassigned={handleAssigned} />
      {/each}
    </div>
  {/if}
</section>

<script lang="ts">
  import { page } from '$app/state';
  import {
    getHomeworkStats,
    getAvailableExercises,
  } from '$lib/features/homework';
  import { getStudentById } from '$lib/features/students';
  import { Spinner } from '$lib/components';
  import { Button } from '$lib/components/ui/button';
  import { ArrowLeft } from 'lucide-svelte';

  const studentId = $derived(page.params.studentId || '');
  const homeworkId = $derived(parseInt(page.params.homeworkId || '0'));

  // Прямая загрузка данных в компоненте
  const stats = $derived(
    await getHomeworkStats({
      homeworkId,
      studentId,
    })
  );
  const student = $derived(await getStudentById(studentId));
  const exercises = $derived(await getAvailableExercises());
</script>

<svelte:head>
  <title>
    {stats
      ? `Статистика домашки #${stats.homework.id}: ${stats.student.first_name} ${stats.student.last_name} - Finch`
      : 'Статистика домашки - Finch'}
  </title>
</svelte:head>

<svelte:boundary>
  <div class="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
    <!-- Навигация назад -->
    <div class="mb-4 md:mb-6">
      <Button
        variant="ghost"
        href="/students/{studentId}"
        class="gap-2 text-sm md:text-base px-2 md:px-4"
      >
        <ArrowLeft class="w-4 h-4" />
        <span class="md:hidden">Назад</span>
        <span class="hidden md:inline">Назад к студенту</span>
      </Button>
    </div>

    {#if stats && student}
      <!-- Информация о студенте и домашке -->
      <div class="bg-white rounded-lg shadow-md border p-4 md:p-6 mb-4 md:mb-6">
        <div class="mb-4">
          <h1 class="text-xl md:text-2xl font-bold">
            Домашнее задание #{stats.homework.id}
          </h1>
          <p class="text-sm md:text-base text-gray-600">
            Студент: {stats.student.first_name}
            {stats.student.last_name}
          </p>
        </div>

        <!-- Общая статистика -->
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg"
        >
          <div class="text-center">
            <div class="text-xl md:text-2xl font-bold text-blue-600 mb-1">
              {stats.overall_progress.total_exercises}
            </div>
            <div class="text-xs md:text-sm text-gray-600">Всего упражнений</div>
          </div>

          <div class="text-center">
            <div class="text-xl md:text-2xl font-bold text-green-600 mb-1">
              {stats.overall_progress.completed_exercises}
            </div>
            <div class="text-xs md:text-sm text-gray-600">Выполнено</div>
          </div>

          <div class="text-center">
            <div class="text-xl md:text-2xl font-bold text-purple-600 mb-1">
              {stats.overall_progress.completion_percentage}%
            </div>
            <div class="text-xs md:text-sm text-gray-600">Прогресс</div>
          </div>

          <div class="text-center">
            <div class="text-xl md:text-2xl font-bold text-orange-600 mb-1">
              {stats.overall_progress.accuracy_percentage}%
            </div>
            <div class="text-xs md:text-sm text-gray-600">Точность</div>
          </div>
        </div>
      </div>

      <!-- Детальная статистика по упражнениям -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold">Упражнения</h2>
        {#each stats.exercises_stats as exerciseStat}
          <div class="bg-white rounded-lg shadow-md border p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold">
                Упражнение {exerciseStat.exercise_id}
              </h3>
              <span
                class="text-sm {exerciseStat.is_completed
                  ? 'text-green-600'
                  : 'text-gray-500'}"
              >
                {exerciseStat.is_completed ? 'Выполнено' : 'Не выполнено'}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>Попыток: {exerciseStat.total_attempts}</div>
              <div>Правильно: {exerciseStat.correct_attempts}</div>
              <div>Точность: {exerciseStat.completion_rate}%</div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="flex justify-center items-center py-16">
        <p class="text-gray-500">Домашнее задание не найдено</p>
      </div>
    {/if}
  </div>

  {#snippet pending()}
    <div class="flex justify-center py-8">
      <Spinner />
    </div>
  {/snippet}
</svelte:boundary>

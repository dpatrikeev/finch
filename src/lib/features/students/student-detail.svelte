<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { getStudentById } from './queries.remote';
  import {
    getStudentHomeworkWithProgress,
    HomeworkCard,
    EmptyHomework,
  } from '$lib/features/homework';
  import { ArrowLeft, Mail } from 'lucide-svelte';
  import { calculateOverallStats } from '$lib/features/homework/utils';

  interface Props {
    studentId: string;
  }

  let { studentId }: Props = $props();

  const student = $derived(await getStudentById(studentId));
  const homework = $derived(await getStudentHomeworkWithProgress(studentId));

  // Общая статистика по всем домашкам
  const overallStats = $derived(
    homework.length > 0
      ? calculateOverallStats(homework)
      : {
          totalHomework: 0,
          completionRate: 0,
          exerciseCompletionRate: 0,
          accuracy: 0,
        }
  );
</script>

<svelte:head>
  <title
    >Домашние задания: {student
      ? [student.firstName, student.lastName].filter(Boolean).join(' ')
      : 'Студент'} - Finch</title
  >
</svelte:head>

{#if student}
  <div class="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
    <!-- Навигация назад -->
    <div class="mb-4 md:mb-6">
      <Button
        variant="ghost"
        href="/students"
        class="gap-2 text-sm md:text-base px-2 md:px-4"
      >
        <ArrowLeft class="w-4 h-4" />
        <span class="md:hidden">Назад</span>
        <span class="hidden md:inline">Назад к студентам</span>
      </Button>
    </div>

    <!-- Информация о студенте -->
    <div class="bg-white rounded-lg shadow-md border p-4 md:p-6 mb-4 md:mb-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center mb-4 md:mb-6">
        {#if student.imageUrl}
          <img
            src={student.imageUrl}
            alt={[student.firstName, student.lastName]
              .filter(Boolean)
              .join(' ')}
            class="w-12 h-12 md:w-16 md:h-16 rounded-full self-start md:self-auto"
          />
        {:else}
          <div
            class="w-12 h-12 md:w-16 md:h-16 text-lg md:text-xl rounded-full bg-blue-500 flex items-center justify-center text-white font-bold self-start md:self-auto"
          >
            {(
              (student.firstName?.[0] || '') + (student.lastName?.[0] || '')
            ).toUpperCase()}
          </div>
        {/if}

        <div class="flex-1">
          <h1 class="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            {[student.firstName, student.lastName].filter(Boolean).join(' ')}
          </h1>
          <div class="flex items-center text-gray-600 mb-2">
            <Mail class="w-4 h-4 mr-2" />
            <span class="text-sm md:text-base">{student.email}</span>
          </div>
          <div
            class="flex flex-col gap-1 md:flex-row md:items-center md:gap-6 text-xs md:text-sm text-gray-500"
          >
            <span>Общая точность: {student.accuracy}%</span>
            <span>Выполнено упражнений: {student.totalExercises}</span>
          </div>
        </div>
      </div>

      <!-- Общая статистика по домашкам -->
      <div
        class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg"
      >
        <div class="text-center">
          <div class="text-xl md:text-2xl font-bold text-blue-600 mb-1">
            {overallStats.totalHomework}
          </div>
          <div class="text-xs md:text-sm text-gray-600">Всего домашек</div>
        </div>

        <div class="text-center">
          <div class="text-xl md:text-2xl font-bold text-green-600 mb-1">
            {overallStats.completionRate}%
          </div>
          <div class="text-xs md:text-sm text-gray-600">Завершено домашек</div>
        </div>

        <div class="text-center">
          <div class="text-xl md:text-2xl font-bold text-purple-600 mb-1">
            {overallStats.exerciseCompletionRate}%
          </div>
          <div class="text-xs md:text-sm text-gray-600">
            Выполнено упражнений
          </div>
        </div>

        <div class="text-center">
          <div class="text-xl md:text-2xl font-bold text-orange-600 mb-1">
            {overallStats.accuracy}%
          </div>
          <div class="text-xs md:text-sm text-gray-600">Точность ответов</div>
        </div>
      </div>
    </div>

    <!-- Список домашних заданий -->
    <div class="space-y-4 md:space-y-6">
      <h2 class="text-xl md:text-2xl font-bold">Домашние задания</h2>

      {#if homework.length === 0}
        <EmptyHomework isTeacher={true} />
      {:else}
        {#each homework as hw}
          <HomeworkCard homework={hw} studentId={student.id} />
        {/each}
      {/if}
    </div>
  </div>
{:else}
  <div class="flex justify-center items-center py-16">
    <p class="text-gray-500">Студент не найден</p>
  </div>
{/if}

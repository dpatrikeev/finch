<script lang="ts">
  import type { PageProps } from './$types';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { formatDistance, format } from 'date-fns';
  import { ru } from 'date-fns/locale';
  import type { StudentInfo } from '$lib/utils/user';
  import EditHomeworkModal from '$lib/components/edit-homework-modal.svelte';
  import { toast } from 'svelte-sonner';
  import {
    CircleCheck,
    CircleX,
    Clock,
    ArrowLeft,
    TrendingUp,
    Target,
    Calendar,
    User,
    Mail,
    Edit,
  } from 'lucide-svelte';

  interface Props extends PageProps {}

  const { data }: Props = $props();
  const { student, stats, exercises, isTeacherView } = data as {
    student: StudentInfo;
    stats: any;
    exercises: { id: string; title: string; description?: string }[];
    isTeacherView: boolean;
  };

  let showEditModal = $state(false);

  // Форматируем дату
  const formatDate = (dateStr: string) => {
    return formatDistance(new Date(dateStr), new Date(), {
      addSuffix: true,
      locale: ru,
    });
  };

  const formatFullDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd.MM.yyyy HH:mm', { locale: ru });
  };

  // Получить иконку статуса
  const getStatusIcon = (isCompleted: boolean, attempts: number) => {
    if (isCompleted) return CircleCheck;
    if (attempts > 0) return CircleX;
    return Clock;
  };

  // Получить цвет статуса
  const getStatusColor = (isCompleted: boolean, attempts: number) => {
    if (isCompleted) return 'text-green-600';
    if (attempts > 0) return 'text-red-500';
    return 'text-gray-400';
  };

  // Получить точность в процентах
  const getAccuracy = (correct: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  function handleEditClick() {
    showEditModal = true;
  }

  function handleEditClose() {
    showEditModal = false;
  }

  // Функция для обработки успешного обновления домашки
  const handleHomeworkUpdated = async () => {
    // Небольшая задержка для лучшего UX (пользователь видит уведомление)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Перезагружаем страницу для обновления данных
    window.location.reload();
  };
</script>

<svelte:head>
  <title
    >Статистика домашки #{stats.homework.id}: {student.firstName}
    {student.lastName} - Finch</title
  >
</svelte:head>

<div class="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
  <!-- Навигация назад -->
  <div class="mb-4 md:mb-6">
    <Button
      variant="ghost"
      href="/students/{student.id}/homework"
      class="gap-2 text-sm md:text-base px-2 md:px-4"
    >
      <ArrowLeft class="w-4 h-4" />
      <span class="md:hidden">Назад</span>
      <span class="hidden md:inline">Назад к домашкам студента</span>
    </Button>
  </div>

  <!-- Информация о студенте и домашке -->
  <div class="bg-white rounded-lg shadow-md border p-4 md:p-6 mb-4 md:mb-6">
    <div
      class="space-y-4 md:flex md:items-start md:justify-between md:space-y-0 mb-4"
    >
      <div class="flex items-center gap-3 md:gap-4">
        {#if student.imageUrl}
          <img
            src={student.imageUrl}
            alt="{student.firstName} {student.lastName}"
            class="w-10 h-10 md:w-12 md:h-12 rounded-full"
          />
        {:else}
          <div
            class="w-10 h-10 md:w-12 md:h-12 text-sm md:text-base rounded-full bg-blue-500 flex items-center justify-center text-white font-medium"
          >
            {student.firstName?.[0]?.toUpperCase()}{student.lastName?.[0]?.toUpperCase()}
          </div>
        {/if}

        <div>
          <h1 class="text-lg md:text-2xl font-bold mb-1">
            {student.firstName}
            {student.lastName}
          </h1>
          <div class="flex items-center text-gray-600 text-xs md:text-sm">
            <Mail class="w-3 h-3 md:w-4 md:h-4 mr-1" />
            {student.email}
          </div>
        </div>
      </div>

      <div class="md:text-right">
        <div
          class="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 md:mb-2"
        >
          <h2 class="text-lg md:text-xl font-semibold">
            Домашнее задание #{stats.homework.id}
          </h2>
          <!-- Кнопка редактирования -->
          {#if isTeacherView}
            <Button
              variant="outline"
              size="sm"
              onclick={handleEditClick}
              class="gap-2 self-start text-xs md:text-sm px-3 py-1 md:px-4 md:py-2"
            >
              <Edit class="w-3 h-3 md:w-4 md:h-4" />
              <span class="md:hidden">Изменить</span>
              <span class="hidden md:inline">Редактировать</span>
            </Button>
          {/if}
        </div>
        <p class="text-sm md:text-base text-gray-600">
          Задано {formatDate(stats.homework.created_at)}
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-2 md:text-right">
      {#if stats.overall_stats.is_completed}
        <Badge
          class="bg-green-100 text-green-700 border-green-200 hover:bg-green-200 mb-2 self-start md:self-auto"
        >
          <CircleCheck class="w-3 h-3 md:w-4 md:h-4 mr-1" />
          Завершено
        </Badge>
      {:else}
        <Badge
          class="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 mb-2 self-start md:self-auto"
          >В процессе</Badge
        >
      {/if}

      <div class="text-xs md:text-sm text-gray-500">
        {stats.overall_stats.completed_exercises} из {stats.overall_stats
          .total_exercises} упражнений
      </div>
    </div>

    <!-- Общая статистика -->
    <div
      class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg mt-4 md:mt-6"
    >
      <div class="text-center">
        <div class="flex items-center justify-center mb-1 md:mb-2">
          <Target class="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
        </div>
        <div class="text-lg md:text-2xl font-bold text-blue-600">
          {stats.overall_stats.progress_percentage}%
        </div>
        <div class="text-xs md:text-sm text-gray-600">Прогресс</div>
      </div>

      <div class="text-center">
        <div class="flex items-center justify-center mb-1 md:mb-2">
          <TrendingUp class="w-4 h-4 md:w-5 md:h-5 text-green-600" />
        </div>
        <div class="text-lg md:text-2xl font-bold text-green-600">
          {getAccuracy(
            stats.overall_stats.total_correct_attempts,
            stats.overall_stats.total_attempts
          )}%
        </div>
        <div class="text-xs md:text-sm text-gray-600">Точность</div>
      </div>

      <div class="text-center">
        <div class="flex items-center justify-center mb-1 md:mb-2">
          <Clock class="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
        </div>
        <div class="text-lg md:text-2xl font-bold text-orange-500">
          {stats.overall_stats.total_attempts}
        </div>
        <div class="text-xs md:text-sm text-gray-600">Попыток</div>
      </div>

      <div class="text-center">
        <div class="flex items-center justify-center mb-1 md:mb-2">
          <Calendar class="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
        </div>
        <div class="text-lg md:text-2xl font-bold text-purple-600">
          {#if stats.overall_stats.started_at}
            {Math.ceil(
              (new Date().getTime() -
                new Date(stats.overall_stats.started_at).getTime()) /
                (1000 * 60 * 60 * 24)
            )}
          {:else}
            0
          {/if}
        </div>
        <div class="text-xs md:text-sm text-gray-600">Дней назад</div>
      </div>
    </div>

    <!-- Временные метки -->
    {#if stats.overall_stats.started_at || stats.overall_stats.completed_at}
      <div
        class="mt-3 md:mt-4 flex flex-col gap-1 md:flex-row md:gap-6 text-xs md:text-sm text-gray-600"
      >
        {#if stats.overall_stats.started_at}
          <div>
            <span class="font-medium">Начато:</span>
            {formatFullDate(stats.overall_stats.started_at)}
          </div>
        {/if}
        {#if stats.overall_stats.completed_at}
          <div>
            <span class="font-medium">Завершено:</span>
            {formatFullDate(stats.overall_stats.completed_at)}
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Детальная статистика по упражнениям -->
  <div class="bg-white rounded-lg shadow-md border p-4 md:p-6">
    <h3 class="text-lg md:text-xl font-semibold mb-4 md:mb-6">
      <span class="md:hidden">Статистика упражнений</span>
      <span class="hidden md:inline">Детальная статистика по упражнениям</span>
    </h3>

    <div class="space-y-4">
      {#each stats.exercise_stats as exerciseStat}
        {@const StatusIcon = getStatusIcon(
          exerciseStat.is_completed,
          exerciseStat.attempts
        )}
        {@const statusColor = getStatusColor(
          exerciseStat.is_completed,
          exerciseStat.attempts
        )}

        <div class="border rounded-lg p-3 md:p-4">
          <div
            class="space-y-3 md:flex md:items-center md:justify-between md:space-y-0 mb-3"
          >
            <div class="flex items-center gap-2 md:gap-3">
              <StatusIcon class="w-4 h-4 md:w-5 md:h-5 {statusColor}" />
              <Badge variant="secondary" class="font-mono text-xs">
                {exerciseStat.exercise_id}
              </Badge>
              <span class="text-sm md:text-base font-medium"
                >Упражнение {exerciseStat.exercise_id}</span
              >
            </div>

            <div class="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                href="/exercises/{exerciseStat.exercise_id}"
                class="text-xs md:text-sm px-3 py-1 md:px-4 md:py-2"
              >
                <span class="md:hidden">Открыть</span>
                <span class="hidden md:inline">Посмотреть упражнение</span>
              </Button>
            </div>
          </div>

          <!-- Статистика упражнения -->
          <div class="grid grid-cols-3 gap-2 md:gap-4 mb-3">
            <div class="text-center p-2 md:p-3 bg-gray-50 rounded">
              <div class="text-base md:text-lg font-semibold {statusColor}">
                {exerciseStat.attempts}
              </div>
              <div class="text-xs text-gray-600">Попыток</div>
            </div>

            <div class="text-center p-2 md:p-3 bg-gray-50 rounded">
              <div class="text-base md:text-lg font-semibold text-green-600">
                {exerciseStat.correct_attempts}
              </div>
              <div class="text-xs text-gray-600">Правильных</div>
            </div>

            <div class="text-center p-2 md:p-3 bg-gray-50 rounded">
              <div class="text-base md:text-lg font-semibold text-blue-600">
                {getAccuracy(
                  exerciseStat.correct_attempts,
                  exerciseStat.attempts
                )}%
              </div>
              <div class="text-xs text-gray-600">Точность</div>
            </div>
          </div>

          <!-- Временные метки -->
          {#if exerciseStat.first_attempt_at || exerciseStat.last_attempt_at}
            <div
              class="flex flex-col gap-1 md:flex-row md:gap-4 text-xs text-gray-500 mb-3"
            >
              {#if exerciseStat.first_attempt_at}
                <span
                  >Первая попытка: {formatDate(
                    exerciseStat.first_attempt_at
                  )}</span
                >
              {/if}
              {#if exerciseStat.last_attempt_at && exerciseStat.first_attempt_at !== exerciseStat.last_attempt_at}
                <span
                  >Последняя: {formatDate(exerciseStat.last_attempt_at)}</span
                >
              {/if}
            </div>
          {/if}

          <!-- История ответов (только для учителей) -->
          {#if isTeacherView && exerciseStat.answers_history.length > 0}
            <details class="mt-3">
              <summary
                class="cursor-pointer text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                История ответов ({exerciseStat.answers_history.length})
              </summary>

              <div class="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {#each exerciseStat.answers_history as answer}
                  <div
                    class="flex flex-col gap-2 p-2 md:flex-row md:items-center md:justify-between rounded {answer.is_correct
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'} border"
                  >
                    <div class="flex items-center gap-2">
                      {#if answer.is_correct}
                        <CircleCheck
                          class="w-3 h-3 md:w-4 md:h-4 text-green-600"
                        />
                        <span class="text-green-700 text-xs md:text-sm"
                          >Правильно</span
                        >
                      {:else}
                        <CircleX class="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                        <span class="text-red-700 text-xs md:text-sm"
                          >Неправильно</span
                        >
                      {/if}
                      <span class="text-xs text-gray-600">
                        Вариант: {answer.selected_answer_id}
                      </span>
                    </div>

                    <span class="text-xs text-gray-500 self-start md:self-auto">
                      {formatDate(answer.answered_at)}
                    </span>
                  </div>
                {/each}
              </div>
            </details>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Модальное окно редактирования -->
{#if isTeacherView}
  <EditHomeworkModal
    open={showEditModal}
    homework={stats.homework}
    {student}
    {exercises}
    onclose={handleEditClose}
    onupdated={handleHomeworkUpdated}
  />
{/if}

<style>
  .container {
    min-height: calc(100vh - 3rem);
  }
</style>

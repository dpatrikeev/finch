<script lang="ts">
  import type { PageProps } from './$types';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { formatDistance, format } from 'date-fns';
  import { ru } from 'date-fns/locale';
  import type { StudentInfo } from '$lib/utils/user';
  import EditHomeworkModal from '$lib/components/edit-homework-modal.svelte';
  import {
    CheckCircle,
    XCircle,
    Clock,
    ArrowLeft,
    TrendingUp,
    Target,
    Calendar,
    User,
    Mail,
    Edit3,
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
    if (isCompleted) return CheckCircle;
    if (attempts > 0) return XCircle;
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
</script>

<svelte:head>
  <title
    >Статистика домашки #{stats.homework.id}: {student.firstName}
    {student.lastName} - Finch</title
  >
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <!-- Навигация назад -->
  <div class="mb-6">
    <Button
      variant="ghost"
      href="/students/{student.id}/homework"
      class="gap-2"
    >
      <ArrowLeft class="w-4 h-4" />
      Назад к домашкам студента
    </Button>
  </div>

  <!-- Информация о студенте и домашке -->
  <div class="bg-white rounded-lg shadow-md border p-6 mb-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-4">
        {#if student.imageUrl}
          <img
            src={student.imageUrl}
            alt="{student.firstName} {student.lastName}"
            class="w-12 h-12 rounded-full"
          />
        {:else}
          <div
            class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium"
          >
            {student.firstName?.[0]?.toUpperCase()}{student.lastName?.[0]?.toUpperCase()}
          </div>
        {/if}

        <div>
          <h1 class="text-2xl font-bold mb-1">
            {student.firstName}
            {student.lastName}
          </h1>
          <div class="flex items-center text-gray-600 text-sm">
            <Mail class="w-4 h-4 mr-1" />
            {student.email}
          </div>
        </div>
      </div>

      <div class="text-right">
        <div class="flex items-center gap-3 mb-2">
          <h2 class="text-xl font-semibold">
            Домашнее задание #{stats.homework.id}
          </h2>
          <!-- Кнопка редактирования -->
          {#if isTeacherView}
            <Button
              variant="outline"
              size="sm"
              onclick={handleEditClick}
              class="gap-2"
            >
              <Edit3 class="w-4 h-4" />
              Редактировать
            </Button>
          {/if}
        </div>
        <p class="text-gray-600">
          Задано {formatDate(stats.homework.created_at)}
        </p>
      </div>
    </div>

    <div class="text-right">
      {#if stats.overall_stats.is_completed}
        <Badge variant="default" class="bg-green-500 mb-2">
          <CheckCircle class="w-4 h-4 mr-1" />
          Завершено
        </Badge>
      {:else}
        <Badge variant="secondary" class="mb-2">В процессе</Badge>
      {/if}

      <div class="text-sm text-gray-500">
        {stats.overall_stats.completed_exercises} из {stats.overall_stats
          .total_exercises} упражнений
      </div>
    </div>

    <!-- Общая статистика -->
    <div
      class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mt-6"
    >
      <div class="text-center">
        <div class="flex items-center justify-center mb-2">
          <Target class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-2xl font-bold text-blue-600">
          {stats.overall_stats.progress_percentage}%
        </div>
        <div class="text-sm text-gray-600">Прогресс</div>
      </div>

      <div class="text-center">
        <div class="flex items-center justify-center mb-2">
          <TrendingUp class="w-5 h-5 text-green-600" />
        </div>
        <div class="text-2xl font-bold text-green-600">
          {getAccuracy(
            stats.overall_stats.total_correct_attempts,
            stats.overall_stats.total_attempts
          )}%
        </div>
        <div class="text-sm text-gray-600">Точность</div>
      </div>

      <div class="text-center">
        <div class="flex items-center justify-center mb-2">
          <Clock class="w-5 h-5 text-orange-500" />
        </div>
        <div class="text-2xl font-bold text-orange-500">
          {stats.overall_stats.total_attempts}
        </div>
        <div class="text-sm text-gray-600">Попыток</div>
      </div>

      <div class="text-center">
        <div class="flex items-center justify-center mb-2">
          <Calendar class="w-5 h-5 text-purple-600" />
        </div>
        <div class="text-2xl font-bold text-purple-600">
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
        <div class="text-sm text-gray-600">Дней назад</div>
      </div>
    </div>

    <!-- Временные метки -->
    {#if stats.overall_stats.started_at || stats.overall_stats.completed_at}
      <div class="mt-4 flex gap-6 text-sm text-gray-600">
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
  <div class="bg-white rounded-lg shadow-md border p-6">
    <h3 class="text-xl font-semibold mb-6">
      Детальная статистика по упражнениям
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

        <div class="border rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <StatusIcon class="w-5 h-5 {statusColor}" />
              <Badge variant="secondary" class="font-mono">
                {exerciseStat.exercise_id}
              </Badge>
              <span class="font-medium"
                >Упражнение {exerciseStat.exercise_id}</span
              >
            </div>

            <div class="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                href="/{exerciseStat.exercise_id}"
              >
                Посмотреть упражнение
              </Button>
            </div>
          </div>

          <!-- Статистика упражнения -->
          <div class="grid grid-cols-3 gap-4 mb-3">
            <div class="text-center p-3 bg-gray-50 rounded">
              <div class="text-lg font-semibold {statusColor}">
                {exerciseStat.attempts}
              </div>
              <div class="text-xs text-gray-600">Попыток</div>
            </div>

            <div class="text-center p-3 bg-gray-50 rounded">
              <div class="text-lg font-semibold text-green-600">
                {exerciseStat.correct_attempts}
              </div>
              <div class="text-xs text-gray-600">Правильных</div>
            </div>

            <div class="text-center p-3 bg-gray-50 rounded">
              <div class="text-lg font-semibold text-blue-600">
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
            <div class="flex gap-4 text-xs text-gray-500 mb-3">
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
                class="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                История ответов ({exerciseStat.answers_history.length})
              </summary>

              <div class="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {#each exerciseStat.answers_history as answer}
                  <div
                    class="flex items-center justify-between p-2 rounded {answer.is_correct
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'} border"
                  >
                    <div class="flex items-center gap-2">
                      {#if answer.is_correct}
                        <CheckCircle class="w-4 h-4 text-green-600" />
                        <span class="text-green-700 text-sm">Правильно</span>
                      {:else}
                        <XCircle class="w-4 h-4 text-red-600" />
                        <span class="text-red-700 text-sm">Неправильно</span>
                      {/if}
                      <span class="text-xs text-gray-600">
                        Вариант: {answer.selected_answer_id}
                      </span>
                    </div>

                    <span class="text-xs text-gray-500">
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
  />
{/if}

<style>
  .container {
    min-height: calc(100vh - 3rem);
  }
</style>

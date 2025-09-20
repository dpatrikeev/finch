<script lang="ts">
  import type { PageProps } from './$types';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { formatDistance } from 'date-fns';
  import { ru } from 'date-fns/locale';
  import type { HomeworkWithProgress } from '$lib/utils/homework';
  import type { StudentInfo } from '$lib/utils/user';
  import {
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    BarChart3,
    ArrowLeft,
    User,
    Mail,
    BookOpen,
    Edit3,
  } from 'lucide-svelte';

  interface Props extends PageProps {}

  const { data }: Props = $props();
  const { student, homework, isTeacherView } = data as {
    student: StudentInfo;
    homework: HomeworkWithProgress[];
    isTeacherView: boolean;
  };

  // Форматируем дату
  const formatDate = (dateStr: string) => {
    return formatDistance(new Date(dateStr), new Date(), {
      addSuffix: true,
      locale: ru,
    });
  };

  // Получить статус упражнения
  const getExerciseStatus = (exerciseId: string, hw: HomeworkWithProgress) => {
    const status = hw.exercises_status[exerciseId];
    if (!status)
      return { icon: Clock, color: 'text-gray-400', text: 'Не начато' };

    if (status.completed) {
      return { icon: CheckCircle, color: 'text-green-600', text: 'Выполнено' };
    } else if (status.attempts > 0) {
      return {
        icon: AlertCircle,
        color: 'text-orange-500',
        text: `Попыток: ${status.attempts}`,
      };
    }

    return { icon: Clock, color: 'text-gray-400', text: 'Не начато' };
  };

  // Получить цвет прогресс-бара
  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  // Общая статистика по всем домашкам
  const overallStats = $derived(() => {
    const totalHomework = homework.length;
    const completedHomework = homework.filter((hw) => hw.is_completed).length;
    const totalExercises = homework.reduce(
      (sum, hw) => sum + hw.exercises.length,
      0
    );
    const completedExercises = homework.reduce((sum, hw) => {
      return (
        sum +
        Object.values(hw.exercises_status).filter((status) => status.completed)
          .length
      );
    }, 0);
    const totalAttempts = homework.reduce(
      (sum, hw) => sum + (hw.total_attempts || 0),
      0
    );
    const correctAttempts = homework.reduce(
      (sum, hw) => sum + (hw.correct_attempts || 0),
      0
    );

    return {
      totalHomework,
      completedHomework,
      totalExercises,
      completedExercises,
      totalAttempts,
      correctAttempts,
      completionRate:
        totalHomework > 0
          ? Math.round((completedHomework / totalHomework) * 100)
          : 0,
      exerciseCompletionRate:
        totalExercises > 0
          ? Math.round((completedExercises / totalExercises) * 100)
          : 0,
      accuracy:
        totalAttempts > 0
          ? Math.round((correctAttempts / totalAttempts) * 100)
          : 0,
    };
  });
</script>

<svelte:head>
  <title>Домашние задания: {student.firstName} {student.lastName} - Finch</title
  >
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <!-- Навигация назад -->
  <div class="mb-6">
    <Button variant="ghost" href="/students" class="gap-2">
      <ArrowLeft class="w-4 h-4" />
      Назад к студентам
    </Button>
  </div>

  <!-- Информация о студенте -->
  <div class="bg-white rounded-lg shadow-md border p-6 mb-6">
    <div class="flex items-center gap-4 mb-6">
      {#if student.imageUrl}
        <img
          src={student.imageUrl}
          alt="{student.firstName} {student.lastName}"
          class="w-16 h-16 rounded-full"
        />
      {:else}
        <div
          class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl"
        >
          {student.firstName?.[0]?.toUpperCase()}{student.lastName?.[0]?.toUpperCase()}
        </div>
      {/if}

      <div class="flex-1">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">
          {student.firstName}
          {student.lastName}
        </h1>
        <div class="flex items-center text-gray-600 mb-2">
          <Mail class="w-4 h-4 mr-2" />
          {student.email}
        </div>
        <div class="flex items-center gap-6 text-sm text-gray-500">
          <span>Общая точность: {student.accuracy}%</span>
          <span>Выполнено упражнений: {student.totalExercises}</span>
        </div>
      </div>
    </div>

    <!-- Общая статистика по домашкам -->
    <div
      class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg"
    >
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600 mb-1">
          {overallStats().totalHomework}
        </div>
        <div class="text-sm text-gray-600">Всего домашек</div>
      </div>

      <div class="text-center">
        <div class="text-2xl font-bold text-green-600 mb-1">
          {overallStats().completionRate}%
        </div>
        <div class="text-sm text-gray-600">Завершено домашек</div>
      </div>

      <div class="text-center">
        <div class="text-2xl font-bold text-purple-600 mb-1">
          {overallStats().exerciseCompletionRate}%
        </div>
        <div class="text-sm text-gray-600">Выполнено упражнений</div>
      </div>

      <div class="text-center">
        <div class="text-2xl font-bold text-orange-600 mb-1">
          {overallStats().accuracy}%
        </div>
        <div class="text-sm text-gray-600">Точность ответов</div>
      </div>
    </div>
  </div>

  <!-- Список домашек -->
  <div class="flex items-center gap-3 mb-6">
    <BookOpen class="w-6 h-6 text-blue-600" />
    <h2 class="text-2xl font-bold">Домашние задания</h2>
  </div>

  {#if homework.length === 0}
    <div class="text-center py-12 bg-white rounded-lg border">
      <div class="text-gray-500 text-lg mb-4">
        Студенту пока не назначено домашних заданий
      </div>
      <p class="text-gray-400">
        Назначьте домашние задания со страницы студентов
      </p>
    </div>
  {:else}
    <div class="space-y-6">
      {#each homework as hw}
        <div class="bg-white rounded-lg shadow-md border p-6">
          <!-- Заголовок с прогрессом -->
          <div class="flex justify-between items-start mb-6">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <h3 class="text-xl font-semibold">
                  Домашнее задание #{hw.id}
                </h3>
                <Badge variant="outline">
                  {hw.exercises.length} упр.
                </Badge>
                {#if hw.is_completed}
                  <Badge variant="default" class="bg-green-500">
                    <CheckCircle class="w-3 h-3 mr-1" />
                    Завершено
                  </Badge>
                {:else if hw.progress_percentage > 0}
                  <Badge variant="secondary">В процессе</Badge>
                {/if}
              </div>

              <p class="text-gray-600 mb-3">
                Задано {formatDate(hw.created_at)}
              </p>

              <!-- Прогресс-бар -->
              <div class="mb-2">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-medium text-gray-700"
                    >Прогресс выполнения</span
                  >
                  <span class="text-sm text-gray-500"
                    >{hw.progress_percentage}%</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-300 {getProgressColor(
                      hw.progress_percentage
                    )}"
                    style="width: {hw.progress_percentage}%"
                  ></div>
                </div>
              </div>

              <!-- Статистика -->
              {#if hw.started_at}
                <div class="flex gap-4 text-sm text-gray-600">
                  <span>Начато: {formatDate(hw.started_at)}</span>
                  {#if hw.completed_at}
                    <span>Завершено: {formatDate(hw.completed_at)}</span>
                  {/if}
                  {#if hw.total_attempts}
                    <span>Попыток: {hw.total_attempts}</span>
                  {/if}
                </div>
              {/if}
            </div>

            <!-- Кнопки действий -->
            <div class="flex flex-col gap-2">
              {#if hw.progress_percentage > 0}
                <Button
                  variant="ghost"
                  size="sm"
                  href="/students/{student.id}/homework/{hw.id}"
                  class="gap-2"
                >
                  <BarChart3 class="w-4 h-4" />
                  Детальная статистика
                </Button>
              {:else}
                <Button
                  variant="outline"
                  size="sm"
                  href="/students/{student.id}/homework/{hw.id}"
                  class="gap-2"
                >
                  <Edit3 class="w-4 h-4" />
                  Редактировать
                </Button>
              {/if}
            </div>
          </div>

          <!-- Список упражнений с прогрессом -->
          {#if hw.exercises.length > 0}
            <div class="space-y-3">
              <h4 class="font-medium text-gray-700 mb-3">Упражнения:</h4>
              <div class="grid gap-3">
                {#each hw.exercises as exerciseId}
                  {@const status = getExerciseStatus(exerciseId, hw)}
                  {@const exerciseStatus = hw.exercises_status[exerciseId]}
                  {@const StatusIcon = status.icon}

                  <div
                    class="flex items-center justify-between p-4 bg-gray-50 rounded-md border-l-4 {status.color ===
                    'text-green-600'
                      ? 'border-green-500'
                      : status.color === 'text-orange-500'
                        ? 'border-orange-500'
                        : 'border-gray-300'}"
                  >
                    <div class="flex items-center gap-3">
                      <StatusIcon class="w-5 h-5 {status.color}" />
                      <Badge variant="secondary" class="font-mono">
                        {exerciseId}
                      </Badge>
                      <div class="flex flex-col">
                        <span class="text-gray-700">
                          Упражнение {exerciseId}
                        </span>
                        <span class="text-xs {status.color}">
                          {status.text}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center gap-3">
                      <!-- Показываем статистику по упражнению -->
                      {#if exerciseStatus?.attempts > 0}
                        <div class="text-right text-xs text-gray-500">
                          <div>Попыток: {exerciseStatus.attempts}</div>
                          {#if exerciseStatus.last_attempt_at}
                            <div>
                              Последняя: {formatDate(
                                exerciseStatus.last_attempt_at
                              )}
                            </div>
                          {/if}
                        </div>
                      {/if}

                      <Button variant="outline" size="sm" href="/{exerciseId}">
                        Посмотреть
                      </Button>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {:else}
            <p class="text-gray-500 italic">Нет упражнений в этом задании</p>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    min-height: calc(100vh - 3rem);
  }
</style>

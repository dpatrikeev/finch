<script lang="ts">
  import type { PageProps } from './$types';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { formatDistance } from 'date-fns';
  import { ru } from 'date-fns/locale';
  import type { HomeworkWithProgress } from '$lib/utils/homework';
  import {
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    BookOpen,
  } from 'lucide-svelte';

  interface Props extends PageProps {}

  const { data }: Props = $props();

  const homework: HomeworkWithProgress[] = data.homework;

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

  // Общая статистика для студента (упрощенная)
  const overallStats = $derived(() => {
    const totalHomework = homework.length;
    const completedHomework = homework.filter((hw) => hw.is_completed).length;
    const inProgressHomework = homework.filter(
      (hw) => hw.progress_percentage > 0 && !hw.is_completed
    ).length;
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

    return {
      totalHomework,
      completedHomework,
      inProgressHomework,
      totalExercises,
      completedExercises,
      completionRate:
        totalHomework > 0
          ? Math.round((completedHomework / totalHomework) * 100)
          : 0,
    };
  });
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <div class="flex items-center gap-3 mb-8">
    <TrendingUp class="w-8 h-8 text-blue-600" />
    <h1 class="text-3xl font-bold">Мои домашние задания</h1>
  </div>

  {#if homework.length === 0}
    <div class="text-center py-12">
      <div class="text-gray-500 text-lg mb-4">
        У вас пока нет домашних заданий
      </div>
      <p class="text-gray-400">
        Когда учитель даст вам задания, они появятся здесь
      </p>
    </div>
  {:else}
    <!-- Общая статистика для студента -->
    <div class="bg-white rounded-lg shadow-md border p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <BookOpen class="w-5 h-5 text-blue-600" />
        Общая статистика
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600 mb-1">
            {overallStats().totalHomework}
          </div>
          <div class="text-sm text-gray-600">Всего домашек</div>
        </div>

        <div class="text-center p-4 bg-green-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600 mb-1">
            {overallStats().completedHomework}
          </div>
          <div class="text-sm text-gray-600">Завершено</div>
        </div>

        <div class="text-center p-4 bg-orange-50 rounded-lg">
          <div class="text-2xl font-bold text-orange-600 mb-1">
            {overallStats().inProgressHomework}
          </div>
          <div class="text-sm text-gray-600">В процессе</div>
        </div>

        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600 mb-1">
            {overallStats().completionRate}%
          </div>
          <div class="text-sm text-gray-600">Процент выполнения</div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      {#each homework as hw}
        <div class="bg-white rounded-lg shadow-md border p-6">
          <!-- Заголовок с прогрессом -->
          <div class="flex justify-between items-start mb-6">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <h2 class="text-xl font-semibold">
                  Домашнее задание #{hw.id}
                </h2>
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

              <!-- Упрощенная статистика -->
              {#if hw.started_at}
                <div class="flex gap-4 text-sm text-gray-600">
                  <span>Начато: {formatDate(hw.started_at)}</span>
                  {#if hw.completed_at}
                    <span>Завершено: {formatDate(hw.completed_at)}</span>
                  {/if}
                </div>
              {/if}
            </div>
          </div>

          <!-- Список упражнений (упрощенная версия) -->
          {#if hw.exercises.length > 0}
            <div class="space-y-3">
              <h3 class="font-medium text-gray-700 mb-3">Упражнения:</h3>
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
                      <Button
                        variant={exerciseStatus?.completed
                          ? 'secondary'
                          : 'outline'}
                        size="sm"
                        href="/{exerciseId}"
                      >
                        {exerciseStatus?.completed ? 'Повторить' : 'Решать'}
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

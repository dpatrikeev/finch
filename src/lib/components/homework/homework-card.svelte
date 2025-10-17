<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { formatDistance } from 'date-fns';
  import { ru } from 'date-fns/locale';
  import CircleCheck from '@lucide/svelte/icons/circle-check';
  import Clock from '@lucide/svelte/icons/clock';
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
  import type { HomeworkWithProgress } from '$lib/types';

  interface Props {
    homework: HomeworkWithProgress;
    index: number;
  }

  let { homework, index }: Props = $props();

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
      return { icon: CircleCheck, color: 'text-green-600', text: 'Выполнено' };
    } else if (status.attempts > 0) {
      return {
        icon: CircleAlert,
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
</script>

<div class="bg-white rounded-lg shadow-md border p-4 md:p-6 mb-6">
  <!-- Заголовок с прогрессом -->
  <div class="mb-4 md:mb-6">
    <div
      class="flex flex-wrap items-center gap-2 mb-3 md:flex-nowrap md:justify-between"
    >
      <div class="flex items-center gap-3">
        <h3 class="text-lg md:text-xl font-semibold">
          Домашнее задание #{index + 1}
        </h3>
        <Badge variant="outline">
          {homework.exercises.length} упр.
        </Badge>
      </div>

      <div class="flex items-center gap-2 w-full md:w-auto">
        {#if homework.is_completed || homework.progress_percentage === 100}
          <Badge
            class="bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
          >
            <CircleCheck class="w-3 h-3 mr-1" />
            <span>Завершено</span>
          </Badge>
        {:else if homework.progress_percentage > 0}
          <Badge
            class="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
          >
            В процессе
          </Badge>
        {/if}
      </div>
    </div>

    <p class="text-sm md:text-base text-gray-600 mb-3">
      Задано {formatDate(homework.created_at)}
    </p>

    <!-- Прогресс-бар -->
    <div class="mb-2">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs md:text-sm font-medium text-gray-700">
          <span>Прогресс</span>
        </span>
        <span class="text-xs md:text-sm text-gray-500">
          {homework.progress_percentage}%
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all duration-300 {getProgressColor(
            homework.progress_percentage
          )}"
          style="width: {homework.progress_percentage}%"
        ></div>
      </div>
    </div>

    <!-- Статистика -->
    {#if homework.started_at}
      <div
        class="flex justify-between md:flex-row md:gap-4 text-xs md:text-sm text-gray-600"
      >
        <span>Начато: {formatDate(homework.started_at)}</span>
        {#if homework.completed_at}
          <span>Завершено: {formatDate(homework.completed_at)}</span>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Список упражнений с прогрессом -->
  {#if homework.exercises.length > 0}
    <div class="space-y-3">
      <h4 class="text-sm md:text-base md:font-medium text-gray-700 mb-3">
        Упражнения:
      </h4>
      <div class="grid gap-3">
        {#each homework.exercises as exerciseId}
          {@const status = getExerciseStatus(exerciseId, homework)}
          {@const exerciseStatus = homework.exercises_status[exerciseId]}
          {@const StatusIcon = status.icon}

          <div
            class="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between md:p-4 bg-gray-50 rounded-md border-l-4 {status.color ===
            'text-green-600'
              ? 'border-green-500'
              : status.color === 'text-orange-500'
                ? 'border-orange-500'
                : 'border-gray-300'}"
          >
            <div
              class="flex items-center justify-between md:justify-start md:gap-3"
            >
              <div class="flex items-center gap-2 md:gap-3">
                <StatusIcon class="w-4 h-4 md:w-5 md:h-5 {status.color}" />
                <Badge variant="secondary" class="font-mono text-xs">
                  {exerciseId}
                </Badge>
                <div class="flex flex-col">
                  <span class="text-sm md:text-base text-gray-700">
                    Упражнение {exerciseId}
                  </span>
                  <span class="text-xs {status.color}">
                    {status.text}
                  </span>
                </div>
              </div>
            </div>

            <div
              class="flex flex-col gap-2 md:flex-row md:items-center md:gap-3"
            >
              {#if exerciseStatus?.attempts > 0}
                <div class="text-xs text-gray-500 md:text-right">
                  <div>Попыток: {exerciseStatus.attempts}</div>
                  {#if exerciseStatus.last_attempt_at}
                    <div>
                      Последняя: {formatDate(exerciseStatus.last_attempt_at)}
                    </div>
                  {/if}
                </div>
              {/if}

              <Button
                variant="outline"
                size="sm"
                href="/exercises/{exerciseId}"
                class="text-xs md:text-sm px-3 py-1 md:px-4 md:py-2"
              >
                <span>Посмотреть упражнение</span>
              </Button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <p class="text-sm md:text-base text-gray-500 italic">
      Нет упражнений в этом задании
    </p>
  {/if}
</div>

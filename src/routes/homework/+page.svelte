<script lang="ts">
  import type { PageProps } from './$types';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import { formatDistance } from 'date-fns';
  import { ru } from 'date-fns/locale';
  import type { HomeworkWithProgress } from '$lib/utils/homework';
  import {
    CircleCheck,
    Clock,
    CircleAlert,
    BookOpenCheck,
    BookOpen,
    ListCheck,
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

<section class="mx-auto p-5 md:p-10">
  <div class="flex items-center gap-3 mb-8">
    <BookOpenCheck class="w-6 h-6 text-primary" />
    <h1 class="text-2xl md:text-3xl font-medium text-foreground">
      Мои домашние задания
    </h1>
  </div>

  {#if homework.length === 0}
    <Card.Root class="text-center py-16">
      <Card.Content class="space-y-4">
        <div class="flex justify-center">
          <div class="p-4 bg-muted rounded-full">
            <ListCheck class="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
        <div class="space-y-2">
          <h3 class="text-xl font-semibold text-foreground">
            У вас пока нет домашних заданий
          </h3>
          <p class="text-muted-foreground max-w-md mx-auto">
            Когда учитель даст вам задания, они появятся здесь
          </p>
        </div>
      </Card.Content>
    </Card.Root>
  {:else}
    <!-- Общая статистика для студента -->
    <Card.Root class="mb-6">
      <Card.Content class="p-4 md:p-6">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen class="w-5 h-5 text-blue-600" />
          Общая статистика
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div class="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
            <div class="text-xl md:text-2xl font-bold text-blue-600 mb-1">
              {overallStats().totalHomework}
            </div>
            <div class="text-xs md:text-sm text-gray-600">Всего домашек</div>
          </div>

          <div class="text-center p-3 md:p-4 bg-green-50 rounded-lg">
            <div class="text-xl md:text-2xl font-bold text-green-600 mb-1">
              {overallStats().completedHomework}
            </div>
            <div class="text-xs md:text-sm text-gray-600">Завершено</div>
          </div>

          <div class="text-center p-3 md:p-4 bg-orange-50 rounded-lg">
            <div class="text-xl md:text-2xl font-bold text-orange-600 mb-1">
              {overallStats().inProgressHomework}
            </div>
            <div class="text-xs md:text-sm text-gray-600">В процессе</div>
          </div>

          <div class="text-center p-3 md:p-4 bg-purple-50 rounded-lg">
            <div class="text-xl md:text-2xl font-bold text-purple-600 mb-1">
              {overallStats().completionRate}%
            </div>
            <div class="text-xs md:text-sm text-gray-600">
              Процент выполнения
            </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>

    <div class="space-y-6">
      {#each homework as hw}
        <Card.Root>
          <Card.Content class="p-4 md:p-6">
            <!-- Заголовок с прогрессом -->
            <div class="mb-6">
              <div
                class="flex flex-wrap items-center gap-2 mb-3 md:flex-nowrap md:justify-between"
              >
                <div class="flex items-center gap-3">
                  <h2 class="text-lg md:text-xl font-semibold">
                    Домашнее задание #{hw.id}
                  </h2>
                  <Badge variant="outline">
                    {hw.exercises.length} упр.
                  </Badge>
                </div>

                {#if hw.is_completed || hw.progress_percentage > 0}
                  <div class="flex items-center gap-2 w-full md:w-auto">
                    {#if hw.is_completed}
                      <Badge
                        class="bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                      >
                        <CircleCheck class="w-3 h-3 mr-1" />
                        <span class="hidden sm:inline">Завершено</span>
                        <span class="sm:hidden">Готово</span>
                      </Badge>
                    {:else if hw.progress_percentage > 0}
                      <Badge
                        class="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                      >
                        В процессе
                      </Badge>
                    {/if}
                  </div>
                {/if}
              </div>

              <p class="text-sm md:text-base text-gray-600 mb-3">
                Задано {formatDate(hw.created_at)}
              </p>

              <!-- Прогресс-бар -->
              <div class="mb-2">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-xs md:text-sm font-medium text-gray-700">
                    <span class="hidden sm:inline">Прогресс выполнения</span>
                    <span class="sm:hidden">Прогресс</span>
                  </span>
                  <span class="text-xs md:text-sm text-gray-500">
                    {hw.progress_percentage}%
                  </span>
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
                <div
                  class="flex flex-col gap-1 md:flex-row md:gap-4 text-xs md:text-sm text-gray-600"
                >
                  <span>Начато: {formatDate(hw.started_at)}</span>
                  {#if hw.completed_at}
                    <span>Завершено: {formatDate(hw.completed_at)}</span>
                  {/if}
                </div>
              {/if}
            </div>

            <!-- Список упражнений -->
            {#if hw.exercises.length > 0}
              <div class="space-y-3">
                <h3
                  class="text-sm md:text-base md:font-medium text-gray-700 mb-3"
                >
                  Упражнения:
                </h3>
                <div class="grid gap-3">
                  {#each hw.exercises as exerciseId}
                    {@const status = getExerciseStatus(exerciseId, hw)}
                    {@const exerciseStatus = hw.exercises_status[exerciseId]}
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
                          <StatusIcon
                            class="w-4 h-4 md:w-5 md:h-5 {status.color}"
                          />
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

                      <div class="mt-3 md:mt-0">
                        <Button
                          variant={exerciseStatus?.completed
                            ? 'secondary'
                            : 'outline'}
                          size="sm"
                          href="/{exerciseId}"
                          class="text-xs md:text-sm px-3 py-1 md:px-4 md:py-2"
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
          </Card.Content>
        </Card.Root>
      {/each}
    </div>
  {/if}
</section>

<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { formatDistance } from 'date-fns';
  import { ru } from 'date-fns/locale';
  import type { HomeworkWithProgress } from '$lib/features/homework/types/homework.types';
  import type { StudentInfo } from '$lib/utils/user';
  import {
    AssignHomeworkButton,
    HomeworkCard,
    EmptyHomework,
  } from '$lib/features/homework';
  import { toast } from 'svelte-sonner';
  import {
    CircleCheck,
    Clock,
    CircleAlert,
    ArrowLeft,
    Mail,
    BookOpen,
  } from 'lucide-svelte';

  interface Props {
    data: {
      student: StudentInfo;
      homework: HomeworkWithProgress[];
      exercises: Array<{ id: string; title: string; description?: string }>;
      isTeacherView: boolean;
    };
  }

  const { data }: Props = $props();
  const { student, homework, exercises } = data;

  // Функция для обработки успешного назначения домашки
  const handleHomeworkAssigned = async () => {
    // Показываем уведомление об успехе
    toast.success(
      `Домашнее задание назначено студенту ${student.firstName} ${student.lastName}!`
    );

    // Небольшая задержка для лучшего UX (пользователь видит уведомление)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Перезагружаем страницу для обновления данных
    // Это надежное решение для обновления после server actions в SvelteKit
    window.location.reload();
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
          alt="{student.firstName} {student.lastName}"
          class="w-12 h-12 md:w-16 md:h-16 rounded-full self-start md:self-auto"
        />
      {:else}
        <div
          class="w-12 h-12 md:w-16 md:h-16 text-lg md:text-xl rounded-full bg-blue-500 flex items-center justify-center text-white font-bold self-start md:self-auto"
        >
          {student.firstName?.[0]?.toUpperCase()}{student.lastName?.[0]?.toUpperCase()}
        </div>
      {/if}

      <div class="flex-1">
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          {student.firstName}
          {student.lastName}
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
          {overallStats().totalHomework}
        </div>
        <div class="text-xs md:text-sm text-gray-600">Всего домашек</div>
      </div>

      <div class="text-center">
        <div class="text-xl md:text-2xl font-bold text-green-600 mb-1">
          {overallStats().completionRate}%
        </div>
        <div class="text-xs md:text-sm text-gray-600">Завершено домашек</div>
      </div>

      <div class="text-center">
        <div class="text-xl md:text-2xl font-bold text-purple-600 mb-1">
          {overallStats().exerciseCompletionRate}%
        </div>
        <div class="text-xs md:text-sm text-gray-600">Выполнено упражнений</div>
      </div>

      <div class="text-center">
        <div class="text-xl md:text-2xl font-bold text-orange-600 mb-1">
          {overallStats().accuracy}%
        </div>
        <div class="text-xs md:text-sm text-gray-600">Точность ответов</div>
      </div>
    </div>
  </div>

  <!-- Список домашек -->
  <div class="flex items-center justify-between mb-4 md:mb-6">
    <div class="flex items-center gap-3">
      <BookOpen class="w-5 h-5 md:w-6 md:h-6" />
      <h2 class="text-xl md:text-2xl font-medium">Домашние задания</h2>
    </div>
    {#if homework.length > 0}
      <AssignHomeworkButton
        {student}
        {exercises}
        onassigned={handleHomeworkAssigned}
        variant="outline"
        class="gap-2"
      />
    {/if}
  </div>

  {#if homework.length === 0}
    <EmptyHomework
      isTeacher={true}
      {student}
      {exercises}
      onAssignHomework={handleHomeworkAssigned}
    />
  {:else}
    <div class="space-y-4 md:space-y-6">
      {#each homework as hw}
        <HomeworkCard homework={hw} studentId={student.id} showDetails={true} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    min-height: calc(100vh - 3rem);
  }
</style>

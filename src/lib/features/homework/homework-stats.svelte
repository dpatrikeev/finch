<script lang="ts">
  import { Mail } from 'lucide-svelte';
  import type { HomeworkWithProgress } from './types';
  import { calculateOverallStats } from './utils';

  interface Props {
    homework: HomeworkWithProgress[];
    user: {
      firstName: string;
      lastName: string;
      email: string;
      imageUrl?: string;
      accuracy: number;
      totalExercises: number;
    };
  }

  const { homework, user }: Props = $props();

  // Общая статистика по всем домашкам
  const overallStats = $derived(calculateOverallStats(homework));
</script>

<div class="bg-white rounded-lg shadow-md border p-4 md:p-6 mb-4 md:mb-6">
  <div class="flex flex-col gap-4 md:flex-row md:items-center mb-4 md:mb-6">
    {#if user.imageUrl}
      <img
        src={user.imageUrl}
        alt="{user.firstName} {user.lastName}"
        class="w-12 h-12 md:w-16 md:h-16 rounded-full self-start md:self-auto"
      />
    {:else}
      <div
        class="w-12 h-12 md:w-16 md:h-16 text-lg md:text-xl rounded-full bg-blue-500 flex items-center justify-center text-white font-bold self-start md:self-auto"
      >
        {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
      </div>
    {/if}

    <div class="flex-1">
      <h1 class="text-xl md:text-2xl font-bold text-gray-900 mb-1">
        {user.firstName}
        {user.lastName}
      </h1>
      <div class="flex items-center text-gray-600 mb-2">
        <Mail class="w-4 h-4 mr-2" />
        <span class="text-sm md:text-base">{user.email}</span>
      </div>
      <div
        class="flex flex-col gap-1 md:flex-row md:items-center md:gap-6 text-xs md:text-sm text-gray-500"
      >
        <span>Общая точность: {user.accuracy}%</span>
        <span>Выполнено упражнений: {user.totalExercises}</span>
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
      <div class="text-xs md:text-sm text-gray-600">Выполнено упражнений</div>
    </div>

    <div class="text-center">
      <div class="text-xl md:text-2xl font-bold text-orange-600 mb-1">
        {overallStats.accuracy}%
      </div>
      <div class="text-xs md:text-sm text-gray-600">Точность ответов</div>
    </div>
  </div>
</div>

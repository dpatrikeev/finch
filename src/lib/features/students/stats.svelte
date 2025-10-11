<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import type { StudentsStatsData } from './types';

  interface Props {
    stats: StudentsStatsData;
  }

  const { stats }: Props = $props();
</script>

<Card.Root class="mb-8">
  <Card.Content class="p-6">
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      <div class="text-center p-4 bg-blue-50 rounded-lg">
        <div class="text-xl md:text-2xl font-bold text-blue-600 mb-1">
          {stats.totalStudents}
        </div>
        <div class="text-xs text-muted-foreground">
          <span class="md:hidden">Студентов</span>
          <span class="hidden md:inline">Всего студентов</span>
        </div>
      </div>

      <div class="text-center p-4 bg-green-50 rounded-lg">
        <div class="text-xl md:text-2xl font-bold text-green-600 mb-1">
          {stats.totalExercises}
        </div>
        <div class="text-xs text-muted-foreground">
          <span class="md:hidden">Упражнений</span>
          <span class="hidden md:inline">Доступно упражнений</span>
        </div>
      </div>

      <div class="hidden md:block text-center p-4 bg-purple-50 rounded-lg">
        <div class="text-2xl font-bold text-purple-600 mb-1">
          {stats.activeStudents}
        </div>
        <div class="text-xs text-muted-foreground">Активных студентов</div>
      </div>

      <div class="hidden md:block text-center p-4 bg-orange-50 rounded-lg">
        <div class="text-2xl font-bold text-orange-600 mb-1">
          {stats.totalCorrectAnswers}
        </div>
        <div class="text-xs text-muted-foreground">Правильных ответов</div>
      </div>
    </div>
  </Card.Content>
</Card.Root>

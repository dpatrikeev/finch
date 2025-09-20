<script lang="ts">
  import type { StudentInfo } from '$lib/utils/user';
  import { BookOpen, Target, Mail, PlusCircle, BarChart3 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';

  interface Props {
    student: StudentInfo;
    onassignHomework?: (event: CustomEvent<{ student: StudentInfo }>) => void;
  }

  const { student, onassignHomework }: Props = $props();

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-green-500';
    if (accuracy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAccuracyTextColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAssignHomework = () => {
    const event = new CustomEvent('assignHomework', {
      detail: { student },
    });
    onassignHomework?.(event);
  };
</script>

<div
  class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
>
  <div class="flex items-center mb-4">
    {#if student.imageUrl}
      <img
        src={student.imageUrl}
        alt="{student.firstName} {student.lastName}"
        class="w-12 h-12 rounded-full mr-4"
      />
    {:else}
      <div
        class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-4"
      >
        {student.firstName?.[0]?.toUpperCase()}{student.lastName?.[0]?.toUpperCase()}
      </div>
    {/if}
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-gray-900">
        {student.firstName}
        {student.lastName}
      </h3>
      <div class="flex items-center text-gray-500 text-sm">
        <Mail class="w-4 h-4 mr-1" />
        {student.email}
      </div>
    </div>
  </div>

  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center text-gray-600">
        <BookOpen class="w-4 h-4 mr-2" />
        <span class="text-sm">Выполнено упражнений</span>
      </div>
      <span class="font-semibold text-lg">{student.totalExercises}</span>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center text-gray-600">
        <Target class="w-4 h-4 mr-2" />
        <span class="text-sm">Точность</span>
      </div>
      <div class="flex items-center">
        <span
          class="font-semibold mr-3 {getAccuracyTextColor(student.accuracy)}"
          >{student.accuracy}%</span
        >
        <div class="w-20 bg-gray-200 rounded-full h-2">
          <div
            class="{getAccuracyColor(
              student.accuracy
            )} h-2 rounded-full transition-all duration-300"
            style="width: {student.accuracy}%"
          ></div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-500">Правильных ответов:</span>
      <span class="font-medium"
        >{student.correctAnswers} из {student.totalExercises}</span
      >
    </div>
  </div>

  <!-- Кнопки действий -->
  <div class="mt-6 pt-4 border-t space-y-2">
    <Button
      variant="outline"
      size="sm"
      onclick={handleAssignHomework}
      class="w-full gap-2"
    >
      <PlusCircle class="w-4 h-4" />
      Назначить домашку
    </Button>

    <Button
      variant="ghost"
      size="sm"
      href="/students/{student.id}/homework"
      class="w-full gap-2"
    >
      <BarChart3 class="w-4 h-4" />
      Посмотреть статистику
    </Button>
  </div>
</div>

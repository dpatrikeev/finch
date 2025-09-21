<script lang="ts">
  import { BookOpen, Target, Mail, User } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { AssignHomeworkButton } from '$lib/features/homework';
  import {
    getAccuracyColor,
    getAccuracyTextColor,
    formatStudentInitials,
    formatStudentFullName,
  } from '../utils/students.utils';
  import type { StudentCardProps } from '../types/students.types';
  import type { StudentInfo as OldStudentInfo } from '$lib/utils/user';

  const { student, exercises, onassigned }: StudentCardProps = $props();
</script>

<div
  class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
>
  <div class="flex items-center mb-4">
    {#if student.imageUrl}
      <img
        src={student.imageUrl}
        alt={formatStudentFullName(student.firstName, student.lastName)}
        class="w-12 h-12 rounded-full mr-4"
      />
    {:else}
      <div
        class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-4"
      >
        {formatStudentInitials(student.firstName, student.lastName)}
      </div>
    {/if}
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-gray-900">
        {formatStudentFullName(student.firstName, student.lastName)}
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

  <div class="mt-6 flex items-center gap-2 flex-col">
    <AssignHomeworkButton
      student={student as OldStudentInfo}
      {exercises}
      {onassigned}
      class="w-full flex-1 min-h-10"
    />

    <Button
      variant="ghost"
      size="sm"
      href="/students/{student.id}"
      class="w-full flex-1 min-h-10"
    >
      <User class="w-4 h-4" />
      Открыть профиль
    </Button>
  </div>
</div>

<script lang="ts">
  import { CircleCheck, Circle, BookOpen, User } from 'lucide-svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { toast } from 'svelte-sonner';
  import { assignHomework } from '$lib/remote/homework.remote';
  import type { BaseUser, ExerciseInfo } from '$lib/types/students.types';

  interface Props {
    open?: boolean;
    student: BaseUser;
    exercises: ExerciseInfo[];
    onclose?: () => void;
    onassigned?: () => void;
  }

  const {
    open = false,
    student,
    exercises,
    onclose,
    onassigned,
  }: Props = $props();

  let selectedExercises = $state<Set<string>>(new Set());
  let isSubmitting = $state(false);

  const toggleExercise = (exerciseId: string) => {
    const newSelected = new Set(selectedExercises);
    if (newSelected.has(exerciseId)) {
      newSelected.delete(exerciseId);
    } else {
      newSelected.add(exerciseId);
    }
    selectedExercises = newSelected;
  };

  const handleClose = () => {
    selectedExercises = new Set();
    isSubmitting = false;
    onclose?.();
  };

  const handleSubmit = async () => {
    if (!student || selectedExercises.size === 0) return;

    isSubmitting = true;

    try {
      await assignHomework({
        studentId: student.id,
        exercises: Array.from(selectedExercises),
      });

      toast.success('Домашнее задание успешно назначено');
      onassigned?.();
      handleClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при назначении домашнего задания';
      toast.error(errorMessage);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Dialog.Root {open} onOpenChange={(newOpen) => !newOpen && handleClose()}>
  <Dialog.Content class="sm:max-w-[600px] max-h-[80vh]">
    <Dialog.Header>
      <Dialog.Title>Назначить домашнее задание</Dialog.Title>
      <Dialog.Description>
        Выберите упражнения для назначения студенту
      </Dialog.Description>
    </Dialog.Header>

    {#if student}
      <!-- Информация о студенте -->
      <div
        class="flex items-center gap-3 mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg"
      >
        <div
          class="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full text-white font-medium"
        >
          <User class="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <div>
          <h3 class="text-sm md:text-base font-medium text-gray-900">
            {student.firstName || ''}
            {student.lastName || ''}
          </h3>
          <p class="text-xs md:text-sm text-gray-600">
            {student.email}
          </p>
        </div>
      </div>

      <!-- Выбор упражнений -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-4">
          <BookOpen class="w-5 h-5 text-gray-600" />
          <h4 class="font-medium text-gray-900">Выберите упражнения</h4>
          {#if selectedExercises.size > 0}
            <Badge variant="secondary">{selectedExercises.size} выбрано</Badge>
          {/if}
        </div>

        <div class="space-y-2 max-h-64 overflow-y-auto">
          {#each exercises as exercise}
            <button
              type="button"
              onclick={() => toggleExercise(exercise.id)}
              class="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors {selectedExercises.has(
                exercise.id
              )
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'}"
            >
              <div class="flex-shrink-0">
                {#if selectedExercises.has(exercise.id)}
                  <CircleCheck class="w-5 h-5 text-blue-600" />
                {:else}
                  <Circle class="w-5 h-5 text-gray-400" />
                {/if}
              </div>

              <div class="flex-1 text-left">
                <div class="flex items-center gap-2 mb-1">
                  <Badge variant="outline" class="font-mono text-xs">
                    {exercise.id}
                  </Badge>
                  <span class="font-medium text-gray-900">{exercise.title}</span
                  >
                </div>
                {#if exercise.description}
                  <p class="text-sm text-gray-600 line-clamp-2">
                    {exercise.description}
                  </p>
                {/if}
              </div>
            </button>
          {/each}
        </div>

        {#if exercises.length === 0}
          <div class="text-center py-8 text-gray-500">
            <BookOpen class="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Нет доступных упражнений</p>
          </div>
        {/if}
      </div>
    {:else}
      <div class="text-center py-8 text-gray-500">
        <p>Студент не выбран</p>
      </div>
    {/if}

    <Dialog.Footer>
      <Button variant="ghost" onclick={handleClose} disabled={isSubmitting}>
        Отмена
      </Button>
      <Button
        onclick={handleSubmit}
        disabled={selectedExercises.size === 0 || isSubmitting}
      >
        {#if isSubmitting}
          Назначение...
        {:else}
          Назначить ({selectedExercises.size})
        {/if}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 2;
  }
</style>

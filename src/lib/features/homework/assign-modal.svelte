<script lang="ts">
  import { CircleCheck, Circle, BookOpen } from 'lucide-svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { toast } from 'svelte-sonner';
  import { assignHomework } from './commands.remote';
  import User from '$lib/features/user/user.svelte';

  import type { BaseUser, ExerciseInfo } from '$lib/features/students/types';

  interface Props {
    student: BaseUser;
    exercises: ExerciseInfo[];
    isOpen?: boolean;
    onClose?: () => void;
    onAssigned?: () => void;
  }

  const {
    isOpen = false,
    student,
    exercises,
    onClose,
    onAssigned,
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
    onClose?.();
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
      onAssigned?.();
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

<Dialog.Root
  open={isOpen}
  onOpenChange={(newOpen) => !newOpen && handleClose()}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Дать домашнее задание</Dialog.Title>
      <Dialog.Description>Выберите упражнения для студента</Dialog.Description>
    </Dialog.Header>
    <div class="flex items-center gap-3 p-3 md:p-4 bg-blue-50 rounded-lg mb-4">
      <User {student} />
    </div>
    <div class="flex items-center gap-2">
      <BookOpen class="w-5 h-5 text-gray-600" />
      <h4 class="font-medium text-gray-900">Выберите упражнения</h4>
      {#if selectedExercises.size > 0}
        <Badge variant="secondary">{selectedExercises.size} выбрано</Badge>
      {/if}
    </div>

    <ScrollArea>
      {#each exercises as exercise}
        <button
          type="button"
          onclick={() => toggleExercise(exercise.id)}
          class="mb-2 w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors {selectedExercises.has(
            exercise.id
          )
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200'}"
        >
          {#if selectedExercises.has(exercise.id)}
            <CircleCheck class="w-5 h-5 text-blue-600 flex-shrink-0" />
          {:else}
            <Circle class="w-5 h-5 text-gray-400 flex-shrink-0" />
          {/if}

          <div class="flex-1 text-left">
            <div class="flex items-center gap-2 mb-1">
              <Badge variant="outline" class="font-mono text-xs">
                {exercise.id}
              </Badge>
              <span class="font-medium text-gray-900">{exercise.title}</span>
            </div>
            {#if exercise.description}
              <p class="text-sm text-gray-600 line-clamp-2">
                {exercise.description}
              </p>
            {/if}
          </div>
        </button>
      {/each}

      {#if exercises.length === 0}
        <div class="text-center py-8 text-gray-500">
          <BookOpen class="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Нет доступных упражнений</p>
        </div>
      {/if}
    </ScrollArea>
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

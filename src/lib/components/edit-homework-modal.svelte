<script lang="ts">
  import { Dialog } from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Check, Loader2, Edit3, Trash2, AlertTriangle } from 'lucide-svelte';
  import { enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import type { StudentInfo } from '$lib/utils/user';
  import type { HomeworkItem } from '$lib/utils/homework';

  interface Props {
    open: boolean;
    homework: HomeworkItem;
    student: StudentInfo;
    exercises: { id: string; title: string; description?: string }[];
    onclose?: () => void;
  }

  const { open, homework, student, exercises, onclose }: Props = $props();

  let selectedExercises: string[] = $state([...homework.exercises]);
  let isSubmitting = $state(false);
  let showDeleteConfirm = $state(false);
  let isDeleting = $state(false);

  function handleClose() {
    onclose?.();
    selectedExercises = [...homework.exercises]; // Reset to original
    showDeleteConfirm = false;
  }

  function toggleExercise(exerciseId: string) {
    if (selectedExercises.includes(exerciseId)) {
      selectedExercises = selectedExercises.filter((id) => id !== exerciseId);
    } else {
      selectedExercises = [...selectedExercises, exerciseId];
    }
  }

  function handleSubmit() {
    isSubmitting = true;
  }

  function handleSuccess() {
    toast.success('Домашнее задание успешно обновлено!');
    isSubmitting = false;
    handleClose();
  }

  function handleError(error: any) {
    toast.error(error?.message || 'Ошибка при обновлении домашнего задания');
    isSubmitting = false;
  }

  function handleDeleteClick() {
    showDeleteConfirm = true;
  }

  function handleDeleteCancel() {
    showDeleteConfirm = false;
  }

  function handleDeleteConfirm() {
    isDeleting = true;
  }

  function handleDeleteSuccess() {
    toast.success('Домашнее задание успешно удалено!');
    isDeleting = false;
    handleClose();
    // Перенаправляем на страницу домашек студента
    goto(`/students/${student.id}/homework`);
  }

  function handleDeleteError(error: any) {
    toast.error(error?.message || 'Ошибка при удалении домашнего задания');
    isDeleting = false;
    showDeleteConfirm = false;
  }

  // Проверяем, есть ли изменения
  const hasChanges = $derived(() => {
    const originalSorted = [...homework.exercises].sort();
    const selectedSorted = [...selectedExercises].sort();
    return JSON.stringify(originalSorted) !== JSON.stringify(selectedSorted);
  });
</script>

<Dialog {open} onclose={handleClose}>
  {#snippet children()}
    {#if !showDeleteConfirm}
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <Edit3 class="w-6 h-6 text-blue-600" />
          <h2 class="text-2xl font-bold">Редактировать домашнее задание</h2>
        </div>

        <!-- Информация о домашке и студенте -->
        <div class="p-4 bg-blue-50 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-blue-900">
              Домашнее задание #{homework.id}
            </h3>
            <Badge variant="outline">
              Создано: {new Date(homework.created_at).toLocaleDateString(
                'ru-RU'
              )}
            </Badge>
          </div>
          <p class="text-blue-700">
            Студент: <span class="font-medium"
              >{student.firstName} {student.lastName}</span
            >
            ({student.email})
          </p>
        </div>

        <!-- Выбор упражнений -->
        <div>
          <h3 class="text-lg font-semibold mb-3">
            Упражнения ({selectedExercises.length} выбрано)
          </h3>

          <div class="space-y-2 max-h-80 overflow-y-auto pr-2">
            {#each exercises as exercise}
              <button
                type="button"
                class="flex items-center justify-between w-full p-3 border rounded-md transition-colors
                {selectedExercises.includes(exercise.id)
                  ? 'bg-blue-50 border-blue-400'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}"
                onclick={() => toggleExercise(exercise.id)}
              >
                <div class="flex items-center gap-3 text-left">
                  {#if selectedExercises.includes(exercise.id)}
                    <Check class="w-5 h-5 text-blue-600" />
                  {:else}
                    <div class="w-5 h-5 border rounded-full bg-white"></div>
                  {/if}
                  <div>
                    <div class="flex items-center gap-2">
                      <Badge variant="outline" class="font-mono text-xs">
                        {exercise.id}
                      </Badge>
                      <span class="font-medium text-gray-800"
                        >{exercise.title}</span
                      >
                    </div>
                    {#if exercise.description}
                      <p class="text-sm text-gray-500 mt-1">
                        {exercise.description}
                      </p>
                    {/if}
                  </div>
                </div>
              </button>
            {/each}
          </div>

          {#if exercises.length === 0}
            <div class="text-center py-8 text-gray-500">
              <p>Нет доступных упражнений</p>
            </div>
          {/if}
        </div>

        <!-- Кнопки действий -->
        <div class="flex justify-between gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="destructive"
            onclick={handleDeleteClick}
            class="gap-2"
          >
            <Trash2 class="w-4 h-4" />
            Удалить домашку
          </Button>

          <div class="flex gap-3">
            <Button type="button" variant="outline" onclick={handleClose}>
              Отмена
            </Button>

            <form
              method="POST"
              action="?/updateHomework"
              use:enhance={() => {
                handleSubmit();
                return async ({ result }) => {
                  if (result.type === 'success') {
                    handleSuccess();
                  } else if (result.type === 'failure') {
                    handleError(result.data);
                  }
                  isSubmitting = false;
                };
              }}
              class="contents"
            >
              <input
                type="hidden"
                name="exercises"
                value={JSON.stringify(selectedExercises)}
              />
              <Button
                type="submit"
                disabled={isSubmitting ||
                  selectedExercises.length === 0 ||
                  !hasChanges()}
              >
                {#if isSubmitting}
                  <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                {/if}
                Сохранить изменения
              </Button>
            </form>
          </div>
        </div>
      </div>
    {:else}
      <!-- Подтверждение удаления -->
      <div class="space-y-6">
        <div class="flex items-center gap-3 text-red-600">
          <AlertTriangle class="w-6 h-6" />
          <h2 class="text-2xl font-bold">Подтверждение удаления</h2>
        </div>

        <div class="p-4 bg-red-50 rounded-lg border border-red-200">
          <p class="text-red-800 mb-3">
            Вы действительно хотите удалить домашнее задание #{homework.id}?
          </p>
          <p class="text-red-700 text-sm">
            <strong>Внимание:</strong> Это действие нельзя будет отменить. Вся статистика
            и прогресс студента по этой домашке будут потеряны.
          </p>
        </div>

        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-gray-700 mb-2">
            <strong>Студент:</strong>
            {student.firstName}
            {student.lastName}
          </p>
          <p class="text-gray-700 mb-2">
            <strong>Упражнений:</strong>
            {homework.exercises.length}
          </p>
          <p class="text-gray-700">
            <strong>Создано:</strong>
            {new Date(homework.created_at).toLocaleDateString('ru-RU')}
          </p>
        </div>

        <!-- Кнопки подтверждения -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onclick={handleDeleteCancel}
            disabled={isDeleting}
          >
            Отмена
          </Button>

          <form
            method="POST"
            action="?/deleteHomework"
            use:enhance={() => {
              handleDeleteConfirm();
              return async ({ result }) => {
                if (result.type === 'success') {
                  handleDeleteSuccess();
                } else if (result.type === 'failure') {
                  handleDeleteError(result.data);
                }
                isDeleting = false;
              };
            }}
            class="contents"
          >
            <Button
              type="submit"
              variant="destructive"
              disabled={isDeleting}
              class="gap-2"
            >
              {#if isDeleting}
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              {/if}
              <Trash2 class="w-4 h-4" />
              Да, удалить
            </Button>
          </form>
        </div>
      </div>
    {/if}
  {/snippet}
</Dialog>

<style>
  :global(.contents) {
    display: contents;
  }
</style>

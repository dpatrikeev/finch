<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import {
    Check,
    LoaderCircle,
    SquarePen,
    Trash2,
    TriangleAlert,
  } from 'lucide-svelte';
  import { enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import { format } from 'date-fns';
  import { ru } from 'date-fns/locale';
  import type { EditHomeworkProps } from '../../types/homework.types';
  import { hasExerciseChanges } from '../../utils/homework.utils';

  const {
    open,
    homework,
    student,
    exercises,
    onclose,
    onupdated,
  }: EditHomeworkProps = $props();

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
    onupdated?.();
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
    // Перенаправляем на страницу студента (без вызова onupdated, так как меняем страницу)
    goto(`/students/${student.id}`);
  }

  function handleDeleteError(error: any) {
    toast.error(error?.message || 'Ошибка при удалении домашнего задания');
    isDeleting = false;
    showDeleteConfirm = false;
  }

  // Проверяем, есть ли изменения
  const hasChanges = $derived(() =>
    hasExerciseChanges(homework.exercises, selectedExercises)
  );
</script>

<Dialog.Root {open} onOpenChange={(newOpen) => !newOpen && handleClose()}>
  <Dialog.Content class="sm:max-w-[600px] max-h-[80vh]">
    {#if !showDeleteConfirm}
      <Dialog.Header>
        <Dialog.Title class="flex items-center gap-3">
          <SquarePen class="w-6 h-6 text-blue-600" />
          Редактировать домашнее задание
        </Dialog.Title>
        <Dialog.Description>
          Измените список упражнений или удалите домашнее задание
        </Dialog.Description>
      </Dialog.Header>

      <div class="space-y-6">
        <!-- Информация о домашке и студенте -->
        <div class="p-4 bg-blue-50 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-blue-900">
              Домашнее задание #{homework.id}
            </h3>
            <Badge variant="outline">
              Создано: {format(new Date(homework.created_at), 'dd.MM.yyyy', {
                locale: ru,
              })}
            </Badge>
          </div>
          <p class="text-blue-700">
            Студент: <span class="font-medium"
              >{student.firstName || ''} {student.lastName || ''}</span
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
                    <Check class="flex-shrink-0 w-5 h-5 text-blue-600" />
                  {:else}
                    <div
                      class="flex-shrink-0 w-5 h-5 border rounded-full bg-white"
                    ></div>
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

        <!-- Скрытые формы -->
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
          class="hidden"
          id="update-form"
        >
          <input
            type="hidden"
            name="exercises"
            value={JSON.stringify(selectedExercises)}
          />
        </form>
      </div>

      <Dialog.Footer
        class="sm:flex-row sm:justify-between flex justify-between"
      >
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

          <Button
            type="button"
            onclick={() => {
              (
                document.getElementById('update-form') as HTMLFormElement
              )?.requestSubmit();
            }}
            disabled={isSubmitting ||
              selectedExercises.length === 0 ||
              !hasChanges()}
          >
            {#if isSubmitting}
              <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
            {/if}
            Сохранить изменения
          </Button>
        </div>
      </Dialog.Footer>
    {:else}
      <Dialog.Header>
        <Dialog.Title class="flex items-center gap-3 text-red-600">
          <TriangleAlert class="w-6 h-6" />
          Подтверждение удаления
        </Dialog.Title>
        <Dialog.Description>
          Это действие нельзя будет отменить
        </Dialog.Description>
      </Dialog.Header>

      <div class="space-y-6">
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
            {student.firstName || ''}
            {student.lastName || ''}
          </p>
          <p class="text-gray-700 mb-2">
            <strong>Упражнений:</strong>
            {homework.exercises.length}
          </p>
          <p class="text-gray-700">
            <strong>Создано:</strong>
            {format(new Date(homework.created_at), 'dd.MM.yyyy', {
              locale: ru,
            })}
          </p>
        </div>

        <!-- Скрытая форма удаления -->
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
          class="hidden"
          id="delete-form"
        ></form>
      </div>

      <Dialog.Footer class="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onclick={handleDeleteCancel}
          disabled={isDeleting}
        >
          Отмена
        </Button>

        <Button
          type="button"
          variant="destructive"
          onclick={() => {
            (
              document.getElementById('delete-form') as HTMLFormElement
            )?.requestSubmit();
          }}
          disabled={isDeleting}
          class="gap-2"
        >
          {#if isDeleting}
            <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          <Trash2 class="w-4 h-4" />
          Да, удалить
        </Button>
      </Dialog.Footer>
    {/if}
  </Dialog.Content>
</Dialog.Root>

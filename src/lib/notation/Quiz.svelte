<script lang="ts">
  import Notation from '$lib/notation/Notation.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
  } from '$lib/components/ui/tooltip';
  import type { Exercise, AnswerHistory } from '$lib/notation/types';
  import { toast } from 'svelte-sonner';
  import { invalidateAll } from '$app/navigation';
  import { History } from '@lucide/svelte';

  type Props = {
    exercise: Exercise;
    answersHistory: AnswerHistory[];
  };

  const { exercise, answersHistory }: Props = $props();

  // Получаем последний ответ для инициализации состояния
  const lastAnswer = answersHistory.length > 0 ? answersHistory[0] : null;

  let selectedOption = $state<string | null>(
    lastAnswer?.selected_answer_id || null
  );
  let showResult = $state(!!lastAnswer);
  let isCorrect = $state(lastAnswer?.is_correct || false);
  let isSubmitting = $state(false);
  let hasInitialAnswer = $state(!!lastAnswer); // Флаг для отслеживания наличия начального ответа
  let showCorrectAnswer = $state(!!lastAnswer && lastAnswer?.is_correct); // Показываем правильный ответ только если последний ответ был правильным

  function selectOption(optionId: string) {
    if (showResult) return;
    selectedOption = optionId;
  }

  async function checkAnswer() {
    if (!selectedOption) {
      toast.error('Выберите один из вариантов ответа');
      return;
    }

    isCorrect = selectedOption === exercise.correctAnswerId;
    showResult = true;
    showCorrectAnswer = isCorrect; // Показываем правильный ответ только если пользователь ответил правильно

    if (isCorrect) {
      toast.success('Правильно!');
    } else {
      toast.error('Неправильно. Попробуйте еще раз.');
    }

    // Сохраняем ответ только если это новый ответ (не из истории)
    if (!hasInitialAnswer) {
      await saveAnswer();
    }
  }

  async function saveAnswer() {
    if (!selectedOption) return;

    isSubmitting = true;

    try {
      const formData = new FormData();
      formData.append('selectedAnswerId', selectedOption);
      formData.append('isCorrect', isCorrect.toString());

      const response = await fetch('?/saveAnswer', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.type === 'success') {
        toast.success('Ответ сохранен!');
        await invalidateAll();
      } else if (result.type === 'failure') {
        const errorMessage =
          result.data?.error || 'Ошибка при сохранении ответа';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Ошибка при сохранении ответа');
    } finally {
      isSubmitting = false;
    }
  }

  function resetQuiz() {
    selectedOption = null;
    showResult = false;
    isCorrect = false;
    hasInitialAnswer = false; // Сбрасываем флаг начального ответа
    showCorrectAnswer = false; // Сбрасываем флаг показа правильного ответа
  }

  function revealCorrectAnswer() {
    showCorrectAnswer = true;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getOptionLabel(optionId: string) {
    const index = exercise.options.findIndex((opt) => opt.id === optionId);
    return index >= 0 ? String.fromCharCode(65 + index) : '?';
  }
</script>

<div class="quiz-container">
  <div class="question-section mb-8">
    <div class="question-notation">
      <Notation measures={exercise.question} />
    </div>
  </div>

  <div class="options-section">
    <h3 class="text-xl font-semibold mb-4 text-slate-800">
      Выберите правильный ответ:
    </h3>

    <div class="options-grid grid grid-cols-2 gap-4 mb-6">
      {#each exercise.options as option, index (option.id)}
        <button
          class="option-button p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md {selectedOption ===
          option.id
            ? showResult
              ? option.isCorrect
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
              : 'border-blue-500 bg-blue-50'
            : showResult && showCorrectAnswer && option.isCorrect
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'}"
          onclick={() => selectOption(option.id)}
          disabled={showResult}
        >
          <div
            class="option-label text-sm font-medium mb-2 text-slate-600 flex items-center justify-between"
          >
            <span>Вариант {String.fromCharCode(65 + index)}</span>
            {#if hasInitialAnswer && selectedOption === option.id && showResult}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <History class="w-4 h-4 text-blue-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Показан ваш последний ответ<br />({formatDate(
                      lastAnswer?.answered_at || ''
                    )})
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            {/if}
          </div>
          <div class="option-notation">
            <Notation measures={option.measures} />
          </div>
        </button>
      {/each}
    </div>

    {#if showResult && !isCorrect && exercise.explanation}
      <div class="explanation mt-6 mb-6 p-4 bg-slate-50 rounded-lg border">
        <h4 class="font-semibold text-slate-800 mb-2">Объяснение:</h4>
        <p class="text-slate-700">{exercise.explanation}</p>
      </div>
    {/if}
  </div>

  <div class="quiz-controls flex gap-4">
    {#if !showResult}
      <Button onclick={checkAnswer} disabled={!selectedOption || isSubmitting}>
        {isSubmitting ? 'Проверка...' : 'Проверить ответ'}
      </Button>
    {:else}
      <div class="flex gap-4">
        {#if !isCorrect && !showCorrectAnswer}
          <Button onclick={revealCorrectAnswer}>Показать ответ</Button>
        {/if}
        <Button onclick={resetQuiz} variant="outline">
          Попробовать еще раз
        </Button>
      </div>
    {/if}
  </div>

  <!-- История ответов -->
  {#if answersHistory.length > 0}
    <div class="history-section mt-12">
      <h3 class="text-xl font-semibold mb-4 text-slate-800">История ответов</h3>

      <div class="history-list space-y-3 max-h-96 overflow-y-auto">
        {#each answersHistory as answer}
          <div
            class="history-item p-4 border rounded-lg {answer.is_correct
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'}"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span
                    class="font-medium text-sm {answer.is_correct
                      ? 'text-green-700'
                      : 'text-red-700'}"
                  >
                    {answer.is_correct ? '✓ Правильно' : '✗ Неправильно'}
                  </span>
                  <span class="text-sm text-slate-600">
                    Вариант {getOptionLabel(answer.selected_answer_id)}
                  </span>
                </div>

                <div class="text-xs text-slate-500">
                  {formatDate(answer.answered_at)}
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .quiz-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .question-notation,
  .option-notation {
    display: flex;
    justify-content: center;
  }

  .option-button:disabled {
    cursor: not-allowed;
  }

  .options-grid {
    min-height: 300px;
  }
</style>

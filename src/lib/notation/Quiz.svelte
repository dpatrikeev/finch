<script lang="ts">
  import Notation from '$lib/notation/Notation.svelte';
  import { Button } from '$lib/components/ui/button';
  import type { QuizExercise } from '$lib/notation/types';
  import { toast } from 'svelte-sonner';

  type Props = {
    exercise: QuizExercise;
  };

  const { exercise }: Props = $props();

  let selectedOption = $state<string | null>(null);
  let showResult = $state(false);
  let isCorrect = $state(false);

  function selectOption(optionId: string) {
    if (showResult) return;
    selectedOption = optionId;
  }

  function checkAnswer() {
    if (!selectedOption) {
      toast.error('Выберите один из вариантов ответа');
      return;
    }

    isCorrect = selectedOption === exercise.correctAnswerId;
    showResult = true;

    if (isCorrect) {
      toast.success('Правильно!');
    } else {
      toast.error('Неправильно. Попробуйте еще раз.');
    }
  }

  function resetQuiz() {
    selectedOption = null;
    showResult = false;
    isCorrect = false;
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
            : showResult && option.isCorrect
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'}"
          onclick={() => selectOption(option.id)}
          disabled={showResult}
        >
          <div class="option-label text-sm font-medium mb-2 text-slate-600">
            Вариант {String.fromCharCode(65 + index)}
          </div>
          <div class="option-notation">
            <Notation measures={option.measures} />
          </div>
        </button>
      {/each}
    </div>

    {#if showResult && exercise.explanation}
      <div class="explanation mt-6 mb-6 p-4 bg-slate-50 rounded-lg border">
        <h4 class="font-semibold text-slate-800 mb-2">Объяснение:</h4>
        <p class="text-slate-700">{exercise.explanation}</p>
      </div>
    {/if}
  </div>

  <div class="quiz-controls flex gap-4">
    {#if !showResult}
      <Button onclick={checkAnswer} disabled={!selectedOption}>
        Проверить ответ
      </Button>
    {:else}
      <Button onclick={resetQuiz} variant="outline">Попробовать еще раз</Button>
    {/if}
  </div>
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

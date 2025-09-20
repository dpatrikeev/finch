<script lang="ts">
  import Notation from '$lib/notation/Notation.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Badge } from '$lib/components/ui/badge';
  import { Separator } from '$lib/components/ui/separator';
  import type { Exercise, AnswerHistory } from '$lib/notation/types';
  import { toast } from 'svelte-sonner';
  import { invalidateAll } from '$app/navigation';
  import { History, CircleCheck, Clock, Eye, CircleX } from 'lucide-svelte';
  import { format } from 'date-fns';
  import { ru } from 'date-fns/locale';

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
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
  }

  function getOptionLabel(optionId: string) {
    const index = exercise.options.findIndex((opt) => opt.id === optionId);
    return index >= 0 ? String.fromCharCode(65 + index) : '?';
  }
</script>

<div class="container mx-auto px-0 py-6 max-w-7xl">
  <!-- Вопрос -->
  <Card.Root class="mb-6">
    <Card.Header class="pb-4">
      <Card.Title class="text-lg md:text-xl text-center"
        >Музыкальное упражнение</Card.Title
      >
    </Card.Header>
    <Card.Content class="flex justify-center p-4 md:p-6">
      <div class="notation-container">
        <Notation measures={exercise.question} />
      </div>
    </Card.Content>
  </Card.Root>

  <!-- Основной грид -->
  <div class="grid gap-6">
    <!-- Секция с вариантами ответов -->
    <Card.Root>
      <Card.Header>
        <Card.Title class="flex items-center gap-2">
          <Clock class="w-5 h-5 text-primary" />
          Выберите правильный ответ
        </Card.Title>
      </Card.Header>
      <Card.Content class="space-y-6">
        <!-- Адаптивный грид для опций -->
        <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
          {#each exercise.options as option, index (option.id)}
            {@const isSelected = selectedOption === option.id}
            {@const isCorrectOption = option.isCorrect}
            {@const showAsCorrect =
              showResult && showCorrectAnswer && isCorrectOption}
            {@const showAsIncorrect =
              showResult && isSelected && !isCorrectOption}

            <Card.Root
              class="relative transition-all duration-200 hover:shadow-md cursor-pointer
                  {isSelected && !showResult ? 'ring-2 ring-primary' : ''}
                  {showAsCorrect ? 'ring-2 ring-green-500 bg-green-50' : ''}
                  {showAsIncorrect ? 'ring-2 ring-red-500 bg-red-50' : ''}
                  {showResult ? 'cursor-not-allowed' : 'hover:shadow-md'}"
              onclick={() => selectOption(option.id)}
            >
              <Card.Header class="pb-2">
                <div class="flex items-center justify-between">
                  <Badge variant="secondary" class="text-xs">
                    Вариант {String.fromCharCode(65 + index)}
                  </Badge>

                  <div class="flex items-center gap-2">
                    {#if hasInitialAnswer && selectedOption === option.id && showResult}
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger>
                            <History class="w-4 h-4 text-blue-500" />
                          </Tooltip.Trigger>
                          <Tooltip.Content>
                            Показан ваш последний ответ<br />({formatDate(
                              lastAnswer?.answered_at || ''
                            )})
                          </Tooltip.Content>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    {/if}

                    {#if showResult}
                      {#if showAsCorrect}
                        <CircleCheck class="w-5 h-5 text-green-500" />
                      {:else if showAsIncorrect}
                        <CircleX class="w-5 h-5 text-red-500" />
                      {/if}
                    {/if}
                  </div>
                </div>
              </Card.Header>
              <Card.Content class="flex justify-center pt-2">
                <div class="notation-container">
                  <Notation measures={option.measures} />
                </div>
              </Card.Content>
            </Card.Root>
          {/each}
        </div>

        <!-- Объяснение -->
        {#if showResult && !isCorrect && exercise.explanation}
          <Card.Root class="border-amber-200 bg-amber-50">
            <Card.Header class="pb-2">
              <Card.Title
                class="text-amber-800 text-base flex items-center gap-2"
              >
                <Eye class="w-4 h-4" />
                Объяснение
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p class="text-amber-700">{exercise.explanation}</p>
            </Card.Content>
          </Card.Root>
        {/if}

        <Separator />

        <!-- Контролы -->
        <div class="flex flex-col sm:flex-row gap-10">
          {#if !showResult}
            <Button
              onclick={checkAnswer}
              disabled={!selectedOption || isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Проверка...' : 'Проверить ответ'}
            </Button>
          {:else}
            <div class="flex flex-col sm:flex-row gap-3 w-full">
              {#if !isCorrect && !showCorrectAnswer}
                <Button onclick={revealCorrectAnswer} size="lg">
                  <Eye class="w-4 h-4 mr-2" />
                  Показать ответ
                </Button>
              {/if}
              <Button onclick={resetQuiz} variant="outline" size="lg">
                Попробовать еще раз
              </Button>
            </div>
          {/if}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- История ответов -->
    {#if answersHistory.length > 0}
      <Card.Root>
        <Card.Header>
          <Card.Title class="text-base flex items-center gap-2">
            <History class="w-4 h-4 text-primary" />
            История ответов
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            {#each answersHistory as answer}
              <div
                class="p-3 rounded-lg border {answer.is_correct
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'}"
              >
                <div class="flex items-center gap-2 mb-2">
                  {#if answer.is_correct}
                    <CircleCheck class="w-4 h-4 text-green-600" />
                    <span class="font-medium text-sm text-green-700"
                      >Правильно</span
                    >
                  {:else}
                    <CircleX class="w-4 h-4 text-red-600" />
                    <span class="font-medium text-sm text-red-700"
                      >Неправильно</span
                    >
                  {/if}
                </div>

                <div class="flex items-center gap-2 mb-1">
                  <Badge variant="outline" class="text-xs">
                    {getOptionLabel(answer.selected_answer_id)}
                  </Badge>
                </div>

                <div class="text-xs text-muted-foreground">
                  {formatDate(answer.answered_at)}
                </div>
              </div>
            {/each}
          </div>
        </Card.Content>
      </Card.Root>
    {/if}
  </div>
</div>

<style>
  .notation-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80px;
    overflow-x: auto;
  }

  /* Улучшаем отображение нотации на мобильных устройствах */
  @media (max-width: 640px) {
    .notation-container {
      min-height: 60px;
      padding: 0.5rem;
    }
  }

  /* Плавная анимация для карточек */
  :global(.card-root) {
    transition: all 0.2s ease-in-out;
  }

  :global(.card-root:hover) {
    transform: translateY(-1px);
  }
</style>

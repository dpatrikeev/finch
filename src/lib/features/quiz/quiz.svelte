<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';
  import { toast } from 'svelte-sonner';
  import { Clock, Eye } from 'lucide-svelte';
  import type {
    ExerciseAnswersHistory,
    QuizExercise,
  } from '$lib/features/exercises/types';
  import { isCorrectAnswer } from '$lib/features/quiz/utils';
  import { saveAnswer } from '../exercises/mutations.remote';
  import QuizOption from './option.svelte';
  import QuizHistory from './history.svelte';
  import QuizExplanation from './explanation.svelte';

  interface Props {
    exercise: QuizExercise;
    answersHistory: ExerciseAnswersHistory[];
  }

  let { exercise, answersHistory }: Props = $props();

  // Получаем последний ответ для инициализации состояния
  const lastAnswer = answersHistory.length > 0 ? answersHistory[0] : null;

  let selectedOption = $state<string | null>(
    lastAnswer?.selected_answer_id || null
  );
  let showResult = $state(!!lastAnswer);
  let isCorrect = $state(lastAnswer?.is_correct || false);
  let isSubmitting = $state(false);
  let hasInitialAnswer = $state(!!lastAnswer);
  let showCorrectAnswer = $state(!!lastAnswer && lastAnswer?.is_correct);

  // Локальное состояние для отслеживания отправленных ответов в текущей сессии
  // Используем Set для быстрой проверки уникальности
  let submittedAnswers = $state<Set<string>>(new Set());

  // Обновляем опции с флагом isCorrect
  const optionsWithCorrectFlag = $derived(() =>
    exercise.options.map((option) => ({
      ...option,
      isCorrect: option.id === exercise.correctAnswerId,
    }))
  );

  function selectOption(optionId: string) {
    if (showResult) return;
    selectedOption = optionId;
  }

  async function checkAnswer() {
    if (!selectedOption) {
      toast.error('Выберите один из вариантов ответа');
      return;
    }

    isCorrect = isCorrectAnswer(selectedOption, exercise.correctAnswerId);
    showResult = true;
    showCorrectAnswer = isCorrect;

    if (isCorrect) {
      toast.success('Правильно!');
    } else {
      toast.error('Неправильно. Попробуйте еще раз.');
    }

    // Создаем уникальный ключ для этого ответа
    const answerKey = `${exercise.id}-${selectedOption}`;

    // Сохраняем ответ только если это новый ответ (не из истории и не отправлялся в текущей сессии)
    if (!hasInitialAnswer && !submittedAnswers.has(answerKey)) {
      // Добавляем в Set сразу, чтобы избежать повторной отправки
      submittedAnswers.add(answerKey);
      await saveAnswerToDatabase();
    }
  }

  async function saveAnswerToDatabase() {
    if (!selectedOption || isSubmitting) return;

    isSubmitting = true;
    const answerKey = `${exercise.id}-${selectedOption}`;

    try {
      await saveAnswer({
        exerciseId: exercise.id,
        selectedAnswerId: selectedOption,
        isCorrect: isCorrect,
      });

      toast.success('Ответ сохранен!');
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Ошибка при сохранении ответа');
      // Удаляем из Set при ошибке, чтобы можно было попробовать снова
      submittedAnswers.delete(answerKey);
    } finally {
      isSubmitting = false;
    }
  }

  function resetQuiz() {
    selectedOption = null;
    showResult = false;
    isCorrect = false;
    hasInitialAnswer = false;
    showCorrectAnswer = false;
    // НЕ очищаем submittedAnswers - пользователь может попробовать тот же ответ снова
    // но мы не должны отправлять его повторно в базу
  }

  function revealCorrectAnswer() {
    showCorrectAnswer = true;
  }
</script>

<div class="container mx-auto px-0 py-6 max-w-7xl">
  <!-- Вопрос -->
  <Card.Root class="mb-6">
    <Card.Header class="pb-4">
      <Card.Title class="text-lg md:text-xl text-center">
        Музыкальное упражнение
      </Card.Title>
    </Card.Header>
    <Card.Content class="flex justify-center p-4 md:p-6">
      <div class="notation-container">
        <!-- <Notation measures={exercise.question} /> -->
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
          {#each optionsWithCorrectFlag() as option, index (option.id)}
            <QuizOption
              {option}
              {index}
              isSelected={selectedOption === option.id}
              {showResult}
              {showCorrectAnswer}
              {hasInitialAnswer}
              lastAnswerDate={lastAnswer?.answered_at}
              onclick={selectOption}
            />
          {/each}
        </div>

        <!-- Объяснение -->
        {#if showResult && !isCorrect && exercise.explanation}
          <QuizExplanation explanation={exercise.explanation} />
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
      <QuizHistory {answersHistory} options={optionsWithCorrectFlag()} />
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

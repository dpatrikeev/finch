<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import CircleCheck from '@lucide/svelte/icons/circle-check';
  import CircleX from '@lucide/svelte/icons/circle-x';
  import History from '@lucide/svelte/icons/history';
  import { Notation } from '$lib/features/notation';
  import { formatAnswerDate } from './utils';
  import type { ExerciseOption } from '$lib/types';

  interface Props {
    option: ExerciseOption;
    index: number;
    isSelected: boolean;
    showResult: boolean;
    showCorrectAnswer: boolean;
    hasInitialAnswer: boolean;
    lastAnswerDate?: string;
    onclick: (optionId: string) => void;
  }

  let {
    option,
    index,
    isSelected,
    showResult,
    showCorrectAnswer,
    hasInitialAnswer,
    lastAnswerDate,
    onclick,
  }: Props = $props();

  // Определяем правильный ли это вариант через родительский компонент
  // Получаем эту информацию из пропсов или через контекст
  const showAsCorrect = $derived(
    () => showResult && showCorrectAnswer && option.isCorrect
  );
  const showAsIncorrect = $derived(
    () => showResult && isSelected && !option.isCorrect
  );
</script>

<Card.Root
  class="relative transition-all duration-200 hover:shadow-md cursor-pointer
      {isSelected && !showResult ? 'ring-2 ring-primary' : ''}
      {showAsCorrect() ? 'ring-2 ring-green-500 bg-green-50' : ''}
      {showAsIncorrect() ? 'ring-2 ring-red-500 bg-red-50' : ''}
      {showResult ? 'cursor-not-allowed' : 'hover:shadow-md'}"
  onclick={() => onclick(option.id)}
>
  <Card.Header class="pb-2">
    <div class="flex items-center justify-between">
      <Badge variant="secondary" class="text-xs">
        Вариант {String.fromCharCode(65 + index)}
      </Badge>

      <div class="flex items-center gap-2">
        {#if hasInitialAnswer && isSelected && showResult && lastAnswerDate}
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <History class="w-4 h-4 text-blue-500" />
              </Tooltip.Trigger>
              <Tooltip.Content>
                Показан ваш последний ответ<br />({formatAnswerDate(
                  lastAnswerDate
                )})
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        {/if}

        {#if showResult}
          {#if showAsCorrect()}
            <CircleCheck class="w-5 h-5 text-green-500" />
          {:else if showAsIncorrect()}
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
</style>

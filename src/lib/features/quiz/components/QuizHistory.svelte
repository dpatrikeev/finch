<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import { CircleCheck, CircleX, History } from 'lucide-svelte';
  import type { QuizHistoryProps } from '../types/quiz.types';
  import { formatAnswerDate } from '../utils/quiz.utils';

  let { answersHistory, options }: QuizHistoryProps = $props();

  // Функция для получения метки опции
  function getOptionLabel(optionId: string, options: any[]) {
    const index = options.findIndex((option) => option.id === optionId);
    return index >= 0 ? String.fromCharCode(65 + index) : '?';
  }
</script>

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
              <span class="font-medium text-sm text-green-700">Правильно</span>
            {:else}
              <CircleX class="w-4 h-4 text-red-600" />
              <span class="font-medium text-sm text-red-700">Неправильно</span>
            {/if}
          </div>

          <div class="flex items-center gap-2 mb-1">
            <Badge variant="outline" class="text-xs">
              {getOptionLabel(answer.selected_answer_id, options)}
            </Badge>
          </div>

          <div class="text-xs text-muted-foreground">
            {formatAnswerDate(answer.answered_at)}
          </div>
        </div>
      {/each}
    </div>
  </Card.Content>
</Card.Root>

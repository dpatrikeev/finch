<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import ListCheck from '@lucide/svelte/icons/list-check';

  interface Props {
    isTeacher?: boolean;
  }

  let { isTeacher = false }: Props = $props();
</script>

{#if isTeacher}
  <Card.Root class="text-center py-16">
    <Card.Content class="space-y-4">
      <div class="flex justify-center">
        <div class="p-4 bg-muted rounded-full">
          <ListCheck class="w-12 h-12 text-muted-foreground" />
        </div>
      </div>
      <div class="space-y-2">
        <h3 class="text-xl font-semibold text-foreground">
          Студенту пока не назначено домашних заданий
        </h3>
        <p class="text-muted-foreground max-w-md mx-auto">
          Назначьте домашние задания, выбрав упражнения из доступного списка
        </p>
      </div>
    </Card.Content>
  </Card.Root>
{:else}
  <Card.Root class="text-center py-16">
    <Card.Content class="space-y-4">
      <div class="flex justify-center">
        <div class="p-4 bg-muted rounded-full">
          <ListCheck class="w-12 h-12 text-muted-foreground" />
        </div>
      </div>
      <div class="space-y-2">
        <h3 class="text-xl font-semibold text-foreground">
          У вас пока нет домашних заданий
        </h3>
        <p class="text-muted-foreground max-w-md mx-auto">
          Когда учитель даст вам задания, они появятся здесь
        </p>
      </div>
    </Card.Content>
  </Card.Root>
{/if}

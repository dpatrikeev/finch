<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import Eye from '@lucide/svelte/icons/eye';

  interface Props {
    explanation: string;
  }

  let { explanation }: Props = $props();
</script>

<Card.Root class="border-amber-200 bg-amber-50">
  <Card.Header class="pb-2">
    <Card.Title class="text-amber-800 text-base flex items-center gap-2">
      <Eye class="w-4 h-4" />
      Объяснение
    </Card.Title>
  </Card.Header>
  <Card.Content>
    <p class="text-amber-700">{explanation}</p>
  </Card.Content>
</Card.Root>

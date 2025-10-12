<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';

  interface Props {
    count: number;
  }

  let { count }: Props = $props();
</script>

{#if count > 0}
  <Badge
    variant="destructive"
    class="absolute -top-0 -right-2 h-4 w-5 rounded-full text-xs"
  >
    {count}
  </Badge>
{/if}

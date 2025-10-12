<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import { getHomeworkCount } from './queries.remote';
</script>

{#await getHomeworkCount() then homeworkCount}
  {#if homeworkCount > 0}
    <Badge
      variant="destructive"
      class="absolute -top-0 -right-2 h-4 w-5 rounded-full text-xs"
    >
      {homeworkCount}
    </Badge>
  {/if}
{/await}

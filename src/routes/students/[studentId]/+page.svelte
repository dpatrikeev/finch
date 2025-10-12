<script lang="ts">
  import type { PageData } from './$types';
  import { StudentDetail } from '$lib/features/students';
  import { Spinner } from '$lib/components';

  let { data }: { data: PageData } = $props();
</script>

<svelte:boundary>
  <StudentDetail studentId={data.studentId} />

  {#snippet pending()}
    <div class="flex justify-center py-8">
      <Spinner />
    </div>
  {/snippet}
</svelte:boundary>

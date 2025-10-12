<script lang="ts">
  import { page } from '$app/state';
  import { StudentDetail } from '$lib/features/students';
  import { Spinner } from '$lib/components';

  const studentId = $derived(page.params.studentId || '');
</script>

<svelte:boundary>
  <StudentDetail {studentId} />

  {#snippet pending()}
    <div class="flex justify-center py-8">
      <Spinner />
    </div>
  {/snippet}
</svelte:boundary>

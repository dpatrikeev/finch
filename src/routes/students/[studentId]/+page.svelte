<script lang="ts">
  import type { PageData } from './$types';
  import { StudentDetail } from '$lib/features/students';

  let { data }: { data: PageData } = $props();
</script>

<svelte:boundary>
  <StudentDetail
    studentId={data.studentId}
    isTeacherView={data.isTeacherView}
  />

  {#snippet pending()}
    <div class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
      ></div>
    </div>
  {/snippet}
</svelte:boundary>

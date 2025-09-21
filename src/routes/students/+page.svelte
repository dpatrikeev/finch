<script lang="ts">
  import type { PageData } from './$types';
  import { Students } from '$lib/features/students';

  let { data }: { data: PageData } = $props();
</script>

<Students students={data.students} exercises={data.exercises} />

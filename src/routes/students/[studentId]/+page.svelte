<script lang="ts">
  import type { PageData } from './$types';
  import { StudentDetail } from '$lib/features/students';

  let { data }: { data: PageData } = $props();
</script>

<StudentDetail
  student={data.student}
  homework={data.homework}
  exercises={data.exercises}
  isTeacherView={data.isTeacherView}
/>

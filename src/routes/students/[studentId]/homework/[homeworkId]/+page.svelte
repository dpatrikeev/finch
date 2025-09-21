<script lang="ts">
  import { HomeworkDetail } from '$lib/features/homework';
  import type { StudentInfo } from '$lib/utils/user';

  interface Props {
    data: {
      student: StudentInfo;
      stats: any;
      exercises: { id: string; title: string; description?: string }[];
      isTeacherView: boolean;
    };
  }

  const { data }: Props = $props();
  const { student, stats, exercises } = data;
</script>

<svelte:head>
  <title
    >Статистика домашки #{stats.homework.id}: {student.firstName}
    {student.lastName} - Finch</title
  >
</svelte:head>

<HomeworkDetail {stats} {student} {exercises} />

<script lang="ts">
  import { Student } from '$lib/components';
  import { GraduationCap } from '@lucide/svelte';
  import { getStudentHomeworkWithProgress } from '$lib/remote/student.remote';
  import { getClerkUser } from '$lib/remote/user.remote';
  import {
    AssignHomeworkButton,
    EmptyHomework,
    HomeworkCard,
  } from '$lib/components';

  let { data } = $props();
  let { studentId, exercises } = $derived(data);

  let student = $derived(await getClerkUser(studentId));
  let homework = $derived(await getStudentHomeworkWithProgress(studentId));
</script>

<svelte:head>
  <title>Домашние задания: {student.fullName} - Finch</title>
</svelte:head>

<div class="flex items-center gap-3 mb-8">
  <GraduationCap class="w-8 h-8 text-primary" />
  <h1 class="text-2xl md:text-3xl font-medium text-foreground">
    Домашние задания ученика
  </h1>
</div>
<div class="flex items-center justify-between gap-4 mb-8">
  <Student {student} />
  <AssignHomeworkButton {student} {exercises} class="w-min-content min-h-10" />
</div>

{#if homework.length === 0}
  <EmptyHomework isTeacher={true} />
{:else}
  {#each homework as hw, index}
    <HomeworkCard homework={hw} {index} />
  {/each}
{/if}

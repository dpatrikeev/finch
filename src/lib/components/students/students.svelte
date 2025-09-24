<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getExercises } from '$lib/remote/exercises.remote';
  import { getTeacherStudents } from '$lib/remote/students.remote';
  import { calculateStudentsStats } from '$lib/utils/students.utils';
  import type { StudentInfo, ExerciseInfo } from '$lib/types/students.types';
  import EmptyStudents from './empty.svelte';
  import StudentsStats from './stats.svelte';
  import StudentCard from './card.svelte';

  interface Props {
    assignHomework: Snippet<[StudentInfo, ExerciseInfo[]]>;
  }

  const { assignHomework }: Props = $props();

  const [students, exercises] = $derived(
    await Promise.all([getTeacherStudents(), getExercises()])
  );
  const stats = $derived(calculateStudentsStats(students, exercises.length));
</script>

{#if students.length === 0}
  <EmptyStudents />
{:else}
  <StudentsStats {stats} />

  <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
    {#each students as student}
      <StudentCard {student}>
        {#if assignHomework}
          {@render assignHomework(student, exercises)}
        {/if}
      </StudentCard>
    {/each}
  </div>
{/if}

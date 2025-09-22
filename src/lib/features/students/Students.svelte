<script lang="ts">
  import { getTeacherStudents, getExercises } from './data.remote';
  import { StudentCard, StudentsStats, EmptyStudents } from './components';
  import { calculateStudentsStats } from './utils';

  const students = $derived(await getTeacherStudents());
  const exercises = $derived(await getExercises());

  const stats = $derived(calculateStudentsStats(students, exercises.length));
</script>

{#if students.length === 0}
  <EmptyStudents />
{:else}
  <StudentsStats {stats} />

  <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
    {#each students as student}
      <StudentCard {student} />
    {/each}
  </div>
{/if}

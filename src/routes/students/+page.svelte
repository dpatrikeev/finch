<script lang="ts">
  import type { PageData } from './$types';
  import type { StudentInfo } from '$lib/utils/user';
  import StudentCard from '$lib/components/student-card.svelte';
  import AssignHomeworkModal from '$lib/components/assign-homework-modal.svelte';
  import { Users, BookOpen } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { page } from '$app/state';

  let { data }: { data: PageData } = $props();
  const { students, exercises } = data;

  let showAssignModal = $state(false);
  let selectedStudent = $state<StudentInfo | null>(null);

  const handleAssignHomework = (
    event: CustomEvent<{ student: StudentInfo }>
  ) => {
    selectedStudent = event.detail.student;
    showAssignModal = true;
  };

  const handleCloseModal = () => {
    showAssignModal = false;
    selectedStudent = null;
  };

  // Показываем уведомление об успешном назначении
  $effect(() => {
    if (page.form?.success) {
      toast.success(page.form.message || 'Домашнее задание успешно назначено!');
    } else if (page.form?.error) {
      toast.error(page.form.error);
    }
  });
</script>

<svelte:head>
  <title>Мои студенты - Finch</title>
</svelte:head>

<section class="mx-auto p-10">
  <div class="mb-8">
    <div class="flex items-center gap-3 mb-4">
      <Users class="w-8 h-8 text-blue-600" />
      <h1 class="text-3xl font-bold text-gray-900">Мои студенты</h1>
    </div>
    <p class="text-gray-600">
      Просмотрите прогресс и статистику ваших студентов, назначайте домашние
      задания
    </p>
  </div>

  {#if students.length === 0}
    <div class="text-center py-12">
      <Users class="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h3 class="text-xl font-medium text-gray-900 mb-2">Пока нет студентов</h3>
      <p class="text-gray-500">
        У вас пока нет студентов. Студенты будут добавлены администратором.
      </p>
    </div>
  {:else}
    <div class="mb-6 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Всего студентов: {students.length}
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <BookOpen class="w-4 h-4" />
        Доступно упражнений: {exercises.length}
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each students as student}
        <StudentCard {student} onassignHomework={handleAssignHomework} />
      {/each}
    </div>
  {/if}
</section>

<!-- Модальное окно для назначения домашки -->
<AssignHomeworkModal
  open={showAssignModal}
  student={selectedStudent}
  {exercises}
  onclose={handleCloseModal}
/>

<script lang="ts">
  import type { PageData } from './$types';
  import { Users, GraduationCap } from 'lucide-svelte';
  import type { StudentInfo } from '$lib/utils/user';
  import * as Card from '$lib/components/ui/card';
  import StudentCard from '$lib/components/student-card.svelte';
  import AssignHomeworkModal from '$lib/components/assign-homework-modal.svelte';
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

<section class="mx-auto p-5 md:p-10">
  <div class="mb-8">
    <div class="flex items-center gap-3 mb-4">
      <GraduationCap class="w-8 h-8 text-primary" />
      <h1 class="text-2xl md:text-3xl font-medium text-foreground">
        Мои студенты
      </h1>
    </div>
    <p class="text-sm md:text-base text-muted-foreground">
      Просмотрите прогресс и статистику ваших студентов, назначайте домашние
      задания
    </p>
  </div>

  {#if students.length === 0}
    <Card.Root class="text-center py-16">
      <Card.Content class="space-y-4">
        <div class="flex justify-center">
          <div class="p-4 bg-muted rounded-full">
            <Users class="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
        <div class="space-y-2">
          <h3 class="text-xl font-semibold text-foreground">
            Пока нет студентов
          </h3>
          <p class="text-muted-foreground max-w-md mx-auto">
            У вас пока нет студентов. Студенты будут добавлены администратором.
          </p>
        </div>
      </Card.Content>
    </Card.Root>
  {:else}
    <!-- Статистика -->
    <Card.Root class="mb-8">
      <Card.Content class="p-6">
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-xl md:text-2xl font-bold text-blue-600 mb-1">
              {students.length}
            </div>
            <div class="text-xs text-muted-foreground">
              <span class="md:hidden">Студентов</span>
              <span class="hidden md:inline">Всего студентов</span>
            </div>
          </div>

          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-xl md:text-2xl font-bold text-green-600 mb-1">
              {exercises.length}
            </div>
            <div class="text-xs text-muted-foreground">
              <span class="md:hidden">Упражнений</span>
              <span class="hidden md:inline">Доступно упражнений</span>
            </div>
          </div>

          <div class="hidden md:block text-center p-4 bg-purple-50 rounded-lg">
            <div class="text-2xl font-bold text-purple-600 mb-1">
              {students.filter((s) => s.correctAnswers > 0).length}
            </div>
            <div class="text-xs text-muted-foreground">Активных студентов</div>
          </div>

          <div class="hidden md:block text-center p-4 bg-orange-50 rounded-lg">
            <div class="text-2xl font-bold text-orange-600 mb-1">
              {students.reduce((sum, s) => sum + s.correctAnswers, 0)}
            </div>
            <div class="text-xs text-muted-foreground">Правильных ответов</div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>

    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
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

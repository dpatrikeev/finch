<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Plus } from 'lucide-svelte';
  import type { StudentInfo } from '$lib/features/students';
  import AssignHomeworkModal from './assign-modal.svelte';

  interface Props {
    student: StudentInfo;
    exercises: Array<{ id: string; title: string; description?: string }>;
    class?: string;
  }

  let { student, exercises, class: className = '' }: Props = $props();
  let showModal = $state(false);

  const handleClick = () => {
    showModal = true;
  };

  const handleClose = () => {
    showModal = false;
  };
</script>

<Button
  variant="outline"
  class="gap-2 {className}"
  onclick={handleClick}
  disabled={!student}
>
  <Plus class="w-4 h-4" />
  Дать домашку
</Button>

<AssignHomeworkModal
  {student}
  {exercises}
  isOpen={showModal}
  onClose={handleClose}
  onAssigned={handleClose}
/>

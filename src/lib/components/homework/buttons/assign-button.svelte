<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Plus } from 'lucide-svelte';
  import type { StudentInfo } from '$lib/types/students.types';
  import AssignHomeworkModal from '../modals/assign-modal.svelte';

  interface Props {
    student: StudentInfo;
    exercises: Array<{ id: string; title: string; description?: string }>;
    variant?:
      | 'default'
      | 'outline'
      | 'ghost'
      | 'link'
      | 'destructive'
      | 'secondary';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    class?: string;
    onassigned?: () => void;
  }

  const {
    student,
    exercises,
    variant = 'outline',
    size = 'sm',
    class: className = '',
    onassigned,
  }: Props = $props();

  let showModal = $state(false);

  const handleClick = () => {
    if (student) {
      showModal = true;
    }
  };

  const handleClose = () => {
    showModal = false;
  };

  const handleAssigned = () => {
    showModal = false;
    onassigned?.();
  };
</script>

<Button
  {variant}
  {size}
  class="gap-2 {className}"
  onclick={handleClick}
  disabled={!student}
>
  <Plus class="w-4 h-4" />
  Назначить домашку
</Button>

<AssignHomeworkModal
  open={showModal}
  {student}
  {exercises}
  onclose={handleClose}
  onassigned={handleAssigned}
/>

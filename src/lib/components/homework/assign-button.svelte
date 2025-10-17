<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import Plus from '@lucide/svelte/icons/plus';
  import AssignHomeworkModal from './assign-modal.svelte';
  import type { BaseUser } from '$lib/types';

  interface Props {
    student: BaseUser;
    exercises: {
      id: string;
      title: string | null;
      description: string | null;
    }[];
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
/>

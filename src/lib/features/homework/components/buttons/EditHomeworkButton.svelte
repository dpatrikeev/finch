<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { SquarePen } from 'lucide-svelte';
  import EditHomeworkModal from '../modals/EditHomeworkModal.svelte';
  import type { HomeworkItem } from '../../types/homework.types';
  import type { StudentInfo } from '$lib/utils/user';

  interface Props {
    homework: HomeworkItem;
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
    onupdated?: () => void;
  }

  const {
    homework,
    student,
    exercises,
    variant = 'outline',
    size = 'sm',
    class: className = '',
    onupdated,
  }: Props = $props();

  let showModal = $state(false);

  const handleClick = () => {
    showModal = true;
  };

  const handleClose = () => {
    showModal = false;
  };

  const handleUpdated = () => {
    showModal = false;
    onupdated?.();
  };
</script>

<Button {variant} {size} class="gap-2 {className}" onclick={handleClick}>
  <SquarePen class="w-4 h-4" />
  Редактировать
</Button>

<EditHomeworkModal
  open={showModal}
  {homework}
  {student}
  {exercises}
  onclose={handleClose}
  onupdated={handleUpdated}
/>

<script lang="ts">
  import { User as UserIcon } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { AssignHomeworkButton, Student } from '$lib/components';

  import type { Snippet } from 'svelte';
  import type { BaseUser } from '$lib/types';

  interface Props {
    student: BaseUser;
    exercises: {
      id: string;
      title: string | null;
      description: string | null;
    }[];
    children?: Snippet;
  }

  let { student, exercises, children }: Props = $props();
</script>

<Card.Root class="hover:shadow-md transition-shadow">
  <Card.Header>
    <Student {student} />
  </Card.Header>

  <Card.Footer class="flex gap-2 justify-center flex-col md:flex-row w-full">
    {#if children}
      {@render children()}
    {/if}
    <Button
      variant="outline"
      size="sm"
      href="/students/{student.id}"
      class="w-full flex-1 min-h-10"
    >
      <UserIcon class="w-4 h-4 mr-2" />
      Открыть профиль
    </Button>
    <AssignHomeworkButton
      {student}
      {exercises}
      class="w-full flex-1 min-h-10"
    />
  </Card.Footer>
</Card.Root>

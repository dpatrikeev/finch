<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';
  import { formatFullName, formatInitials } from '$lib/features/students/utils';
  import * as Card from '$lib/components/ui/card';
  import type { BaseUser } from '$lib/features/students/types';
  import { Mail } from 'lucide-svelte';

  interface Props {
    student: BaseUser;
  }

  const { student }: Props = $props();
</script>

<div class="flex items-center space-x-4">
  <Avatar.Root class="h-12 w-12">
    {#if student.imageUrl}
      <Avatar.Image
        src={student.imageUrl}
        alt={formatFullName({
          first: student.firstName,
          last: student.lastName,
        })}
      />
    {/if}
    <Avatar.Fallback class="bg-blue-500 text-white">
      {formatInitials({ first: student.firstName, last: student.lastName })}
    </Avatar.Fallback>
  </Avatar.Root>
  <div class="flex-1">
    <Card.Title class="text-lg">
      {formatFullName({ first: student.firstName, last: student.lastName })}
    </Card.Title>
    <Card.Description class="flex items-center">
      <Mail class="w-4 h-4 mr-1" />
      {student.email}
    </Card.Description>
  </div>
</div>

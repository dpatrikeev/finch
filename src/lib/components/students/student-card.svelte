<script lang="ts">
  import { BookOpen, Target, Mail, User } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Avatar from '$lib/components/ui/avatar';
  import { Badge } from '$lib/components/ui/badge';
  import type { StudentInfo } from '$lib/types/students.types';
  import type { Snippet } from 'svelte';
  import {
    formatFullName,
    formatInitials,
    getAccuracyColorClass,
    getAccuracyTextClass,
  } from '$lib/utils/students.utils';

  interface Props {
    student: StudentInfo;
    children?: Snippet;
  }

  const { student, children }: Props = $props();
</script>

<Card.Root class="hover:shadow-md transition-shadow">
  <Card.Header>
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
  </Card.Header>

  <Card.Content class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center text-muted-foreground">
        <BookOpen class="w-4 h-4 mr-2" />
        <span class="text-sm">Выполнено упражнений</span>
      </div>
      <Badge variant="secondary" class="font-semibold">
        {student.totalExercises}
      </Badge>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center text-muted-foreground">
        <Target class="w-4 h-4 mr-2" />
        <span class="text-sm">Точность</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="font-semibold {getAccuracyTextClass(student.accuracy)}">
          {student.accuracy}%
        </span>
        <div class="w-20 bg-secondary rounded-full h-2">
          <div
            class="{getAccuracyColorClass(
              student.accuracy
            )} h-2 rounded-full transition-all duration-300"
            style="width: {student.accuracy}%"
          ></div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between text-sm">
      <span class="text-muted-foreground">Правильных ответов:</span>
      <span class="font-medium">
        {student.correctAnswers} из {student.totalExercises}
      </span>
    </div>
  </Card.Content>

  <Card.Footer class="flex flex-col gap-2">
    {#if children}
      {@render children()}
    {/if}
    <Button
      variant="ghost"
      size="sm"
      href="/students/{student.id}"
      class="w-full"
    >
      <User class="w-4 h-4 mr-2" />
      Открыть профиль
    </Button>
  </Card.Footer>
</Card.Root>

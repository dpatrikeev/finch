<script lang="ts">
  import { BookOpen, Target, User as UserIcon } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import User from '$lib/features/user/user.svelte';
  import { getAccuracyColorClass, getAccuracyTextClass } from './utils';

  import type { StudentInfo } from './types';
  import type { Snippet } from 'svelte';

  interface Props {
    student: StudentInfo;
    children?: Snippet;
  }

  const { student, children }: Props = $props();
</script>

<Card.Root class="hover:shadow-md transition-shadow">
  <Card.Header>
    <User {student} />
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

  <Card.Footer class="flex gap-2 justify-center flex-col md:flex-row w-full">
    {#if children}
      {@render children()}
    {/if}
    <Button
      variant="ghost"
      size="sm"
      href="/students/{student.id}"
      class="w-full flex-1 min-h-10"
    >
      <UserIcon class="w-4 h-4 mr-2" />
      Открыть профиль
    </Button>
  </Card.Footer>
</Card.Root>

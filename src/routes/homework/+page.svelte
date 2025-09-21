<script lang="ts">
  import { Homework } from '$lib/features/homework';
  import type { HomeworkProps } from '$lib/features/homework/types/homework.types';
  import { BookOpenCheck } from 'lucide-svelte';

  interface Props {
    data: HomeworkProps;
  }

  const { data }: Props = $props();
</script>

<section class="mx-auto p-5 md:p-10">
  <div class="flex items-center gap-3 mb-8">
    <BookOpenCheck class="w-8 h-8 text-primary" />
    <h1 class="text-2xl md:text-3xl font-medium text-foreground">
      Мои домашние задания
    </h1>
  </div>

  <Homework homework={data.homework} user={data.user} />
</section>

<script lang="ts">
  import { Students } from '$lib/features/students';
  import { GraduationCap } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Мои студенты - Finch</title>
</svelte:head>

<svelte:boundary>
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

    <Students />
  </section>

  {#snippet pending()}
    <div class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
      ></div>
    </div>
  {/snippet}
</svelte:boundary>

<script lang="ts">
  import type { PageData } from './$types';
  import { Button } from '$lib/components/ui/button';
  import { ExerciseItem } from '$lib/components';
  import { SignedIn, SignedOut, SignInButton } from 'svelte-clerk';

  let { data }: { data: PageData } = $props();
</script>

<SignedOut>
  <section class="max-w-5xl mx-auto p-10 sm:p-20">
    <h1
      class="mb-6 text-4xl sm:text-5xl font-serif font-extralight leading-tight text-slate-950"
    >
      Изучайте музыку через технологии
    </h1>
    <p class="mb-6 text-base sm:text-lg text-slate-950 leading-relaxed">
      Добро пожаловать в Finch: современный музыкальный учебник, основанный на
      проверенных временем методах и персонализированной обратной связи.
      Изучайте теорию музыки через интерактивные упражнения, мгновенную обратную
      связь и руководство с помощью ИИ.
    </p>
    <p class="mb-12 text-base sm:text-lg text-slate-950 leading-relaxed">
      Наша миссия — сделать академическое музыкальное образование доступным,
      понятным и увлекательным.
    </p>

    <SignInButton asChild mode="modal">
      {#snippet children({ signIn })}
        <Button onclick={signIn}>Войти</Button>
      {/snippet}
    </SignInButton>
  </section>
</SignedOut>

<SignedIn>
  <section class="mx-auto p-10">
    <h1 class="text-3xl font-medium mb-8 text-slate-950">Список упражнений</h1>

    <ul class="space-y-4">
      {#each data.exercises as exercise}
        <ExerciseItem {exercise} status={data.exerciseStatuses[exercise.id]} />
      {/each}
    </ul>
  </section>
</SignedIn>

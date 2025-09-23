<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { SignedIn, SignedOut, SignInButton } from 'svelte-clerk';
  import { BookOpen } from 'lucide-svelte';
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
        <Button onclick={signIn}>Начать обучение</Button>
      {/snippet}
    </SignInButton>
  </section>
</SignedOut>

<SignedIn>
  <section class="mx-auto p-5 md:p-10">
    <div class="flex items-center gap-3 mb-8">
      <BookOpen class="w-8 h-8 text-primary" />
      <h1 class="text-2xl md:text-3xl font-medium text-foreground">
        Список упражнений
      </h1>
    </div>
  </section>
</SignedIn>

<script lang="ts">
  import { SignInButton } from 'svelte-clerk';
  import { Button } from '$lib/components/ui/button';
  import { getUser } from '$lib/remote/user.remote';

  let { userId, userRole } = $derived(await getUser());
</script>

<section class="card">
  <h1 class="title">Изучайте музыку через технологии</h1>
  <p class="description">
    Добро пожаловать в Finch: современный музыкальный учебник, основанный на
    проверенных временем методах и персонализированной обратной связи. Изучайте
    теорию музыки через интерактивные упражнения, мгновенную обратную связь и
    руководство с помощью ИИ.
  </p>
  <p class="mission">
    Наша миссия — сделать академическое музыкальное образование доступным,
    понятным и увлекательным.
  </p>

  {#if !userId}
    <SignInButton asChild mode="modal">
      {#snippet children({ signIn })}
        <Button onclick={signIn}>Начать обучение</Button>
      {/snippet}
    </SignInButton>
  {:else}
    {@const href = userRole === 'teacher' ? 'students' : 'homework'}
    <Button {href}>Открыть приложение</Button>
  {/if}
</section>

<style lang="postcss">
  @reference "app.css";

  .card {
    @apply max-w-5xl 
      mx-auto
      p-10
      sm:p-20;
  }

  .title {
    @apply mb-6
      text-4xl
      sm:text-5xl
      font-serif
      font-extralight
      leading-tight
      text-slate-950;
  }

  .description {
    @apply mb-6
      text-base
      sm:text-lg
      text-slate-950
      leading-relaxed;
  }

  .mission {
    @apply mb-12
      text-base
      sm:text-lg
      text-slate-950
      leading-relaxed;
  }
</style>

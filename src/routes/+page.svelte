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
      Understand music through technology
    </h1>
    <p class="mb-6 text-base sm:text-lg text-slate-950 leading-relaxed">
      Welcome to Finch: a modern music workbook based on proven over time
      methods and personalized feedback. Learn music theory through interactive
      exercises, instant feedback, and powered by AI guidance.
    </p>
    <p class="mb-12 text-base sm:text-lg text-slate-950 leading-relaxed">
      Our mission is to make academic music education accessible, clear, and
      fun.
    </p>

    <SignInButton asChild mode="modal">
      {#snippet children({ signIn })}
        <Button onclick={signIn}>Sign in to try the app</Button>
      {/snippet}
    </SignInButton>
  </section>
</SignedOut>

<SignedIn>
  <section class="mx-auto p-10">
    <h1 class="text-3xl font-bold mb-8 text-slate-950">Exercise List</h1>

    <ul class="space-y-4">
      {#each data.exercises as exercise}
        <ExerciseItem {exercise} />
      {/each}
    </ul>
  </section>
</SignedIn>

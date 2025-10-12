<script lang="ts">
  import '../app.css';

  import type { Snippet } from 'svelte';
  import { ClerkProvider } from 'svelte-clerk';
  import { ruRU } from '@clerk/localizations';
  import { Toaster } from '$lib/components/ui/sonner';
  import { Header } from '$lib/features/header';
  import { HomeworkBadge } from '$lib/features/homework';

  interface LayoutData {
    clerk: any;
    role: string;
    newHomeworkCount: number;
  }

  interface Props {
    children: Snippet;
    data: LayoutData;
  }

  let { children, data }: Props = $props();
</script>

<svelte:head>
  <title>Finch</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<ClerkProvider localization={ruRU}>
  <main class="min-h-screen relative overflow-hidden">
    <Header {homeworkBadge} />
    {@render children()}
  </main>
  <Toaster />
</ClerkProvider>

{#snippet homeworkBadge()}
  {#if data.role === 'student'}
    <HomeworkBadge count={data.newHomeworkCount} />
  {/if}
{/snippet}

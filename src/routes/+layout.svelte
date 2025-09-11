<script lang="ts">
  import '../app.css';

  import type { Snippet } from 'svelte';
  import type { InitialState } from '@clerk/types';
  import { ClerkProvider } from 'svelte-clerk';

  import { Toaster } from '$lib/components/ui/sonner';
  import { Header } from '$lib/components';

  interface Props {
    children: Snippet;
    data: { clerk: InitialState };
  }

  const { children }: Props = $props();
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

<ClerkProvider>
  <main class="min-h-screen relative overflow-hidden">
    <Header />
    {@render children()}
  </main>
  <Toaster />
</ClerkProvider>

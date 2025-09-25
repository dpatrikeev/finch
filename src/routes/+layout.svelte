<script lang="ts">
  import '../app.css';

  import { ClerkProvider } from 'svelte-clerk';
  import { Toaster } from '$lib/components/ui/sonner';
  import { ruRU } from '@clerk/localizations';
  import Header from '$lib/components/header/header.svelte';

  const { children, data } = $props();
  const { userRole, userId } = $derived(data);
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
    <Header {userRole} {userId} />
    {@render children()}
  </main>
  <Toaster />
</ClerkProvider>

<script lang="ts">
  import '../app.css';

  import type { Snippet } from 'svelte';
  import type { InitialState } from '@clerk/types';
  import { ClerkProvider } from 'svelte-clerk';

  import { Toaster } from '$lib/components/ui/sonner';
  import { Header } from '$lib/features/header';
  import { ruRU } from '@clerk/localizations';
  import type { UserRole } from '$lib/utils/user';

  interface Props {
    children: Snippet;
    data: { clerk: InitialState; role: UserRole; newHomeworkCount: number };
  }

  const { children, data }: Props = $props();
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
    <Header role={data.role} newHomeworkCount={data.newHomeworkCount} />
    {@render children()}
  </main>
  <Toaster />
</ClerkProvider>

<script lang="ts">
  import { SignedIn, UserButton } from 'svelte-clerk';
  import Logo from './logo.svelte';
  import { Button } from '$lib/components/ui/button';
  import type { UserRole } from '$lib/utils/user';

  interface Props {
    role: UserRole;
  }

  const { role }: Props = $props();
</script>

<div class="w-full h-12">
  <header
    class="flex items-center justify-between fixed h-12 top-0 left-0 flex-0 w-full backdrop-blur-[9px] px-10 z-40"
  >
    <Logo />

    <SignedIn>
      <div class="flex items-center justify-center">
        {#if role === 'teacher'}
          <Button variant="ghost" class="mr-2">My students</Button>
        {/if}
        {#if role === 'student'}
          <Button variant="ghost" class="mr-2">My Homework</Button>
        {/if}
      </div>
      <div class="flex flex-col items-center justify-center min-w-10 min-h-10">
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-10 h-10',
            },
          }}
        />
      </div>
    </SignedIn>
  </header>
</div>

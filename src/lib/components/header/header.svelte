<script lang="ts">
  import { SignedIn, UserButton } from 'svelte-clerk';
  import type { UserRole } from '$lib/remote/user.remote';
  import { getNavigationItems } from '$lib/utils/header.utils';
  import Logo from './logo.svelte';
  import Menu from './menu.svelte';

  interface Props {
    userRole: UserRole;
    userId: string;
  }

  const { userRole, userId }: Props = $props();
  const navigationItems = $derived(getNavigationItems(userRole));
</script>

<div class="w-full h-12">
  <header
    class="flex items-center justify-between fixed h-12 top-0 left-0 flex-0 w-full backdrop-blur-[9px] px-4 md:px-10 z-40 border-b border-border/10"
  >
    <Logo />

    <SignedIn>
      <div class="flex items-center gap-2">
        <Menu {navigationItems} {userId} />
        <div class="shrink-0 min-w-8 min-h-8 flex items-center justify-center">
          <UserButton />
        </div>
      </div>
    </SignedIn>
  </header>
</div>

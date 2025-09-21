<script lang="ts">
  import { SignedIn } from 'svelte-clerk';
  import { Logo, MobileMenu, DesktopMenu } from './components';
  import type { HeaderProps } from './types/header.types';

  const { role, newHomeworkCount = 0 }: HeaderProps = $props();

  let sheetOpen = $state(false);

  function handleClose() {
    sheetOpen = false;
  }
</script>

<div class="w-full h-12">
  <header
    class="flex items-center justify-between fixed h-12 top-0 left-0 flex-0 w-full backdrop-blur-[9px] px-4 md:px-10 z-40 border-b border-border/10"
  >
    <Logo />

    <SignedIn>
      <MobileMenu
        {role}
        {newHomeworkCount}
        isOpen={sheetOpen}
        onClose={handleClose}
      />
      <DesktopMenu {role} {newHomeworkCount} />
    </SignedIn>
  </header>
</div>

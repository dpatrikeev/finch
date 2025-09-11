<script lang="ts">
  import { SignedIn, SignedOut, SignInButton, UserButton } from 'svelte-clerk';
  import Logo from './logo.svelte';
</script>

<div class="w-full h-12">
  <header
    class="flex items-center justify-between fixed h-12 top-0 left-0 flex-0 w-full backdrop-blur-[9px] px-10 z-40"
  >
    <Logo />

    <div class="flex flex-col items-center justify-center min-w-10 min-h-10">
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-10 h-10',
            },
          }}
        />
      </SignedIn>
    </div>
  </header>
</div>

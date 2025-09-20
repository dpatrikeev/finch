<script lang="ts">
  import { SignedIn, UserButton } from 'svelte-clerk';
  import Logo from './logo.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Sheet from '$lib/components/ui/sheet';
  import { Menu, Users, BookOpen } from 'lucide-svelte';
  import type { UserRole } from '$lib/utils/user';

  interface Props {
    role: UserRole;
    newHomeworkCount?: number;
  }

  const { role, newHomeworkCount = 0 }: Props = $props();

  let sheetOpen = $state(false);
</script>

<div class="w-full h-12">
  <header
    class="flex items-center justify-between fixed h-12 top-0 left-0 flex-0 w-full backdrop-blur-[9px] px-4 md:px-10 z-40 border-b border-border/10"
  >
    <Logo />

    <SignedIn>
      <!-- Мобильное меню -->
      <div class="flex items-center gap-2 md:hidden">
        <Sheet.Root bind:open={sheetOpen}>
          <Sheet.Trigger>
            <Button variant="ghost" size="sm" class="p-2">
              <Menu class="w-5 h-5" />
            </Button>
          </Sheet.Trigger>
          <Sheet.Content side="right" class="w-80">
            <Sheet.Header>
              <Sheet.Title>Меню</Sheet.Title>
            </Sheet.Header>
            <div class="mt-6 space-y-4">
              {#if role === 'teacher'}
                <Button
                  variant="ghost"
                  class="w-full justify-start"
                  href="/students"
                  onclick={() => (sheetOpen = false)}
                >
                  <Users class="w-4 h-4 mr-2" />
                  Мои студенты
                </Button>
              {/if}
              {#if role === 'student'}
                <div class="relative">
                  <Button
                    variant="ghost"
                    class="w-full justify-start"
                    href="/homework"
                    onclick={() => (sheetOpen = false)}
                  >
                    <BookOpen class="w-4 h-4 mr-2" />
                    Моя домашка
                    {#if newHomeworkCount > 0}
                      <Badge
                        variant="destructive"
                        class="ml-auto h-5 w-6 rounded-full text-xs"
                      >
                        {newHomeworkCount}
                      </Badge>
                    {/if}
                  </Button>
                </div>
              {/if}
            </div>
          </Sheet.Content>
        </Sheet.Root>

        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
            },
          }}
        />
      </div>

      <!-- Десктопное меню -->
      <div class="hidden md:flex items-center justify-center">
        {#if role === 'teacher'}
          <Button variant="ghost" class="mr-2" href="/students">
            <Users class="w-4 h-4 mr-2" />
            Мои студенты
          </Button>
        {/if}
        {#if role === 'student'}
          <div class="relative mr-2">
            <Button variant="ghost" href="/homework">
              <BookOpen class="w-4 h-4 mr-2" />
              Моя домашка
            </Button>
            {#if newHomeworkCount > 0}
              <Badge
                variant="destructive"
                class="absolute -top-0 -right-2 h-4 w-5 rounded-full text-xs"
              >
                {newHomeworkCount}
              </Badge>
            {/if}
          </div>
        {/if}
        <div
          class="flex flex-col items-center justify-center min-w-10 min-h-10"
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10',
              },
            }}
          />
        </div>
      </div>
    </SignedIn>
  </header>
</div>

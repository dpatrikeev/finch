<script lang="ts">
  import { page } from '$app/state';
  import * as Card from '$lib/components/ui/card';
  import Users from '@lucide/svelte/icons/users';

  const { message } = page.error as { message: string };
</script>

<Card.Root class="text-center py-16">
  <Card.Content class="space-y-4">
    <div class="flex justify-center">
      <div class="p-4 bg-muted rounded-full">
        <Users class="w-12 h-12 text-muted-foreground" />
      </div>
    </div>
    <div class="space-y-2">
      <h3 class="text-xl font-semibold text-foreground">{message}</h3>
      <p class="text-muted-foreground max-w-md mx-auto">
        У вас пока нет студента с таким ID
      </p>
    </div>
  </Card.Content>
</Card.Root>

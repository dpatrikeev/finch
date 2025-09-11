<script lang="ts">
  import { page } from '$app/state';

  const { message } = page.error as { message: string };
</script>

<section class="mx-auto p-10">
  <h1 class="text-3xl font-bold mb-8 text-slate-950">
    {message}
  </h1>
</section>

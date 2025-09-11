<script lang="ts">
  import type { PageData } from './$types';
  import Notation from '$lib/notation/Notation.svelte';
  import { Title } from '$lib/components';

  let { data }: { data: PageData } = $props();
  let { measures, title } = $derived(data);
</script>

<section class="mx-auto p-10">
  <h1 class="text-3xl font-bold mb-8 text-slate-950">
    <Title {title} />
  </h1>
  <Notation {measures} />
</section>

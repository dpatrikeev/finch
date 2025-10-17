<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Header } from '$lib/components';
  import { getNavigation } from '$lib/remote/nav.remote';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
  let navigation = $derived(await getNavigation());
</script>

<Header {navigation} />

<section class="mx-auto p-5 md:p-10">
  {@render children()}
</section>

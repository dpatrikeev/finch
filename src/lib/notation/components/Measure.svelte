<script lang="ts">
  import type { Measure } from '../types';

  import Note from './Note.svelte';
  import Element from './Element.svelte';
  import Text from './Text.svelte';

  type Props = {
    readonly measure: Measure;
    readonly index: number;
  };

  const { measure }: Props = $props();
  const { staves, clefs, keySignatures, barlines, texts } = measure;
  const { attributes, notes } = $derived(measure);
</script>

<g {...attributes}>
  {#each staves as { attributes, innerHTML }}
    <Element {attributes} {innerHTML} />
  {/each}

  {#each clefs as { attributes, innerHTML }}
    <Element {attributes} {innerHTML} />
  {/each}

  {#each keySignatures as { attributes, innerHTML }}
    <Element {attributes} {innerHTML} />
  {/each}

  {#each barlines as { attributes, innerHTML }}
    <Element {attributes} {innerHTML} />
  {/each}

  {#each texts as { attributes, innerHTML }}
    <Text {attributes} {innerHTML} />
  {/each}

  {#each notes as { attributes, innerHTML, noteheads }}
    <Note {attributes} {innerHTML} {noteheads} />
  {/each}
</g>

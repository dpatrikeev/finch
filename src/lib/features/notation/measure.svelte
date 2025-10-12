<script lang="ts">
  import type { Measure } from './types';

  import Note from './note.svelte';
  import Element from './element.svelte';
  import Text from './text.svelte';

  type Props = {
    readonly measure: Measure;
    readonly index: number;
  };

  let { measure }: Props = $props();
  let { staves, clefs, keySignatures, barlines, texts } = measure;
  let { attributes, notes } = $derived(measure);
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

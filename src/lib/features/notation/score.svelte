<script lang="ts">
  import type { Measure as MeasureType, Options, Score } from './types';
  import Measure from './measure.svelte';

  type Props = {
    readonly score: Score;
    readonly notation: MeasureType[];
    readonly options: Options;
  };

  const { score, notation }: Props = $props();
  const { attributes } = $derived(score);
</script>

<svg xmlns="http://www.w3.org/2000/svg" {...attributes}>
  {#each notation as measure, index}
    <Measure {measure} {index} />
  {/each}
</svg>

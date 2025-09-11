<script lang="ts">
  import { onMount } from 'svelte';
  import { prepareNotation } from './utils/prepare-notation';
  import { covertSvgToData } from './utils/svg-to-data';
  import { notationState } from './state.svelte';
  import Score from './components/Score.svelte';
  import type { ExerciseMeasure, Options } from './types';

  let fontsReady = $state(false);
  type Props = {
    readonly measures: ExerciseMeasure[];
  };

  const { measures }: Props = $props();

  onMount(async () => {
    await document.fonts.ready;
    fontsReady = true;
  });

  $effect(() => {
    if (fontsReady && measures) {
      const distance: [string, string] = ['f/3', 'e/6'];
      const scale = 1;

      const lineSpacing = 10;
      const staveWidth = 200;
      const staveHeight = 110;
      const textHeight = 21;
      const totalHeight = (staveHeight + lineSpacing + textHeight * 2) * scale;

      const measuresLength = measures.length;
      const totalWidth = staveWidth * measuresLength * scale + 1;

      const options: Options = {
        measuresLength,
        distance,
        scale,
        lineSpacing,
        staveWidth,
        staveHeight,
        textHeight,
        totalWidth,
        totalHeight,
      };

      const context = prepareNotation(measures, options);
      const { notation, score } = covertSvgToData(context);

      notationState.notation = notation;
      notationState.score = score;
      notationState.options = options;
    }
  });

  const { score, notation, options } = $derived(notationState);
</script>

<div class="notation">
  {#if fontsReady && score && notation && options}
    <Score {score} {notation} {options} />
  {:else}
    <p>loading...</p>
  {/if}
</div>

<style>
  .notation {
    position: relative;
    width: min-content;
    height: min-content;
    user-select: none;
    background: white;
    padding: 40px;
    border-radius: 10px;
  }
</style>

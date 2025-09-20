<script lang="ts">
  import { onMount } from 'svelte';
  import { prepareNotation } from './utils/prepare-notation';
  import { covertSvgToData } from './utils/svg-to-data';
  import Score from './components/Score.svelte';
  import type {
    ExerciseMeasure,
    Measure,
    Options,
    Score as ScoreType,
  } from './types';

  let fontsReady = $state(false);
  type Props = {
    readonly measures: ExerciseMeasure[];
  };

  const { measures }: Props = $props();

  let score = $state<ScoreType | undefined>(undefined);
  let notation = $state<Measure[] | undefined>(undefined);
  let options = $state<Options | undefined>(undefined);

  onMount(async () => {
    await document.fonts.ready;
    fontsReady = true;
  });

  $effect(() => {
    if (fontsReady && measures) {
      const distance: [string, string] = ['f/3', 'e/6'];
      // Адаптивный масштаб для мобильных устройств - будет определяться CSS
      const scale = 1;

      const lineSpacing = 10;
      // Адаптивная ширина нотного стана - будет определяться CSS
      const staveWidth = 200;
      const staveHeight = 110;
      const textHeight = 21;
      const totalHeight = (staveHeight + lineSpacing + textHeight * 2) * scale;

      const measuresLength = measures.length;
      const totalWidth = staveWidth * measuresLength * scale + 1;

      const currentOptions: Options = {
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

      const context = prepareNotation(measures, currentOptions);
      const { notation: currentNotation, score: currentScore } =
        covertSvgToData(context);

      notation = currentNotation;
      score = currentScore;
      options = currentOptions;
    }
  });

  // const { score, notation, options } = $derived(notationState);
</script>

<div class="notation">
  {#if fontsReady && score && notation && options}
    <Score {score} {notation} {options} />
  {:else}
    <div class="flex items-center justify-center gap-2 text-muted-foreground">
      <div
        class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"
      ></div>
      <span class="text-sm">Загрузка нотации...</span>
    </div>
  {/if}
</div>

<style>
  .notation {
    position: relative;
    width: min-content;
    height: min-content;
    user-select: none;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    max-width: 100%;
    overflow-x: auto;
  }

  /* Адаптивные отступы для мобильных устройств */
  @media (max-width: 640px) {
    .notation {
      padding: 12px;
      border-radius: 6px;
    }
  }

  /* Плавная анимация загрузки */
  .notation:has(div) {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
  }
</style>

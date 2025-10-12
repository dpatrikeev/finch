<script lang="ts">
  import { onMount } from 'svelte';
  import {
    prepareNotation,
    convertSvgToData,
    createDefaultOptions,
  } from './utils';
  import Score from './score.svelte';
  import { Spinner } from '$lib/components';
  import type {
    ExerciseMeasure,
    Measure,
    Options,
    Score as ScoreType,
  } from './types';

  type Props = {
    measures: ExerciseMeasure[];
  };

  let { measures }: Props = $props();

  let fontsReady = $state(false);
  let score = $state<ScoreType | undefined>(undefined);
  let notation = $state<Measure[] | undefined>(undefined);
  let options = $state<Options | undefined>(undefined);

  onMount(async () => {
    await document.fonts.ready;
    fontsReady = true;
  });

  $effect(() => {
    if (fontsReady && measures) {
      const currentOptions = createDefaultOptions(measures);
      const context = prepareNotation(measures, currentOptions);
      const { notation: currentNotation, score: currentScore } =
        convertSvgToData(context);

      notation = currentNotation;
      score = currentScore;
      options = currentOptions;
    }
  });
</script>

<div class="notation">
  {#if fontsReady && score && notation && options}
    <Score {score} {notation} {options} />
  {:else}
    <div class="flex items-center justify-center gap-2 text-muted-foreground">
      <Spinner size="sm" />
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

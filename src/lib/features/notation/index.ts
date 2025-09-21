// Экспорт всего публичного API фичи
export type {
  ExerciseMeasure,
  ExerciseNote,
  NotationProps,
  ScoreProps,
  Options,
  Score,
  Measure,
  Group,
  Attributes,
} from './types/notation.types';
export {
  prepareNotation,
  convertSvgToData,
  createDefaultOptions,
  throttle,
} from './utils/notation.utils';
export * from './components';
export { default as Notation } from './Notation.svelte';

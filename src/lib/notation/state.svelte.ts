import type { Measure, Options, Score } from './types';

type State = {
  score: Score | undefined;
  notation: Measure[] | undefined;
  options: Options | undefined;
};

export const notationState = $state<State>({
  score: undefined,
  notation: undefined,
  options: undefined,
});

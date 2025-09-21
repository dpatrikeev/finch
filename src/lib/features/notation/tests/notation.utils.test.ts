import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createDefaultOptions, throttle } from '../utils/notation.utils';
import type { ExerciseMeasure } from '../types/notation.types';

describe('notation.utils', () => {
  describe('createDefaultOptions', () => {
    it('should create default options for single measure', () => {
      const measures: ExerciseMeasure[] = [
        {
          clef: 'treble',
          notes: [{ keys: ['c/4'], duration: 'q' }],
        },
      ];

      const options = createDefaultOptions(measures);

      expect(options).toEqual({
        measuresLength: 1,
        distance: ['f/3', 'e/6'],
        scale: 1,
        lineSpacing: 10,
        staveWidth: 200,
        staveHeight: 110,
        textHeight: 21,
        totalWidth: 201, // staveWidth * measuresLength * scale + 1
        totalHeight: 162, // (staveHeight + lineSpacing + textHeight * 2) * scale
      });
    });

    it('should create default options for multiple measures', () => {
      const measures: ExerciseMeasure[] = [
        { clef: 'treble' },
        { clef: 'bass' },
        { clef: 'treble' },
      ];

      const options = createDefaultOptions(measures);

      expect(options.measuresLength).toBe(3);
      expect(options.totalWidth).toBe(601); // 200 * 3 * 1 + 1
    });

    it('should handle empty measures array', () => {
      const measures: ExerciseMeasure[] = [];

      const options = createDefaultOptions(measures);

      expect(options.measuresLength).toBe(0);
      expect(options.totalWidth).toBe(1);
    });
  });

  describe('throttle', () => {
    let mockFn: ReturnType<typeof vi.fn>;
    let throttledFn: (...args: any[]) => void;

    beforeEach(() => {
      mockFn = vi.fn();
      throttledFn = throttle(mockFn, 100);
    });

    it('should call function immediately on first call', () => {
      throttledFn('test');
      expect(mockFn).toHaveBeenCalledWith('test');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should throttle subsequent calls', async () => {
      throttledFn('first');
      throttledFn('second'); // Should be ignored
      throttledFn('third'); // Should be ignored

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      // Wait for throttle delay
      await new Promise((resolve) => setTimeout(resolve, 150));

      throttledFn('fourth');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('fourth');
    });
  });
});

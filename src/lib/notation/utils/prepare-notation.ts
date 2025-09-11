import {
  Formatter,
  Stave,
  StaveModifierPosition,
  StaveNote,
  StaveText,
  SVGContext,
  Voice,
} from 'vexflow';
import type { ExerciseMeasure, ExerciseNote } from '../types';
import type { Options } from '../types';

export function prepareNotation(measures: ExerciseMeasure[], options: Options) {
  const container = document.createElement('div');
  const context = new SVGContext(container);

  const { totalWidth, totalHeight, staveWidth, textHeight, scale } = options;

  context.resize(totalWidth, totalHeight);
  context.scale(scale, scale);

  measures.forEach(({ clef, keySignature, barline, notes, text }, index) => {
    context.openGroup('measure');

    let voice = new Voice();
    let formatter = new Formatter();

    const x = index * staveWidth;
    const stave = new Stave(x, textHeight, staveWidth);

    stave.setContext(context);

    clef && stave.addClef(clef);
    keySignature && stave.addKeySignature(keySignature);
    barline && stave.setEndBarType(barline);

    if (text) {
      const { above, below } = text;

      if (above) {
        const textAbove = new StaveText(above, StaveModifierPosition.ABOVE, {
          shiftY: -textHeight + 2,
        });
        stave.addModifier(textAbove);
      }

      if (below) {
        const textBelow = new StaveText(below, StaveModifierPosition.BELOW, {
          shiftY: textHeight - 2,
        });
        stave.addModifier(textBelow);
      }
    }

    if (notes) {
      const staveNotes = notes.map(({ keys, duration }: ExerciseNote) => {
        const note = new StaveNote({
          keys,
          duration,
        });

        return note;
      });

      voice.addTickables(staveNotes);
      formatter.joinVoices([voice]).formatToStave([voice], stave);
      voice.draw(context, stave);
    }

    stave.draw();
    context.closeGroup();
  });

  return context;
}

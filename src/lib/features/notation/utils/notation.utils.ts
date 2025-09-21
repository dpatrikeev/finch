import {
  Formatter,
  Stave,
  StaveModifierPosition,
  StaveNote,
  StaveText,
  SVGContext,
  Voice,
} from 'vexflow';
import type { SVGContext as SVGContextType } from 'vexflow';
import type {
  ExerciseMeasure,
  ExerciseNote,
  Options,
  Measure,
  Score,
  Attributes,
  Group,
} from '../types/notation.types';

/**
 * Подготавливает нотацию для отображения с использованием VexFlow
 */
export function prepareNotation(
  measures: ExerciseMeasure[],
  options: Options
): SVGContextType {
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

    if (notes && notes.length > 0) {
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

/**
 * Конвертирует SVG контекст в данные для отображения
 */
export function convertSvgToData(context: SVGContextType): {
  score: Score;
  notation: Measure[];
} {
  const svg = context.svg;

  const score: Score = {
    attributes: getAttributes(svg),
  };

  const notation = [...svg.querySelectorAll('.vf-measure')].map(
    (measure): Measure => {
      const texts = [...measure.querySelectorAll('text')]
        .filter((text) => text.parentElement?.classList.contains('vf-measure'))
        .map((text) => {
          return {
            attributes: getAttributes(text),
            innerHTML: text.innerHTML,
          };
        });

      const notes = [...measure.querySelectorAll('.vf-stavenote')].map(
        (note) => {
          const noteheads = [...note.querySelectorAll('.vf-notehead')].map(
            (notehead) => {
              const x = Number(
                getAttributes(notehead.getElementsByTagName('text')[0]).x
              );
              const y =
                Number(
                  getAttributes(notehead.getElementsByTagName('text')[0]).y
                ) - 4;
              const width = Number(
                getAttributes(note.getElementsByTagName('rect')[0]).width
              );
              const height = 10;

              notehead.remove();

              return {
                attributes: getAttributes(notehead),
                innerHTML: notehead.innerHTML,
                rectAttributes: {
                  x,
                  y,
                  width,
                  height,
                },
              };
            }
          );

          return {
            attributes: getAttributes(note),
            innerHTML: note.innerHTML,
            noteheads,
          };
        }
      );

      return {
        attributes: getAttributes(measure),
        staves: extractElements(measure, '.vf-stave'),
        clefs: extractElements(measure, '.vf-clef'),
        barlines: extractElements(measure, '.vf-stavebarline'),
        keySignatures: extractElements(measure, '.vf-keysignature'),
        notes,
        texts,
      };
    }
  );

  return {
    score,
    notation,
  };
}

/**
 * Создает опции по умолчанию для нотации
 */
export function createDefaultOptions(measures: ExerciseMeasure[]): Options {
  const distance: [string, string] = ['f/3', 'e/6'];
  const scale = 1;
  const lineSpacing = 10;
  const staveWidth = 200;
  const staveHeight = 110;
  const textHeight = 21;
  const measuresLength = measures.length;
  const totalWidth = staveWidth * measuresLength * scale + 1;
  const totalHeight = (staveHeight + lineSpacing + textHeight * 2) * scale;

  return {
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
}

/**
 * Throttle функция для ограничения частоты вызовов
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Получает атрибуты элемента в виде объекта
 */
function getAttributes(element: Element): Attributes {
  return Object.fromEntries(
    [...element.attributes].map((a) => [a.name, a.value])
  );
}

/**
 * Извлекает элементы по селектору из родительского элемента
 */
function extractElements(parent: Element, selector: string): Group[] {
  return [...parent.querySelectorAll(selector)].map((element) => ({
    attributes: getAttributes(element),
    innerHTML: element.innerHTML,
  }));
}

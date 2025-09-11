import type { SVGContext } from 'vexflow';
import type { Measure, Score } from '../types';

export function covertSvgToData(context: SVGContext): {
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

function getAttributes(element: Element) {
  return Object.fromEntries(
    [...element.attributes].map((a) => [a.name, a.value])
  );
}

function extractElements(parent: Element, selector: string) {
  return [...parent.querySelectorAll(selector)].map((element) => ({
    attributes: getAttributes(element),
    innerHTML: element.innerHTML,
  }));
}

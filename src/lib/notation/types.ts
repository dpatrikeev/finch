import type { BarlineType } from 'vexflow';

export type Attributes = { [key: string]: string };

export type Score = {
  attributes: Attributes;
};

export type ExerciseNote = {
  keys: string[];
  duration: string;
};

export type ExerciseMeasure = {
  clef?: 'treble' | 'bass';
  keySignature?: string;
  timeSignature?: string;
  barline?: BarlineType;
  text?: {
    above?: string;
    below?: string;
  };
  notes?: ExerciseNote[];
};

export type Measure = {
  attributes: Attributes;
  notes: {
    attributes: Attributes;
    innerHTML: string;
    noteheads: {
      attributes: Attributes;
      innerHTML: string;
      rectAttributes: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }[];
  }[];
  staves: Group[];
  clefs: Group[];
  barlines: Group[];
  keySignatures: Group[];
  texts: Group[];
};

export type Group = {
  attributes: Attributes;
  innerHTML: string;
};

export type Options = {
  measuresLength: number;
  scale: number;
  lineSpacing: number;
  staveWidth: number;
  staveHeight: number;
  distance: [string, string];
  totalWidth: number;
  totalHeight: number;
  textHeight: number;
};

export type ExerciseOption = {
  id: string;
  measures: ExerciseMeasure[];
  isCorrect?: boolean;
};

export type Exercise = {
  id: string;
  title: string;
  description?: string;
  type: 'quiz';
  question: ExerciseMeasure[];
  options: ExerciseOption[];
  correctAnswerId: string;
  explanation?: string;
};

export type AnswerHistory = {
  id: number;
  user_id: string;
  exercise_id: string;
  selected_answer_id: string;
  is_correct: boolean;
  answered_at: string;
};

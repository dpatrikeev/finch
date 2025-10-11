import type { ExerciseMeasure } from '$lib/features/notation/types';

export interface ExerciseStatus {
  isCompleted: boolean;
  isCorrect: boolean;
}

export interface ExerciseInfo {
  id: string;
  title: string;
  description?: string;
}

export type ExerciseOption = {
  id: string;
  measures: ExerciseMeasure[];
  isCorrect?: boolean;
};

export type QuizExercise = {
  id: string;
  title: string;
  description?: string;
  type: 'quiz';
  question: ExerciseMeasure[];
  options: ExerciseOption[];
  correctAnswerId: string;
  explanation?: string;
};

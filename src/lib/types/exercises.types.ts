import type { ExerciseMeasure } from './notation.types';

export interface ExerciseStatus {
  completed: boolean;
  is_correct: boolean;
  attempts?: number;
  last_attempt_at?: string;
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

export type AnswerHistory = {
  id: number;
  user_id: string;
  exercise_id: string;
  selected_answer_id: string;
  is_correct: boolean;
  answered_at: string;
};

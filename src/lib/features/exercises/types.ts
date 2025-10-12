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

export interface ExerciseAnswersHistory {
  id: number;
  user_id: string;
  exercise_id: string;
  selected_answer_id: string;
  is_correct: boolean;
  answered_at: string;
}

export type ExerciseQuiz = {
  id: string;
  title: string;
  description?: string;
  type: 'quiz';
  question: ExerciseMeasure[];
  options: ExerciseOption[];
  correctAnswerId: string;
  explanation?: string;
};

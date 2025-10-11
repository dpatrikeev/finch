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

export type AnswerHistory = {
  id: number;
  user_id: string;
  exercise_id: string;
  selected_answer_id: string;
  is_correct: boolean;
  answered_at: string;
};

export interface ExerciseStat {
  exercise_id: string;
  attempts: number;
  correct_attempts: number;
  is_completed: boolean;
  last_attempt_at: string | null;
  first_attempt_at: string | null;
  answers_history: AnswerHistory[];
}

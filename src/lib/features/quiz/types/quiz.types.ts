import type { ExerciseMeasure } from '$lib/features/notation';

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

// Пропсы для компонентов
export interface QuizProps {
  exercise: QuizExercise;
  answersHistory: AnswerHistory[];
}

export interface QuizOptionProps {
  option: ExerciseOption;
  index: number;
  isSelected: boolean;
  showResult: boolean;
  showCorrectAnswer: boolean;
  hasInitialAnswer: boolean;
  lastAnswerDate?: string;
  onclick: (optionId: string) => void;
}

export interface QuizHistoryProps {
  answersHistory: AnswerHistory[];
  options: ExerciseOption[];
}

export interface QuizExplanationProps {
  explanation: string;
}

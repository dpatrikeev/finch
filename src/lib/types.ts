import type { BarlineType } from 'vexflow';
import type { User } from 'svelte-clerk/server';

export type BaseUser = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'fullName' | 'imageUrl'
> & {
  emailAddress: string;
};

export interface HomeworkItem {
  id: number;
  created_at: string;
  teacher_id: string;
  student_id: string;
  exercises: string[];
  started_at?: string;
  completed_at?: string;
  exercises_completed: string[];
  total_attempts: number;
  correct_attempts: number;
}

export interface HomeworkWithProgress extends HomeworkItem {
  is_completed: boolean;
  progress_percentage: number;
  exercises_status: Record<string, ExerciseStatus>;
}

export interface ExerciseStatus {
  completed: boolean;
  attempts: number;
  last_attempt_at?: string;
}

export interface AnswerRecord {
  exercise_id: string | null;
  selected_answer_id: string | null;
  is_correct: boolean | null;
  answered_at: string;
}

export interface ExerciseAnswersHistory extends AnswerRecord {
  id: number;
  user_id: string | null;
}

export type Exercise = ExerciseQuiz;

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

export type ExerciseOption = {
  id: string;
  measures: ExerciseMeasure[];
  isCorrect?: boolean;
};

export type ExerciseNote = {
  keys: string[];
  duration: string;
};

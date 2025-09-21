export interface BasicExercise {
  id: string;
  title: string;
  description: string;
}

export interface ExerciseStatus {
  isCompleted: boolean;
  isCorrect: boolean;
}

export interface ExerciseItemProps {
  exercise: BasicExercise;
  status?: ExerciseStatus;
}

export interface AnswerHistory {
  id: number;
  user_id: string;
  exercise_id: string;
  selected_answer_id: string;
  is_correct: boolean;
  answered_at: string;
}

export interface SaveAnswerData {
  selectedAnswerId: string;
  isCorrect: boolean;
}

export interface ExercisePageData {
  exercise: BasicExercise;
  answersHistory: AnswerHistory[];
}

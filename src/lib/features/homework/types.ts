export interface HomeworkItem {
  id: number;
  created_at: string;
  teacher_id: string;
  student_id: string;
  exercises: string[];
  is_viewed?: boolean;
  started_at?: string;
  completed_at?: string;
  exercises_completed?: string[];
  total_attempts?: number;
  correct_attempts?: number;
}

export interface AnswerRecord {
  exercise_id: string;
  is_correct: boolean;
  answered_at: string;
}

export interface HomeworkWithProgress extends HomeworkItem {
  is_completed: boolean;
  progress_percentage: number;
  exercises_status: {
    isCompleted: boolean;
    isCorrect: boolean;
  };
}

export interface ExerciseStatus {
  isCompleted: boolean;
  isCorrect: boolean;
}

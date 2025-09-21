export interface HomeworkItem {
  id: number;
  created_at: string;
  teacher_id: string;
  student_id: string;
  exercises: string[]; // Массив ID упражнений
  is_viewed?: boolean;
  // Новые поля для отслеживания прогресса
  started_at?: string; // Когда студент начал выполнять
  completed_at?: string; // Когда студент завершил все упражнения
  exercises_completed?: string[]; // Какие упражнения уже выполнены правильно
  total_attempts?: number; // Общее количество попыток по всем упражнениям
  correct_attempts?: number; // Количество правильных ответов
}

// Расширенный интерфейс с вычисляемыми полями для UI
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
  exercise_id: string;
  selected_answer_id: string;
  is_correct: boolean;
  answered_at: string;
}

export interface FullAnswerRecord extends AnswerRecord {
  user_id: string;
  id: number;
}

export interface ExerciseStat {
  exercise_id: string;
  total_attempts: number;
  correct_attempts: number;
  completion_rate: number;
  last_attempt_at?: string;
  is_completed: boolean;
  first_attempt_at?: string;
  answers_history: AnswerRecord[];
}

export interface HomeworkStats {
  homework: HomeworkItem;
  student: {
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  exercises_stats: ExerciseStat[];
  overall_progress: {
    total_exercises: number;
    completed_exercises: number;
    completion_percentage: number;
    total_attempts: number;
    correct_attempts: number;
    accuracy_percentage: number;
  };
}

export interface HomeworkProps {
  homework: HomeworkWithProgress[];
  user: {
    firstName: string;
    lastName: string;
    email: string;
    imageUrl?: string;
    accuracy: number;
    totalExercises: number;
  };
}

export interface AssignHomeworkProps {
  open?: boolean;
  student: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
  exercises: Array<{ id: string; title: string; description?: string }>;
  onclose?: () => void;
  onassigned?: () => void;
}

export interface EditHomeworkProps {
  open: boolean;
  homework: HomeworkItem;
  student: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  exercises: { id: string; title: string; description?: string }[];
  onclose?: () => void;
  onupdated?: () => void;
}

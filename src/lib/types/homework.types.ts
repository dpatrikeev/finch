import type { ExerciseStatus } from './exercises.types';

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

// Интерфейс для ответов из базы данных (частичный, только нужные поля)
export interface AnswerRecord {
  exercise_id: string;
  is_correct: boolean;
  answered_at: string;
}

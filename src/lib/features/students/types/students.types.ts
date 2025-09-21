export interface StudentInfo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  imageUrl: string | null;
  totalExercises: number;
  correctAnswers: number;
  accuracy: number;
}

export interface StudentsListProps {
  students: StudentInfo[];
  exercises: ExerciseInfo[];
}

export interface StudentDetailProps {
  student: StudentInfo;
  homework: HomeworkWithProgress[];
  exercises: ExerciseInfo[];
  isTeacherView: boolean;
}

export interface StudentCardProps {
  student: StudentInfo;
  exercises: ExerciseInfo[];
  onassigned?: () => void;
}

export interface ExerciseInfo {
  id: string;
  title: string;
  description?: string;
}

// Import and re-export from homework feature to maintain consistency
import type { HomeworkWithProgress } from '$lib/features/homework/types/homework.types';
export type { HomeworkWithProgress };

export interface ExerciseStatus {
  completed: boolean;
  attempts: number;
}

export interface StudentsStatsData {
  totalStudents: number;
  totalExercises: number;
  activeStudents: number;
  totalCorrectAnswers: number;
}

export interface AssignHomeworkData {
  studentId: string;
  exercises: string[];
}

export interface AssignHomeworkResult {
  success: boolean;
  message?: string;
  error?: string;
  homeworkId?: string;
}

export type UserRole = 'teacher' | 'student';

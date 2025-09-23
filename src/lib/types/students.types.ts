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

export interface ExerciseInfo {
  id: string;
  title: string;
  description?: string;
}

export interface StudentsStatsData {
  totalStudents: number;
  totalExercises: number;
  activeStudents: number;
  totalCorrectAnswers: number;
}

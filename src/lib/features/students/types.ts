export interface BaseUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  imageUrl?: string | null;
}

export interface StudentInfo extends BaseUser {
  totalExercises: number;
  correctAnswers: number;
  accuracy: number;
}

export interface StudentsStatsData {
  totalStudents: number;
  totalExercises: number;
  activeStudents: number;
  totalCorrectAnswers: number;
}

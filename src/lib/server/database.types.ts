export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      answers_history: {
        Row: {
          id: number;
          user_id: string | null;
          exercise_id: string | null;
          selected_answer_id: string | null;
          is_correct: boolean | null;
          answered_at: string;
        };
        Insert: {
          id?: never;
          user_id?: string | null;
          exercise_id?: string | null;
          selected_answer_id?: string | null;
          is_correct?: boolean | null;
          answered_at?: string;
        };
        Update: {
          id?: never;
          user_id?: string | null;
          exercise_id?: string | null;
          selected_answer_id?: string | null;
          is_correct?: boolean | null;
          answered_at?: string;
        };
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          title: string | null;
          description: string | null;
        };
        Insert: {
          id: string;
          title?: string | null;
          description?: string | null;
        };
        Update: {
          id?: string;
          title?: string | null;
          description?: string | null;
        };
        Relationships: [];
      };
      homework: {
        Row: {
          id: number;
          created_at: string;
          teacher_id: string | null;
          student_id: string | null;
          exercises: string[] | null;
        };
        Insert: {
          id?: never;
          created_at?: string;
          teacher_id?: string | null;
          student_id?: string | null;
          exercises?: string[] | null;
        };
        Update: {
          id?: never;
          created_at?: string;
          teacher_id?: string | null;
          student_id?: string | null;
          exercises?: string[] | null;
        };
        Relationships: [];
      };
      students: {
        Row: {
          student_id: string;
          teacher_id: string;
        };
        Insert: {
          student_id: string;
          teacher_id: string;
        };
        Update: {
          student_id?: string;
          teacher_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

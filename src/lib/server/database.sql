-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.answers_history (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id text,
  exercise_id text,
  selected_answer_id text,
  is_correct boolean,
  answered_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT answers_history_pkey PRIMARY KEY (id)
);
CREATE TABLE public.exercises (
  id text NOT NULL UNIQUE,
  title text,
  description text,
  CONSTRAINT exercises_pkey PRIMARY KEY (id)
);
CREATE TABLE public.homework (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  teacher_id text,
  student_id text,
  exercises ARRAY,
  CONSTRAINT homework_pkey PRIMARY KEY (id)
);
CREATE TABLE public.students (
  student_id text NOT NULL,
  teacher_id text NOT NULL,
  CONSTRAINT students_pkey PRIMARY KEY (student_id)
);
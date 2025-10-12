import { clerkClient } from 'svelte-clerk/server';
import { getRequestEvent, query } from '$app/server';
import { supabase } from '$lib/server/database';
import { getUserRole } from '$lib/features/user';
import * as v from 'valibot';

import type { StudentInfo } from '$lib/features/students/types';

/**
 * Загружает список студентов для учителя
 */
export const getTeacherStudents = query(async (): Promise<StudentInfo[]> => {
  const { locals } = getRequestEvent();
  const auth = locals.auth();
  const userId = auth.userId as string;
  const role = await getUserRole(userId);

  if (role !== 'teacher') return [];

  const { data: studentRelations, error } = await supabase(locals)
    .from('students')
    .select('student_id')
    .eq('teacher_id', userId);

  if (error) {
    console.error('Error fetching students:', error);
    return [];
  }

  if (!studentRelations || studentRelations.length === 0) {
    return [];
  }

  const studentIds = studentRelations.map((r) => r.student_id);

  // Получаем статистику всех студентов одним запросом
  const { data: allAnswers } = await supabase(locals)
    .from('answers_history')
    .select('user_id, exercise_id, is_correct, answered_at')
    .in('user_id', studentIds)
    .order('answered_at', { ascending: true });

  // Группируем ответы по студентам
  const answersByStudent = new Map<
    string,
    Array<{ exercise_id: string; is_correct: boolean; answered_at: string }>
  >();
  (allAnswers || []).forEach((answer) => {
    if (!answersByStudent.has(answer.user_id)) {
      answersByStudent.set(answer.user_id, []);
    }
    answersByStudent.get(answer.user_id)!.push({
      exercise_id: answer.exercise_id,
      is_correct: answer.is_correct,
      answered_at: answer.answered_at,
    });
  });

  const students: StudentInfo[] = [];

  for (const relation of studentRelations) {
    try {
      const user = await clerkClient.users.getUser(relation.student_id);
      const answers = answersByStudent.get(relation.student_id) || [];

      // Группируем ответы по упражнениям и берем только последний ответ для каждого
      // Ответы отсортированы по answered_at, поэтому последние перезапишут ранние
      const exerciseMap = new Map<string, boolean>();
      answers.forEach((answer) => {
        exerciseMap.set(answer.exercise_id, answer.is_correct);
      });

      const totalExercises = exerciseMap.size;
      const correctAnswers = Array.from(exerciseMap.values()).filter(
        (isCorrect) => isCorrect
      ).length;

      students.push({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress || '',
        imageUrl: user.imageUrl,
        totalExercises,
        correctAnswers,
        accuracy:
          totalExercises > 0
            ? Math.round((correctAnswers / totalExercises) * 100)
            : 0,
      });
    } catch (error) {
      console.error(`Error fetching student ${relation.student_id}:`, error);
    }
  }

  return students;
});

/**
 * Загружает данные конкретного студента
 */
export const getStudentById = query(
  v.string(),
  async (studentId: string): Promise<StudentInfo | null> => {
    const { locals } = getRequestEvent();
    const auth = locals.auth();
    const userId = auth.userId as string;
    const role = await getUserRole(userId);

    if (role !== 'teacher') return null;

    try {
      // Проверяем, что студент принадлежит этому учителю
      const { data: relation, error: relationError } = await supabase(locals)
        .from('students')
        .select('student_id')
        .eq('teacher_id', userId)
        .eq('student_id', studentId)
        .single();

      if (relationError || !relation) {
        return null;
      }

      const user = await clerkClient.users.getUser(studentId);

      // Получаем статистику студента
      const { data: answers } = await supabase(locals)
        .from('answers_history')
        .select('exercise_id, is_correct, answered_at')
        .eq('user_id', studentId)
        .order('answered_at', { ascending: true });

      // Группируем ответы по упражнениям и берем только последний ответ для каждого
      // Ответы отсортированы по answered_at, поэтому последние перезапишут ранние
      const exerciseMap = new Map<string, boolean>();
      (answers || []).forEach((answer) => {
        exerciseMap.set(answer.exercise_id, answer.is_correct);
      });

      const totalExercises = exerciseMap.size;
      const correctAnswers = Array.from(exerciseMap.values()).filter(
        (isCorrect) => isCorrect
      ).length;

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress || '',
        imageUrl: user.imageUrl,
        totalExercises,
        correctAnswers,
        accuracy:
          totalExercises > 0
            ? Math.round((correctAnswers / totalExercises) * 100)
            : 0,
      };
    } catch (error) {
      console.error('Ошибка при загрузке данных студента:', error);
      return null;
    }
  }
);

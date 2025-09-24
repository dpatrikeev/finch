import { clerkClient } from 'svelte-clerk/server';
import { getRequestEvent, query } from '$app/server';
import type { StudentInfo } from '$lib/types/students.types';
import { supabase } from '$lib/server/database';
import { getUserRole } from './user.remote';

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

  const students: StudentInfo[] = [];

  for (const relation of studentRelations) {
    try {
      const user = await clerkClient.users.getUser(relation.student_id);

      // Получаем статистику студента
      const { data: answers } = await supabase(locals)
        .from('answers_history')
        .select('exercise_id, is_correct')
        .eq('user_id', relation.student_id);

      // Подсчитываем уникальные упражнения и правильные ответы
      const uniqueExercises = new Set(answers?.map((a) => a.exercise_id) || []);
      const correctAnswers = answers?.filter((a) => a.is_correct).length || 0;
      const totalExercises = uniqueExercises.size;

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

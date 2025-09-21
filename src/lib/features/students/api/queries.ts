import { clerkClient } from 'svelte-clerk/server';
import { supabase } from '$lib/supabase';
import type { StudentInfo, UserRole } from '../types/students.types';

/**
 * Получает роль пользователя
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  if (!userId) return 'student';

  const user = await clerkClient.users.getUser(userId);
  return (user.publicMetadata.role as UserRole) || 'student';
}

/**
 * Загружает список студентов для учителя
 */
export async function loadTeacherStudents(
  locals: App.Locals
): Promise<StudentInfo[]> {
  const auth = locals.auth();
  const userId = auth.userId as string;
  const role = await getUserRole(userId);

  if (role !== 'teacher') return [];

  try {
    // Получаем список ID студентов для данного учителя
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
        const uniqueExercises = new Set(
          answers?.map((a) => a.exercise_id) || []
        );
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
  } catch (error) {
    console.error('Error in loadTeacherStudents:', error);
    return [];
  }
}

/**
 * Загружает данные конкретного студента
 */
export async function loadStudentById(
  locals: App.Locals,
  studentId: string
): Promise<StudentInfo | null> {
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
      .select('exercise_id, is_correct')
      .eq('user_id', studentId);

    // Подсчитываем уникальные упражнения и правильные ответы
    const uniqueExercises = new Set(answers?.map((a) => a.exercise_id) || []);
    const correctAnswers = answers?.filter((a) => a.is_correct).length || 0;
    const totalExercises = uniqueExercises.size;

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
    console.error('Error in loadStudentById:', error);
    return null;
  }
}

/**
 * Загружает доступные упражнения
 */
export async function loadExercises(locals: App.Locals) {
  try {
    const { data: exercises, error } = await supabase(locals)
      .from('exercises')
      .select('id, title, description')
      .order('id');

    if (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }

    return exercises || [];
  } catch (error) {
    console.error('Error in loadExercises:', error);
    return [];
  }
}

/**
 * Загружает информацию о текущем пользователе
 */
export async function loadCurrentUserInfo(
  locals: App.Locals
): Promise<StudentInfo | null> {
  const auth = locals.auth();
  const userId = auth.userId as string;

  if (!userId) return null;

  try {
    const user = await clerkClient.users.getUser(userId);

    // Получаем статистику пользователя
    const { data: answers } = await supabase(locals)
      .from('answers_history')
      .select('exercise_id, is_correct')
      .eq('user_id', userId);

    // Подсчитываем уникальные упражнения и правильные ответы
    const uniqueExercises = new Set(answers?.map((a) => a.exercise_id) || []);
    const correctAnswers = answers?.filter((a) => a.is_correct).length || 0;
    const totalExercises = uniqueExercises.size;

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
    console.error('Error fetching current user info:', error);
    return null;
  }
}

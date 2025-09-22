import { query, command } from '$app/server';
import { getRequestEvent } from '$app/server';
import { clerkClient } from 'svelte-clerk/server';
import { supabase } from '$lib/supabase';
import * as v from 'valibot';
import type { StudentInfo, ExerciseInfo, UserRole } from './types';

/**
 * Получает роль пользователя
 */
async function getUserRole(userId: string): Promise<UserRole> {
  if (!userId) return 'student';

  const user = await clerkClient.users.getUser(userId);
  return (user.publicMetadata.role as UserRole) || 'student';
}

/**
 * Загружает список студентов для учителя
 */
export const getTeacherStudents = query(async (): Promise<StudentInfo[]> => {
  const { locals } = getRequestEvent();
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
    console.error('Error in getTeacherStudents:', error);
    return [];
  }
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
      console.error('Error in getStudentById:', error);
      return null;
    }
  }
);

/**
 * Загружает доступные упражнения
 */
export const getExercises = query(async (): Promise<ExerciseInfo[]> => {
  const { locals } = getRequestEvent();

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
    console.error('Error in getExercises:', error);
    return [];
  }
});

/**
 * Назначает домашнее задание одному студенту
 */
export const assignHomework = command(
  v.object({
    studentId: v.pipe(v.string(), v.minLength(1, 'ID студента обязателен')),
    exercises: v.pipe(
      v.array(v.string()),
      v.minLength(1, 'Необходимо выбрать хотя бы одно упражнение')
    ),
  }),
  async ({ studentId, exercises }) => {
    const { locals } = getRequestEvent();
    const auth = locals.auth();

    if (!auth.userId) {
      throw new Error('Необходима авторизация');
    }

    // Проверяем, что студент принадлежит этому учителю
    const students = await getTeacherStudents();
    const student = students.find((s) => s.id === studentId);

    if (!student) {
      throw new Error('Студент не найден или не принадлежит вам');
    }

    try {
      const { data, error } = await supabase(locals)
        .from('homework')
        .insert({
          teacher_id: auth.userId,
          student_id: studentId,
          exercises,
        })
        .select()
        .single();

      if (error) {
        console.error('Error assigning homework:', error);
        throw new Error('Ошибка при создании домашнего задания');
      }

      // Обновляем список студентов
      await getTeacherStudents().refresh();

      return {
        success: true,
        message: `Домашнее задание назначено студенту ${student.firstName} ${student.lastName}`,
        homeworkId: data.id.toString(),
      };
    } catch (error) {
      console.error('Error in assignHomework:', error);
      throw new Error('Ошибка при создании домашнего задания');
    }
  }
);

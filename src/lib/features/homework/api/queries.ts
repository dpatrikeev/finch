import { supabase } from '$lib/supabase';
import type {
  HomeworkItem,
  HomeworkWithProgress,
  HomeworkStats,
} from '../types/homework.types';
import {
  createHomeworkWithProgress,
  createHomeworkStats,
} from '../utils/homework.utils';

/**
 * Загружает домашние задания студента с прогрессом
 */
export async function loadStudentHomework(
  locals: App.Locals,
  studentId: string
): Promise<HomeworkWithProgress[]> {
  try {
    const { data: homework, error } = await supabase(locals)
      .from('homework')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching homework:', error);
      return [];
    }

    if (!homework || homework.length === 0) {
      return [];
    }

    // Получаем записи ответов для всех упражнений
    const exerciseIds = homework.flatMap((hw) => hw.exercises);
    const { data: answerRecords, error: answersError } = await supabase(locals)
      .from('answers_history')
      .select('*')
      .in('exercise_id', exerciseIds)
      .eq('user_id', studentId);

    if (answersError) {
      console.error('Error fetching answer records:', answersError);
    }

    // Создаем расширенные объекты с прогрессом
    return homework.map((hw) =>
      createHomeworkWithProgress(hw, answerRecords || [])
    );
  } catch (error) {
    console.error('Error in loadStudentHomework:', error);
    return [];
  }
}

/**
 * Загружает домашние задания студента (базовая версия)
 */
export async function loadStudentHomeworkBasic(
  locals: App.Locals,
  studentId: string
): Promise<HomeworkItem[]> {
  try {
    const { data: homework, error } = await supabase(locals)
      .from('homework')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching homework:', error);
      return [];
    }

    return homework || [];
  } catch (error) {
    console.error('Error in loadStudentHomeworkBasic:', error);
    return [];
  }
}

/**
 * Загружает список всех доступных упражнений
 */
export async function loadAvailableExercises(
  locals: App.Locals
): Promise<Array<{ id: string; title: string; description?: string }>> {
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
    console.error('Error in loadAvailableExercises:', error);
    return [];
  }
}

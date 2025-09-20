import { supabase } from '$lib/supabase';
import type { HomeworkItem } from './homework';

// Утилиты для учителей по работе с домашними заданиями

export const assignHomeworkToStudent = async (
  locals: App.Locals,
  teacherId: string,
  studentId: string,
  exercises: string[]
): Promise<HomeworkItem | null> => {
  try {
    const { data, error } = await supabase(locals)
      .from('homework')
      .insert({
        teacher_id: teacherId,
        student_id: studentId,
        exercises, // text[] массив напрямую
      })
      .select()
      .single();

    if (error) {
      console.error('Error assigning homework:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in assignHomeworkToStudent:', error);
    return null;
  }
};

export const assignHomeworkToMultipleStudents = async (
  locals: App.Locals,
  teacherId: string,
  studentIds: string[],
  exercises: string[]
): Promise<HomeworkItem[]> => {
  try {
    const homeworkData = studentIds.map((studentId) => ({
      teacher_id: teacherId,
      student_id: studentId,
      exercises, // Один и тот же массив упражнений для всех
    }));

    const { data, error } = await supabase(locals)
      .from('homework')
      .insert(homeworkData)
      .select();

    if (error) {
      console.error('Error assigning homework to multiple students:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in assignHomeworkToMultipleStudents:', error);
    return [];
  }
};

export const getTeacherHomeworkHistory = async (
  locals: App.Locals,
  teacherId: string
): Promise<HomeworkItem[]> => {
  try {
    const { data: homework, error } = await supabase(locals)
      .from('homework')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teacher homework history:', error);
      return [];
    }

    return homework || [];
  } catch (error) {
    console.error('Error in getTeacherHomeworkHistory:', error);
    return [];
  }
};

// Получить статистику по домашкам учителя
export const getHomeworkStats = async (
  locals: App.Locals,
  teacherId: string
) => {
  try {
    const { data: homework, error } = await supabase(locals)
      .from('homework')
      .select('exercises, student_id')
      .eq('teacher_id', teacherId);

    if (error) {
      console.error('Error fetching homework stats:', error);
      return {
        totalHomework: 0,
        totalStudents: 0,
        totalExercises: 0,
        averageExercisesPerHomework: 0,
      };
    }

    const totalHomework = homework?.length || 0;
    const uniqueStudents = new Set(homework?.map((h) => h.student_id) || [])
      .size;
    const totalExercises =
      homework?.reduce((sum, h) => sum + (h.exercises?.length || 0), 0) || 0;
    const averageExercisesPerHomework =
      totalHomework > 0 ? Math.round(totalExercises / totalHomework) : 0;

    return {
      totalHomework,
      totalStudents: uniqueStudents,
      totalExercises,
      averageExercisesPerHomework,
    };
  } catch (error) {
    console.error('Error in getHomeworkStats:', error);
    return {
      totalHomework: 0,
      totalStudents: 0,
      totalExercises: 0,
      averageExercisesPerHomework: 0,
    };
  }
};

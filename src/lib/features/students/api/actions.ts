import { fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { loadTeacherStudents } from './queries';
import type {
  AssignHomeworkResult,
  HomeworkWithProgress,
} from '../types/students.types';

/**
 * Назначает домашнее задание одному студенту
 */
export function createAssignHomeworkAction() {
  return async (event: {
    request: Request;
    locals: App.Locals;
    params?: Record<string, string>;
  }) => {
    const auth = event.locals.auth();

    if (!auth.userId) {
      return fail(401, { error: 'Необходима авторизация' });
    }

    const formData = await event.request.formData();
    const studentId =
      (formData.get('studentId') as string) || event.params?.studentId;
    const exercisesJson = formData.get('exercises') as string;

    if (!studentId || !exercisesJson) {
      return fail(400, { error: 'Не указан студент или упражнения' });
    }

    let exercises: string[];
    try {
      exercises = JSON.parse(exercisesJson);
    } catch {
      return fail(400, { error: 'Неверный формат упражнений' });
    }

    if (exercises.length === 0) {
      return fail(400, { error: 'Не выбрано ни одного упражнения' });
    }

    // Проверяем, что студент принадлежит этому учителю
    const students = await loadTeacherStudents(event.locals);
    const student = students.find((s) => s.id === studentId);

    if (!student) {
      return fail(403, { error: 'Студент не найден или не принадлежит вам' });
    }

    // Создаем домашнее задание
    const homework = await assignHomeworkToStudent(
      event.locals,
      auth.userId,
      studentId,
      exercises
    );

    if (!homework) {
      return fail(500, { error: 'Ошибка при создании домашнего задания' });
    }

    return {
      success: true,
      message: `Домашнее задание назначено студенту ${student.firstName} ${student.lastName}`,
      homeworkId: homework.id.toString(),
    } as AssignHomeworkResult;
  };
}

/**
 * Назначает домашнее задание нескольким студентам
 */
export function createAssignHomeworkToMultipleAction() {
  return async (event: { request: Request; locals: App.Locals }) => {
    const auth = event.locals.auth();

    if (!auth.userId) {
      return fail(401, { error: 'Необходима авторизация' });
    }

    const formData = await event.request.formData();
    const studentIdsJson = formData.get('studentIds') as string;
    const exercisesJson = formData.get('exercises') as string;

    if (!studentIdsJson || !exercisesJson) {
      return fail(400, { error: 'Не указаны студенты или упражнения' });
    }

    let studentIds: string[];
    let exercises: string[];

    try {
      studentIds = JSON.parse(studentIdsJson);
      exercises = JSON.parse(exercisesJson);
    } catch {
      return fail(400, { error: 'Неверный формат данных' });
    }

    if (studentIds.length === 0 || exercises.length === 0) {
      return fail(400, { error: 'Не выбраны студенты или упражнения' });
    }

    // Проверяем, что все студенты принадлежат этому учителю
    const teacherStudents = await loadTeacherStudents(event.locals);
    const teacherStudentIds = new Set(teacherStudents.map((s) => s.id));

    const invalidStudents = studentIds.filter(
      (id) => !teacherStudentIds.has(id)
    );
    if (invalidStudents.length > 0) {
      return fail(403, { error: 'Некоторые студенты не принадлежат вам' });
    }

    // Создаем домашние задания для всех студентов
    const homeworkResults = await assignHomeworkToMultipleStudents(
      event.locals,
      auth.userId,
      studentIds,
      exercises
    );

    if (homeworkResults.length === 0) {
      return fail(500, { error: 'Ошибка при создании домашних заданий' });
    }

    return {
      success: true,
      message: `Домашнее задание назначено ${studentIds.length} студентам`,
      homeworkIds: homeworkResults.map((hw) => hw.id.toString()),
    };
  };
}

/**
 * Внутренняя функция для назначения домашнего задания одному студенту
 */
async function assignHomeworkToStudent(
  locals: App.Locals,
  teacherId: string,
  studentId: string,
  exercises: string[]
): Promise<HomeworkWithProgress | null> {
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
}

/**
 * Внутренняя функция для назначения домашнего задания нескольким студентам
 */
async function assignHomeworkToMultipleStudents(
  locals: App.Locals,
  teacherId: string,
  studentIds: string[],
  exercises: string[]
): Promise<HomeworkWithProgress[]> {
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
}

// Объект для удобного импорта
export const studentsActions = {
  assignHomework: createAssignHomeworkAction(),
  assignHomeworkToMultiple: createAssignHomeworkToMultipleAction(),
};

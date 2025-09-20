import { supabase } from '$lib/supabase';
import { subDays, formatISO } from 'date-fns';

export interface HomeworkItem {
  id: number;
  created_at: string;
  teacher_id: string;
  student_id: string;
  exercises: string[]; // Массив ID упражнений
  is_viewed?: boolean;
  // Новые поля для отслеживания прогресса
  started_at?: string; // Когда студент начал выполнять
  completed_at?: string; // Когда студент завершил все упражнения
  exercises_completed?: string[]; // Какие упражнения уже выполнены правильно
  total_attempts?: number; // Общее количество попыток по всем упражнениям
  correct_attempts?: number; // Количество правильных ответов
}

// Расширенный интерфейс с вычисляемыми полями для UI
export interface HomeworkWithProgress extends HomeworkItem {
  progress_percentage: number; // Процент выполнения (0-100)
  is_completed: boolean; // Все упражнения выполнены правильно
  exercises_status: Record<
    string,
    {
      completed: boolean;
      correct: boolean;
      attempts: number;
      last_attempt_at?: string;
    }
  >;
}

// Интерфейс для ответов из базы данных (частичный, только нужные поля)
interface AnswerRecord {
  exercise_id: string;
  is_correct: boolean;
  answered_at: string;
}

// Полный интерфейс для детальной статистики
interface FullAnswerRecord extends AnswerRecord {
  selected_answer_id: string;
  user_id: string;
  id: number;
}

export const getStudentHomework = async (
  locals: App.Locals,
  studentId: string
): Promise<HomeworkItem[]> => {
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
    console.error('Error in getStudentHomework:', error);
    return [];
  }
};

export const getHomeworkWithProgress = async (
  locals: App.Locals,
  studentId: string
): Promise<HomeworkWithProgress[]> => {
  try {
    const homework = await getStudentHomework(locals, studentId);

    // Получаем все ответы студента для анализа прогресса
    const { data: answers, error: answersError } = await supabase(locals)
      .from('answers_history')
      .select('exercise_id, is_correct, answered_at')
      .eq('user_id', studentId)
      .order('answered_at', { ascending: false });

    if (answersError) {
      console.error('Error fetching answers for progress:', answersError);
      return homework.map((hw) => ({
        ...hw,
        progress_percentage: 0,
        is_completed: false,
        exercises_status: {},
      }));
    }

    // Обрабатываем каждую домашку
    return homework.map((hw) => {
      const exercisesStatus: Record<
        string,
        {
          completed: boolean;
          correct: boolean;
          attempts: number;
          last_attempt_at?: string;
        }
      > = {};

      // Анализируем каждое упражнение в домашке
      hw.exercises.forEach((exerciseId: string) => {
        const exerciseAnswers =
          answers?.filter((a: AnswerRecord) => a.exercise_id === exerciseId) ||
          [];
        const correctAnswers = exerciseAnswers.filter(
          (a: AnswerRecord) => a.is_correct
        );
        const hasCorrectAnswer = correctAnswers.length > 0;

        exercisesStatus[exerciseId] = {
          completed: hasCorrectAnswer,
          correct: hasCorrectAnswer,
          attempts: exerciseAnswers.length,
          last_attempt_at:
            exerciseAnswers.length > 0
              ? exerciseAnswers[0].answered_at
              : undefined,
        };
      });

      // Вычисляем общий прогресс
      const completedCount = Object.values(exercisesStatus).filter(
        (s) => s.completed
      ).length;
      const totalCount = hw.exercises.length;
      const progressPercentage =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return {
        ...hw,
        progress_percentage: progressPercentage,
        is_completed: progressPercentage === 100,
        exercises_status: exercisesStatus,
      };
    });
  } catch (error) {
    console.error('Error in getHomeworkWithProgress:', error);
    return [];
  }
};

export const getNewHomeworkCount = async (
  locals: App.Locals,
  studentId: string
): Promise<number> => {
  try {
    // Для простоты будем считать новыми все домашки за последние 24 часа
    const oneDayAgo = subDays(new Date(), 1);

    const { data: homework, error } = await supabase(locals)
      .from('homework')
      .select('id')
      .eq('student_id', studentId)
      .gte('created_at', formatISO(oneDayAgo));

    if (error) {
      console.error('Error fetching new homework count:', error);
      return 0;
    }

    return homework?.length || 0;
  } catch (error) {
    console.error('Error in getNewHomeworkCount:', error);
    return 0;
  }
};

// Обновить прогресс домашки когда студент отвечает на упражнение
export const updateHomeworkProgress = async (
  locals: App.Locals,
  studentId: string,
  exerciseId: string,
  isCorrect: boolean
) => {
  try {
    // Найти домашки, которые содержат это упражнение
    const { data: relevantHomework, error } = await supabase(locals)
      .from('homework')
      .select('*')
      .eq('student_id', studentId)
      .contains('exercises', [exerciseId]);

    if (error || !relevantHomework) {
      return; // Упражнение не является частью домашки
    }

    // Обновляем каждую релевантную домашку
    for (const hw of relevantHomework) {
      const updates: Partial<HomeworkItem> = {};

      // Если это первый ответ на любое упражнение в домашке, отмечаем started_at
      if (!hw.started_at) {
        updates.started_at = formatISO(new Date());
      }

      // Обновляем exercises_completed если ответ правильный
      if (isCorrect) {
        const currentCompleted = hw.exercises_completed || [];
        if (!currentCompleted.includes(exerciseId)) {
          updates.exercises_completed = [...currentCompleted, exerciseId];
        }

        // Проверяем, завершена ли вся домашка
        const allExercisesCompleted = hw.exercises.every((ex: string) =>
          [...currentCompleted, exerciseId].includes(ex)
        );

        if (allExercisesCompleted && !hw.completed_at) {
          updates.completed_at = formatISO(new Date());
        }
      }

      // Обновляем счетчики попыток
      updates.total_attempts = (hw.total_attempts || 0) + 1;
      if (isCorrect) {
        updates.correct_attempts = (hw.correct_attempts || 0) + 1;
      }

      // Применяем обновления
      if (Object.keys(updates).length > 0) {
        await supabase(locals).from('homework').update(updates).eq('id', hw.id);
      }
    }
  } catch (error) {
    console.error('Error updating homework progress:', error);
  }
};

// Интерфейс для статистики упражнения
interface ExerciseStat {
  exercise_id: string;
  attempts: number;
  correct_attempts: number;
  is_completed: boolean;
  last_attempt_at: string | null;
  first_attempt_at: string | null;
  answers_history: FullAnswerRecord[];
}

// Получить детальную статистику по конкретной домашке
export const getHomeworkStats = async (
  locals: App.Locals,
  homeworkId: number,
  studentId: string
) => {
  try {
    const { data: homework, error } = await supabase(locals)
      .from('homework')
      .select('*')
      .eq('id', homeworkId)
      .eq('student_id', studentId)
      .single();

    if (error || !homework) {
      return null;
    }

    // Получаем все ответы студента по упражнениям из этой домашки
    const { data: answers, error: answersError } = await supabase(locals)
      .from('answers_history')
      .select('*')
      .eq('user_id', studentId)
      .in('exercise_id', homework.exercises)
      .order('answered_at', { ascending: false });

    if (answersError) {
      console.error('Error fetching homework answers:', answersError);
      return null;
    }

    // Группируем ответы по упражнениям
    const answersByExercise = (answers || []).reduce(
      (acc: Record<string, FullAnswerRecord[]>, answer: FullAnswerRecord) => {
        if (!acc[answer.exercise_id]) {
          acc[answer.exercise_id] = [];
        }
        acc[answer.exercise_id].push(answer);
        return acc;
      },
      {}
    );

    // Создаем статистику по каждому упражнению
    const exerciseStats: ExerciseStat[] = homework.exercises.map(
      (exerciseId: string) => {
        const exerciseAnswers = answersByExercise[exerciseId] || [];
        const correctAnswers = exerciseAnswers.filter(
          (a: FullAnswerRecord) => a.is_correct
        );

        return {
          exercise_id: exerciseId,
          attempts: exerciseAnswers.length,
          correct_attempts: correctAnswers.length,
          is_completed: correctAnswers.length > 0,
          last_attempt_at:
            exerciseAnswers.length > 0 ? exerciseAnswers[0].answered_at : null,
          first_attempt_at:
            exerciseAnswers.length > 0
              ? exerciseAnswers[exerciseAnswers.length - 1].answered_at
              : null,
          answers_history: exerciseAnswers,
        };
      }
    );

    const completedExercises = exerciseStats.filter(
      (stat: ExerciseStat) => stat.is_completed
    ).length;
    const totalExercises = homework.exercises.length;

    return {
      homework,
      exercise_stats: exerciseStats,
      overall_stats: {
        total_exercises: totalExercises,
        completed_exercises: completedExercises,
        progress_percentage:
          totalExercises > 0
            ? Math.round((completedExercises / totalExercises) * 100)
            : 0,
        total_attempts: exerciseStats.reduce(
          (sum: number, stat: ExerciseStat) => sum + stat.attempts,
          0
        ),
        total_correct_attempts: exerciseStats.reduce(
          (sum: number, stat: ExerciseStat) => sum + stat.correct_attempts,
          0
        ),
        is_completed: completedExercises === totalExercises,
        started_at: homework.started_at,
        completed_at: homework.completed_at,
      },
    };
  } catch (error) {
    console.error('Error getting homework stats:', error);
    return null;
  }
};

// Оставляем для обратной совместимости
export const parseExercises = (exercises: string[] | string): string[] => {
  if (Array.isArray(exercises)) {
    return exercises;
  }

  try {
    return JSON.parse(exercises);
  } catch {
    try {
      const fixedStr = exercises.replace(/'/g, '"');
      return JSON.parse(fixedStr);
    } catch {
      console.warn('Failed to parse exercises:', exercises);
      return [];
    }
  }
};

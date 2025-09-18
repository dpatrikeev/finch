import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';
import { getUserRole } from '$lib/utils/user';

export const load: PageServerLoad = async ({ locals }) => {
  // const response = await fetch('/exercises.json');
  // const exercises = await response.json();

  const auth = locals.auth();
  const userId = auth.userId as string;
  const role = await getUserRole(userId);

  const { data: exercises } = await supabase(locals).from('exercises').select();

  let exerciseStatuses: Record<
    string,
    { isCompleted: boolean; isCorrect: boolean }
  > = {};

  if (auth.userId && exercises) {
    // Получаем последние ответы для каждого упражнения
    const { data: lastAnswers } = await supabase(locals)
      .from('answers_history')
      .select('exercise_id, is_correct, answered_at')
      .eq('user_id', auth.userId)
      .order('answered_at', { ascending: false });

    if (lastAnswers) {
      // Группируем по упражнениям и берем последний ответ для каждого
      const groupedAnswers = lastAnswers.reduce((acc, answer) => {
        if (!acc[answer.exercise_id]) {
          acc[answer.exercise_id] = answer;
        }
        return acc;
      }, {} as Record<string, (typeof lastAnswers)[0]>);

      // Создаем статусы упражнений
      exerciseStatuses = Object.entries(groupedAnswers).reduce(
        (acc, [exerciseId, answer]) => {
          acc[exerciseId] = {
            isCompleted: true,
            isCorrect: answer.is_correct,
          };
          return acc;
        },
        {} as Record<string, { isCompleted: boolean; isCorrect: boolean }>
      );
    }
  }

  return {
    exercises: exercises ?? [],
    exerciseStatuses,
    role,
  };
};

import { getRequestEvent, query } from '$app/server';
import { supabase } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import { getAuthorizedUser } from '$lib/remote/user.remote';

export const getExercises = query(async () => {
  const { locals } = getRequestEvent();

  const { data: exercises, error } = await supabase(locals)
    .from('exercises')
    .select('id, title, description')
    .order('id');

  if (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }

  return exercises || [];
});

export const getTeacherStudents = query(async () => {
  const { locals } = getRequestEvent();
  const { userId, userRole } = await getAuthorizedUser();

  if (userRole !== 'teacher') {
    throw error(403, 'Forbidden');
  }

  const { data: students, error: dbError } = await supabase(locals)
    .from('students')
    .select('student_id')
    .eq('teacher_id', userId);

  if (dbError) {
    console.error('Error fetching students:', dbError);
    return [];
  }

  return students || [];
});

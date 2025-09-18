import { clerkClient } from 'svelte-clerk/server';
import { supabase } from '$lib/supabase';

export type UserRole = 'teacher' | 'student';

export const getUserRole = async (userId: string): Promise<UserRole> => {
  if (!userId) return 'student';

  const user = await clerkClient.users.getUser(userId);
  return (user.publicMetadata.role as UserRole) || 'student';
};

export const getTeacherStudents = async (locals: App.Locals) => {
  const { userId } = locals.auth();
  if (!userId) return [];

  const { data, error } = await supabase(locals)
    .from('students')
    .select('student_id')
    .eq('teacher_id', userId);

  if (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

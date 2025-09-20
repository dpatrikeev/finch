// Примеры использования homework с типом text[]

import type { App } from '@sveltejs/kit';
import {
  assignHomeworkToStudent,
  assignHomeworkToMultipleStudents,
} from './teacher-homework';

// Пример 1: Учитель задает домашку одному студенту
export const exampleAssignToOne = async (locals: App.Locals) => {
  const homework = await assignHomeworkToStudent(
    locals,
    'teacher_123',
    'student_456',
    ['2-9', '2-8', '3-1'] // Массив упражнений напрямую!
  );

  console.log('Assigned homework:', homework);
  return homework;
};

// Пример 2: Учитель задает одинаковую домашку нескольким студентам
export const exampleAssignToMany = async (locals: App.Locals) => {
  const homework = await assignHomeworkToMultipleStudents(
    locals,
    'teacher_123',
    ['student_456', 'student_789', 'student_101'],
    ['2-9', '2-8'] // Все получат одинаковые упражнения
  );

  console.log('Assigned homework to multiple students:', homework);
  return homework;
};

// Пример 3: SQL запросы, которые теперь возможны с text[]
export const sqlExamples = () => {
  return `
    -- Найти все домашки с конкретным упражнением
    SELECT * FROM homework WHERE '2-9' = ANY(exercises);
    
    -- Найти домашки, содержащие любое из упражнений
    SELECT * FROM homework WHERE exercises && ARRAY['2-9', '2-8'];
    
    -- Найти домашки с определенным количеством упражнений
    SELECT * FROM homework WHERE array_length(exercises, 1) = 3;
    
    -- Получить все уникальные упражнения из всех домашек
    SELECT DISTINCT unnest(exercises) as exercise_id FROM homework;
    
    -- Статистика: самые популярные упражнения
    SELECT unnest(exercises) as exercise_id, COUNT(*) as usage_count 
    FROM homework 
    GROUP BY exercise_id 
    ORDER BY usage_count DESC;
    
    -- Найти студентов, которым задавали конкретное упражнение
    SELECT DISTINCT student_id FROM homework WHERE '2-9' = ANY(exercises);
  `;
};

// Пример 4: Supabase клиент запросы
export const supabaseExamples = () => {
  return `
    // Найти домашки с конкретным упражнением
    const { data } = await supabase
      .from('homework')
      .select('*')
      .contains('exercises', ['2-9']);
    
    // Найти домашки, где есть любое из упражнений  
    const { data } = await supabase
      .from('homework')
      .select('*')
      .overlaps('exercises', ['2-9', '2-8']);
      
    // Создать новую домашку
    const { data } = await supabase
      .from('homework')
      .insert({
        teacher_id: 'teacher_123',
        student_id: 'student_456', 
        exercises: ['2-9', '2-8', '3-1'] // Массив напрямую!
      });
  `;
};

// Components
export { default as HomeworkBadge } from './homework-badge.svelte';
export { default as AssignHomeworkButton } from './assign-button.svelte';
export { default as Homework } from './homework.svelte';
export { default as HomeworkCard } from './homework-card.svelte';
export { default as HomeworkStatsCard } from './homework-stats.svelte';
export { default as EmptyHomework } from './empty-homework.svelte';

// Types
export type {
  HomeworkItem,
  HomeworkWithProgress,
  ExerciseStatus,
  AnswerRecord,
  ExerciseStat,
  HomeworkStats,
} from './types';

// Queries
export {
  getHomeworkCount,
  getStudentHomeworkWithProgress,
  getMyHomework,
  getAvailableExercises,
  getCurrentUserInfo,
  getHomeworkStats,
} from './queries.remote';

// Commands
export {
  assignHomework,
  assignHomeworkToMultiple,
  updateHomework,
  deleteHomework,
  updateHomeworkProgress,
} from './commands.remote';

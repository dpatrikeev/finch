# Students Feature

Фича для управления студентами в системе Finch. Позволяет учителям просматривать список своих студентов, назначать домашние задания и отслеживать прогресс.

## Структура

```text
src/lib/features/students/
├── api/
│   ├── actions.ts            # Server actions
│   ├── queries.ts            # Load functions  
│   └── index.ts              # Экспорт API
├── components/
│   ├── index.ts              # Экспорт компонентов
│   ├── StudentCard.svelte    # Карточка студента
│   ├── StudentsStats.svelte  # Статистика по студентам
│   ├── EmptyStudents.svelte  # Пустое состояние
│   └── StudentDetail.svelte  # Детальная информация о студенте
├── types/
│   └── students.types.ts     # TypeScript типы
├── utils/
│   └── students.utils.ts     # Утилиты
├── tests/
│   └── students.utils.test.ts # Тесты утилит
├── Students.svelte           # Главный компонент
├── index.ts                  # Публичный экспорт
└── README.md                 # Эта документация
```

## Использование

### Основной компонент

```svelte
<script>
  import { Students } from '$lib/features/students';
  import type { StudentsListProps } from '$lib/features/students';
  
  const props: StudentsListProps = {
    students: studentsData,
    exercises: exercisesData
  };
</script>

<Students {...props} />
```

### Детальная страница студента

```svelte
<script>
  import { StudentDetail } from '$lib/features/students';
  import type { StudentDetailProps } from '$lib/features/students';
  
  const props: StudentDetailProps = {
    student: studentData,
    homework: homeworkData,
    exercises: exercisesData,
    isTeacherView: true
  };
</script>

<StudentDetail {...props} />
```

## API

### Компоненты

- `Students` - главный компонент фичи для отображения списка студентов
- `StudentDetail` - компонент для детального просмотра студента
- `StudentCard` - карточка студента в списке
- `StudentsStats` - статистика по студентам
- `EmptyStudents` - состояние пустого списка

### Queries (Load Functions)

- `loadTeacherStudents(locals)` - загружает список студентов учителя
- `loadStudentById(locals, studentId)` - загружает данные конкретного студента
- `loadExercises(locals)` - загружает доступные упражнения
- `loadCurrentUserInfo(locals)` - загружает информацию о текущем пользователе
- `getUserRole(userId)` - получает роль пользователя

### Actions (Server Actions)

- `createAssignHomeworkAction()` - создает action для назначения домашнего задания
- `createAssignHomeworkToMultipleAction()` - создает action для назначения ДЗ нескольким студентам
- `studentsActions` - объект с готовыми actions

### Утилиты

- `getAccuracyColor(accuracy)` - возвращает CSS класс цвета для точности
- `getAccuracyTextColor(accuracy)` - возвращает CSS класс цвета текста для точности
- `formatStudentInitials(firstName, lastName)` - форматирует инициалы студента
- `formatStudentFullName(firstName, lastName)` - форматирует полное имя студента
- `calculateStudentsStats(students, totalExercises)` - вычисляет общую статистику
- `getExerciseStatus(exerciseId, homework)` - получает статус упражнения
- `getProgressColor(percentage)` - возвращает цвет прогресс-бара
- `calculateOverallHomeworkStats(homework)` - вычисляет статистику по домашкам
- `filterStudents(students, searchQuery)` - фильтрует студентов по поисковому запросу
- `sortStudents(students, sortBy)` - сортирует студентов по критерию
- `isValidStudentInfo(student)` - проверяет валидность данных студента

### Типы

- `StudentInfo` - информация о студенте
- `StudentsListProps` - пропсы для списка студентов
- `StudentDetailProps` - пропсы для детального просмотра
- `StudentCardProps` - пропсы для карточки студента
- `ExerciseInfo` - информация об упражнении
- `HomeworkWithProgress` - домашнее задание с прогрессом
- `StudentsStats` - статистика по студентам
- `AssignHomeworkData` - данные для назначения ДЗ
- `AssignHomeworkResult` - результат назначения ДЗ
- `UserRole` - роль пользователя

## Примеры использования в роутах

### +page.server.ts (список студентов)

```typescript
import type { PageServerLoad, Actions } from './$types';
import { loadTeacherStudents, loadExercises, studentsActions } from '$lib/features/students';

export const load: PageServerLoad = async ({ locals }) => {
  const [students, exercises] = await Promise.all([
    loadTeacherStudents(locals),
    loadExercises(locals)
  ]);

  return {
    students,
    exercises
  };
};

export const actions: Actions = {
  assignHomework: studentsActions.assignHomework
};
```

### +page.svelte (список студентов)

```svelte
<script>
  import { Students } from '$lib/features/students';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<Students students={data.students} exercises={data.exercises} />
```

### +page.server.ts (детальная страница студента)

```typescript
import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import { 
  loadStudentById, 
  loadExercises, 
  studentsActions 
} from '$lib/features/students';
import { loadStudentHomework } from '$lib/features/homework';

export const load: PageServerLoad = async ({ params, locals }) => {
  const studentId = params.studentId;

  const student = await loadStudentById(locals, studentId);
  if (!student) {
    error(404, 'Студент не найден');
  }

  const [homework, exercises] = await Promise.all([
    loadStudentHomework(locals, studentId),
    loadExercises(locals)
  ]);

  return {
    student,
    homework,
    exercises,
    isTeacherView: true
  };
};

export const actions: Actions = {
  assignHomework: studentsActions.assignHomework
};
```

### +page.svelte (детальная страница студента)

```svelte
<script>
  import { StudentDetail } from '$lib/features/students';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<StudentDetail
  student={data.student}
  homework={data.homework}
  exercises={data.exercises}
  isTeacherView={data.isTeacherView}
/>
```

## Тестирование

```bash
bun test src/lib/features/students/tests/
```

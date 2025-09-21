# Homework Feature

Фича для управления домашними заданиями студентов с отслеживанием прогресса выполнения.

## Структура

```text
src/lib/features/homework/
├── components/
│   ├── index.ts                    # Экспорт компонентов
│   ├── HomeworkCard.svelte         # Карточка домашнего задания
│   ├── HomeworkStats.svelte        # Статистика домашнего задания
│   ├── HomeworkDetail.svelte       # Детальная информация о задании
│   ├── EmptyHomework.svelte        # Пустое состояние (универсальное)
│   ├── buttons/
│   │   ├── AssignHomeworkButton.svelte # Кнопка назначения домашнего задания
│   │   └── EditHomeworkButton.svelte   # Кнопка редактирования задания
│   └── modals/
│       ├── AssignHomeworkModal.svelte  # Модальное окно назначения
│       └── EditHomeworkModal.svelte    # Модальное окно редактирования
├── types/
│   └── homework.types.ts           # TypeScript типы
├── utils/
│   └── homework.utils.ts           # Утилиты
├── api/
│   ├── actions.ts                  # Server actions
│   ├── queries.ts                  # Load functions
│   └── index.ts                    # Экспорт API
├── tests/
│   └── homework.utils.test.ts      # Тесты утилит
├── Homework.svelte                 # Главный компонент
├── index.ts                        # Публичный API
└── README.md                       # Эта документация
```

## Использование

### Главный компонент Homework

```svelte
<script>
  import { Homework } from '$lib/features/homework';
  import type { HomeworkWithProgress } from '$lib/features/homework';
  
  const homework: HomeworkWithProgress[] = [
    {
      id: 1,
      created_at: '2024-01-01T00:00:00Z',
      teacher_id: 'teacher_1',
      student_id: 'student_1',
      exercises: ['ex1', 'ex2'],
      is_completed: false,
      progress_percentage: 50,
      exercises_status: {
        'ex1': { completed: true, attempts: 2, last_attempt_at: '2024-01-02T10:00:00Z' },
        'ex2': { completed: false, attempts: 1, last_attempt_at: '2024-01-02T11:00:00Z' }
      }
    }
  ];
  
  const user = {
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@example.com',
    imageUrl: '/avatar.jpg',
    accuracy: 75,
    totalExercises: 10
  };
</script>

<Homework {homework} {user} />
```

### Кнопки для работы с домашними заданиями

```svelte
<script>
  import { AssignHomeworkButton, EditHomeworkButton } from '$lib/features/homework';
  import type { HomeworkItem } from '$lib/features/homework';
  
  const student = {
    id: '1',
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@example.com'
  };
  
  const homework: HomeworkItem = {
    id: 1,
    created_at: '2024-01-01T00:00:00Z',
    teacher_id: 'teacher_1',
    student_id: 'student_1',
    exercises: ['ex1', 'ex2']
  };
  
  const exercises = [
    { id: '1', title: 'Упражнение 1', description: 'Описание' },
    { id: '2', title: 'Упражнение 2' }
  ];
  
  const handleAssigned = () => {
    console.log('Домашнее задание назначено!');
  };
  
  const handleUpdated = () => {
    console.log('Домашнее задание обновлено!');
  };
</script>

<!-- Кнопка назначения домашнего задания -->
<AssignHomeworkButton 
  {student} 
  {exercises} 
  onassigned={handleAssigned}
/>

<!-- Кнопка редактирования домашнего задания -->
<EditHomeworkButton 
  {homework}
  {student}
  {exercises}
  onupdated={handleUpdated}
/>
```

### Модальные окна

```svelte
<script>
  import { AssignHomeworkModal, EditHomeworkModal } from '$lib/features/homework';
  
  let assignModalOpen = false;
  let editModalOpen = false;
  
  const student = {
    id: '1',
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@example.com'
  };
  
  const homework = {
    id: 1,
    created_at: '2024-01-01T00:00:00Z',
    teacher_id: 'teacher_1',
    student_id: 'student_1',
    exercises: ['ex1', 'ex2']
  };
  
  const exercises = [
    { id: '1', title: 'Упражнение 1', description: 'Описание' },
    { id: '2', title: 'Упражнение 2' }
  ];
</script>

<!-- Модальное окно назначения -->
<AssignHomeworkModal 
  bind:open={assignModalOpen}
  {student}
  {exercises}
  onassigned={() => {
    console.log('Назначено!');
    assignModalOpen = false;
  }}
/>

<!-- Модальное окно редактирования -->
<EditHomeworkModal 
  bind:open={editModalOpen}
  {homework}
  {student}
  {exercises}
  onupdated={() => {
    console.log('Обновлено!');
    editModalOpen = false;
  }}
/>
```

### Пустое состояние (EmptyHomework)

```svelte
<script>
  import { EmptyHomework } from '$lib/features/homework';
  
  const student = {
    id: '1',
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@example.com'
  };
  
  const exercises = [
    { id: '1', title: 'Упражнение 1', description: 'Описание' },
    { id: '2', title: 'Упражнение 2' }
  ];
  
  const handleAssignHomework = () => {
    console.log('Домашнее задание назначено!');
  };
</script>

<!-- Студенческий вид (по умолчанию) -->
<EmptyHomework />

<!-- Учительский вид с возможностью назначения -->
<EmptyHomework 
  isTeacher={true}
  {student}
  {exercises}
  onAssignHomework={handleAssignHomework}
/>
```

### Использование API

```svelte
<script>
  import { loadStudentHomework, loadAvailableExercises } from '$lib/features/homework/api';
  import { createAssignHomeworkAction, createDeleteHomeworkAction } from '$lib/features/homework/api';
  
  // В +page.server.ts
  export async function load({ locals, params }) {
    const [homework, exercises] = await Promise.all([
      loadStudentHomework(locals, params.studentId),
      loadAvailableExercises(locals)
    ]);
    
    return { homework, exercises };
  }
  
  // В +page.server.ts для actions
  export const actions = {
    assign: createAssignHomeworkAction(),
    delete: createDeleteHomeworkAction()
  };
</script>
```

## API

### Компоненты

- `Homework` - главный компонент фичи
- `HomeworkCard` - карточка домашнего задания
- `HomeworkStats` - статистика выполнения
- `HomeworkDetail` - детальная информация о задании
- `EmptyHomework` - пустое состояние (универсальное)
- `AssignHomeworkButton` - кнопка назначения домашнего задания
- `EditHomeworkButton` - кнопка редактирования задания
- `AssignHomeworkModal` - модальное окно назначения
- `EditHomeworkModal` - модальное окно редактирования

#### Homework API

**Пропсы:**

- `homework: HomeworkWithProgress[]` - массив домашних заданий с прогрессом
- `user: { firstName: string, lastName: string, email: string, imageUrl?: string, accuracy: number, totalExercises: number }` - информация о пользователе

#### EmptyHomework API

**Пропсы:**

- `isTeacher?: boolean` - режим отображения (по умолчанию `false` - студенческий вид)
- `student?: { id: string, firstName: string, lastName: string, email: string } | null` - информация о студенте (только для учительского режима)
- `exercises?: Array<{id: string, title: string, description?: string}>` - список упражнений (только для учительского режима)
- `onAssignHomework?: () => void` - колбэк при назначении домашнего задания (только для учительского режима)

**Режимы отображения:**

- **Студенческий режим** (`isTeacher = false`): показывает сообщение о том, что домашних заданий пока нет
- **Учительский режим** (`isTeacher = true`): показывает сообщение и кнопку для назначения домашнего задания

#### AssignHomeworkButton API

**Пропсы:**

- `student: { id: string, firstName: string, lastName: string, email: string }` - информация о студенте
- `exercises: Array<{id: string, title: string, description?: string}>` - список упражнений
- `onassigned?: () => void` - колбэк при назначении
- `variant?: ButtonVariant` - вариант кнопки
- `size?: ButtonSize` - размер кнопки
- `class?: string` - дополнительные CSS классы

#### EditHomeworkButton API

**Пропсы:**

- `homework: HomeworkItem` - домашнее задание для редактирования
- `student: { id: string, firstName: string, lastName: string, email: string }` - информация о студенте
- `exercises: Array<{id: string, title: string, description?: string}>` - список упражнений
- `onupdated?: () => void` - колбэк при обновлении
- `variant?: ButtonVariant` - вариант кнопки
- `size?: ButtonSize` - размер кнопки
- `class?: string` - дополнительные CSS классы

### Утилиты

- `calculateExerciseStatus()` - вычисляет статус упражнения на основе данных о прогрессе
- `calculateProgressPercentage()` - вычисляет процент выполнения домашнего задания
- `calculateExerciseStats()` - статистика упражнения
- `createHomeworkWithProgress()` - создает объект домашнего задания с прогрессом
- `createHomeworkStats()` - создает статистику домашнего задания
- `formatRelativeDate()` - форматирование дат в относительном формате
- `formatAbsoluteDate()` - форматирование дат в абсолютном формате
- `validateExercises()` - валидация списка упражнений

### API функции

#### Queries (Load functions)

- `loadStudentHomework(locals, studentId)` - загружает домашние задания студента с прогрессом
- `loadStudentHomeworkBasic(locals, studentId)` - загружает базовые домашние задания студента
- `loadAvailableExercises(locals)` - загружает список доступных упражнений
- `loadHomeworkStats(locals, homeworkId, studentId)` - загружает статистику домашнего задания

#### Actions (Server actions)

- `createAssignHomeworkAction()` - назначает домашнее задание студенту
- `createDeleteHomeworkAction()` - удаляет домашнее задание
- `createUpdateHomeworkProgressAction()` - обновляет прогресс выполнения

### Типы

- `HomeworkItem` - базовое домашнее задание
- `HomeworkWithProgress` - домашнее задание с прогрессом выполнения
- `ExerciseStatus` - статус выполнения упражнения
- `AnswerRecord` - запись ответа студента
- `FullAnswerRecord` - полная запись ответа с метаданными
- `ExerciseStat` - статистика упражнения
- `HomeworkStats` - общая статистика домашнего задания
- `HomeworkProps` - пропсы главного компонента
- `AssignHomeworkProps` - пропсы модального окна назначения
- `EditHomeworkProps` - пропсы модального окна редактирования

## Особенности

### Отслеживание прогресса

Фича автоматически отслеживает прогресс выполнения домашних заданий:

- **Статус упражнений**: каждое упражнение имеет статус (выполнено/не выполнено)
- **Количество попыток**: отслеживается количество попыток по каждому упражнению
- **Время выполнения**: записывается время последней попытки
- **Общий прогресс**: вычисляется процент выполнения всего задания

### Интеграция с базой данных

- Использует Supabase для хранения данных
- Таблица `homework` для домашних заданий
- Таблица `answers_history` для истории ответов
- Таблица `exercises` для доступных упражнений

### Безопасность

- Все действия требуют авторизации
- Валидация данных на сервере
- Проверка прав доступа к домашним заданиям

## Тестирование

```bash
bun test src/lib/features/homework/tests/
```

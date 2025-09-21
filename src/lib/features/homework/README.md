# Homework Feature

Фича для управления домашними заданиями студентов.

## Структура

```text
src/lib/features/homework/
├── components/
│   ├── index.ts                    # Экспорт компонентов
│   ├── HomeworkCard.svelte         # Карточка домашнего задания
│   ├── HomeworkStats.svelte        # Статистика домашнего задания
│   ├── EmptyHomework.svelte        # Пустое состояние (универсальное)
│   ├── AssignHomeworkModal.svelte  # Модальное окно назначения
│   ├── EditHomeworkModal.svelte    # Модальное окно редактирования
│   ├── HomeworkActionButtons.svelte # Кнопки действий (группа)
│   ├── AssignHomeworkButton.svelte # Кнопка "Назначить домашку" (с модалкой)
│   └── AssignMoreButton.svelte     # Кнопка "Назначить еще"
├── types/
│   └── homework.types.ts           # TypeScript типы
├── utils/
│   └── homework.utils.ts           # Утилиты
├── api/
│   ├── actions.ts                  # Server actions
│   └── queries.ts                  # Load functions
├── tests/
│   └── homework.utils.test.ts      # Тесты утилит
├── Homework.svelte                 # Главный компонент
├── index.ts                        # Публичный API
└── README.md                       # Эта документация
```

## Использование

### Универсальная кнопка для работы с домашними заданиями

```svelte
<script>
  import { HomeworkActionButton } from '$lib/features/homework';
  import type { StudentInfo } from '$lib/utils/user';
  import type { HomeworkItem } from '$lib/features/homework/types/homework.types';
  
  const student: StudentInfo = {
    id: '1',
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@example.com',
    // ... другие поля
  };
  
  const homework: HomeworkItem = {
    id: 1,
    created_at: '2024-01-01T00:00:00Z',
    teacher_id: 'teacher_1',
    student_id: 'student_1',
    exercises: ['ex1', 'ex2'],
    // ... другие поля
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
<HomeworkActionButton 
  action="assign"
  {student} 
  {exercises} 
  onassigned={handleAssigned}
/>

<!-- Кнопка для перехода к детальному назначению -->
<HomeworkActionButton 
  action="assign-more"
  {student}
/>

<!-- Кнопка редактирования домашнего задания -->
<HomeworkActionButton 
  action="edit"
  {homework}
  {student}
  {exercises}
  onupdated={handleUpdated}
/>

<!-- Кастомная кнопка с собственным обработчиком -->
<HomeworkActionButton 
  action="assign"
  {student}
  text="Создать задание"
  icon="plus"
  variant="default"
  size="lg"
  onclick={() => console.log('Кастомное действие')}
/>
```

### Настройка внешнего вида

```svelte
<!-- Различные варианты универсальной кнопки -->
<HomeworkActionButton 
  action="assign"
  {student} 
  {exercises} 
  variant="default"
  size="lg"
  class="w-full"
  onassigned={handleAssigned}
/>

<HomeworkActionButton 
  action="assign-more"
  {student} 
  variant="outline"
  size="sm"
  class="flex-1"
/>

<!-- Кастомные иконки и текст -->
<HomeworkActionButton 
  action="edit"
  {homework}
  {student}
  {exercises}
  text="Изменить задание"
  icon="edit"
  variant="ghost"
  size="sm"
  class="text-blue-600 hover:text-blue-700"
  onupdated={handleUpdated}
/>
```

### Пустое состояние (EmptyHomework)

```svelte
<script>
  import { EmptyHomework } from '$lib/features/homework';
  import type { StudentInfo } from '$lib/utils/user';
  
  const student: StudentInfo = {
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

### Полная интеграция с главным компонентом

```svelte
<script>
  import { Homework } from '$lib/features/homework';
  import type { HomeworkWithProgress } from '$lib/features/homework';
  
  const homework: HomeworkWithProgress[] = [
    // ... данные домашних заданий
  ];
  
  const user = {
    id: '1',
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@example.com'
  };
</script>

<Homework {homework} {user} />
```

## API

### Компоненты

- `Homework` - главный компонент фичи
- `HomeworkActionButton` - **универсальная кнопка** для работы с домашними заданиями
- `HomeworkCard` - карточка домашнего задания
- `HomeworkStats` - статистика выполнения
- `EmptyHomework` - пустое состояние (универсальное)
- `AssignHomeworkModal` - модальное окно назначения
- `EditHomeworkModal` - модальное окно редактирования

#### EmptyHomework API

**Пропсы:**

- `isTeacher?: boolean` - режим отображения (по умолчанию `false` - студенческий вид)
- `student?: StudentInfo | null` - информация о студенте (только для учительского режима)
- `exercises?: Array<{id: string, title: string, description?: string}>` - список упражнений (только для учительского режима)
- `onAssignHomework?: () => void` - колбэк при назначении домашнего задания (только для учительского режима)

**Режимы отображения:**

- **Студенческий режим** (`isTeacher = false`): показывает сообщение о том, что домашних заданий пока нет
- **Учительский режим** (`isTeacher = true`): показывает сообщение и кнопку для назначения домашнего задания

#### HomeworkActionButton API

**Пропсы:**

- `action: 'assign' | 'assign-more' | 'edit'` - тип действия
- `student: StudentInfo | null` - информация о студенте
- `exercises?: Array<{id: string, title: string, description?: string}>` - список упражнений
- `homework?: HomeworkItem` - домашнее задание (для редактирования)
- `variant?: ButtonVariant` - вариант кнопки
- `size?: ButtonSize` - размер кнопки
- `class?: string` - дополнительные CSS классы
- `text?: string` - кастомный текст кнопки
- `icon?: 'plus' | 'square-pen' | 'edit'` - кастомная иконка
- `disabled?: boolean` - отключить кнопку
- `onassigned?: () => void` - колбэк при назначении
- `onupdated?: () => void` - колбэк при обновлении
- `onclick?: () => void` - кастомный обработчик клика

### Утилиты

- `calculateHomeworkProgress()` - расчет прогресса выполнения
- `calculateExerciseStatus()` - статус упражнения
- `calculateExerciseStats()` - статистика упражнения
- `calculateHomeworkStats()` - общая статистика
- `formatRelativeDate()` - форматирование дат

### Типы

- `HomeworkItem` - домашнее задание
- `HomeworkWithProgress` - домашнее задание с прогрессом
- `ExerciseStatus` - статус упражнения
- `AnswerRecord` - запись ответа
- `ExerciseStat` - статистика упражнения
- `HomeworkStats` - общая статистика

## Тестирование

```bash
bun test src/lib/features/homework/tests/
```

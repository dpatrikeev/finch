# Exercises Feature

Фича для управления упражнениями в приложении Finch.

## Структура

```text
src/lib/features/exercises/
├── api/
│   ├── actions.ts            # Server actions для упражнений
│   ├── queries.ts            # Load functions для загрузки данных
│   └── index.ts              # Экспорт API
├── components/
│   ├── ExerciseItem.svelte   # Карточка упражнения
│   └── index.ts              # Экспорт компонентов
├── types/
│   └── exercises.types.ts    # TypeScript типы
├── utils/
│   └── exercises.utils.ts    # Утилиты (чистые функции)
├── tests/
│   ├── exercises.utils.test.ts # Тесты утилит
│   └── exercises.actions.test.ts # Тесты server actions
├── Exercises.svelte          # Главный компонент фичи
├── index.ts                  # Публичный API фичи
└── README.md                 # Эта документация
```

## Использование

### Главный компонент

```svelte
<script>
  import { Exercises } from '$lib/features/exercises';
  import type { BasicExercise, AnswerHistory } from '$lib/features/exercises';
  
  const exercises: BasicExercise[] = [
    { id: '1', title: 'Упражнение 1', description: 'Описание' }
  ];
  const answersHistory: AnswerHistory[] = [];
</script>

<Exercises {exercises} {answersHistory} />
```

### Отдельные компоненты

```svelte
<script>
  import { ExerciseItem } from '$lib/features/exercises';
  import type { BasicExercise, ExerciseStatus } from '$lib/features/exercises';
  
  const exercise: BasicExercise = {
    id: '1',
    title: 'Упражнение 1',
    description: 'Описание упражнения'
  };
  
  const status: ExerciseStatus = {
    isCompleted: true,
    isCorrect: true
  };
</script>

<ExerciseItem {exercise} {status} />
```

### API функции

```js
// В +page.server.ts
import { loadExercisePageData, exerciseActions } from '$lib/features/exercises';

export const load = async ({ fetch, locals, params }) => {
  return await loadExercisePageData(fetch, locals, params);
};

export const actions = {
  ...exerciseActions
};
```

### Утилиты

```js
import { 
  getExerciseStatus, 
  isExerciseCompleted,
  getExerciseButtonText,
  getExerciseStatusText,
  validateAnswerData
} from '$lib/features/exercises';

const status = getExerciseStatus(answersHistory, exerciseId);
const completed = isExerciseCompleted(status);
const buttonText = getExerciseButtonText(status);
const statusText = getExerciseStatusText(status);
```

## API

### Компоненты

- `Exercises` - главный компонент для отображения списка упражнений
- `ExerciseItem` - карточка отдельного упражнения

### Функции API

- `loadExercise(fetch, exerciseId)` - загружает упражнение по ID
- `loadAnswersHistory(locals, userId, exerciseId?)` - загружает историю ответов
- `loadExercisePageData(fetch, locals, params)` - загружает данные для страницы упражнения
- `createSaveAnswerAction()` - создает action для сохранения ответа
- `exerciseActions` - объект с готовыми actions

### Функции утилит

- `getExerciseStatus(answersHistory, exerciseId)` - определяет статус упражнения на основе истории ответов
- `isExerciseCompleted(status)` - проверяет завершенность упражнения
- `isExerciseCorrect(status)` - проверяет правильность выполнения упражнения
- `getExerciseButtonText(status)` - возвращает текст для кнопки ("Начать" или "Повторить")
- `getExerciseStatusText(status)` - возвращает текст статуса ("Не решено", "Решено", "Ошибка")
- `getExerciseStatusDescription(status)` - возвращает описание статуса для tooltip
- `filterAnswersByExercise(answersHistory, exerciseId)` - фильтрует ответы по ID упражнения
- `validateAnswerData(selectedAnswerId, isCorrect)` - валидирует данные ответа перед сохранением

### Типы

- `BasicExercise` - базовый интерфейс упражнения с id, title, description
- `ExerciseStatus` - статус выполнения упражнения (isCompleted, isCorrect)
- `ExerciseItemProps` - пропсы для компонента ExerciseItem
- `AnswerHistory` - история ответов пользователя с полной информацией из базы данных
- `SaveAnswerData` - данные для сохранения ответа (selectedAnswerId, isCorrect)
- `ExercisePageData` - данные страницы упражнения (exercise, answersHistory)

## Архитектурные особенности

### Разделение ответственности

- **Главный компонент** (`Exercises.svelte`) - управляет состоянием и координирует презентационные компоненты
- **Презентационные компоненты** (`ExerciseItem.svelte`) - отображают данные, получаемые через props
- **Утилиты** - чистые функции для работы со статусами и валидацией
- **API слой** - server actions и load functions для работы с данными

### Логика статусов

Статус упражнения определяется на основе последнего ответа пользователя:
- Если ответов нет - статус `undefined`
- Если есть ответы - берется самый свежий (первый в отсортированном массиве)
- `isCompleted: true` для любого ответа
- `isCorrect` соответствует полю `is_correct` последнего ответа

## Тестирование

```bash
bun test src/lib/features/exercises/tests/
```

Тесты покрывают:
- Все утилиты (обязательно 100% покрытие)
- Server actions с моками
- Валидация данных

# Quiz Feature

Фича для создания и отображения музыкальных викторин с нотными вопросами и интерактивными ответами.

## Структура

```text
src/lib/features/quiz/
├── components/
│   ├── index.ts                    # Экспорт компонентов
│   ├── QuizOption.svelte          # Опция ответа в викторине
│   ├── QuizHistory.svelte         # История ответов пользователя
│   └── QuizExplanation.svelte     # Объяснение правильного ответа
├── types/
│   └── quiz.types.ts              # TypeScript типы
├── utils/
│   └── quiz.utils.ts              # Утилиты для работы с викторинами
├── tests/
│   ├── quiz.utils.test.ts         # Тесты утилит
│   └── quiz.actions.test.ts       # Тесты интеграций
├── Quiz.svelte                    # Главный компонент викторины
├── index.ts                       # Публичный экспорт
└── README.md                      # Эта документация
```

## Использование

### Основное использование

```svelte
<script>
  import { Quiz } from '$lib/features/quiz';
  import type { QuizProps } from '$lib/features/quiz';
  
  const props: QuizProps = {
    exercise: {
      id: '2-8',
      title: 'Определите интервал',
      type: 'quiz',
      question: [
        {
          clef: 'treble',
          keySignature: 'C',
          notes: [
            { keys: ['c/4', 'e/4'], duration: 'w' }
          ]
        }
      ],
      options: [
        {
          id: 'option1',
          measures: [{ notes: [{ keys: ['c/4'], duration: 'w' }] }],
          isCorrect: false
        },
        {
          id: 'option2', 
          measures: [{ notes: [{ keys: ['e/4'], duration: 'w' }] }],
          isCorrect: true
        }
      ],
      correctAnswerId: 'option2',
      explanation: 'Это большая терция - интервал между до и ми'
    },
    answersHistory: []
  };
</script>

<Quiz {...props} />
```

### Использование отдельных компонентов

```svelte
<script>
  import { QuizOption, QuizHistory, QuizExplanation } from '$lib/features/quiz';
  import type { QuizOptionProps, QuizHistoryProps } from '$lib/features/quiz';
  
  // Отдельная опция ответа
  const optionProps: QuizOptionProps = {
    option: { id: 'opt1', measures: [...], isCorrect: true },
    index: 0,
    isSelected: false,
    showResult: false,
    showCorrectAnswer: false,
    hasInitialAnswer: false,
    onclick: (optionId) => console.log('Selected:', optionId)
  };
  
  // История ответов
  const historyProps: QuizHistoryProps = {
    answersHistory: [...],
    options: [...]
  };
</script>

<QuizOption {...optionProps} />
<QuizHistory {...historyProps} />
<QuizExplanation explanation="Объяснение правильного ответа" />
```

### Утилиты для работы с викторинами

```js
import { 
  isCorrectAnswer, 
  formatAnswerDate, 
  getAnswerStats 
} from '$lib/features/quiz';

// Проверка правильности ответа
const correct = isCorrectAnswer('option2', 'option2'); // true

// Форматирование даты
const formattedDate = formatAnswerDate('2024-01-15T10:30:00Z'); 
// "15.01.2024, 10:30"

// Получение статистики
const stats = getAnswerStats([
  { is_correct: true },
  { is_correct: false },
  { is_correct: true }
]);
// { total: 3, correct: 2, incorrect: 1, successRate: 67 }
```

## API

### Главный компонент

- `Quiz` - интерактивная викторина с нотными вопросами и вариантами ответов

### Презентационные компоненты

- `QuizOption` - отдельная опция ответа с нотацией, состоянием выбора и результатом
- `QuizHistory` - история предыдущих ответов пользователя с датами и результатами  
- `QuizExplanation` - развернутое объяснение правильного ответа

### Функции утилит

- `isCorrectAnswer(selectedAnswerId, correctAnswerId)` - проверяет соответствие выбранного и правильного ответа
- `formatAnswerDate(dateString)` - форматирует ISO дату в локальный формат (DD.MM.YYYY, HH:MM)
- `getAnswerStats(answersHistory)` - вычисляет статистику ответов (общее количество, правильные, неправильные, процент успеха)

### Типы

#### Основные типы викторины
- `QuizExercise` - упражнение-викторина с вопросом, вариантами ответов и объяснением
- `ExerciseOption` - вариант ответа с нотацией и флагом правильности
- `AnswerHistory` - запись истории ответа пользователя

#### Пропсы компонентов
- `QuizProps` - пропсы для главного компонента Quiz (exercise, answersHistory)
- `QuizOptionProps` - пропсы для компонента QuizOption с состоянием и обработчиками
- `QuizHistoryProps` - пропсы для компонента QuizHistory (answersHistory, options)
- `QuizExplanationProps` - пропсы для компонента QuizExplanation (explanation)

## Архитектурные особенности

### Разделение ответственности

- **Главный компонент** (`Quiz.svelte`) - управляет состоянием викторины, обрабатывает выбор ответов, координирует отображение
- **Презентационные компоненты** - отображают данные без логики состояния
- **Утилиты** - чистые функции для проверки ответов и форматирования данных
- **Типы** - строгая типизация для всех элементов викторины

### Логика состояний

Викторина поддерживает несколько состояний:
- **Начальное**: показ вопроса и вариантов ответов
- **Выбран ответ**: подсветка выбранного варианта
- **Показ результата**: отображение правильного ответа и объяснения
- **История**: показ предыдущих попыток пользователя

### Интеграция с нотацией

Викторина тесно интегрирована с модулем `notation`:
- Вопрос отображается как `ExerciseMeasure[]`
- Каждый вариант ответа содержит `ExerciseMeasure[]`
- Используются компоненты `Notation` для рендеринга всех музыкальных элементов

## Зависимости

Эта фича зависит от:
- `$lib/features/notation` - для отображения нотных вопросов и ответов
- `$lib/components/ui/*` - для UI компонентов (Button, Card, Badge)
- `svelte-sonner` - для уведомлений о результатах
- `lucide-svelte` - для иконок (Check, X, Clock)

## Особенности

### Интерактивность

- Мгновенная обратная связь при выборе ответа
- Визуальное выделение правильного и неправильного ответов
- Анимированные переходы между состояниями
- Уведомления о результатах

### UX/UI

- Адаптивный дизайн для мобильных устройств
- Четкое визуальное разделение вопроса и вариантов ответов
- Цветовое кодирование результатов (зеленый/красный)
- Информативные tooltips и подсказки

### Доступность

- Семантическая разметка для screen readers
- Клавиатурная навигация по вариантам ответов
- Четкие текстовые описания состояний
- Контрастные цвета для лучшей читаемости

## Тестирование

```bash
bun test src/lib/features/quiz/tests/
```

Тесты покрывают:
- Все утилиты (100% покрытие функций)
- Форматирование дат в разных локалях
- Вычисление статистики для различных наборов данных
- Проверка правильности ответов
- Интеграционные тесты с компонентами

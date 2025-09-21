# Notation Feature

Фича для отображения музыкальной нотации в приложении Finch с использованием VexFlow.

## Структура

```text
src/lib/features/notation/
├── components/
│   ├── Element.svelte          # Базовый элемент нотации
│   ├── Measure.svelte          # Музыкальный такт
│   ├── Note.svelte             # Музыкальная нота
│   ├── Score.svelte            # Нотный стан
│   ├── Text.svelte             # Текстовые элементы нотации
│   └── index.ts                # Экспорт компонентов
├── types/
│   └── notation.types.ts       # TypeScript типы
├── utils/
│   └── notation.utils.ts       # Утилиты (чистые функции)
├── tests/
│   └── notation.utils.test.ts  # Тесты утилит
├── Notation.svelte             # Главный компонент нотации
├── index.ts                    # Публичный API фичи
└── README.md                   # Эта документация
```

## Использование

### Отображение нотации

```svelte
<script>
  import { Notation } from '$lib/features/notation';
  import type { ExerciseMeasure } from '$lib/features/notation';
  
  const measures: ExerciseMeasure[] = [
    {
      clef: 'treble',
      keySignature: 'C',
      timeSignature: '4/4',
      notes: [
        { keys: ['c/4'], duration: 'q' },
        { keys: ['d/4'], duration: 'q' },
        { keys: ['e/4'], duration: 'h' }
      ],
      text: {
        above: 'Мелодия',
        below: 'До мажор'
      }
    }
  ];
</script>

<Notation {measures} />
```

### Работа с отдельными компонентами

```svelte
<script>
  import { Score, Measure, Note } from '$lib/features/notation';
  import type { ScoreProps, Measure as MeasureType } from '$lib/features/notation';
  
  // Использование отдельных компонентов для кастомного отображения
  const scoreProps: ScoreProps = {
    score: { attributes: { width: '400', height: '200' } },
    notation: processedMeasures,
    options: defaultOptions
  };
</script>

<Score {...scoreProps} />
```

### Утилиты для обработки нотации

```js
import { 
  prepareNotation,
  convertSvgToData,
  createDefaultOptions,
  throttle
} from '$lib/features/notation';

// Подготовка нотации для отображения
const measures = [
  {
    clef: 'treble',
    keySignature: 'G',
    notes: [{ keys: ['g/4'], duration: 'w' }]
  }
];

const options = createDefaultOptions(measures);
const context = prepareNotation(measures, options);
const { score, notation } = convertSvgToData(context);

// Throttling для оптимизации производительности
const throttledRender = throttle(() => {
  // функция рендеринга
}, 100);
```

## API

### Главный компонент

- `Notation` - отображение музыкальной нотации с автоматической обработкой VexFlow

### Презентационные компоненты

- `Element` - базовый SVG элемент нотации с атрибутами
- `Measure` - музыкальный такт с нотами, ключами и текстом
- `Note` - отдельная музыкальная нота с noteheads
- `Score` - нотный стан, координирующий отображение всех элементов
- `Text` - текстовые элементы (над и под нотным станом)

### Функции утилит

- `prepareNotation(measures, options)` - создает SVG контекст и рендерит нотацию с помощью VexFlow
- `convertSvgToData(context)` - парсит SVG и извлекает данные для компонентов Svelte
- `createDefaultOptions(measures)` - генерирует опции рендеринга на основе количества тактов
- `throttle(func, delay)` - ограничивает частоту вызовов функции для оптимизации

### Типы

#### Входные данные
- `ExerciseMeasure` - такт упражнения с опциональными clef, keySignature, timeSignature, barline, text, notes
- `ExerciseNote` - музыкальная нота с массивом keys и duration (VexFlow формат)

#### Обработанные данные  
- `Measure` - обработанный такт с атрибутами, нотами, staves, clefs, barlines, keySignatures, texts
- `Score` - нотный стан с SVG атрибутами
- `Options` - опции рендеринга (размеры, масштаб, отступы)

#### Пропсы компонентов
- `NotationProps` - пропсы для главного компонента (measures)
- `ScoreProps` - пропсы для компонента Score (score, notation, options)

#### Вспомогательные типы
- `Attributes` - объект атрибутов HTML/SVG элементов
- `Group` - группа элементов нотации с атрибутами и innerHTML

## Архитектурные особенности

### Разделение ответственности

- **Главный компонент** (`Notation.svelte`) - управляет жизненным циклом и координирует обработку
- **Утилиты** - чистые функции для работы с VexFlow и SVG
- **Презентационные компоненты** - отображают обработанные данные без логики
- **Типы** - строгая типизация для всех этапов обработки

### Процесс рендеринга

1. `ExerciseMeasure[]` → `createDefaultOptions()` → `Options`
2. `measures + options` → `prepareNotation()` → `SVGContext` (VexFlow)
3. `SVGContext` → `convertSvgToData()` → `{ score, notation }`
4. `score + notation + options` → `Score.svelte` → отображение

### Оптимизация производительности

- **Ленивая обработка**: нотация обрабатывается только при изменении measures
- **Throttling**: ограничение частоты перерисовки при изменениях
- **Кэширование**: обработанные данные кэшируются до изменения входных данных
- **Эффективный парсинг**: минимальная обработка DOM для извлечения данных

## Зависимости

Фича использует библиотеку [VexFlow](https://github.com/0xfe/vexflow) для рендеринга музыкальной нотации:

- `Formatter` - форматирование нот в такте
- `Stave` - создание нотного стана
- `StaveNote` - создание нот
- `StaveText` - текстовые элементы
- `SVGContext` - SVG рендеринг
- `Voice` - группировка нот

## Особенности

### Поддерживаемые элементы

- **Ключи**: treble, bass
- **Тональности**: все стандартные тональности VexFlow
- **Размеры**: любые размеры, поддерживаемые VexFlow  
- **Ноты**: стандартный формат VexFlow (keys + duration)
- **Текст**: над и под нотным станом
- **Тактовые черты**: все типы VexFlow BarlineType

### Адаптивность

- Автоматическое масштабирование в зависимости от количества тактов
- Адаптивная ширина и высота нотного стана
- Оптимизация для мобильных устройств

### Интерактивность

- Статическое отображение нотации
- Поддержка кастомных стилей через CSS
- Возможность расширения интерактивными элементами

## Тестирование

```bash
bun test src/lib/features/notation/tests/
```

Тесты покрывают:
- Все утилиты (100% покрытие функций)
- Создание опций по умолчанию
- Throttling функций
- Валидация входных данных

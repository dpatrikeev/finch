# Header Feature

Фича header содержит компоненты для отображения навигации и пользовательского интерфейса в шапке приложения.

## Использование

```svelte
<script>
  import { Header } from '$lib/features/header';
  import type { UserRole } from '$lib/utils/user';
  
  const role: UserRole = 'teacher';
  const newHomeworkCount = 5;
</script>

<Header {role} {newHomeworkCount} />
```

## API

### Компоненты

- `Header` - главный компонент header
- `MobileMenu` - мобильное меню (используется внутри Header)
- `DesktopMenu` - десктопное меню (используется внутри Header)
- `Logo` - логотип приложения

### Утилиты

- `getNavigationItems(role, newHomeworkCount)` - получает элементы навигации для роли
- `shouldShowBadge(count)` - проверяет, нужно ли показывать бейдж
- `formatBadgeCount(count)` - форматирует количество для бейджа

### Типы

- `HeaderProps` - пропсы для главного компонента
- `NavigationItem` - элемент навигации
- `MobileMenuProps` - пропсы для мобильного меню
- `DesktopMenuProps` - пропсы для десктопного меню

## Тестирование

Все утилиты покрыты тестами. Запуск тестов:

```bash
bun test src/lib/features/header/tests/utils.test.ts
```

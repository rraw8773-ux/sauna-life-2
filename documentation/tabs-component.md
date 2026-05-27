# 📑 Документация компонента: Универсальные Табы (`sl-tabs` / `product-tabs`)

Универсальный, независимый и масштабируемый компонент вкладок (табов), разработанный по методологии BEM (Block, Element, Modifier). Поддерживает как универсальный блок `.sl-tabs`, так и премиальный компонент вкладок для карточек товаров `.product-tabs`. Позволяет организовывать любые переключаемые блоки контента без использования инлайн-скриптов (`onclick`) и автоматически выбирает активную вкладку по умолчанию при загрузке страницы.

---

## 🛠 1. Структура Папок и Файлов

- **Стили:** [css/modules/tabs.css](file:///s:/3.%20%D0%A1%D0%B0%D1%83%D0%BD%D1%8B/%21SITE/%21FILES/NEW-HTML/css/modules/tabs.css)
- **Логика:** [js/modules/tabs.js](file:///s:/3.%20%D0%A1%D0%B0%D1%83%D0%BD%D1%8B/%21SITE/%21FILES/NEW-HTML/js/modules/tabs.js)

---

## 📐 2. Разметка (HTML)

Для создания табов оберните кнопки и панели в контейнер `.sl-tabs`. Связь кнопок с панелями осуществляется через дата-атрибуты `data-tab-trigger="[ID]"` и `data-tab-pane="[ID]"`.

### Вариант А: Стандартные табы с линией снизу (Default Tabs)

```html
<div class="sl-tabs">
  <!-- Навигация -->
  <div class="sl-tabs__nav-wrapper">
    <div class="sl-tabs__nav">
      <button
        class="sl-tabs__trigger sl-tabs__trigger--active"
        data-tab-trigger="desc"
      >
        Описание
      </button>
      <button class="sl-tabs__trigger" data-tab-trigger="specs">
        Характеристики
      </button>
      <button class="sl-tabs__trigger" data-tab-trigger="reviews">
        Отзывы <span class="sl-tabs__count">8</span>
      </button>
    </div>
  </div>

  <!-- Содержимое -->
  <div class="sl-tabs__content">
    <div class="sl-tabs__pane sl-tabs__pane--active" data-tab-pane="desc">
      <h3>Описание товара</h3>
      <p>Текст описания...</p>
    </div>
    <div class="sl-tabs__pane" data-tab-pane="specs">
      <h3>Характеристики</h3>
      <p>Таблица характеристик...</p>
    </div>
    <div class="sl-tabs__pane" data-tab-pane="reviews">
      <h3>Отзывы пользователей</h3>
      <p>Список отзывов...</p>
    </div>
  </div>
</div>
```

---

### Вариант Б: Круглые кнопки-пилюли (Pill Tabs)

Для изменения визуального стиля на круглые очерченные кнопки добавьте класс-модификатор `.sl-tabs--pills` к главному контейнеру:

```html
<div class="sl-tabs sl-tabs--pills">
  <div class="sl-tabs__nav-wrapper">
    <div class="sl-tabs__nav">
      <button
        class="sl-tabs__trigger sl-tabs__trigger--active"
        data-tab-trigger="cat-1"
      >
        Категория 1
      </button>
      <button class="sl-tabs__trigger" data-tab-trigger="cat-2">
        Категория 2
      </button>
    </div>
  </div>
</div>
```

_Этот вариант идеально подходит для категорий в слайдерах товаров, где панели отсутствуют, а требуется только визуальное переключение фильтра._

---

## ⚡ 3. Инициализация (JavaScript)

Компонент работает через ES Modules без зависимостей от сторонних библиотек (jQuery).

Импортируйте и вызовите функцию `initTabs()` в точке входа страницы:

```javascript
import { initTabs } from "../modules/tabs.js";

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
});
```

### Принцип работы логики:

- Скрипт находит все элементы `.sl-tabs`.
- Слушает клики по элементам `[data-tab-trigger]` индивидуально внутри каждого контейнера.
- При клике снимает класс активности с текущих кнопок/панелей **только внутри этого контейнера** и вешает на новые.
- Это позволяет безопасно размещать **несколько независимых блоков табов на одной странице** без риска их пересечения!

---

## 🎨 4. Кастомизация СТИЛЕЙ (CSS Variables)

Компонент построен на CSS переменных проекта, что обеспечивает автоматическую поддержку темной темы:

- `--color-accent` — цвет нижней линии активного таба и активной кнопки-пилюли (по умолчанию оранжевый).
- `--text-color-primary` — цвет текста активного таба.
- `--text-color-secondary` — цвет текста неактивного таба.
- `--border-color` — цвет разделительной линии снизу.

# Sauna Life — Статический фронтенд интернет-магазина

> Многостраничный e-commerce сайт для продажи оборудования и материалов для бань, саун и купелей.  
> Чистый HTML + CSS + Vanilla JavaScript. Без сборщиков, SCSS и фреймворков.

---

## Быстрый старт

Проект не требует установки зависимостей и сборки. Достаточно открыть любой HTML-файл в браузере.

> **Важно:** Для корректной работы ES-модулей (`type="module"`) страницы нужно открывать через HTTP-сервер, а не через `file://`.

---

## Структура проекта

```
project-root/
│
├── index.html                   # Главная — хаб выбора раздела (glassmorphic-карточки + таймер)
├── new-catalog.html             # Каталог товаров (фильтры, сортировка, сетка/список)
├── new-product-pechi.html       # Карточка товара — печи для бани
├── new-product-kupeli.html      # Карточка товара — купели
├── new-product-vagonka.html     # Карточка товара — вагонка
├── wishlist.html                # Избранное (наполненное)
├── wishlist-empty.html          # Избранное (пустое состояние)
├── project.md                   # Проектный контекст и правила для LLM/разработчиков
├── favicon.ico
├── .gitignore
│
├── assets/
│   ├── fonts/
│   │   └── Gilroy/              # Локальный шрифт (Regular, Medium, SemiBold) — woff2/woff/ttf
│   ├── icons/                   # SVG-иконки интерфейса (header, product, features и др.)
│   └── images/                  # Контентные изображения (каталог, продукты, категории)
│
├── css/
│   ├── custom-normalize.css     # Кастомный reset/normalize
│   ├── global.css               # Агрегатор: импортирует base/* и modules/*
│   ├── base/
│   │   ├── variables.css        # Дизайн-токены: цвета, тени, радиусы, отступы
│   │   ├── typography.css       # @font-face Gilroy + базовые текстовые стили
│   │   ├── layout.css           # Контейнер, 12-колоночная сетка, breakpoints
│   │   └── utilities.css        # Утилитарные классы
│   ├── modules/                 # Переиспользуемые UI-компоненты (21 файл)
│   │   ├── header.css
│   │   ├── footer.css
│   │   ├── buttons.css
│   │   ├── product-card.css     # Карточка товара (главный компонент каталога)
│   │   ├── catalog-modal.css    # Десктопное модальное меню каталога
│   │   ├── mobile-menu.css      # Бургер-меню
│   │   ├── mobile-catalog-menu.css  # Мобильный каталог (аккордеон)
│   │   ├── offcanvas.css        # Слайд-панель (корзина и т.д.)
│   │   ├── tabs.css             # Табы (переиспользуемые)
│   │   ├── tags.css             # Тег-фильтры
│   │   ├── toast.css            # Toast-уведомления
│   │   ├── custom-dropdown.css  # Кастомный селект
│   │   ├── pagination.css
│   │   ├── breadcrumbs.css
│   │   ├── badge.css
│   │   ├── forms.css
│   │   ├── inputs.css
│   │   ├── search.css
│   │   ├── tooltip.css
│   │   ├── mobile-nav.css
│   │   └── products-widget.css  # Виджет «Похожие товары»
│   ├── pages/
│   │   ├── catalog-page.css     # Точка входа стилей каталога
│   │   ├── catalog/
│   │   │   ├── catalog-grid.css
│   │   │   ├── catalog-layout.css
│   │   │   ├── catalog-list.css
│   │   │   ├── catalog-sort.css
│   │   │   ├── catalog-view-toggle.css
│   │   │   └── promo-block.css  # Промо-блок с таймером
│   │   ├── product-page.css     # Точка входа стилей карточки товара
│   │   ├── product/
│   │   │   ├── product-hero.css     # Hero-секция товара (галерея + info)
│   │   │   ├── product-tabs.css     # Табы с характеристиками
│   │   │   ├── product-slider.css   # Слайдер изображений
│   │   │   ├── product-addons.css   # Доп. аксессуары
│   │   │   └── product-promo.css    # Промо-секция товара
│   │   ├── wishlist-page.css    # Точка входа стилей избранного
│   │   └── wishlist/
│   │       ├── wishlist-list.css    # Список товаров в избранном
│   │       └── wishlist-empty.css   # Пустое состояние
│   └── legacy/                  # Старые CSS-библиотеки (slick, fancybox, jQuery UI и др.)
│
├── js/
│   ├── main.js                  # Глобальная точка входа: header, menus, dropdowns, cards
│   ├── modules/                 # Переиспользуемые ES-модули (12 файлов)
│   │   ├── sticky-header.js     # Липкая шапка
│   │   ├── offcanvas.js         # Слайд-панели
│   │   ├── mobile-menu.js       # Бургер-меню
│   │   ├── mobile-catalog-menu.js   # Мобильный каталог (тяжелый модуль, ~52 KB)
│   │   ├── catalog-modal.js     # Десктопный каталог
│   │   ├── custom-dropdown.js   # Кастомные дропдауны
│   │   ├── product-card.js      # Логика карточки (лайки, корзина, слайдер фото)
│   │   ├── sliders.js           # Кастомные слайдеры (без Swiper/Slick)
│   │   ├── tabs.js              # Переключение табов
│   │   ├── products-widget.js   # Виджет похожих товаров
│   │   ├── toast.js             # Toast-система уведомлений
│   │   ├── favorites-toast-controller.js  # Контроллер toast для избранного
│   │   └── compare-toast-controller.js    # Контроллер toast для сравнения
│   ├── pages/
│   │   ├── catalog.js           # Точка входа каталога
│   │   ├── catalog/
│   │   │   ├── tags.js          # Тег-фильтры
│   │   │   ├── view-toggle.js   # Переключение сетка/список
│   │   │   ├── sort-dropdown.js # Сортировка
│   │   │   ├── filters-more.js  # Кнопка «Ещё фильтры»
│   │   │   ├── range-sliders.js # Ценовые ползунки
│   │   │   ├── sticky-sidebar.js    # Фиксированная боковая панель
│   │   │   ├── promo-mover.js   # Перемещение промо-блока
│   │   │   └── promo-timer.js   # Таймер обратного отсчёта в промо
│   │   ├── product.js           # Точка входа карточки товара
│   │   ├── product/
│   │   │   ├── gallery.js       # Галерея изображений (зум, навигация)
│   │   │   ├── tabs.js          # Табы на карточке
│   │   │   ├── slider.js        # Слайдер товара
│   │   │   └── product-details.js   # Логика деталей товара
│   │   └── wishlist.js          # Точка входа избранного
│   └── legacy/                  # Старые JS-библиотеки (jQuery, Slick, Fancybox, GTM и др.)
│
├── documentation/               # Техническая документация по компонентам (12 файлов .md)
└── migrations/                  # Планы миграции со старого стека
```

---

## Технологический стек

| Слой                 | Технология                          | Детали                                                              |
| -------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| **Разметка**         | HTML5                               | Семантический HTML, многостраничный сайт                            |
| **Стили**            | Vanilla CSS                         | BEM, CSS Custom Properties, `@import` через `global.css`            |
| **Скрипты**          | Vanilla JS (ES Modules)             | `type="module"`, экспорт/импорт, без бандлера                       |
| **Шрифт**            | Gilroy (локальный)                  | Regular 400, Medium 500, SemiBold 600 — woff2/woff/ttf              |
| **Шрифт (fallback)** | Montserrat (Google Fonts)           | Подключается на главной                                             |
| **Иконки**           | Inline SVG                          | Хранятся в `assets/icons/`, встраиваются в HTML                     |
| **Legacy**           | jQuery, Slick, Fancybox, noUiSlider | Только в `css/legacy/` и `js/legacy/`, не использовать в новом коде |

---

## Дизайн-система

### Цветовая палитра

```
--color-dark:          #0a0a0a      (основной текст)
--color-light:         #ffffff      (белый)
--color-bg:            #f5f9fc      (фон страниц)
--color-accent:        #ff2e47      (CTA, акценты — красный)
--color-accent-hover:  #e6233b      (hover состояние акцента)
--color-blue:          #3696c5      (ссылки, интерактивные элементы)
--color-blue-hover:    #27799e      (hover для синего)
--color-gray:          #717182      (вторичный текст)
--color-gray-light:    #ebf5fa      (фоны кнопок, бэджи)
--color-star:          #ffa500      (рейтинг)
```

### Breakpoints (Desktop-first)

```
@media (max-width: 1539px)  →  Ноутбуки / крупные планшеты
@media (max-width: 1023px)  →  Планшеты
@media (max-width: 767px)   →  Мобильные
@media (max-width: 479px)   →  Компактные мобильные
```

> ⚠️ **Не используй** круглые значения `1024px`, `768px`, `480px` — они не совпадают с сеткой проекта. Не используй `min-width` без крайней необходимости.

### CSS-методология

- **BEM**: `.block`, `.block__element`, `.block--modifier`
- **Состояния**: `is-*` классы (`.is-active`, `.is-open`, `.is-hidden`)
- **Порядок свойств**: Positioning → Box Model → Typography → Visual → Animation
- **`!important`**: запрещён без технической необходимости

---

## Архитектура CSS

```
HTML-страница
  └── <link> custom-normalize.css     ← Reset
  └── <link> global.css               ← Base + Modules (через @import)
  └── <link> pages/<page-name>.css    ← Стили конкретной страницы
```

- `global.css` — единая точка сборки общих стилей через `@import`
- Страничные стили **не попадают** в `global.css`
- Общие компоненты **не дублируются** в страничных файлах

---

## Архитектура JavaScript

### Паттерн модуля

Каждый переиспользуемый модуль экспортирует функцию инициализации и проверяет наличие DOM перед запуском:

```js
// js/modules/feature.js
export function initFeature() {
  const root = document.querySelector(".feature");
  if (!root) return;
  // ...логика
}
```

### Паттерн страничной точки входа

```js
// js/pages/catalog.js
import { initStickyHeader } from "../modules/sticky-header.js";
import { initMobileMenu } from "../modules/mobile-menu.js";
// ...

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".header")) initStickyHeader();
  if (document.getElementById("burger-btn")) initMobileMenu();
  // ...страничная логика
});
```

### Глобальная точка входа (`main.js`)

Подключается на страницах, которым не нужна собственная логика. Инициализирует:

- Липкую шапку (`sticky-header`)
- Offcanvas-панели
- Бургер-меню
- Мобильный каталог
- Десктопный каталог (модальный)
- Кастомные дропдауны
- Карточки товаров + слайдеры
- Обработку динамически добавленных карточек через событие `catalog:products-appended`

### Правила для нового JS

- **ES Modules** — всегда `type="module"`
- **Нет jQuery** в новом коде (legacy-only)
- **Нет глобальных переменных** — только модульный экспорт
- **DOM-связи** через классы и `data-*` атрибуты
- **Graceful degradation** — модуль не падает, если его DOM отсутствует

---

## Страницы

| Файл                       | Назначение             | CSS точка входа                    | JS точка входа                 |
| -------------------------- | ---------------------- | ---------------------------------- | ------------------------------ |
| `index.html`               | Хаб выбора разделов    | Встроенные стили + `variables.css` | Встроенный `<script>` (таймер) |
| `new-catalog.html`         | Каталог товаров        | `pages/catalog-page.css`           | `pages/catalog.js`             |
| `new-product-pechi.html`   | Товар: Печи            | `pages/product-page.css`           | `pages/product.js`             |
| `new-product-kupeli.html`  | Товар: Купели          | `pages/product-page.css`           | `pages/product.js`             |
| `new-product-vagonka.html` | Товар: Вагонка         | `pages/product-page.css`           | `pages/product.js`             |
| `wishlist.html`            | Избранное (с товарами) | `pages/wishlist-page.css`          | `pages/wishlist.js`            |
| `wishlist-empty.html`      | Избранное (пустое)     | `pages/wishlist-page.css`          | `pages/wishlist.js`            |

---

## Ключевые компоненты

### Карточка товара (`product-card`)

Главный переиспользуемый блок каталога. Поддерживает:

- Слайдер изображений внутри карточки
- Кнопку лайка (избранное)
- Бэджи (скидка, новинка, хит)
- Режим сетки и списка
- **Файлы:** `css/modules/product-card.css`, `js/modules/product-card.js`
- **Документация:** `documentation/product-card.md`

### Каталог

Комплексная страница с:

- Боковым фильтром (sticky sidebar, ценовые ползунки, теги)
- Переключатель сетка/список
- Сортировка через кастомный дропдаун
- Промо-блок с таймером обратного отсчёта
- Пагинация
- **Документация:** `documentation/catalog-view-toggle.md`, `documentation/promo-block.md`

### Карточка товара (product page)

Детальная страница товара:

- Hero-секция: галерея с зумом + основная информация
- Табы: характеристики, описание, отзывы
- Слайдер «Похожие товары»
- **Документация:** `documentation/product-gallery.md`, `documentation/tabs-component.md`

### Toast-уведомления

Универсальная система уведомлений с анимациями.

- **Файлы:** `css/modules/toast.css`, `js/modules/toast.js`
- **Документация:** `documentation/toast-notification.md`

### Модальные меню

- **Десктоп:** `catalog-modal` — раскрывающаяся панель каталога в шапке
- **Мобильные:** `mobile-menu` (бургер) + `mobile-catalog-menu` (аккордеон категорий)
- **Документация:** `documentation/catalog-modal.md`, `documentation/catalog-modal-mobile.md`, `documentation/mobile-menu.md`

---

## Документация

Техническая документация по каждому компоненту лежит в `documentation/`:

| Файл                      | Описание                              |
| ------------------------- | ------------------------------------- |
| `product-card.md`         | Карточка товара: HTML/CSS/JS-контракт |
| `product-gallery.md`      | Галерея изображений товара            |
| `catalog-modal.md`        | Десктопное модальное окно каталога    |
| `catalog-modal-mobile.md` | Мобильное меню каталога               |
| `catalog-view-toggle.md`  | Переключатель сетка/список            |
| `mobile-menu.md`          | Бургер-меню                           |
| `mobile-tags-menu.md`     | Мобильное меню тегов                  |
| `promo-block.md`          | Промо-блок с таймером                 |
| `tabs-component.md`       | Компонент табов                       |
| `toast-notification.md`   | Toast-уведомления                     |
| `visual-loading.md`       | Визуальная загрузка                   |
| `wishlist-page.md`        | Страница избранного                   |
| `focus-visible.md`        | Доступная клавиатурная навигация      |

---

## Как добавлять новую страницу

1. Создать HTML-файл **в корне** проекта
2. Подключить CSS в правильном порядке:
   ```html
   <link rel="stylesheet" href="./css/custom-normalize.css" />
   <link rel="stylesheet" href="./css/global.css" />
   <link rel="stylesheet" href="./css/pages/my-page.css" />
   ```
3. Создать файл `css/pages/my-page.css` для страничных стилей
4. Если нужна логика — создать `js/pages/my-page.js` и подключить как `type="module"`
5. Переиспользовать существующие компоненты (header, footer, catalog-modal, mobile-menu и др.)
6. Написать документацию в `documentation/my-page.md`

---

## Как добавлять новый компонент

1. CSS → `css/modules/component-name.css` + добавить `@import` в `global.css`
2. JS → `js/modules/component-name.js` с экспортом `initComponentName()`
3. Инициализацию добавить в `main.js` (для глобальных) или в страничную точку входа
4. Документация → `documentation/component-name.md`

---

## Legacy-код

В папках `css/legacy/` и `js/legacy/` лежат старые библиотеки от предыдущей версии сайта:

- **jQuery** + jQuery UI
- **Slick** (карусель) — постепенно заменяется на кастомные слайдеры
- **Fancybox** (лайтбокс)
- **noUiSlider** (ползунки)
- **GTM, Метрика** и другие трекеры

> ⛔ **Не используй legacy-библиотеки в новом коде.** Если задача решается ванильным JS — пиши на нём.  
> Миграция со Slick на кастомные слайдеры описана в `migrations/`.

---

## Ограничения и особенности

- **Папка `!FILES/`** — старый миграционный источник, **Read-Only**. Не трогать без явного разрешения.
- **Нет сборщика** — все `@import` работают нативно в браузере.
- **Нет SCSS/PostCSS** — используются CSS Custom Properties.
- **Нет npm/node_modules** — проект полностью самодостаточный.
- **Desktop-first** — адаптив строится через `max-width` медиазапросы.

---

## Чеклист перед коммитом

- [ ] HTML-страница лежит в корне (если новая)
- [ ] CSS подключен: `custom-normalize.css` → `global.css` → страничный CSS
- [ ] Страничные стили не в `global.css`, общие — не в страничном файле
- [ ] JS подключен как `type="module"`
- [ ] Инициализация модулей защищена проверками DOM
- [ ] Изображения/иконки/шрифты лежат в `assets/`
- [ ] Создан `.md` файл в `documentation/` для новой фичи
- [ ] Нет подключений к `!FILES/` или `legacy/` (без необходимости)
- [ ] Проверено на desktop, tablet (`1023px`) и mobile (`767px`)
- [ ] Breakpoints используют правильные значения: `1539`, `1023`, `767`, `479`
- [ ] Все изображения (кроме тех, что на первом экране/above-the-fold) имеют `loading="lazy"`, а также `width`/`height` для оптимизации скорости и борьбы с CLS
- [ ] HTML-страницы имеют уникальный тег `<meta name="description" content="..." />` в `<head>` для SEO-оптимизации

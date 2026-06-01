# Финальный аудит вёрстки перед сдачей

Дата проверки: 2026-06-01.

Проверенная зона: актуальные файлы в корне проекта, `assets`, `css`, `js`, `documentation`. Папки `OLD` и `!FILES` не рассматривались как рабочая база, но ссылки на них из текущих HTML/JS отмечены как проблемы.

## Краткий итог

- Локальные CSS/JS-файлы, подключённые через `href/src`, в целом существуют.
- `url(...)` в текущих CSS и ES module imports в текущих JS не дают битых локальных путей.
- Явные `debugger`, `TODO`, `FIXME` в текущих рабочих HTML/CSS/JS не найдены.
- Критичные проблемы перед сдачей: ссылки на `!FILES`, отключённая legacy-логика корзины на product-страницах, оставшиеся console-логи, просроченный таймер акции, большое количество `href="#"`, inline-скрипты/стили и визуально/интерактивно сомнительный `#go-top`.

## P0 - критично перед сдачей

### 1. Текущие файлы всё ещё завязаны на `!FILES`

`!FILES` по проектным правилам является миграционным read-only источником, но текущая вёрстка и JS продолжают брать оттуда runtime-ресурсы.

Найдено:

- `new-product-kupeli.html:3884` -> `src="./!FILES/catalog-pechi_files/rivox.js"`
- `new-product-pechi.html:4610` -> `src="./!FILES/catalog-pechi_files/rivox.js"`
- `new-product-vagonka.html:3790` -> `src="./!FILES/catalog-pechi_files/rivox.js"`
- `wishlist.html:2513` -> `src="./!FILES/catalog-pechi_files/rivox.js"`
- `wishlist-empty.html:2255` -> `src="./!FILES/catalog-pechi_files/rivox.js"`
- `js/modules/catalog-modal.js:13-14` -> иконки из `./!FILES/NEW-HTML/...`
- `js/modules/mobile-catalog-menu.js:1379`, `js/modules/mobile-catalog-menu.js:1434` -> `./!FILES/NEW-HTML/assets/icons/arrow/chevron-right.svg`

Риск: после переноса/деплоя без `!FILES` сломаются иконки и аналитический скрипт. В проекте уже есть рабочие аналоги: `js/legacy/rivox.js`, `assets/icons/header/hamburger.svg`, `assets/icons/interfaces/close-light.svg`, `assets/icons/arrow/chevron-right.svg`.

### 2. Корзина на product-страницах выглядит подключённой, но legacy-обработчики отключены

На product-страницах кнопки корзины и fast-buy используют legacy-классы, но `script.js/script2.js/script3.js` закомментированы.

Найдено:

- `new-product-kupeli.html:2182-2184` -> кнопка `type="button"` с классом `addtocart`
- `new-product-pechi.html:2164-2166` -> кнопка `type="button"` с классом `addtocart`
- `new-product-vagonka.html:2111-2113` -> кнопка `type="button"` с классом `addtocart`
- `new-product-kupeli.html:3792-3794`, `new-product-pechi.html:4518-4520`, `new-product-vagonka.html:3698-3700` -> legacy scripts закомментированы
- `js/legacy/script2.js:171`, `js/legacy/script2.js:376`, `js/legacy/script2.js:730` -> именно здесь живут `addToCart`, `contrlolQuantity`, `comparison`
- `js/pages/product.js:456-528` -> только показывает tooltip при нулевом количестве, но не вызывает добавление в корзину

Риск: визуально кнопки есть, но без `script2.js` они могут ничего не делать. Если product-страницы должны сдавать рабочую покупку, это главный блокер.

## P1 - нужно зачистить

### 3. Остались console-выводы в текущем и подключённом JS

Текущие ES-модули:

- `js/pages/product.js:288` -> `console.error`
- `js/pages/product/gallery.js:15` -> `console.error`
- `js/pages/product/gallery.js:260` -> `console.warn`
- `js/pages/product/gallery.js:263` -> `console.log`
- `js/pages/product/gallery.js:265` -> `console.error`
- `js/pages/catalog/promo-timer.js:24` -> `console.warn`

Legacy, который подключается на `new-catalog.html`:

- `js/legacy/script.js:167` -> `console.log("SCRIPT.JS LOADED")`
- `js/legacy/script2.js:263` -> `console.log(i)`
- `js/legacy/script2.js:1370` -> `console.log("digiLayer undefined")`
- `js/legacy/script3.js:5` -> `console.log(result[0])`

Рекомендация: убрать явные `console.log`; `warn/error` оставить только если это осознанный production-лог, иначе заменить на silent fallback или debug flag.

### 4. `#go-top` является артефактом и местами конфликтует с legacy-логикой

Найдено:

- `new-catalog.html:4189`, `new-product-kupeli.html:3892`, `new-product-pechi.html:4618`, `new-product-vagonka.html:3798`, `wishlist.html:2521`, `wishlist-empty.html:2263` -> вручную вставлен `<div id="go-top" ... style="display: block"></div>`
- `js/legacy/script2.js:281-295` -> legacy сам добавляет `#go-top` и вешает обработчик
- На `new-catalog.html` `script2.js` подключён, значит возможен runtime-дубликат `id="go-top"`.
- На product/wishlist страницах `script2.js` закомментирован, значит видимый `#go-top` может остаться без поведения.

Риск: видимая лишняя кнопка, дублирование id, разные сценарии поведения между каталогом и product/wishlist.

### 5. Таймер акции уже просрочен

Найдено:

- `new-catalog.html:3738-3739` -> `data-countdown="2026-05-31T00:00:00"`

На дату аудита, 2026-06-01, это уже прошедшая дата. Визуально блок акции может показывать нули/истёкшее состояние сразу при загрузке.

### 6. Очень много `href="#"` в реальной навигации

Количество:

- `new-catalog.html` -> 142
- `new-product-kupeli.html` -> 131
- `new-product-pechi.html` -> 141
- `new-product-vagonka.html` -> 132
- `wishlist-empty.html` -> 127
- `wishlist.html` -> 128

Примеры зон: header links, mobile menu, catalog modal, breadcrumbs, tags, product/simple-card links. Риск: мёртвые ссылки, прыжок страницы наверх, плохая клавиатурная навигация и неготовый вид перед сдачей.

### 7. Inline-скрипты, inline-стили и inline-handlers остались в большом объёме

Inline script blocks:

- `new-catalog.html` -> 9
- `new-product-kupeli.html` -> 8
- `new-product-pechi.html` -> 8
- `new-product-vagonka.html` -> 8
- `wishlist-empty.html` -> 8
- `wishlist.html` -> 7
- `index.html` -> 1

Inline style attrs:

- `new-catalog.html` -> 6
- `new-product-kupeli.html` -> 11
- `new-product-pechi.html` -> 12
- `new-product-vagonka.html` -> 9
- `wishlist-empty.html` -> 3
- `wishlist.html` -> 5

Inline handlers:

- `new-catalog.html:342`, `new-catalog.html:451` -> `generalPixel.postClick(...)`
- `new-catalog.html:2936`, `2947`, `2978`, `2989` -> `onclick="calcCatPrice(this)"`
- По всем product/wishlist страницам есть `onclick="generalPixel.postClick(...)"`.

Дополнительно: `generalPixel` в текущих HTML/JS не определяется локально, значит при блокировке внешнего источника клик может давать JS-ошибку.

## P2 - качество, визуал, доступность

### 8. Изображения тяжёлые для первого рендера: нет `loading="lazy"`

Статистика:

- `new-catalog.html`: 134 img, `loading="lazy"` = 0
- `new-product-kupeli.html`: 101 img, `loading="lazy"` = 0
- `new-product-pechi.html`: 121 img, `loading="lazy"` = 0
- `new-product-vagonka.html`: 103 img, `loading="lazy"` = 0
- `wishlist-empty.html`: 78 img, `loading="lazy"` = 0
- `wishlist.html`: 87 img, `loading="lazy"` = 0

Риск: лишняя загрузка ниже первого экрана, медленный старт, возможный layout shift. Также не у всех img есть `width/height`.

### 9. Много контентных изображений с пустым `alt`

Статистика пустых `alt=""`:

- `new-catalog.html` -> 108
- `new-product-kupeli.html` -> 70
- `new-product-pechi.html` -> 75
- `new-product-vagonka.html` -> 68
- `wishlist-empty.html` -> 60 и 1 img без alt
- `wishlist.html` -> 67

Пустой `alt` нормален для декоративных иконок, но в выборке есть карточки товаров/категорий и галереи. Их лучше заполнить осмысленными alt или явно подтвердить, что они декоративные.

### 10. CSS содержит проектные нарушения по breakpoint-системе

Проектные правила задают desktop-first и основные breakpoints `1539px`, `1023px`, `767px`, `479px`, без `min-width` без необходимости.

Найдено:

- `css/pages/catalog/promo-block.css:239` -> `@media (max-width: 1440px)`
- `css/pages/catalog/promo-block.css:259` -> `@media (max-width: 1199px)`
- `css/modules/products-widget.css:204` -> `@media (max-width: 1300px)`
- `css/modules/mobile-catalog-menu.css:33`, `css/modules/offcanvas.css:89`, `css/modules/tags.css:206` -> `@media (min-width: 768px)`

Риск: адаптив будет вести себя иначе, чем остальная сетка проекта; сложнее проверять desktop/tablet/mobile.

### 11. Много `!important` и мелких размеров интерактивных элементов

Примеры `!important` вне utility/reset-зон:

- `css/modules/mobile-catalog-menu.css:35`
- `css/pages/product/product-tabs.css:206`, `281-283`
- `css/modules/tags.css:20-24`, `39`, `108`, `214`
- `css/pages/catalog/promo-block.css:58`, `395`
- `css/pages/product/product-hero.css:480`, `536`, `569`, `589`, `624`, `652`
- `css/modules/product-card.css:30-35`, `122`, `539`

Много интерактивных/иконковых размеров ниже 44px: `32px`, `36px`, `40px`, местами `14-20px`. Примеры: `css/modules/mobile-catalog-menu.css:81-82`, `css/pages/product/product-slider.css:69-70`, `css/modules/product-card.css:70-71`, `css/modules/pagination.css:147-175`.

Риск: касания на мобильных и фокусные состояния могут быть неудобными.

### 12. Фокусные состояния местами сбрасываются

Найдено `outline: none`:

- `css/modules/custom-dropdown.css:25`
- `css/modules/inputs.css:18`
- `css/modules/search.css:30`
- `css/modules/tabs.css:40`
- `css/pages/catalog/catalog-sort.css:129`
- `css/pages/product/product-hero.css:541`, `575`, `819`, `1033`
- `css/modules/product-card.css:720`

В проекте мало явных `:focus-visible`. Риск: клавиатурная навигация визуально теряется, особенно в dropdown/tabs/product-card controls.

### 13. Wishlist-страницы без meta description

Найдено:

- `wishlist.html` -> нет `meta name="description"`
- `wishlist-empty.html` -> нет `meta name="description"`

Это не ломает вёрстку, но перед сдачей лучше закрыть как SEO/preview-артефакт.

### 14. `index.html` живёт вне общей CSS/JS-системы проекта

Найдено:

- `index.html:14-15` подключает только `css/base/variables.css` и `css/base/typography.css`
- `index.html:18-451` содержит большой inline `<style>`
- `index.html:632-758` содержит большой inline `<script>`

Если `index.html` остаётся production-страницей, он не следует принятому порядку `custom-normalize.css` -> `global.css` -> page CSS и выбивается из общей архитектуры. Если это только временный hub/chooser, его стоит явно исключить из сдачи.

## Что выглядит нормально

- Реальные локальные CSS/JS-подключения из текущих директорий в основном существуют.
- В текущих CSS не найдено битых локальных `url(...)`.
- В текущих ES-модулях не найдено битых `import ... from`.
- Статических дубликатов обычного `id="..."` в HTML не найдено; конфликт есть именно runtime-уровня для `#go-top`.
- У всех страниц есть один `<main>`.
- У всех страниц есть viewport meta, он просто разбит на несколько строк.

## Рекомендуемый порядок зачистки

1. Убрать зависимости от `!FILES`: заменить rivox и иконки на текущие `js/legacy` и `assets/icons`.
2. Принять решение по product cart: либо подключить нужную legacy-логику, либо реализовать современный обработчик для `.addtocart` / `.fast-buy`.
3. Удалить production-лишние `console.log`, особенно в `script.js`, `script2.js`, `script3.js`, `gallery.js`.
4. Исправить `#go-top`: один источник разметки и один обработчик, без `style="display: block"`.
5. Обновить дату таймера акции.
6. Заменить `href="#"` на реальные URL, кнопки или `data-*` controlled actions.
7. Перенести критичные inline-стили/скрипты в CSS/JS, а inline analytics handlers защитить проверками.
8. Добавить lazy-loading/размеры для изображений ниже первого экрана и пройтись по alt для товарных картинок.

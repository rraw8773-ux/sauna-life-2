# Документация: Промо-блок каталога (Promo Block Component)

Данный документ описывает структуру, стили и JavaScript-интеграцию промо-блока с акционными товарами (`.promo-block`) на сайте. Компонент состоит из HTML-разметки, адаптивных стилей в `css/pages/catalog/promo-block.css` и JS-модуля таймера в `js/pages/catalog/promo-timer.js`.

---

## 1. DOM-структура и HTML-контракт

Промо-блок является автономным интерактивным компонентом, который встраивается в сетку каталога товаров.

### Пример разметки:
```html
<div class="promo-block">
  <div class="promo-block__header">
    <h2 class="promo-block__title">ТОВАРЫ ПО АКЦИЯМ</h2>
    <img src="./assets/icons/sale-badge.svg" alt="%" class="promo-block__badge-icon" />
  </div>
  
  <div class="promo-block__body">
    <!-- Блок изображения -->
    <div class="promo-block__image-wrapper">
      <img src="./assets/images/catalog/catalog-cta.png" alt="Печь по акции" class="promo-block__image" />
    </div>
    
    <!-- Информационный блок -->
    <div class="promo-block__info">
      <span class="badge badge--new promo-block__discount">Скидка 2%</span>
      <h3 class="promo-block__product-title">
        Печь для бани и сауны Костер сетка 21 + бак для воды 70 л (комплект)
      </h3>
      
      <!-- Цены товара -->
      <div class="promo-block__prices">
        <span class="promo-block__price">52 681 ₽</span>
        <span class="promo-block__price-old">54 280 ₽</span>
      </div>
      
      <!-- Панель действий с таймером -->
      <div class="promo-block__actions">
        <button class="button button--primary promo-block__buy-btn" type="button">
          <svg class="button__icon">
            <use xlink:href="./assets/icons/sprite.svg#cart"></use>
          </svg>
          <span>В корзину</span>
        </button>
        
        <!-- Таймер обратного отсчета -->
        <div class="promo-block__timer promo-timer" data-countdown="2026-05-31T00:00:00">
          <span class="promo-timer__label">До конца акции:</span>
          <div class="promo-timer__grid">
            <!-- Дни (показываются только если дней > 0) -->
            <div class="promo-timer__group" data-days-container>
              <span class="promo-timer__digit" data-days>00</span>
              <span class="promo-timer__unit">дн</span>
            </div>
            <span class="promo-timer__divider" data-days-divider>:</span>
            
            <!-- Часы -->
            <div class="promo-timer__group">
              <span class="promo-timer__digit" data-hours>00</span>
              <span class="promo-timer__unit">ч</span>
            </div>
            <span class="promo-timer__divider">:</span>
            
            <!-- Минуты -->
            <div class="promo-timer__group">
              <span class="promo-timer__digit" data-minutes>00</span>
              <span class="promo-timer__unit">мин</span>
            </div>
            <span class="promo-timer__divider">:</span>
            
            <!-- Секунды -->
            <div class="promo-timer__group">
              <span class="promo-timer__digit" data-seconds>00</span>
              <span class="promo-timer__unit">сек</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</div>
```

---

## 2. Адаптивное поведение и CSS

Стили компонента находятся в файле `css/pages/catalog/promo-block.css`. Блок спроектирован так, чтобы всегда оставаться полноценным горизонтальным баннером-прямоугольником, не сжимаясь в стандартную узкую карточку товара в одну колонку.

### Основные состояния и брейкпоинты:

*   **Десктоп (>= 1024px)**:
    *   Компонент располагается горизонтально: изображение слева, текстовое описание и блок цен справа.
    *   Все элементы внутри блока выровнены по левому краю для интеграции с общим дизайном каталога.
    *   Панель действий `.promo-block__actions` представляет собой аккуратную серую плашку во всю ширину правого блока с кнопкой «В корзину» и таймером, расположенным справа.

*   **Планшеты (от 768px до 1023px)**:
    *   Размер картинки фиксируется на `160x160px` во избежание растяжения изображения.
    *   Кнопка покупки занимает `100%` от доступной ей части серой плашки действий во избежание переносов.
    *   Таймер отсчета занимает оставшуюся область, выравнивая цифры по центру.

*   **Мобильные устройства (от 480px до 767px)**:
    *   Блок **всегда занимает 2 колонки** (`grid-column: 1 / -1 !important`), растягиваясь во всю ширину мобильного экрана.
    *   Используется аккуратная горизонтальная раскладка: картинка слева (`100x100px`), описание и цены справа.
    *   Панель действий (`.promo-block__actions`) перестраивается вертикально: кнопка «В корзину» занимает `100%` ширины правой колонки, а компактный таймер размещается под ней.

*   **Ультра-малые экраны (до 479px)**:
    *   Внутренние отступы блока уменьшаются до `12px`, размер картинки сжимается до `80x80px` для предотвращения вылазов.
    *   Высота кнопки уменьшается до `32px`, а зазоры уменьшаются до `6px` для идеальной читаемости даже на экранах шириной `320px`.

---

## 3. Модуль таймера (Promo Timer JS)

Логика обратного отсчета инициализируется модулем `js/pages/catalog/promo-timer.js` через вызов экспортируемой функции `initPromoTimer()`.

### DOM-интерфейс таймера:
*   **Корневой селектор**: `.promo-block__timer` или `.js-promo-timer`
*   **Целевая дата**: Задается через атрибут `data-countdown` в формате **ISO 8601** (например, `2026-05-31T00:00:00`). Если атрибут отсутствует, скрипт автоматически генерирует дату окончания текущих суток (`23:59:59.999`) в качестве fallback-значения.
*   **Интерактивные контейнеры**:
    *   `[data-days-container]` и `[data-days-divider]` — автоматически скрываются скриптом, если оставшееся время составляет менее 24 часов (значение дней равно 0).
    *   `[data-days]`, `[data-hours]`, `[data-minutes]`, `[data-seconds]` — элементы для текстовой вставки отформатированных цифр (значения автоматически дополняются ведущим нулем до 2 символов через `padStart(2, "0")`).

### Жизненный цикл таймера:
1.  При вызове `initPromoTimer()` скрипт находит все неинициализированные таймеры на странице, вешает на них маркер-класс `is-initialized` и считывает целевую дату.
2.  Запускается ежесекундный интервал обновления (`setInterval`).
3.  Каждую секунду рассчитывается разница между текущим временем и целевой датой.
4.  При **истечении таймера** (`difference <= 0`):
    *   Интервал очищается.
    *   Все значения сбрасываются в `"00"`.
    *   Блок дней скрывается.
    *   Надпись `.promo-timer__label` меняется на «Акция завершена» и окрашивается в серый цвет (`var(--color-gray)`).
    *   Корневому контейнеру таймера присваивается класс `.promo-timer--expired` (для дополнительных стилистических манипуляций).

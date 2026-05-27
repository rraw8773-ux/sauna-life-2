/*
 * Назначение файла: Динамическое перемещение промо-блока в сетке товаров
 */

export function initPromoMover() {
  const grid = document.querySelector(".catalog__grid");
  const promoBlock = document.querySelector(".promo-block");

  if (!grid || !promoBlock) return;

  // Если используется переключатель вида, мы можем слушать изменения DOM
  // Но для брейкпоинтов лучше использовать matchMedia
  const breakpoints = {
    // Ноутбук: 3 колонки (от 1024px до 1539px)
    laptop: window.matchMedia("(max-width: 1539px) and (min-width: 1024px)"),
  };

  function movePromoBlock() {
    // Проверяем, в режиме списка ли мы (если да, то логика может отличаться, но пока оставляем одинаковой)
    const isListView = grid.classList.contains("catalog__grid--list");

    // Если промо-блок уже в DOM, удаляем его из потока, чтобы получить чистый массив карточек
    if (promoBlock.parentNode === grid) {
      grid.removeChild(promoBlock);
    }

    const products = Array.from(grid.children).filter(
      (el) => !el.classList.contains("promo-block"),
    );

    // По умолчанию (ПК > 1539px - 4 колонки) и (Планшет/Мобилка <= 1023px - 2 колонки)
    // Вставляем после 4 товаров (индекс 4)
    let targetIndex = 4;

    // На ноутбуке 3 колонки, вставляем после 3 товаров (индекс 3)
    if (breakpoints.laptop.matches && !isListView) {
      targetIndex = 3;
    }

    // Если товаров меньше, чем нужно для заполнения ряда, ставим в самый конец
    if (products.length < targetIndex) {
      grid.appendChild(promoBlock);
    } else {
      // Иначе вставляем перед нужным элементом
      grid.insertBefore(promoBlock, products[targetIndex]);
    }
  }

  // Запускаем изначальное позиционирование
  movePromoBlock();

  // Слушаем изменение ширины экрана для перестроения
  breakpoints.laptop.addEventListener("change", movePromoBlock);

  // Опционально: если вид переключается на лету (Сетка / Список), можно вызывать перестроение
  // через MutationObserver за классом на сетке
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        movePromoBlock();
      }
    });
  });

  observer.observe(grid, { attributes: true });
}

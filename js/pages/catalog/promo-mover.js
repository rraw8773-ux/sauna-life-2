/*
 * Назначение файла: Динамическое перемещение промо-блока в сетке товаров (Catalog page specific)
 */

export function initPromoMover() {
  const grid = document.querySelector(".catalog__grid");
  const promoBlock = document.querySelector(".promo-block");

  if (!grid || !promoBlock) return;

  const breakpoints = {
    laptop: window.matchMedia("(max-width: 1539px) and (min-width: 1024px)"),
  };

  function movePromoBlock() {
    const isListView = grid.classList.contains("catalog__grid--list");

    if (promoBlock.parentNode === grid) {
      grid.removeChild(promoBlock);
    }

    const products = Array.from(grid.children).filter(
      (el) => !el.classList.contains("promo-block"),
    );

    let targetIndex = 4;

    if (breakpoints.laptop.matches && !isListView) {
      targetIndex = 3;
    }

    if (products.length < targetIndex) {
      grid.appendChild(promoBlock);
    } else {
      grid.insertBefore(promoBlock, products[targetIndex]);
    }
  }

  movePromoBlock();

  breakpoints.laptop.addEventListener("change", movePromoBlock);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        movePromoBlock();
      }
    });
  });

  observer.observe(grid, { attributes: true });
}

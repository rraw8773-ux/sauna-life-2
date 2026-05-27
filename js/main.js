/*
 * Назначение файла: Глобальная точка входа для общих элементов всего сайта (Main UI entry point)
 * Содержит только общие сквозные модули (шапка, меню, оффканвас, глобальные дропдауны и т.д.)
 */

import { initStickyHeader } from "./modules/sticky-header.js";
import { initOffcanvas } from "./modules/offcanvas.js";
import { initMobileMenu } from "./modules/mobile-menu.js";
import { initMobileCatalogMenu } from "./modules/mobile-catalog-menu.js";
import { initCatalogModal } from "./modules/catalog-modal.js";
import { initCustomDropdown } from "./modules/custom-dropdown.js";
import { initProductCards } from "./modules/product-card.js";
import { initSliders } from "./modules/sliders.js";

const hasMatch = (root, selector) =>
  Boolean(root?.matches?.(selector) || root?.querySelector?.(selector));

document.addEventListener("DOMContentLoaded", () => {
  // Глобальная липкая шапка
  if (document.querySelector(".header")) {
    initStickyHeader();
  }

  // Глобальный оффканвас (меню/корзина)
  if (document.querySelector(".offcanvas")) {
    initOffcanvas();
  }

  // Глобальное бургер-меню
  if (document.getElementById("burger-btn")) {
    initMobileMenu();
  }

  // Глобальный мобильный каталог
  if (document.getElementById("mobile-catalog-btn")) {
    initMobileCatalogMenu();
  }

  // Глобальное модальное окно каталога
  if (document.getElementById("catalog-btn")) {
    initCatalogModal();
  }

  // Глобальные кастомные дропдауны
  initCustomDropdown();

  // Глобальные карточки товаров и слайдеры
  if (document.querySelector(".product-card")) {
    initProductCards();
  }

  if (document.querySelector(".js-product-card-slider")) {
    initSliders();
  }

  // Поддержка динамически добавляемых элементов в DOM
  document.addEventListener("catalog:products-appended", (event) => {
    const root = event.detail?.root instanceof Element ? event.detail.root : document;

    if (hasMatch(root, ".js-product-card-slider")) {
      initSliders(root);
    }

    if (hasMatch(root, ".product-card")) {
      initProductCards(root);
    }
  });
});

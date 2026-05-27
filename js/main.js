/*
 * Назначение файла: Точка входа, инициализация всех модулей
 */

import { initStickyHeader } from "./modules/sticky-header.js";
import { initOffcanvas } from "./modules/offcanvas.js";
import { initRangeSliders } from "./modules/range-sliders.js";
import { initSliders } from "./modules/sliders.js";
import { initTags } from "./modules/tags.js";
import { initProductCards } from "./modules/product-card.js";
import { initCustomDropdown } from "./modules/custom-dropdown.js";
import { initViewToggle } from "./modules/view-toggle.js";
import { initFiltersMore } from "./modules/filters-more.js";
import { initCatalogModal } from "./modules/catalog-modal.js";
import { initMobileMenu } from "./modules/mobile-menu.js";
import { initMobileCatalogMenu } from "./modules/mobile-catalog-menu.js";
import { initPromoMover } from "./modules/promo-mover.js";
import { initStickySidebar } from "./modules/sticky-sidebar.js";
import { initProductDetails } from "./modules/product-details.js";
import { initPromoTimer } from "./modules/promo-timer.js";

const hasMatch = (root, selector) =>
  Boolean(root?.matches?.(selector) || root?.querySelector?.(selector));

document.addEventListener("DOMContentLoaded", () => {
  // Инициализация интерактивных элементов страницы товара (Harvia)
  if (
    document.querySelector(".products-section") ||
    document.querySelector(".product-tabs, .tabs-section")
  ) {
    initProductDetails();
  }

  if (document.querySelector(".header")) {
    initStickyHeader();
  }

  if (document.querySelector(".offcanvas")) {
    initOffcanvas();
  }

  // Инициализация фильтров каталога
  if (document.querySelector(".filters")) {
    initRangeSliders();
  }

  // Инициализация слайдеров
  if (document.querySelector(".js-product-card-slider")) {
    initSliders();
  }

  // Инициализация тегов
  if (document.querySelector(".tags")) {
    initTags();
  }

  // Инициализация карточек товаров
  if (document.querySelector(".product-card")) {
    initProductCards();
  }

  document.addEventListener("catalog:products-appended", (event) => {
    const root = event.detail?.root instanceof Element ? event.detail.root : document;

    if (hasMatch(root, ".js-product-card-slider")) {
      initSliders(root);
    }

    if (hasMatch(root, ".product-card")) {
      initProductCards(root);
    }

    if (hasMatch(root, ".promo-block__timer, .js-promo-timer")) {
      initPromoTimer(root);
    }
  });

  // Инициализация кастомных дропдаунов
  initCustomDropdown();

  // Инициализация переключателя вида каталога
  if (document.querySelector(".catalog__view-toggle")) {
    initViewToggle();
  }

  // Инициализация кнопки "Посмотреть все" в фильтрах
  if (document.querySelector(".filters__more")) {
    initFiltersMore();
  }

  // Инициализация модального окна каталога
  if (document.getElementById("catalog-btn")) {
    initCatalogModal();
  }

  // Инициализация мобильного меню
  if (document.getElementById("burger-btn")) {
    initMobileMenu();
  }

  // Инициализация мобильного каталога
  if (document.getElementById("mobile-catalog-btn")) {
    initMobileCatalogMenu();
  }

  // Динамическое перемещение промо-блока в сетке
  if (
    document.querySelector(".promo-block") &&
    document.querySelector(".catalog__grid")
  ) {
    initPromoMover();
  }

  // Высокотехнологичный таймер промо-блока
  if (document.querySelector(".promo-block__timer, .js-promo-timer")) {
    initPromoTimer();
  }

  // Липкий сайдбар каталога
  if (document.getElementById("filters-sidebar")) {
    initStickySidebar();
  }
});

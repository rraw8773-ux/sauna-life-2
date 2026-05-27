/*
 * Назначение: Главная точка входа для JavaScript страницы каталога (Catalog Page JS)
 * Собирает глобальные и локальные ES-модули и запускает их при DOMContentLoaded
 */

// Глобальные модули общего интерфейса
import { initStickyHeader } from "../modules/sticky-header.js";
import { initOffcanvas } from "../modules/offcanvas.js";
import { initMobileMenu } from "../modules/mobile-menu.js";
import { initMobileCatalogMenu } from "../modules/mobile-catalog-menu.js";
import { initCatalogModal } from "../modules/catalog-modal.js";

// Глобальные переиспользуемые модули (DRY)
import { initCustomDropdown } from "../modules/custom-dropdown.js";
import { initProductCards } from "../modules/product-card.js";
import { initProductsWidget } from "../modules/products-widget.js";
import { initSliders } from "../modules/sliders.js";

// Локальные страничные модули каталога
import { initFiltersMore } from "./catalog/filters-more.js";
import { initPromoMover } from "./catalog/promo-mover.js";
import { initPromoTimer } from "./catalog/promo-timer.js";
import { initRangeSliders } from "./catalog/range-sliders.js";
import { initSortDropdown } from "./catalog/sort-dropdown.js";
import { initStickySidebar } from "./catalog/sticky-sidebar.js";
import { initViewToggle } from "./catalog/view-toggle.js";
import { initTags } from "./catalog/tags.js";

const hasMatch = (root, selector) =>
  Boolean(root?.matches?.(selector) || root?.querySelector?.(selector));

document.addEventListener("DOMContentLoaded", () => {
  // Запуск глобальных модулей общего интерфейса
  if (document.querySelector(".header")) {
    initStickyHeader();
  }

  if (document.querySelector(".offcanvas")) {
    initOffcanvas();
  }

  if (document.getElementById("burger-btn")) {
    initMobileMenu();
  }

  if (document.getElementById("mobile-catalog-btn")) {
    initMobileCatalogMenu();
  }

  if (document.getElementById("catalog-btn")) {
    initCatalogModal();
  }

  // Запуск общего функционала
  initCustomDropdown();
  initProductCards();
  initProductsWidget();

  if (document.querySelector(".js-product-card-slider")) {
    initSliders();
  }

  // Поддержка динамически добавляемых элементов в DOM (фильтрация, пагинация)
  document.addEventListener("catalog:products-appended", (event) => {
    const root = event.detail?.root instanceof Element ? event.detail.root : document;

    if (hasMatch(root, ".js-product-card-slider")) {
      initSliders(root);
    }

    if (hasMatch(root, ".product-card")) {
      initProductCards(root);
    }
  });

  // Запуск локального функционала страницы каталога
  if (document.querySelector(".filters__more")) {
    initFiltersMore();
  }

  if (document.querySelector(".promo-block")) {
    initPromoMover();
    initPromoTimer();
  }

  if (document.querySelector(".filters")) {
    initRangeSliders();
    initStickySidebar();
  }

  if (document.getElementById("sort-dropdown")) {
    initSortDropdown();
  }

  if (document.querySelector(".catalog__view-toggle")) {
    initViewToggle();
  }

  if (document.querySelector(".tags")) {
    initTags();
  }
});

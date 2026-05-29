/*
 * Назначение: Главная точка входа для JavaScript страницы Избранного (Wishlist Page JS)
 * Собирает глобальные и локальные ES-модули и запускает их при DOMContentLoaded
 */

// Глобальные модули общего интерфейса
import { initStickyHeader } from "../modules/sticky-header.js";
import { initOffcanvas } from "../modules/offcanvas.js";
import { initMobileMenu } from "../modules/mobile-menu.js";
import { initMobileCatalogMenu } from "../modules/mobile-catalog-menu.js";
import { initCatalogModal } from "../modules/catalog-modal.js";

// Глобальные переиспользуемые модули (DRY)
import { initTabs } from "../modules/tabs.js";
import { initProductsWidget } from "../modules/products-widget.js";
import { initFavoritesToastController } from "../modules/favorites-toast-controller.js";

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

  // Запуск общего переиспользуемого функционала (табы и слайдеры в блоке дополнительных товаров)
  initTabs();
  initProductsWidget();
  initFavoritesToastController();

  // Локальный интерактивный функционал для страницы Избранного
  initWishlistPage();
});

/**
 * Логика страницы Избранного:
 * - Плавное удаление товара при клике на кнопку Избранного (сердечко)
 * - Плавное переключение экрана в пустое состояние, когда все товары удалены
 */
function initWishlistPage() {
  // Локальный функционал страницы Избранного (удаление карточек отключено по требованию пользователя)
}

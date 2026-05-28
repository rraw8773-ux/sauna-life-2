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

  // Локальный интерактивный функционал для страницы Избранного
  initWishlistPage();
});

/**
 * Логика страницы Избранного:
 * - Плавное удаление товара при клике на кнопку Избранного (сердечко)
 * - Плавное переключение экрана в пустое состояние, когда все товары удалены
 */
function initWishlistPage() {
  const wishlistSection = document.querySelector(".wishlist-list");
  const emptySection = document.querySelector(".wishlist-empty");
  const cardsContainer = document.querySelector(".wishlist-list__items");

  if (!cardsContainer) return;

  cardsContainer.addEventListener("click", (e) => {
    const likeBtn = e.target.closest(".wishlist-card__like-btn");
    if (!likeBtn) return;

    const card = likeBtn.closest(".wishlist-card");
    if (!card) return;

    // Плавная микроанимация удаления карточки (прозрачность, масштабирование и подъем)
    card.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    card.style.opacity = "0";
    card.style.transform = "scale(0.9) translateY(15px)";

    setTimeout(() => {
      card.remove();

      // Проверяем, остались ли еще карточки в списке избранного
      const remainingCards = cardsContainer.querySelectorAll(".wishlist-card");
      if (remainingCards.length === 0) {
        // Если товаров больше нет, плавно скрываем секцию списка и показываем пустую страницу
        if (wishlistSection && emptySection) {
          wishlistSection.style.transition = "opacity 0.3s ease";
          wishlistSection.style.opacity = "0";
          
          setTimeout(() => {
            wishlistSection.style.display = "none";
            
            // Плавное проявление пустого состояния
            emptySection.style.display = "block";
            emptySection.style.opacity = "0";
            emptySection.style.transform = "translateY(20px)";
            emptySection.style.transition = "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"; // премиальный эффект упругости
            
            // Принудительный reflow для запуска CSS transition
            emptySection.offsetHeight;
            
            emptySection.style.opacity = "1";
            emptySection.style.transform = "translateY(0)";
          }, 300);
        }
      }
    }, 400);
  });
}

/*
 * Назначение: Контроллер добавления в избранное (Favorites Toast Controller)
 * Реализует перехват событий добавления/удаления из избранного с вызовом Toasts.
 * Использует делегирование событий для поддержки AJAX-элементов.
 */

import { Toast } from "./toast.js";

/**
 * Инициализирует контроллер избранного.
 * Навешивает глобальный обработчик на клики по сердечкам на всех страницах.
 */
export function initFavoritesToastController() {
  // Флаг предотвращения повторной инициализации
  if (window.__favoritesToastControllerInitialized) return;
  window.__favoritesToastControllerInitialized = true;

  document.addEventListener("click", (e) => {
    // 1. Ищем кнопку добавления в избранное в карточке товара (каталог)
    const cardLikeBtn = e.target.closest(".product-card__action-btn");
    if (cardLikeBtn) {
      const likeImg = cardLikeBtn.querySelector("img[src*='like']");
      if (likeImg) {
        handleLikeToggle(cardLikeBtn, likeImg);
        return;
      }
    }

    // 2. Ищем кнопку добавления в избранное на детальной странице товара
    const heroLikeBtn = e.target.closest(".product-hero__gallery-action-btn");
    if (heroLikeBtn) {
      const likeImg = heroLikeBtn.querySelector("img[src*='like']");
      if (likeImg) {
        handleLikeToggle(heroLikeBtn, likeImg);
        return;
      }
    }

    // 3. Ищем кнопку удаления в избранном на странице wishlist.html
    const wishlistLikeBtn = e.target.closest(".wishlist-card__like-btn");
    if (wishlistLikeBtn) {
      // На странице избранного карточка удаляется, просто выводим уведомление
      Toast.show({
        message: "Товар удалён из избранного",
        type: "remove",
        duration: 3000
      });
      return;
    }
  });
}

/**
 * Вспомогательная функция переключения состояния сердечка и вызова тоста
 * @param {HTMLElement} btnElement - Кнопка
 * @param {HTMLImageElement} imgElement - Картинка внутри кнопки
 */
function handleLikeToggle(btnElement, imgElement) {
  const currentSrc = imgElement.src;
  const isFilled = currentSrc.includes("like-fill.svg");

  if (isFilled) {
    // Деактивируем сердечко (убираем из избранного)
    imgElement.src = currentSrc.replace("like-fill.svg", "like.svg");
    btnElement.classList.remove("is-active");
    
    Toast.show({
      message: "Товар удалён из избранного",
      type: "remove",
      duration: 3000
    });
  } else {
    // Активируем сердечко (добавляем в избранное)
    imgElement.src = currentSrc.replace("like.svg", "like-fill.svg");
    btnElement.classList.add("is-active");

    Toast.show({
      message: "Товар добавлен в избранное",
      type: "success",
      duration: 3000
    });
  }
}

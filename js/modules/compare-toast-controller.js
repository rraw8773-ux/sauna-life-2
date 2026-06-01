/*
 * Назначение: Контроллер добавления в сравнение (Compare Toast Controller)
 * Реализует перехват событий добавления/удаления из сравнения с вызовом Toasts.
 * Использует делегирование событий для поддержки AJAX-элементов.
 */

import { Toast } from "./toast.js";

/**
 * Инициализирует контроллер сравнения.
 * Навешивает глобальный обработчик на клики по весам на всех страницах.
 */
export function initCompareToastController() {
  // Флаг предотвращения повторной инициализации
  if (window.__compareToastControllerInitialized) return;
  window.__compareToastControllerInitialized = true;

  // 1. Делегирование кликов для кнопок-весов в карточках товара (каталог)
  document.addEventListener("click", (e) => {
    const cardCompareBtn = e.target.closest(".product-card__action-btn");
    if (cardCompareBtn) {
      const compareImg = cardCompareBtn.querySelector("img[src*='compare']");
      if (compareImg) {
        handleCompareToggle(cardCompareBtn, compareImg);
        return;
      }
    }
  });

  // 2. Делегирование изменений для чекбоксов сравнения (детальная страница товара)
  document.addEventListener("change", (e) => {
    const compareCheckbox = e.target.closest(".product-hero__compare-badge .checkbox__input");
    if (compareCheckbox) {
      handleCheckboxCompareToggle(compareCheckbox);
      return;
    }
  });
}

/**
 * Вспомогательная функция переключения состояния весов и вызова тоста
 * @param {HTMLElement} btnElement - Кнопка
 * @param {HTMLImageElement} imgElement - Картинка внутри кнопки
 */
function handleCompareToggle(btnElement, imgElement) {
  const currentSrc = imgElement.src;
  const isFilled = currentSrc.includes("compare-fill.svg");

  if (isFilled) {
    // Деактивируем весы (убираем из сравнения)
    imgElement.src = currentSrc.replace("compare-fill.svg", "compare.svg");
    btnElement.classList.remove("is-active");
    
    Toast.show({
      message: "Товар удалён из сравнения",
      type: "remove",
      duration: 3000
    });
  } else {
    // Активируем весы (добавляем в сравнение)
    imgElement.src = currentSrc.replace("compare.svg", "compare-fill.svg");
    btnElement.classList.add("is-active");

    Toast.show({
      message: "Товар добавлен в сравнение",
      type: "success",
      duration: 3000
    });
  }
}

/**
 * Вспомогательная функция для обработки изменения состояния чекбокса сравнения на детальной странице товара
 * @param {HTMLInputElement} checkboxElement - Элемент чекбокса
 */
function handleCheckboxCompareToggle(checkboxElement) {
  if (checkboxElement.checked) {
    Toast.show({
      message: "Товар добавлен в сравнение",
      type: "success",
      duration: 3000
    });
  } else {
    Toast.show({
      message: "Товар удалён из сравнения",
      type: "remove",
      duration: 3000
    });
  }
}


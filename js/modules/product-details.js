/*
 * Назначение файла: Интерактивный функционал детальной страницы товара Harvia
 * (Переключение вкладок описания, переключение категорий каруселей, прокрутка слайдера)
 */

export function initProductDetails() {
  // 1. Вкладки описания товара (Описание, Характеристики, Отзывы и т.д.)
  // Перенаправляем вызов legacy-функции switchTab на клик по новому триггеру
  window.switchTab = function (tabId) {
    const trigger = document.querySelector(
      `.product-tabs__trigger[data-tab-trigger="${tabId}"], .sl-tabs__trigger[data-tab-trigger="${tabId}"]`
    );
    if (trigger) {
      trigger.dispatchEvent(new Event("click"));
      // Плавный скролл к вкладкам
      const container = trigger.closest(".product-tabs, .sl-tabs");
      if (container) {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // 2. Вкладки каруселей со слайдерами (Покупают вместе / Вы смотрели и т.д.)
  window.switchProdTab = function (btn, tabId) {
    const section = btn.closest(".products-section");
    if (!section) {
      const tabs = btn.parentElement.querySelectorAll(".btn-tab");
      tabs.forEach((t) => t.classList.remove("btn-tab--active"));
      btn.classList.add("btn-tab--active");
      return;
    }
    const tabs = section.querySelectorAll(".btn-tab");
    tabs.forEach((t) => t.classList.remove("btn-tab--active"));
    btn.classList.add("btn-tab--active");
  };

  // 3. Прокрутка слайдеров кнопками-стрелками
  const sliders = document.querySelectorAll(
    ".products-section__slider-wrapper",
  );
  sliders.forEach((wrapper) => {
    const slider = wrapper.querySelector(".products-section__slider");
    const prevBtn = wrapper.querySelector(".slider-arrow--prev");
    const nextBtn = wrapper.querySelector(".slider-arrow--next");

    if (prevBtn && nextBtn && slider) {
      const scrollAmount = 300; // Примерная ширина карточки товара

      prevBtn.addEventListener("click", () => {
        slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });

      nextBtn.addEventListener("click", () => {
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    }
  });
}

/*
 * Назначение: Переключение вкладок описания товара и категорий каруселей
 */

export function initProductTabs() {
  // 1. Вкладки описания товара (Описание, Характеристики, Отзывы и т.д.)
  // Перенаправляем вызов legacy-функции switchTab на клик по новому триггеру
  window.switchTab = function (tabId) {
    const trigger = document.querySelector(
      `.product-tabs__trigger[data-tab-trigger="${tabId}"], .sl-tabs__trigger[data-tab-trigger="${tabId}"]`
    );
    if (trigger) {
      trigger.dispatchEvent(new Event("click"));
      // Плавный скролл к вкладкам, чтобы пользователь не потерялся
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
}

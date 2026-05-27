/*
 * Назначение файла: Интерактивный функционал детальной страницы товара Harvia (Product page specific)
 * (Переключение вкладок описания, переключение категорий каруселей, прокрутка слайдера)
 */

export function initProductDetails() {
  window.switchTab = function (tabId) {
    const trigger = document.querySelector(
      `.product-tabs__trigger[data-tab-trigger="${tabId}"], .sl-tabs__trigger[data-tab-trigger="${tabId}"]`
    );
    if (trigger) {
      trigger.dispatchEvent(new Event("click"));
      const container = trigger.closest(".product-tabs, .sl-tabs");
      if (container) {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

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

  const sliders = document.querySelectorAll(
    ".products-section__slider-wrapper",
  );
  sliders.forEach((wrapper) => {
    const slider = wrapper.querySelector(".products-section__slider");
    const prevBtn = wrapper.querySelector(".slider-arrow--prev");
    const nextBtn = wrapper.querySelector(".slider-arrow--next");

    if (prevBtn && nextBtn && slider) {
      const scrollAmount = 300;

      prevBtn.addEventListener("click", () => {
        slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });

      nextBtn.addEventListener("click", () => {
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    }
  });
}

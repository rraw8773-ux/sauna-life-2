/*
 * Назначение: Инициализация кнопок прокрутки горизонтальных слайдеров
 */

export function initProductSlider() {
  const sliders = document.querySelectorAll(
    ".products-section__slider-wrapper",
  );
  
  sliders.forEach((wrapper) => {
    const slider = wrapper.querySelector(".products-section__slider");
    const prevBtn = wrapper.querySelector(".slider-arrow--prev");
    const nextBtn = wrapper.querySelector(".slider-arrow--next");

    if (prevBtn && nextBtn && slider) {
      const scrollAmount = 300; // Примерная ширина карточки товара для сдвига

      prevBtn.addEventListener("click", () => {
        slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });

      nextBtn.addEventListener("click", () => {
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    }
  });
}

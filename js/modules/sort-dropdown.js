/*
 * Назначение файла: Кастомный дропдаун сортировки каталога
 */

export function initSortDropdown() {
  const wrapper = document.getElementById("sort-dropdown");
  if (!wrapper) return;

  const trigger = wrapper.querySelector(".catalog__sort-trigger");
  const valueEl = wrapper.querySelector(".catalog__sort-value");
  const iconEl = wrapper.querySelector(".catalog__sort-icon");
  const list = wrapper.querySelector(".catalog__sort-list");
  const options = wrapper.querySelectorAll(".catalog__sort-option");

  // Открыть / закрыть по клику на весь wrapper
  wrapper.addEventListener("click", (e) => {
    // Если кликнули по опции — не переключать dropdown (это обработает другой listener)
    if (e.target.closest(".catalog__sort-option")) return;

    const isOpen = wrapper.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", isOpen);
  });

  // Выбрать опцию
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();

      // Снять выделение с предыдущей
      options.forEach((o) => {
        o.classList.remove("catalog__sort-option--selected");
        o.setAttribute("aria-selected", "false");
      });

      // Выделить выбранную
      option.classList.add("catalog__sort-option--selected");
      option.setAttribute("aria-selected", "true");

      // Обновить текст кнопки
      valueEl.textContent = option.textContent.trim();

      // Сменить иконку если указана
      const newIcon = option.dataset.icon;
      if (newIcon && iconEl) {
        iconEl.src = newIcon;
      }

      // Закрыть дропдаун
      wrapper.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    });
  });

  // Закрыть при клике вне
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });

  // Закрыть по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      wrapper.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });
}

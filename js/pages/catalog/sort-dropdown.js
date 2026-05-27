/*
 * Назначение файла: Кастомный дропдаун сортировки каталога (Catalog page specific)
 */

export function initSortDropdown() {
  const wrapper = document.getElementById("sort-dropdown");
  if (!wrapper) return;

  const trigger = wrapper.querySelector(".catalog__sort-trigger");
  const valueEl = wrapper.querySelector(".catalog__sort-value");
  const iconEl = wrapper.querySelector(".catalog__sort-icon");
  const options = wrapper.querySelectorAll(".catalog__sort-option");

  wrapper.addEventListener("click", (e) => {
    if (e.target.closest(".catalog__sort-option")) return;

    const isOpen = wrapper.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", isOpen);
  });

  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();

      options.forEach((o) => {
        o.classList.remove("catalog__sort-option--selected");
        o.setAttribute("aria-selected", "false");
      });

      option.classList.add("catalog__sort-option--selected");
      option.setAttribute("aria-selected", "true");

      valueEl.textContent = option.textContent.trim();

      const newIcon = option.dataset.icon;
      if (newIcon && iconEl) {
        iconEl.src = newIcon;
      }

      wrapper.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      wrapper.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });
}

/*
 * Назначение файла: Кастомный дропдаун сортировки каталога (Catalog page specific)
 */

export function initSortDropdown() {
  const wrapper = document.getElementById("sort-dropdown");
  if (!wrapper) return;

  const trigger = wrapper.querySelector(".custom-dropdown__trigger, .catalog__sort-trigger");
  const valueEl = wrapper.querySelector(".custom-dropdown__value, .catalog__sort-value");
  const iconEl = wrapper.querySelector(".custom-dropdown__icon, .catalog__sort-icon");
  const options = wrapper.querySelectorAll(".custom-dropdown__option, .catalog__sort-option");

  wrapper.addEventListener("click", (e) => {
    if (e.target.closest(".custom-dropdown__option, .catalog__sort-option")) return;

    const isOpen = wrapper.classList.toggle("is-open");
    if (trigger) {
      trigger.setAttribute("aria-expanded", isOpen);
    }
  });

  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();

      options.forEach((o) => {
        o.classList.remove("custom-dropdown__option--selected", "catalog__sort-option--selected");
        o.setAttribute("aria-selected", "false");
      });

      option.classList.add(
        option.classList.contains("custom-dropdown__option")
          ? "custom-dropdown__option--selected"
          : "catalog__sort-option--selected"
      );
      option.setAttribute("aria-selected", "true");

      if (valueEl) {
        valueEl.textContent = option.textContent.trim();
      }

      const newIcon = option.dataset.icon;
      if (newIcon && iconEl) {
        iconEl.src = newIcon;
      }

      wrapper.classList.remove("is-open");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove("is-open");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      wrapper.classList.remove("is-open");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    }
  });
}

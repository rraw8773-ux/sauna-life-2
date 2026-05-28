/*
 * Назначение: Модуль для управления кастомными выпадающими списками (Custom Dropdowns)
 * Обеспечивает универсальное поведение, поддержку клавиатуры, доступность (ARIA)
 */

export function initCustomDropdown() {
  const dropdowns = document.querySelectorAll(".custom-dropdown");
  if (dropdowns.length === 0) return;

  dropdowns.forEach((dropdown) => {
    // Предотвращаем повторную инициализацию
    if (dropdown.dataset.initialized) return;
    dropdown.dataset.initialized = "true";

    const trigger = dropdown.querySelector(".custom-dropdown__trigger");
    const valueEl = dropdown.querySelector(".custom-dropdown__value");
    const iconEl = dropdown.querySelector(".custom-dropdown__icon");
    const options = dropdown.querySelectorAll(".custom-dropdown__option");

    // Синхронизируем выбранную опцию по умолчанию, если она задана в HTML
    const defaultSelected = dropdown.querySelector(
      ".custom-dropdown__option--selected",
    );
    if (defaultSelected && valueEl) {
      const defaultText = defaultSelected.querySelector(
        ".custom-dropdown__option-text",
      )
        ? defaultSelected
            .querySelector(".custom-dropdown__option-text")
            .textContent.trim()
        : defaultSelected.textContent.trim();
      valueEl.textContent = defaultText;
    }

    // Открытие/закрытие списка
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", isOpen);

      // Закрываем все остальные открытые кастомные выпадающие списки
      document.querySelectorAll(".custom-dropdown").forEach((other) => {
        if (other !== dropdown) {
          other.classList.remove("is-open");
          const otherTrigger = other.querySelector(".custom-dropdown__trigger");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Обработка клика по опциям
    options.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();

        // Одиночный выбор элемента
        options.forEach((opt) => {
          opt.classList.remove("custom-dropdown__option--selected");
          opt.setAttribute("aria-selected", "false");
        });

        option.classList.add("custom-dropdown__option--selected");
        option.setAttribute("aria-selected", "true");

        const optionText = option.querySelector(".custom-dropdown__option-text")
          ? option
              .querySelector(".custom-dropdown__option-text")
              .textContent.trim()
          : option.textContent.trim();

        if (valueEl) {
          valueEl.textContent = optionText;
        }

        // Если есть иконка у опции, обновляем ее на триггере
        const optionIcon = option.dataset.icon;
        if (optionIcon && iconEl) {
          iconEl.src = optionIcon;
        }

        // Закрываем список после выбора
        dropdown.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      });
    });

    // Закрытие при клике по любому месту документа
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    // Закрытие по нажатию клавиши Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        dropdown.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  });
}

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
    const defaultSelected = dropdown.querySelector(".custom-dropdown__option--selected");
    if (defaultSelected && valueEl) {
      const defaultText = defaultSelected.querySelector(".custom-dropdown__option-text")
        ? defaultSelected.querySelector(".custom-dropdown__option-text").textContent.trim()
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
          ? option.querySelector(".custom-dropdown__option-text").textContent.trim()
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

/* ==========================================================================
   КОД ЛЕГАСИ-ИНТЕГРАЦИИ И СИНХРОНИЗАЦИИ (ЗАКОММЕНТИРОВАН ПО ЗАПРОСУ)
   ==========================================================================

export function initCustomDropdownLegacy() {
  const dropdowns = document.querySelectorAll(".custom-dropdown");
  if (dropdowns.length === 0) return;

  dropdowns.forEach((dropdown) => {
    if (dropdown.dataset.initialized) return;
    dropdown.dataset.initialized = "true";

    const trigger = dropdown.querySelector(".custom-dropdown__trigger");
    const valueEl = dropdown.querySelector(".custom-dropdown__value");
    const iconEl = dropdown.querySelector(".custom-dropdown__icon");
    const options = dropdown.querySelectorAll(".custom-dropdown__option");
    
    const isMultiple = dropdown.classList.contains("custom-dropdown--multiple");
    const isStones = dropdown.classList.contains("custom-dropdown--stones");

    // Функция синхронизации состояния дропдауна с реальными скрытыми радио-инпутами
    function syncStonesState() {
      if (!isStones) return;
      const checkedInput = document.querySelector('.stones-card input[type="radio"].checked');
      
      if (checkedInput) {
        const val = checkedInput.value;
        const matchingOption = dropdown.querySelector(`.custom-dropdown__option[data-value="${val}"]`);
        
        options.forEach((opt) => {
          opt.classList.remove("custom-dropdown__option--selected");
          opt.setAttribute("aria-selected", "false");
        });

        if (matchingOption) {
          matchingOption.classList.add("custom-dropdown__option--selected");
          matchingOption.setAttribute("aria-selected", "true");
          const text = matchingOption.querySelector(".custom-dropdown__option-text").textContent.trim();
          if (valueEl) valueEl.textContent = text;
        }
      } else {
        options.forEach((opt) => {
          opt.classList.remove("custom-dropdown__option--selected");
          opt.setAttribute("aria-selected", "false");
        });
        if (valueEl) valueEl.textContent = "Выбрать";
      }
    }

    // Первичная синхронизация при загрузке
    if (isStones) {
      setTimeout(syncStonesState, 50);
      
      const radios = document.querySelectorAll('.stones-card input[type="radio"]');
      radios.forEach((radio) => {
        radio.addEventListener("change", () => {
          setTimeout(syncStonesState, 0);
        });
        radio.addEventListener("click", () => {
          setTimeout(syncStonesState, 0);
        });
      });
    } else {
      const defaultSelected = dropdown.querySelector(".custom-dropdown__option--selected");
      if (defaultSelected && valueEl) {
        valueEl.textContent = defaultSelected.textContent.trim();
      }
    }

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", isOpen);

      document.querySelectorAll(".custom-dropdown").forEach((other) => {
        if (other !== dropdown) {
          other.classList.remove("is-open");
          const otherTrigger = other.querySelector(".custom-dropdown__trigger");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        }
      });
    });

    options.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();

        if (isMultiple) {
          const isSelected = option.classList.toggle("custom-dropdown__option--selected");
          option.setAttribute("aria-selected", isSelected ? "true" : "false");
        } else {
          if (isStones) {
            const val = option.dataset.value;
            const targetInput = document.querySelector(`.stones-card input[value="${val}"]`);
            if (targetInput) {
              targetInput.click();
            }
          } else {
            options.forEach((opt) => {
              opt.classList.remove("custom-dropdown__option--selected");
              opt.setAttribute("aria-selected", "false");
            });

            option.classList.add("custom-dropdown__option--selected");
            option.setAttribute("aria-selected", "true");

            const optionText = option.querySelector(".custom-dropdown__option-text")
              ? option.querySelector(".custom-dropdown__option-text").textContent.trim()
              : option.textContent.trim();

            if (valueEl) {
              valueEl.textContent = optionText;
            }

            const optionIcon = option.dataset.icon;
            if (optionIcon && iconEl) {
              iconEl.src = optionIcon;
            }
          }

          dropdown.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        dropdown.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  });
}
*/

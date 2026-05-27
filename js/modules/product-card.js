/**
 * Назначение файла: логика компонентов карточки товара.
 * Включает в себя:
 * - Утилиты (форматирование и парсинг цен)
 * - Логика раскрытия характеристик (SpecsToggle)
 * - Логика выпадающих списков (Dropdown)
 * - Логика счетчика и пересчета итоговых цен (ProductCard)
 */

const Utils = {
  parsePrice(value) {
    if (value === null || value === undefined) return 0;
    const normalized = String(value)
      .replace(/\s+/g, "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  },

  formatPrice(value) {
    const rounded = Math.max(0, Math.round(value));
    return `${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
  },

  clampToInt(value, min = 0) {
    const parsed = Number.parseInt(String(value), 10);
    return Number.isFinite(parsed) ? Math.max(min, parsed) : min;
  },
};

class SpecsToggle {
  constructor(element) {
    this.root = element;
    this.items = this.root.querySelectorAll(".product-card-specs__item");
    this.moreBtn = this.root.querySelector(".product-card__more");
    this.textTarget = this.moreBtn?.querySelector(".product-card__more-text");

    this.init();
  }

  init() {
    if (!this.moreBtn) return;

    if (this.items.length <= 2) {
      this.moreBtn.style.display = "none";
      return;
    }

    this.moreBtn.addEventListener("click", () => this.toggle());
  }

  toggle() {
    this.root.classList.toggle("is-expanded");
    const isExpanded = this.root.classList.contains("is-expanded");

    if (this.textTarget) {
      this.textTarget.textContent = isExpanded ? "Свернуть" : "Показать ещё";
    }
  }
}

class DropdownManager {
  constructor() {
    this.activeDropdown = null;
    this.bindEvents();
  }

  open(dropdown) {
    if (this.activeDropdown && this.activeDropdown !== dropdown) {
      this.activeDropdown.close();
    }
    this.activeDropdown = dropdown;
  }

  closeActive() {
    if (this.activeDropdown) {
      this.activeDropdown.close();
      this.activeDropdown = null;
    }
  }

  bindEvents() {
    document.addEventListener("click", (event) => {
      if (!this.activeDropdown) return;
      if (this.activeDropdown.root.contains(event.target)) return;
      this.closeActive();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.closeActive();
    });
  }
}

const globalDropdownManager = new DropdownManager();

class Dropdown {
  constructor(element, manager) {
    this.root = element;
    this.manager = manager;
    this.trigger = this.root.querySelector(".product-card-dropdown__trigger, .product-hero__dropdown-trigger");
    this.options = this.root.querySelectorAll(".product-card-dropdown__option, .product-hero__dropdown-option");
    this.menu = this.root.querySelector(".product-card-dropdown__menu, .product-hero__dropdown-menu");
    this.isOpen = false;

    this.init();
  }

  init() {
    if (!this.trigger || !this.menu || this.options.length === 0) return;

    this.valueEl = this.trigger.querySelector(".product-card-dropdown__value, .product-hero__dropdown-value");
    if (!this.valueEl) {
      this.valueEl = this.trigger.querySelector("span");
      if (this.valueEl) {
        const isHero = this.root.classList.contains("product-hero__dropdown");
        this.valueEl.classList.add(isHero ? "product-hero__dropdown-value" : "product-card-dropdown__value");
      }
    }

    if (!this.menu.id) {
      this.menu.id = `pc-dropdown-${Math.random().toString(36).substring(2, 11)}`;
    }

    this.trigger.setAttribute("aria-controls", this.menu.id);
    this.trigger.setAttribute("aria-expanded", "false");

    this.trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    this.options.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.selectOption(option);
      });
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.manager.open(this);
    this.root.classList.add("is-open");
    this.trigger.setAttribute("aria-expanded", "true");
    this.isOpen = true;
  }

  close() {
    this.root.classList.remove("is-open");
    this.trigger.setAttribute("aria-expanded", "false");
    this.isOpen = false;
  }

  selectOption(option) {
    this.options.forEach((node) => node.classList.remove("is-selected"));
    option.classList.add("is-selected");

    const displayText = option.textContent.trim();
    const selectedValue = option.dataset.value || displayText;
    if (this.valueEl) this.valueEl.textContent = displayText;

    this.root.dispatchEvent(
      new CustomEvent("pc:dropdown-change", {
        bubbles: true,
        detail: { value: selectedValue, text: displayText },
      }),
    );

    this.close();
  }
}

class ProductCard {
  constructor(element) {
    this.root = element;
    this.priceRows = this.root.querySelectorAll(".product-card-price-row");
    this.totalPriceEl = this.root.querySelector(
      ".product-card__footer .product-card__price",
    );
    this.totalOldPriceEl = this.root.querySelector(
      ".product-card__footer .product-card__price-old",
    );

    this.init();
  }

  init() {
    if (this.priceRows.length === 0) return;

    this.priceRows.forEach((row) => {
      const counter = row.querySelector(".product-card-counter");
      if (!counter) return;

      const input = counter.querySelector(".product-card-counter__input");
      const decBtn = counter.querySelector(".product-card-counter__btn--dec");
      const incBtn = counter.querySelector(".product-card-counter__btn--inc");

      if (!input || !decBtn || !incBtn) return;

      // this.initCounter(input, decBtn, incBtn);
    });

    this.recalculateTotals();
  }

  initCounter(input, decBtn, incBtn) {
    const applyQuantity = (nextValue) => {
      const quantity = Utils.clampToInt(nextValue, 0);
      input.value = String(quantity);
      this.updateDecrementButtonState(decBtn, quantity);
      this.recalculateTotals();
    };

    applyQuantity(input.value);

    incBtn.addEventListener("click", () => {
      applyQuantity(Utils.clampToInt(input.value, 0) + 1);
    });

    decBtn.addEventListener("click", () => {
      const current = Utils.clampToInt(input.value, 0);
      if (current <= 0) return;
      if (current === 1) {
        applyQuantity(0);
        return;
      }
      applyQuantity(current - 1);
    });

    const updateFromInput = () => applyQuantity(input.value);
    input.addEventListener("input", updateFromInput);
    input.addEventListener("blur", updateFromInput);
  }

  updateDecrementButtonState(button, quantity) {
    button.className =
      "product-card-counter__btn product-card-counter__btn--dec";

    if (quantity <= 0) {
      button.classList.add("is-hidden");
      button.textContent = "−";
      button.setAttribute("aria-label", "Уменьшить количество");
    } else if (quantity === 1) {
      button.classList.add("is-cart");
      button.textContent = "";
      button.setAttribute("aria-label", "Сбросить количество");
    } else {
      button.classList.add("is-minus");
      button.textContent = "−";
      button.setAttribute("aria-label", "Уменьшить количество");
    }
  }

  recalculateTotals() {
    let total = 0;
    let oldTotal = 0;

    this.priceRows.forEach((row) => {
      const input = row.querySelector(".product-card-counter__input");
      const quantity = input ? Utils.clampToInt(input.value, 0) : 0;

      const priceEl = row.querySelector(".product-card-price-row__price");
      const oldPriceEl = row.querySelector(
        ".product-card-price-row__old-price",
      );

      const unitPrice = priceEl ? Utils.parsePrice(priceEl.textContent) : 0;
      const unitOldPrice = oldPriceEl
        ? Utils.parsePrice(oldPriceEl.textContent)
        : 0;

      total += quantity * unitPrice;
      oldTotal += quantity * unitOldPrice;
    });

    if (this.totalPriceEl) {
      this.totalPriceEl.textContent = Utils.formatPrice(total);
    }

    if (this.totalOldPriceEl) {
      const showOld = total > 0 && oldTotal > 0;
      this.totalOldPriceEl.classList.toggle("is-hidden", !showOld);
      if (showOld) {
        this.totalOldPriceEl.textContent = Utils.formatPrice(oldTotal);
      }
    }
  }
}

const isScopeNode = (value) =>
  value instanceof Document || value instanceof Element;

const getScope = (root) => (isScopeNode(root) ? root : document);

export const initProductCards = (root = document) => {
  const scope = getScope(root);

  scope.querySelectorAll(".product-card__specs").forEach((el) => {
    if (el.dataset.pcSpecsReady === "true") {
      return;
    }

    el.dataset.pcSpecsReady = "true";
    new SpecsToggle(el);
  });

  scope
    .querySelectorAll(".product-card-dropdown, .product-hero__dropdown")
    .forEach((el) => {
      if (el.dataset.pcDropdownReady === "true") {
        return;
      }

      el.dataset.pcDropdownReady = "true";
      new Dropdown(el, globalDropdownManager);
    });

  scope.querySelectorAll(".product-card").forEach((el) => {
    if (el.dataset.pcCardReady === "true") {
      return;
    }

    el.dataset.pcCardReady = "true";
    new ProductCard(el);
  });
};

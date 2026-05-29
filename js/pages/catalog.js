/*
 * Назначение: Главная точка входа для JavaScript страницы каталога (Catalog Page JS)
 * Собирает глобальные и локальные ES-модули и запускает их при DOMContentLoaded
 */

// Глобальные модули общего интерфейса
import { initStickyHeader } from "../modules/sticky-header.js";
import { initOffcanvas } from "../modules/offcanvas.js";
import { initMobileMenu } from "../modules/mobile-menu.js";
import { initMobileCatalogMenu } from "../modules/mobile-catalog-menu.js";
import { initCatalogModal } from "../modules/catalog-modal.js";

// Глобальные переиспользуемые модули (DRY)
import { initCustomDropdown } from "../modules/custom-dropdown.js";
import { initProductCards } from "../modules/product-card.js";
import { initProductsWidget } from "../modules/products-widget.js";
import { initSliders } from "../modules/sliders.js";
import { initFavoritesToastController } from "../modules/favorites-toast-controller.js";

// Локальные страничные модули каталога
import { initFiltersMore } from "./catalog/filters-more.js";
import { initPromoMover } from "./catalog/promo-mover.js";
import { initPromoTimer } from "./catalog/promo-timer.js";
import { initRangeSliders } from "./catalog/range-sliders.js";
import { initSortDropdown } from "./catalog/sort-dropdown.js";
import { initStickySidebar } from "./catalog/sticky-sidebar.js";
import { initViewToggle } from "./catalog/view-toggle.js";
import { initTags } from "./catalog/tags.js";

const hasMatch = (root, selector) =>
  Boolean(root?.matches?.(selector) || root?.querySelector?.(selector));

document.addEventListener("DOMContentLoaded", () => {
  // Запуск глобальных модулей общего интерфейса
  if (document.querySelector(".header")) {
    initStickyHeader();
  }

  if (document.querySelector(".offcanvas")) {
    initOffcanvas();
  }

  if (document.getElementById("burger-btn")) {
    initMobileMenu();
  }

  if (document.getElementById("mobile-catalog-btn")) {
    initMobileCatalogMenu();
  }

  if (document.getElementById("catalog-btn")) {
    initCatalogModal();
  }

  // Запуск общего функционала
  initCustomDropdown();
  initProductCards();
  initProductsWidget();
  initFavoritesToastController();

  if (document.querySelector(".js-product-card-slider")) {
    initSliders();
  }

  // Синхронизация опций карточек товара (Размер, Цвет) с их локальной галереей слайдера и ценой
  document.addEventListener("pc:dropdown-change", (e) => {
    const card = e.target.closest(".product-card");
    if (!card) return;

    // 1. Запуск пересчета цены для карточки через адаптированную calcCatPrice
    const selectedOption = e.target.closest(".product-card-dropdown")?.querySelector(".product-card-dropdown__option.is-selected");
    if (selectedOption && typeof window.calcCatPrice === "function") {
      window.calcCatPrice(selectedOption);
    }

    // 2. Синхронизация слайдов галереи с выбранными спецификациями
    syncCardGallery(card);
  });

  function syncCardGallery(card) {
    const $slider = $(card).find(".js-product-card-slider");
    if (!$slider.length || !$slider.hasClass("slick-initialized")) return;

    // Сбор текущих выбранных опций карточки
    const activeSpecs = {};
    $(card).find(".product-card-field").each(function () {
      const $field = $(this);
      const label = $field.find(".product-card-field__label").text().trim().toLowerCase();
      const selectedOption = $field.find(".product-card-dropdown__option.is-selected");
      
      if (selectedOption.length) {
        const val = String(selectedOption.attr("data-value") || selectedOption.text().trim()).toLowerCase().trim();
        const text = selectedOption.text().trim().toLowerCase();

        if (label.includes("цвет") || label.includes("дерево") || label.includes("материал")) {
          activeSpecs.color = { val: val, text: text };
        } else if (label.includes("размер")) {
          activeSpecs.size = { val: val, text: text };
        }
      }
    });

    let bestSlideIndex = -1;
    let highestScore = -1;

    // Извлекаем только оригинальные слайды (без slick-cloned)
    const $slides = $slider.find(".product-card__slide").not(".slick-cloned, .slick-cloned *");

    $slides.each(function (index) {
      const $slide = $(this);
      const $img = $slide.find("img");

      const slideColor = String($slide.attr("data-color") || $slide.attr("data-option-value") || $img.attr("data-color") || $img.attr("data-option-value") || "").toLowerCase().trim();
      const slideSize = String($slide.attr("data-size") || $img.attr("data-size") || "").toLowerCase().trim();

      const imgTitle = ($img.attr("title") || "").toLowerCase();
      const imgAlt = ($img.attr("alt") || "").toLowerCase();

      let isDisqualified = false;
      let score = 0;

      // Оценка по ЦВЕТУ
      if (slideColor) {
        if (activeSpecs.color) {
          if (slideColor === activeSpecs.color.val || slideColor === activeSpecs.color.text) {
            score += 10;
          } else {
            isDisqualified = true;
          }
        } else {
          isDisqualified = true;
        }
      }

      // Оценка по РАЗМЕРУ
      if (slideSize) {
        if (activeSpecs.size) {
          if (slideSize === activeSpecs.size.val || slideSize === activeSpecs.size.text) {
            score += 5;
          } else {
            isDisqualified = true;
          }
        } else {
          isDisqualified = true;
        }
      }

      // Оценка по вхождению подстроки в alt/title (текстовый фолбек)
      let textScore = 0;
      if (score === 0 && !isDisqualified) {
        if (activeSpecs.color) {
          const cText = activeSpecs.color.text;
          if (cText && (imgTitle.includes(cText) || imgAlt.includes(cText))) {
            textScore += 2;
          }
        }
        if (activeSpecs.size) {
          const sText = activeSpecs.size.text;
          if (sText && (imgTitle.includes(sText) || imgAlt.includes(sText))) {
            textScore += 1;
          }
        }
      }

      const finalScore = score > 0 ? score : textScore;

      if (!isDisqualified && finalScore > highestScore) {
        highestScore = finalScore;
        bestSlideIndex = index;
      }
    });

    if (bestSlideIndex !== -1 && highestScore >= 0) {
      $slider.slick("slickGoTo", bestSlideIndex);
    }
  }

  // Поддержка динамически добавляемых элементов в DOM (фильтрация, пагинация)
  document.addEventListener("catalog:products-appended", (event) => {
    const root = event.detail?.root instanceof Element ? event.detail.root : document;

    if (hasMatch(root, ".js-product-card-slider")) {
      initSliders(root);
    }

    if (hasMatch(root, ".product-card")) {
      initProductCards(root);
    }
  });

  // Запуск локального функционала страницы каталога
  if (document.querySelector(".filters__more")) {
    initFiltersMore();
  }

  if (document.querySelector(".promo-block")) {
    initPromoMover();
    initPromoTimer();
  }

  if (document.querySelector(".filters")) {
    initRangeSliders();
    initStickySidebar();
  }

  if (document.getElementById("sort-dropdown")) {
    initSortDropdown();
  }

  if (document.querySelector(".catalog__view-toggle")) {
    initViewToggle();
  }

  if (document.querySelector(".tags")) {
    initTags();
  }

  // Всплывающие тултипы валидации количества для кнопок "В корзину" в каталоге (Event Delegation)
  let activeTooltipTimeout = null;
  let activeTooltip = null;

  // 1. Обработка клика по кнопке "В корзину" в фазе перехвата (capture phase)
  // Это необходимо, чтобы перехватить событие ДО того, как jQuery-обработчик на body вернет false (stopPropagation)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".product-card__buy-btn.addtocart");
    if (btn) {
      const container = btn.closest(".card-main_buttons");
      if (!container) return;

      const form = btn.closest("form");
      if (!form) return;

      const quantityInputs = form.querySelectorAll(".quantity-input.need-calc");
      if (quantityInputs.length > 0) {
        const hasPositiveQty = Array.from(quantityInputs).some((input) => (parseInt(input.value, 10) || 0) > 0);
        if (!hasPositiveQty) {
          // Полностью останавливаем событие на этапе погружения
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Получаем или динамически создаем тултип, если его нет в разметке карточки
          let tooltip = container.querySelector(".cart-tooltip");
          if (!tooltip) {
            tooltip = document.createElement("div");
            tooltip.className = "cart-tooltip";
            tooltip.innerHTML = `
              <div class="cart-tooltip__inner">
                <div class="cart-tooltip__icon">
                  <img
                    src="./assets/icons/interfaces/info-circle.svg"
                    alt=""
                    width="14"
                    height="14"
                  />
                </div>
                <div class="cart-tooltip__text">
                  Укажите<br />необходимое кол-во
                </div>
              </div>
            `;
            container.appendChild(tooltip);
          }

          // Скрываем ранее открытый тултип, если он есть
          if (activeTooltip && activeTooltip !== tooltip) {
            activeTooltip.classList.remove("is-visible");
            clearTimeout(activeTooltipTimeout);
          }

          tooltip.classList.add("is-visible");
          activeTooltip = tooltip;

          clearTimeout(activeTooltipTimeout);
          activeTooltipTimeout = setTimeout(() => {
            tooltip.classList.remove("is-visible");
            if (activeTooltip === tooltip) {
              activeTooltip = null;
            }
          }, 3000);
        }
      }
    }
  }, true);

  // 2. Обработка клика по кнопкам изменения количества счетчика (+/-) (bubbling phase)
  document.addEventListener("click", (e) => {
    const counterBtn = e.target.closest(".product-card-counter__btn, .quantity-plus, .quantity-minus");
    if (counterBtn) {
      const container = counterBtn.closest(".card-main_buttons");
      if (container) {
        const tooltip = container.querySelector(".cart-tooltip");
        if (tooltip && tooltip.classList.contains("is-visible")) {
          // Даем микропаузу для обновления значения input в DOM
          setTimeout(() => {
            const form = counterBtn.closest("form");
            if (form) {
              const inputs = form.querySelectorAll(".quantity-input.need-calc");
              const hasPositiveQty = Array.from(inputs).some((input) => (parseInt(input.value, 10) || 0) > 0);
              if (hasPositiveQty) {
                tooltip.classList.remove("is-visible");
                if (activeTooltip === tooltip) {
                  clearTimeout(activeTooltipTimeout);
                  activeTooltip = null;
                }
              }
            }
          }, 10);
        }
      }
    }
  });

  // 3. Скрываем тултип при ручном изменении количества
  document.addEventListener("input", (e) => {
    if (e.target.matches(".quantity-input.need-calc")) {
      const container = e.target.closest(".card-main_buttons");
      if (container) {
        const tooltip = container.querySelector(".cart-tooltip");
        if (tooltip && tooltip.classList.contains("is-visible")) {
          const form = e.target.closest("form");
          if (form) {
            const inputs = form.querySelectorAll(".quantity-input.need-calc");
            const hasPositiveQty = Array.from(inputs).some((input) => (parseInt(input.value, 10) || 0) > 0);
            if (hasPositiveQty) {
              tooltip.classList.remove("is-visible");
              if (activeTooltip === tooltip) {
                clearTimeout(activeTooltipTimeout);
                activeTooltip = null;
              }
            }
          }
        }
      }
    }
  });
});

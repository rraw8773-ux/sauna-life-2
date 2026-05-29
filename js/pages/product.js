/*
 * Назначение: Главная точка входа для JavaScript детальной страницы товара (Product Page JS)
 * Собирает глобальные и локальные ES-модули и запускает их при DOMContentLoaded
 */

// Глобальные модули
import { initStickyHeader } from "../modules/sticky-header.js";
import { initOffcanvas } from "../modules/offcanvas.js";
import { initMobileMenu } from "../modules/mobile-menu.js";
import { initMobileCatalogMenu } from "../modules/mobile-catalog-menu.js";
import { initCatalogModal } from "../modules/catalog-modal.js";

// Глобальные переиспользуемые модули (DRY)
import { initTabs } from "../modules/tabs.js";
import { initCustomDropdown } from "../modules/custom-dropdown.js";
import { initProductCards } from "../modules/product-card.js";
import { initSliders } from "../modules/sliders.js";
import { initFavoritesToastController } from "../modules/favorites-toast-controller.js";

// Локальные страничные модули страницы товара
import { initProductTabs } from "./product/tabs.js";
import { initProductSlider } from "./product/slider.js";
import { initProductsWidget } from "../modules/products-widget.js";
import { initProductDetails } from "./product/product-details.js";
import { initProductGallery } from "./product/gallery.js";

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

  // Запуск локального функционала страницы товара
  initTabs();
  initCustomDropdown();
  initProductCards();
  initFavoritesToastController();
  initProductTabs();
  initProductSlider();
  initProductsWidget();
  initProductGallery();

  if (document.querySelector(".js-product-card-slider")) {
    initSliders();
  }

  if (
    document.querySelector(".products-section") ||
    document.querySelector(".product-tabs, .tabs-section")
  ) {
    initProductDetails();
  }


  // Интерактивный блок обратной связи (Как вам товар?) с эмоциями-частицами
  const feedbackContainer = document.querySelector(".product-feedback");
  const feedbackOptions = document.querySelectorAll(".product-feedback__option");
  const feedbackThankyou = document.querySelector(".product-feedback__thankyou");

  if (feedbackOptions.length > 0 && feedbackContainer) {
    let thankyouTimeout;

    // Списки эмодзи для каждой реакции
    const emojis = {
      excellent: ["✨", "🎉", "🌟", "🥳", "💛", "💥", "🤩", "👑"],
      good: ["👍", "❤️", "😊", "👏", "👌", "💙", "🥰", "🎈"],
      bad: ["😢", "💧", "💔", "😭", "😿", "🌧️", "💔", "👎"]
    };

    function spawnFeedbackParticles(type, containerRect, buttonRect) {
      // Вычисляем центр кнопки относительно контейнера обратной связи
      const spawnX = buttonRect.left - containerRect.left + buttonRect.width / 2;
      const spawnY = buttonRect.top - containerRect.top + buttonRect.height / 2;

      // Количество создаваемых частиц
      const count = type === "excellent" ? 20 : 12;
      const emojiPool = emojis[type] || ["✨"];

      for (let i = 0; i < count; i++) {
        const particle = document.createElement("span");
        particle.className = "feedback-particle";
        
        // Случайный эмодзи из пула
        particle.innerText = emojiPool[Math.floor(Math.random() * emojiPool.length)];

        // Случайные параметры анимации (быстрее и динамичнее!)
        let rot = (Math.random() * 360 - 180) + "deg"; // Полный оборот для зрелищности
        let duration = (0.5 + Math.random() * 0.4) + "s"; // Быстрее: от 0.5 до 0.9 секунд
        let size = (16 + Math.random() * 14) + "px"; // Крупнее
        let endScale = (0.3 + Math.random() * 0.5).toFixed(2);

        // Все анимации теперь взрываются из центра во все стороны (радиально)
        const angle = Math.random() * Math.PI * 2;
        let distance = 50;

        if (type === "excellent") {
          distance = 60 + Math.random() * 90; // Большой праздничный взрыв
        } else if (type === "good") {
          distance = 50 + Math.random() * 70; // Средний взрыв тепла
        } else if (type === "bad") {
          distance = 40 + Math.random() * 60; // Небольшой грустный всплеск
        }

        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        // Задаем CSS-переменные для Keyframes
        particle.style.setProperty("--tx", tx + "px");
        particle.style.setProperty("--ty", ty + "px");
        particle.style.setProperty("--rot", rot);
        particle.style.setProperty("--duration", duration);
        particle.style.setProperty("--size", size);
        particle.style.setProperty("--end-scale", endScale);

        // Устанавливаем координаты спауна
        particle.style.left = spawnX + "px";
        particle.style.top = spawnY + "px";

        feedbackContainer.appendChild(particle);

        // Удаляем частицу после окончания анимации
        setTimeout(() => {
          particle.remove();
        }, parseFloat(duration) * 1000);
      }
    }

    feedbackOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const type = option.getAttribute("data-feedback");

        // 1. Получаем геометрические параметры ДО изменения классов для избежания Forced Reflow
        const containerRect = feedbackContainer.getBoundingClientRect();
        const buttonRect = option.getBoundingClientRect();

        // 2. Анимация нажатия (выделение активного смайла)
        feedbackOptions.forEach((opt) => {
          opt.classList.remove("is-active");
          opt.classList.add("is-dimmed");
        });
        option.classList.add("is-active");
        option.classList.remove("is-dimmed");

        // 3. Взрыв эмоций/частиц
        spawnFeedbackParticles(type, containerRect, buttonRect);

        // 4. Появление и автоматическое скрытие всплывающего тултипа "Спасибо за ваш отзыв!"
        if (feedbackThankyou) {
          clearTimeout(thankyouTimeout);
          feedbackThankyou.classList.add("is-visible");
          
          thankyouTimeout = setTimeout(() => {
            feedbackThankyou.classList.remove("is-visible");
          }, 3500);
        }
      });
    });
  }

  // Копирование кода товара в буфер обмена с всплывашкой
  const codeValue = document.querySelector(".page-header__code-value");
  if (codeValue) {
    let tooltipTimeout;
    codeValue.addEventListener("click", () => {
      const code = codeValue.getAttribute("data-code") || codeValue.childNodes[0].nodeValue.trim();
      
      navigator.clipboard.writeText(code).then(() => {
        const tooltip = codeValue.querySelector(".page-header__code-tooltip");
        if (tooltip) {
          clearTimeout(tooltipTimeout);
          tooltip.classList.add("is-visible");
          tooltipTimeout = setTimeout(() => {
            tooltip.classList.remove("is-visible");
          }, 1500);
        }
      }).catch(err => {
        console.error("Не удалось скопировать код: ", err);
      });
    });
  }

  // Скролл к дополнительным товарам и активация нужной вкладки
  const scrollToWiresBtn = document.getElementById("scroll-to-wires");
  if (scrollToWiresBtn) {
    scrollToWiresBtn.addEventListener("click", (e) => {
      e.preventDefault();
      
      const targetSection = document.getElementById("products-widget");
      if (targetSection) {
        // Плавный скролл до секции
        const yOffset = -100; // Отступ для фиксированного хедера, если он есть
        const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        // Активация вкладки "Провода"
        const wiresTabTrigger = targetSection.querySelector('[data-tab-trigger="upsell-wires"]');
        if (wiresTabTrigger) {
          // Используем .click(), чтобы событие всплывало и отлавливалось jQuery ($(document).on('click'))
          wiresTabTrigger.click();
          
          // На всякий случай дублируем принудительное обновление слайдера
          if (typeof window.jQuery !== 'undefined') {
             setTimeout(() => {
               window.jQuery('.products-widget__slider.slick-initialized').slick('setPosition');
             }, 100);
          }
        }
      }
    });
  }

  // Функция скролла к вкладке и её активации
  function scrollToTab(tabId) {
    const targetSection = document.querySelector(".product-tabs");
    if (targetSection) {
      // Плавный скролл до секции
      const yOffset = -80; // Красивый отступ сверху
      const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      // Активация вкладки
      const tabTrigger = targetSection.querySelector(`[data-tab-trigger="${tabId}"]`);
      if (tabTrigger) {
        tabTrigger.click();
      }
    }
  }

  // Скролл к характеристикам при клике на "Все характеристики" (.spec-link)
  const specLink = document.querySelector(".spec-link");
  if (specLink) {
    specLink.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToTab("specs");
    });
  }

  // Скролл к вкладкам при клике на "Подробнее" в карточках доставки/оплаты в шапке товара
  const heroInfoLinks = document.querySelectorAll(".product-hero__info-link[data-tab-trigger]");
  heroInfoLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const tabId = link.getAttribute("data-tab-trigger");
      scrollToTab(tabId);
    });
  });

  // Синхронизация новых выпадающих списков (Размер, Цвет) со скрытыми инпутами формы заказа
  document.addEventListener("pc:dropdown-change", (e) => {
    const dropdown = e.target.closest(".product-card-dropdown, .product-hero__dropdown");
    if (!dropdown) return;

    const field = dropdown.closest(".product-field, .product-hero__field");
    if (!field) return;

    const labelEl = field.querySelector(".product-card-field__label, .product-hero__field-label");
    if (!labelEl) return;

    const labelText = labelEl.textContent.trim().toLowerCase();
    const selectedOption = dropdown.querySelector(".product-card-dropdown__option.is-selected, .product-hero__dropdown-option.is-selected");
    if (!selectedOption) return;

    const dataValue = selectedOption.getAttribute("data-value");

    if (labelText.includes("размер")) {
      const input = document.getElementById("size-hidden-input");
      if (input) {
        input.value = dataValue;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    } else if (labelText.includes("цвет")) {
      const input = document.getElementById("color-hidden-input");
      if (input) {
        input.value = dataValue;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  });

  // Синхронизация чекбоксов-аддонов (Добавьте к товару) в правой колонке купелей
  const isKupeliPage = window.location.href.includes("kupeli") || !!document.getElementById("size-hidden-input");
  
  if (isKupeliPage) {
    const addonsGroup = document.querySelector(".product-hero-group--addons");
    const addonsList = document.querySelector(".product-hero__addons-list");

    if (addonsGroup && addonsList) {
      const updateSelectedAddons = () => {
        addonsList.innerHTML = "";
        const checkedInputs = addonsGroup.querySelectorAll(".checkbox__input:checked");

        if (checkedInputs.length === 0) {
          addonsList.style.display = "none";
          return;
        }

        checkedInputs.forEach((input) => {
          const addonTitle = input.closest(".product-hero__addon").querySelector(".checkbox__text").textContent;
          // Извлекаем название и цену, например: "Установка и подключение (16 640 руб)" -> "Установка и подключение" и "16 640 ₽"
          let name = addonTitle.split("(")[0].trim();
          let price = "";
          
          const match = addonTitle.match(/\(([^)]+)\)/);
          if (match) {
            price = match[1].replace("руб", "₽").trim();
          }

          const addonHTML = `
            <div class="product-hero__addon-simple">
              <span class="product-hero__addon-simple-name">${name}</span>
              <span class="product-hero__addon-simple-price">
                <span class="product-hero__addon-simple-val">${price}</span>
              </span>
            </div>
          `;
          addonsList.insertAdjacentHTML("beforeend", addonHTML);
        });

        addonsList.style.display = "";
      };

      // Слушаем изменения на чекбоксах
      addonsGroup.addEventListener("change", updateSelectedAddons);
      
      // На всякий случай также ловим клики на сами блоки `.install-card` и `.chimney-card`
      addonsGroup.addEventListener("click", (e) => {
        if (e.target.closest(".product-hero__addon")) {
          // Даем микропаузу, чтобы состояние инпута успело обновиться
          setTimeout(updateSelectedAddons, 10);
        }
      });

      // Первичный запуск при инициализации страницы
      updateSelectedAddons();
    }
  }

  // Логика всплывающего тултипа для кнопки "В корзину" (при нулевом кол-ве)
  const addToCartBtn = document.querySelector(".product-hero__add-to-cart");
  const cartTooltip = document.getElementById("cart-tooltip");

  if (addToCartBtn && cartTooltip) {
    let tooltipTimeout;

    addToCartBtn.addEventListener("click", (e) => {
      const form = addToCartBtn.closest("form");
      if (form) {
        const needCalcInputs = form.querySelectorAll(".need-calc");
        let hasQuantity = false;

        needCalcInputs.forEach((input) => {
          if (parseInt(input.value, 10) > 0) {
            hasQuantity = true;
          }
        });

        if (!hasQuantity) {
          // Предотвращаем стандартную отправку и показываем тултип
          e.preventDefault();
          e.stopPropagation();

          clearTimeout(tooltipTimeout);
          cartTooltip.classList.add("is-visible");

          // Скрываем тултип через 3 секунды
          tooltipTimeout = setTimeout(() => {
            cartTooltip.classList.remove("is-visible");
          }, 3000);
        }
      }
    });

    // Скрываем тултип при изменении кол-ва на значение больше нуля (ввод текста)
    const quantityInputs = document.querySelectorAll(".need-calc");
    quantityInputs.forEach((input) => {
      input.addEventListener("input", () => {
        let hasQuantity = false;
        quantityInputs.forEach((inp) => {
          if (parseInt(inp.value, 10) > 0) {
            hasQuantity = true;
          }
        });

        if (hasQuantity) {
          clearTimeout(tooltipTimeout);
          cartTooltip.classList.remove("is-visible");
        }
      });
    });

    // Скрываем тултип при клике по кнопкам изменения кол-ва (+/-)
    const counterButtons = document.querySelectorAll(".product-hero__counter-btn");
    counterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setTimeout(() => {
          let hasQuantity = false;
          quantityInputs.forEach((inp) => {
            if (parseInt(inp.value, 10) > 0) {
              hasQuantity = true;
            }
          });

          if (hasQuantity) {
            clearTimeout(tooltipTimeout);
            cartTooltip.classList.remove("is-visible");
          }
        }, 10);
      });
    });
  }
});


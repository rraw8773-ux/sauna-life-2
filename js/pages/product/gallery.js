/**
 * Назначение: Инициализация галереи товара
 * Главный слайдер (Slick) + статическая пагинация с миниатюрами и стрелками.
 * Интеграция с Fancybox 3 с полной синхронизацией.
 *
 * Зависимости: jQuery, slick.min.js, jquery.fancybox.min.js
 */

jQuery(document).ready(function () {
  try {
    if (typeof jQuery.fn.slick === "undefined") {
      console.error("[SLICK] slick.min.js не загрузился.");
      return;
    }

    var $mainSlider = jQuery(".card-main_slick-one");
    var $navItems   = jQuery(".gallery-nav__item");
    var $prevArrow  = jQuery(".gallery-nav__arrow--prev");
    var $nextArrow  = jQuery(".gallery-nav__arrow--next");
    var $strip      = jQuery(".gallery-nav__strip");

    // Добавляем класс has-overflow, если слайдов 5 или больше
    if ($navItems.length >= 5) {
      $strip.addClass("has-overflow");
    }

    // ── Главный слайдер ──
    $mainSlider.slick({
      arrows: false,
      infinite: false,
      speed: 300,
      dots: false
    });

    // ── Вспомогательная функция обновления активной миниатюры ──
    function setActiveThumb(index) {
      $navItems.removeClass("is-active");
      $navItems.eq(index).addClass("is-active");

      // Автоматическая плавная прокрутка ленты с центрированием активного эскиза
      var activeItem = $navItems.eq(index);
      if (activeItem.length) {
        var stripEl = $strip[0];
        if (stripEl) {
          var stripRect = stripEl.getBoundingClientRect();
          var activeRect = activeItem[0].getBoundingClientRect();
          var scrollLeft = stripEl.scrollLeft + (activeRect.left - stripRect.left) - (stripRect.width / 2) + (activeRect.width / 2);
          stripEl.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
      }
    }

    // ── Функция синхронизации навигации (миниатюры + стрелки) ──
    function syncNav(index) {
      setActiveThumb(index);
      var slickObj = $mainSlider.slick("getSlick");
      if (slickObj) {
        var total = slickObj.slideCount;
        $prevArrow.toggleClass("is-disabled", index === 0);
        $nextArrow.toggleClass("is-disabled", index === total - 1);
      }
    }

    // ── Клик по миниатюре → переключаем главный слайдер ──
    $navItems.on("click", function () {
      var index = parseInt(jQuery(this).attr("data-slide"), 10);
      $mainSlider.slick("slickGoTo", index);
    });

    // ── Стрелки слева/справа → навигация по главному слайдеру ──
    $prevArrow.on("click", function () {
      $mainSlider.slick("slickPrev");
    });
    $nextArrow.on("click", function () {
      $mainSlider.slick("slickNext");
    });

    // ── beforeChange → мгновенно синхронизируем активную миниатюру при начале перехода ──
    $mainSlider.on("beforeChange", function (event, slick, currentSlide, nextSlide) {
      syncNav(nextSlide);
    });

    // ── Синхронизация опций (Цвет, Размер) с галереей ──
    document.addEventListener("pc:dropdown-change", function (e) {
      const detail = e.detail;
      if (!detail) return;

      // Собираем текущие выбранные значения всех опций на странице
      const activeSpecs = {};
      jQuery(".product-hero__field").each(function () {
        const $field = jQuery(this);
        const label = $field.find(".product-hero__field-label").text().trim().toLowerCase();
        const selectedOption = $field.find(".product-hero__dropdown-option.is-selected");
        if (selectedOption.length) {
          const val = String(selectedOption.attr("data-value") || "").toLowerCase();
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

      // Поиск слайда напрямую по ссылкам галереи
      const $slides = $mainSlider.find("a[data-slider-fancybox='gallery']").not(".slick-cloned, .slick-cloned *");

      $slides.each(function (index) {
        const $a = jQuery(this);
        const $img = $a.find("img");

        // Характеристики слайда из data-атрибутов
        const slideColor = String($a.attr("data-color") || $a.attr("data-option-value") || $img.attr("data-color") || $img.attr("data-option-value") || "").toLowerCase();
        const slideSize = String($a.attr("data-size") || $img.attr("data-size") || "").toLowerCase();

        const imgTitle = ($img.attr("title") || "").toLowerCase();
        const imgAlt = ($img.attr("alt") || "").toLowerCase();

        let isDisqualified = false;
        let score = 0;

        // 1. Сравнение по ЦВЕТУ
        if (slideColor) {
          if (activeSpecs.color) {
            if (slideColor === activeSpecs.color.val || slideColor === activeSpecs.color.text) {
              score += 10; // Явное совпадение по цвету имеет высокий приоритет
            } else {
              isDisqualified = true; // Конфликт цвета — дисквалификация слайда
            }
          } else {
            // Слайд привязан к конкретному цвету, но цвет еще не выбран — дисквалификация
            isDisqualified = true;
          }
        }

        // 2. Сравнение по РАЗМЕРУ
        if (slideSize) {
          if (activeSpecs.size) {
            if (slideSize === activeSpecs.size.val || slideSize === activeSpecs.size.text) {
              score += 5; // Совпадение по размеру добавляет веса
            } else {
              isDisqualified = true; // Конфликт размера — дисквалификация слайда
            }
          } else {
            // Слайд привязан к конкретному размеру, но размер еще не выбран — дисквалификация
            isDisqualified = true;
          }
        }

        // 3. Текстовый фолбэк по title/alt (если слайд не дисквалифицирован и не имеет явных data-атрибутов)
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

      // Переключаем слайдер на лучший совпавший индекс
      if (bestSlideIndex !== -1 && highestScore >= 0) {
        $mainSlider.slick("slickGoTo", bestSlideIndex);
      }
    });

    // Начальное состояние стрелок
    $prevArrow.addClass("is-disabled");

    // ── Интеграция Fancybox 3 ──
    if (typeof jQuery.fn.fancybox !== "undefined") {
      // Отключаем стандартный запуск Fancybox 3 по клику на [data-fancybox] на всякий случай
      jQuery(document).off('click.fb-start', '[data-fancybox]');

      // Единый делегированный обработчик клика на ссылки слайдов на уровне документа
      jQuery(document).on('click', 'a[data-slider-fancybox="gallery"]', function (e) {
        e.preventDefault();

        // 1. Если кликнули по клонированному слайду (при infinite: true)
        var $slide = jQuery(this).closest('.slick-slide');
        if ($slide.hasClass('slick-cloned')) {
          var slickIndex = parseInt($slide.attr('data-slick-index'), 10);
          var slickObj = $mainSlider.slick('getSlick');
          
          if (slickObj) {
            var totalSlides = slickObj.slideCount;
            var targetIndex = slickIndex;
            if (slickIndex < 0) {
              targetIndex = totalSlides + (slickIndex % totalSlides);
            } else if (slickIndex >= totalSlides) {
              targetIndex = slickIndex % totalSlides;
            }
            
            $mainSlider.find('.slick-slide:not(.slick-cloned)')
              .eq(targetIndex)
              .find('a[data-slider-fancybox="gallery"]')
              .trigger('click');
          }
          return;
        }

        // 2. Сбор реальных ссылок для Fancybox
        var $realLinks = jQuery('.card-main_slick-one .slick-slide:not(.slick-cloned) a[data-slider-fancybox="gallery"]');
        if ($realLinks.length === 0) {
          // Фолбэк на случай, если Slick еще не успел инициализироваться
          $realLinks = jQuery('.card-main_slick-one a[data-slider-fancybox="gallery"]');
        }

        var index = $realLinks.index(this);

        // Собираем чистый массив картинок без примеси клонов
        var items = [];
        $realLinks.each(function () {
          items.push({
            src: jQuery(this).attr('href'),
            type: 'image',
            opts: {
              caption: jQuery(this).find('img').attr('title') || ''
            }
          });
        });

        // 3. Открытие галереи Fancybox 3
        jQuery.fancybox.open(items, {
          index: index,
          backFocus: false, // Избегаем прыжков фокуса при закрытии
          hash: false,
          loop: false,
          afterShow: function (instance, current) {
            if (current && typeof current.index !== "undefined") {
              // Мгновенно синхронизируем Slick Slider с текущим индексом Fancybox
              $mainSlider.slick("slickGoTo", current.index, true);
              // Явно обновляем активные миниатюры и стрелки
              syncNav(current.index);
            }
          }
        });
      });
    } else {
      console.warn("[FANCYBOX] jquery.fancybox.min.js не загрузился.");
    }

    console.log("[SLICK] Галерея инициализирована успешно.");
  } catch (e) {
    console.error("[SLICK] Ошибка:", e);
  }
});

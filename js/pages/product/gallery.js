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

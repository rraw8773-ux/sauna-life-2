export function initProductsWidget() {
  if (typeof jQuery === "undefined") return;

  jQuery(function ($) {
    const $sliders = $(".products-widget__slider");

    if ($sliders.length > 0 && typeof $.fn.slick !== "undefined") {
      $sliders.each(function () {
        const $slider = $(this);
        const $wrapper = $slider.closest(".products-widget__slider-wrapper");

        $slider.slick({
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          prevArrow: $wrapper.find(".products-widget__slider-arrow--prev"),
          nextArrow: $wrapper.find(".products-widget__slider-arrow--next"),
          responsive: [
            {
              breakpoint: 1024 /* screens <= 1023px */,
              settings: {
                slidesToShow: 3.15 /* 3 cards fully visible, 4th peeking ~20-30px */,
                slidesToScroll: 1,
                swipeToSlide: true /* Enable premium touch-swipe momentum */,
              },
            },
            {
              breakpoint: 768 /* screens <= 767px */,
              settings: {
                slidesToShow: 2.15 /* 2 cards fully visible, 3rd peeking */,
                slidesToScroll: 1,
                arrows: false,
                swipeToSlide: true,
              },
            },
            {
              breakpoint: 480 /* screens <= 479px */,
              settings: {
                slidesToShow: 1.5 /* "полторы карточки" - 1 full card, 2nd peeking 50% */,
                slidesToScroll: 1,
                arrows: false,
                swipeToSlide: true /* Free-scroll style swipe */,
                centerMode: false /* Align first card on left, peek on right */,
              },
            },
          ],
        });
      });

      // Refresh slick calculations when switching tabs
      $(document).on("click", "[data-tab-trigger]", function () {
        setTimeout(function () {
          $sliders.each(function () {
            if ($(this).hasClass("slick-initialized")) {
              $(this).slick("setPosition");
            }
          });
        }, 50);
      });
    }
  });
}

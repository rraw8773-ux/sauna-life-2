jQuery(document).ready(function () {
  (jQuery(".js_tgl").click(function () {
    jQuery(this).toggleClass("a");
  }),
    jQuery(".header_catalog").click(function () {
      jQuery("body").toggleClass("catalog-opened");
    }),
    jQuery(".header_info button").click(function () {
      jQuery("body").addClass("phone-opened");
    }),
    jQuery(".mob-footer_1").click(function () {
      jQuery("body").addClass("show-mob-menu");
    }),
    jQuery(".mob-menu_close, .mob-menu_items a").click(function () {
      jQuery("body").removeClass("show-mob-menu");
    }),
    jQuery(".overlay").click(function () {
      jQuery("body").removeAttr("class");
    }),
    jQuery(".key_toggle").click(function () {
      (jQuery(".key_toggle").removeClass("a"),
        jQuery(this).parent().addClass("a"),
        jQuery(this).addClass("a"));
    }),
    jQuery(".js-card-add_item").click(function () {
      jQuery("body").addClass("overlay-opened");
    }),
    jQuery(".scroll-to").bind("click", function (e) {
      var o = jQuery(this);
      (jQuery("html,body")
        .stop()
        .animate(
          {
            scrollTop: jQuery(o.attr("href")).offset().top - 100,
          },
          1e3,
        ),
        e.preventDefault());
    }),
    jQuery(".contek2").on("click", function () {
      (jQuery(".contek").css("display", "block"),
        jQuery("#popup-overlay").css("display", "block"));
    }),
    $('.calc_bottom button[type="submit"]').on("click", function () {}));

  var fd = $(".contacts_title").text();
  var aa2 = $(".contacts_title").attr("aa");
  if (fd == "Ваша заявка принята" && aa2 != 1) {
    (jQuery(".contek").css("display", "block"),
      $(".contacts_title").attr("aa", "1"));
    jQuery("#popup-overlay").css("display", "block");
  }
  if (aa2 == 1) {
    (jQuery(".contek").css("display", "none"),
      jQuery("#popup-overlay").css("display", "none"));
  }

  (jQuery(".tox-icon2").on("click", function () {
    $(".contacts_title").attr("aa", "1");
    ($(".contacts_title").text("Напишите нам"),
      jQuery(".contek").css("display", "none"),
      jQuery("#popup-overlay").css("display", "none"));
  }),
    jQuery(".js-tab").on("click", function () {
      (jQuery(this).parents().eq(2).find(".js-tab").removeClass("a"),
        jQuery(this).parents().eq(2).find(".js-tabBody").removeClass("a"),
        jQuery(this).addClass("a"));
      var e = jQuery(this).data("tab");
      jQuery(this)
        .parents()
        .eq(2)
        .find(".js-tabBody[data-body=" + e + "]")
        .addClass("a");
    }),
    jQuery('input[type="tel"]').mask("+7 (999) 999-99-99"));

  if (jQuery(this).scrollTop() === 0) {
    jQuery("body").removeClass("min-header");
  } else {
    jQuery("body").addClass("min-header");
  }
  jQuery(window).scroll(function () {
    if (jQuery(this).scrollTop() === 0) {
      jQuery("body").removeClass("min-header");
    } else {
      jQuery("body").addClass("min-header");
    }
  });

  // работа меню каталога на ПК версии
  const catalogMenuItems = document.querySelectorAll(".js-catalog-item");
  if (catalogMenuItems.length) {
    catalogMenuItems.forEach((item) => {
      item.addEventListener("mouseover", (event) => {
        const id = event.currentTarget.dataset.catalogId;
        const menus = document.querySelectorAll(".js-catalog-item");
        menus.forEach((menu) => {
          menu.classList.remove("active");
        });
        const bodies = document.querySelectorAll(".js-catalog-body");
        bodies.forEach((body) => {
          body.classList.remove("active");
        });
        event.currentTarget.classList.add("active");
        event.currentTarget.parentNode.parentNode
          .querySelector(".js-catalog-body_" + id)
          .classList.add("active");
        event.currentTarget.parentNode.parentNode.classList.add("has-right");
      });
    });
  }

  jQuery(".js-open-catalog").click(function () {
    jQuery("body").toggleClass("catalog-actived");
  });
  jQuery(".js-close-catalog, .header_catalog-sub a").click(function () {
    jQuery("body").removeClass("catalog-actived");
  });

  const toggle = document.querySelectorAll(".js-toggle");
  if (toggle.length) {
    toggle.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.currentTarget.classList.toggle("active");
      });
    });
  }
  const parentToggle = document.querySelectorAll(".js-parent-toggle");
  if (parentToggle.length) {
    parentToggle.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.parentNode.classList.toggle("active");
      });
    });
  }

  jQuery(".js-mob-catalog").click(function () {
    jQuery("body").addClass("mob-catalog-actived-1");
  });
  jQuery(".mob-menu_catalog .mob-menu_catalog-button").click(function () {
    jQuery("body").addClass("mob-catalog-actived-2");
    jQuery(".mob-menu_catalog").scrollTop(0);
  });
  jQuery(".js-close-1").click(function () {
    jQuery(this)
      .parent()
      .parent()
      .find(".mob-menu_toggle-1")
      .removeClass("active");
    jQuery("body").removeClass("mob-catalog-actived-1");
  });
  jQuery(".js-close-2").click(function () {
    jQuery(this)
      .parent()
      .parent()
      .find(".mob-menu_catalog-button")
      .removeClass("active");
    jQuery("body").removeClass("mob-catalog-actived-2");
  });

  console.log("SCRIPT.JS LOADED");
});

function setComparisonCount() {
  var check = getCookie("comparison");
  if (check && Object.keys(JSON.parse(check)).length > 1)
    $(".total_compare").text(Object.keys(JSON.parse(check)).length);
  else $(".total_compare").text("0");
}
